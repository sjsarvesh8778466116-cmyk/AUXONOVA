import logging
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from preprocessing.validation import validate_mri_file
from models.registry import central_registry
from reports.report_generator import report_generator

logger = logging.getLogger("axonova.api.upload")

router = APIRouter(prefix="/api/mri", tags=["MRI Upload & Quality Check"])

@router.post("/upload")
async def upload_and_validate_mri(
    file: UploadFile = File(..., description="Brain MRI scan file (.jpg, .jpeg, .png, .dcm)"),
    scan_type: str = Form("MRI", description="Scan modality (must be MRI)"),
    sequence: Optional[str] = Form(None, description="Acquired MRI sequence (e.g. T1, T2, FLAIR, DWI)"),
    orientation: Optional[str] = Form("Not specified", description="Scan acquisition plane (Axial, Coronal, Sagittal)"),
    target_condition: Optional[str] = Form(None, description="Target neurological condition or study focus"),
):
    """
    Validates uploaded file against security, dimensions, corruption, and photometric quality constraints.
    Generates a Case ID and identifies compatible models without executing heavy neural inference.
    """
    filename = file.filename or "uploaded_scan.jpg"
    file_bytes = await file.read()

    val_result = validate_mri_file(
        file_bytes=file_bytes,
        filename=filename,
        scan_type=scan_type,
        sequence=sequence,
    )

    if not val_result.is_valid:
        msg = val_result.error_message or "Image validation failed."
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=msg,
        )

    # Find compatible models
    compatible = central_registry.find_compatible_models(
        sequence=sequence,
        target_condition=target_condition,
    )
    compatible_list = [
        {
            "model_id": m.model_id,
            "model_name": m.name,
            "status": m.get_status(),
            "is_available": m.is_available(),
            "task": m.task,
        }
        for m in compatible
    ]

    case_id = report_generator.generate_case_id()

    return {
        "status": "validated",
        "case_id": case_id,
        "filename": filename,
        "file_size_bytes": len(file_bytes),
        "dimensions": val_result.dimensions,
        "format_detected": val_result.format_detected,
        "modality": scan_type,
        "sequence": sequence or "Not specified",
        "orientation": orientation or "Not specified",
        "quality_metrics": val_result.quality_metrics,
        "compatible_models": compatible_list,
        "message": "MRI scan validated successfully. Ready for compatible model routing and analysis.",
    }
