import io
import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile, status
import numpy as np
from PIL import Image

from app.catalog_data import (
    CONDITION_CATALOG,
    LIVE_MODEL_REGISTRY,
    get_catalog_entry,
    get_condition_catalog,
    get_model_registry,
    match_scan_to_model,
)

logger = logging.getLogger("axonova.routes.catalog")

router = APIRouter(prefix="/api", tags=["Condition Catalog & Model Registry"])


@router.get("/catalog")
async def list_catalog(
    category: Optional[str] = Query(None, description="Category filter key (e.g. 'tumors_masses', 'vascular_stroke')"),
    availability: Optional[str] = Query(None, description="Availability filter ('Available', 'In Development', 'Needs Validation', 'Not Available')"),
    search: Optional[str] = Query(None, description="Search keyword"),
):
    """
    Returns the comprehensive Brain MRI Condition Catalog (Categories A to J).
    Clearly demarcates which conditions have live AI models vs. those that are unassessed.
    """
    items = get_condition_catalog(category_key=category, availability=availability, search=search)
    return {
        "total_count": len(items),
        "catalog_size": len(CONDITION_CATALOG),
        "conditions": items,
        "disclaimer": (
            "AXONOVA condition catalog is a reference taxonomy of neurological conditions. "
            "Inclusion in this catalog does not imply that an automated AI model exists or is enabled."
        ),
    }


@router.get("/catalog/{condition_id}")
async def get_condition(condition_id: str):
    """
    Returns clinical details, imaging sequences, and model availability for a specific catalog condition.
    """
    item = get_catalog_entry(condition_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Condition '{condition_id}' not found in the catalog.",
        )
    return item


@router.get("/models/registry")
async def list_model_registry():
    """
    Returns the live Central AI Model Registry containing validated inference models,
    supported sequences, validation metrics, and explicit limitations.
    """
    models = get_model_registry()
    return {
        "models_count": len(models),
        "registry": models,
        "disclaimer": (
            "Only models marked 'Available' are validated for clinical decision-support demonstration. "
            "Output predictions must always be reviewed by a qualified healthcare professional."
        ),
    }


@router.post("/catalog/match-scan")
async def match_scan(
    condition_id: Optional[str] = Form(None),
    sequence: Optional[str] = Form(None),
    orientation: Optional[str] = Form("Not specified"),
):
    """
    Checks compatibility between an uploaded scan's sequence/orientation and the chosen catalog condition.
    Prevents routing incompatible scans to models and refuses to force unassessed conditions into known classes.
    """
    match_result = match_scan_to_model(
        condition_id=condition_id,
        sequence=sequence,
        orientation=orientation,
    )
    return match_result


@router.post("/scans/quality-check")
async def check_scan_quality(
    file: UploadFile = File(..., description="Brain MRI scan file (.jpg, .jpeg, .png)"),
    sequence: Optional[str] = Form("Not specified"),
    orientation: Optional[str] = Form("Not specified"),
):
    """
    Analyzes uploaded MRI slice for image quality issues:
    - Minimum spatial resolution
    - Mean luminance & dynamic range (detects solid black or washed out images)
    - Contrast standard deviation
    - Laplacian focus/blur measure (detects severely blurred or artifacted scans)
    """
    filename = file.filename or "scan.jpg"
    try:
        contents = await file.read()
        if len(contents) == 0:
            return {
                "verdict": "fail",
                "status": "Image Quality Issue",
                "message": "Uploaded file is 0 bytes (empty).",
                "passed": False,
            }

        image = Image.open(io.BytesIO(contents))
        image = image.convert("RGB")
        width, height = image.size

        # Convert to grayscale numpy array for photometric analysis
        gray = np.array(image.convert("L"), dtype=np.float32)

        mean_lum = float(np.mean(gray))
        std_contrast = float(np.std(gray))
        min_lum = float(np.min(gray))
        max_lum = float(np.max(gray))
        dynamic_range = max_lum - min_lum

        # Calculate Laplacian variance as focus/sharpness metric
        # Discrete Laplacian kernel [[0, 1, 0], [1, -4, 1], [0, 1, 0]]
        pad = np.pad(gray, 1, mode="reflect")
        laplacian = (
            pad[:-2, 1:-1]
            + pad[2:, 1:-1]
            + pad[1:-1, :-2]
            + pad[1:-1, 2:]
            - 4.0 * pad[1:-1, 1:-1]
        )
        sharpness_score = float(np.var(laplacian))

        warnings: List[str] = []
        is_passed = True
        verdict = "pass"

        # Check resolution
        if width < 128 or height < 128:
            warnings.append(f"Image resolution ({width}x{height}) is below optimal diagnostic minimum (224x224).")
            verdict = "warning"

        # Check extreme luminance (solid dark / white)
        if mean_lum < 15:
            warnings.append("Image is severely underexposed or predominantly dark parenchymal void.")
            verdict = "fail"
            is_passed = False
        elif mean_lum > 240:
            warnings.append("Image is severely overexposed / washed out with signal clipping.")
            verdict = "fail"
            is_passed = False

        # Check dynamic range & contrast
        if std_contrast < 12:
            warnings.append("Low tissue contrast: inadequate gray-white matter signal differentiation.")
            verdict = "warning" if is_passed else "fail"

        # Check sharpness / blur
        if sharpness_score < 40.0:
            warnings.append("Elevated blur detected: image may exhibit patient motion artifact or low high-frequency edge definition.")
            verdict = "warning" if is_passed else "fail"

        status_label = "Analysis Complete" if is_passed and verdict == "pass" else (
            "Image Quality Issue" if verdict == "fail" else "Quality Warning"
        )

        return {
            "verdict": verdict,
            "status": status_label,
            "passed": is_passed,
            "filename": filename,
            "dimensions": {"width": width, "height": height},
            "metrics": {
                "mean_luminance": round(mean_lum, 2),
                "contrast_std": round(std_contrast, 2),
                "dynamic_range": round(dynamic_range, 2),
                "sharpness_score": round(sharpness_score, 2),
            },
            "warnings": warnings,
            "message": (
                "Image quality verified. Suitable for standardized neural feature extraction."
                if verdict == "pass"
                else (
                    "Image quality warnings noted: analysis reliability may be reduced."
                    if verdict == "warning"
                    else "Image quality failed validation: excessive blur, artifact, or invalid exposure detected."
                )
            ),
        }

    except Exception as e:
        logger.error("Quality check failed for %s: %s", filename, str(e))
        return {
            "verdict": "fail",
            "status": "Image Quality Issue",
            "passed": False,
            "filename": filename,
            "message": f"Unable to parse image data: {str(e)}",
            "warnings": ["File format corruption or unreadable image stream."],
        }
