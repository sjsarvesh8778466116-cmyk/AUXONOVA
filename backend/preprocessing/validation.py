import io
import logging
from pathlib import Path
from typing import Any, Dict, Optional, Tuple
import numpy as np
from PIL import Image

logger = logging.getLogger("axonova.preprocessing.validation")

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".dcm"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "application/dicom"}
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
MIN_IMAGE_DIM = 64
MAX_IMAGE_DIM = 4096

SUPPORTED_SCAN_TYPES = ["MRI"]
DISALLOWED_SCAN_TYPES = ["CT", "X-RAY", "ULTRASOUND", "PET"]

SUPPORTED_SEQUENCES = {
    "T1",
    "T1-WEIGHTED",
    "T1-WEIGHTED CONTRAST-ENHANCED",
    "T1-WEIGHTED (+CONTRAST)",
    "T1 CONTRAST-ENHANCED",
    "T1 POST-CONTRAST",
    "T1-WEIGHTED POST-CONTRAST",
    "T1-WEIGHTED POST-CONTRAST 3D",
    "T1+C",
    "T1-MPRAGE",
    "T1-WEIGHTED MPRAGE",
    "MPRAGE",
    "3D T1",
    "HIGH-RESOLUTION 3D T1",
    "T1 3D VOLUMETRIC",
    "T1 3D VOLUMETRIC (MPRAGE)",
    "T1-3D",
    "CORONAL T1",
    "T2",
    "T2-WEIGHTED",
    "T2-FLAIR",
    "FLAIR",
    "3D FLAIR",
    "PD/T2",
    "DWI",
    "DIFFUSION-WEIGHTED IMAGING (DWI B=1000)",
    "ADC",
    "ADC MAP",
    "APPARENT DIFFUSION COEFFICIENT (ADC) MAP",
    "DWI / ADC",
    "T2* GRE / SWI (SUSCEPTIBILITY)",
    "SWI / T2*",
    "SWI",
    "GRE",
    "T2*",
    "DIFFUSION TENSOR IMAGING (DTI)",
    "DTI",
    "PERFUSION MRI",
    "MR SPECTROSCOPY",
    "HEAVY T2-WEIGHTED CISS / FIESTA",
    "CISS / FIESTA",
    "MRA / MRV",
    "MRA",
    "MRV",
    "NON-STANDARD / OTHER SEQUENCE",
    "NOT SPECIFIED",
    "STANDARD",
    "RESEARCH",
}

class ValidationResult:
    def __init__(
        self,
        is_valid: bool,
        error_message: Optional[str] = None,
        error_code: Optional[str] = None,
        dimensions: Optional[Tuple[int, int]] = None,
        format_detected: Optional[str] = None,
        quality_metrics: Optional[Dict[str, Any]] = None,
    ):
        self.is_valid = is_valid
        self.error_message = error_message
        self.error_code = error_code
        self.dimensions = dimensions
        self.format_detected = format_detected
        self.quality_metrics = quality_metrics or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_valid": self.is_valid,
            "error_message": self.error_message,
            "error_code": self.error_code,
            "dimensions": list(self.dimensions) if self.dimensions else None,
            "format_detected": self.format_detected,
            "quality_metrics": self.quality_metrics,
        }


def compute_photometric_quality(pil_image: Image.Image) -> Dict[str, Any]:
    """
    Computes rigorous photometric quality metrics:
    - Laplacian variance (focus / blur indicator)
    - Contrast (standard deviation of grayscale values)
    - Mean luminance
    - Dynamic range (percentile 5 to 95)
    """
    gray = pil_image.convert("L")
    arr = np.array(gray, dtype=np.float32)

    # Sharpness via discrete Laplacian approximation
    if arr.shape[0] > 2 and arr.shape[1] > 2:
        laplacian = (
            arr[2:, 1:-1]
            + arr[:-2, 1:-1]
            + arr[1:-1, 2:]
            + arr[1:-1, :-2]
            - 4 * arr[1:-1, 1:-1]
        )
        sharpness_var = float(np.var(laplacian))
    else:
        sharpness_var = 0.0

    contrast_std = float(np.std(arr))
    mean_luminance = float(np.mean(arr))
    p5 = float(np.percentile(arr, 5))
    p95 = float(np.percentile(arr, 95))
    dynamic_range = round(p95 - p5, 2)

    # Threshold checks
    is_blank = contrast_std < 5.0 or dynamic_range < 10.0
    is_extremely_blurry = sharpness_var < 8.0
    is_overexposed = mean_luminance > 245.0
    is_underexposed = mean_luminance < 8.0

    verdict = "PASSED"
    warning = None

    if is_blank:
        verdict = "REJECTED_BLANK"
        warning = "Image appears blank or has virtually zero contrast."
    elif is_overexposed:
        verdict = "REJECTED_OVEREXPOSED"
        warning = "Image is washed out or overexposed."
    elif is_underexposed:
        verdict = "REJECTED_UNDEREXPOSED"
        warning = "Image is underexposed or near pure black."
    elif is_extremely_blurry:
        verdict = "QUALITY_WARNING_BLUR"
        warning = "Significant image blur detected, which may impair neural feature extraction."

    return {
        "sharpness_variance": round(sharpness_var, 2),
        "contrast_std": round(contrast_std, 2),
        "mean_luminance": round(mean_luminance, 2),
        "dynamic_range": dynamic_range,
        "quality_verdict": verdict,
        "quality_warning": warning,
        "is_acceptable": verdict in ["PASSED", "QUALITY_WARNING_BLUR"],
    }


def validate_mri_file(
    file_bytes: bytes,
    filename: str,
    scan_type: str = "MRI",
    sequence: Optional[str] = None,
) -> ValidationResult:
    """
    Validates uploaded file against security, size, format, corruption, and clinical scan constraints.
    """
    # 1. Non-empty check
    if not file_bytes or len(file_bytes) == 0:
        return ValidationResult(
            is_valid=False,
            error_message="Uploaded file is empty (0 bytes).",
            error_code="EMPTY_FILE",
        )

    # 2. Size limit
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        return ValidationResult(
            is_valid=False,
            error_message=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024*1024)} MB.",
            error_code="FILE_TOO_LARGE",
        )

    # 3. Filename extension check
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        return ValidationResult(
            is_valid=False,
            error_message=(
                f"Unsupported file format '{ext}'. "
                f"Supported formats: {', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))}."
            ),
            error_code="UNSUPPORTED_FORMAT",
        )

    # 4. Modality check
    clean_scan_type = scan_type.strip().upper()
    if clean_scan_type in DISALLOWED_SCAN_TYPES:
        return ValidationResult(
            is_valid=False,
            error_message=(
                f"Analysis is disabled for {clean_scan_type} scans. "
                "AXONOVA models were trained exclusively on Brain MRI protocols."
            ),
            error_code="UNSUPPORTED_MODALITY",
        )

    if clean_scan_type not in SUPPORTED_SCAN_TYPES:
        return ValidationResult(
            is_valid=False,
            error_message=f"Unsupported scan type '{scan_type}'. Expected: MRI.",
            error_code="UNSUPPORTED_SCAN_TYPE",
        )

    # 5. Sequence check if provided
    if sequence:
        clean_seq = sequence.strip().upper()
        # Recognized MRI sequence keywords / sub-strings
        mri_keywords = [
            "T1", "T2", "FLAIR", "DWI", "ADC", "SWI", "GRE", "DTI",
            "MPRAGE", "CISS", "FIESTA", "PERFUSION", "SPECTROSCOPY",
            "CONTRAST", "DIFFUSION", "VOLUMETRIC", "RESEARCH",
            "NON-STANDARD", "OTHER", "MRA", "MRV", "NOT SPECIFIED"
        ]
        if clean_seq not in SUPPORTED_SEQUENCES and not any(kw in clean_seq for kw in mri_keywords):
            return ValidationResult(
                is_valid=False,
                error_message=f"Sequence '{sequence}' is not recognized or supported by available models.",
                error_code="UNSUPPORTED_SEQUENCE",
            )

    # 6. Corruption & Image decode check
    try:
        pil_img = Image.open(io.BytesIO(file_bytes))
        pil_img.verify()
        # Re-open for dimension and quality analysis as verify() closes the stream
        pil_img = Image.open(io.BytesIO(file_bytes))
    except Exception as e:
        logger.warning("Image verification failed for %s: %s", filename, str(e))
        return ValidationResult(
            is_valid=False,
            error_message="File is corrupted, truncated, or cannot be decoded as a valid image.",
            error_code="CORRUPTED_FILE",
        )

    width, height = pil_img.size
    fmt = pil_img.format or ext.replace(".", "").upper()

    # 7. Dimension bounds check
    if width < MIN_IMAGE_DIM or height < MIN_IMAGE_DIM:
        return ValidationResult(
            is_valid=False,
            error_message=(
                f"Image dimensions ({width}x{height}) are too small. "
                f"Minimum required dimensions: {MIN_IMAGE_DIM}x{MIN_IMAGE_DIM}."
            ),
            error_code="DIMENSIONS_TOO_SMALL",
            dimensions=(width, height),
            format_detected=fmt,
        )

    if width > MAX_IMAGE_DIM or height > MAX_IMAGE_DIM:
        return ValidationResult(
            is_valid=False,
            error_message=(
                f"Image dimensions ({width}x{height}) exceed maximum allowed limit of {MAX_IMAGE_DIM}x{MAX_IMAGE_DIM}."
            ),
            error_code="DIMENSIONS_TOO_LARGE",
            dimensions=(width, height),
            format_detected=fmt,
        )

    # 8. Photometric quality evaluation
    quality = compute_photometric_quality(pil_img)
    if not quality["is_acceptable"]:
        return ValidationResult(
            is_valid=False,
            error_message=quality["quality_warning"] or "Image quality prevents reliable neural processing.",
            error_code="IMAGE_QUALITY_ISSUE",
            dimensions=(width, height),
            format_detected=fmt,
            quality_metrics=quality,
        )

    return ValidationResult(
        is_valid=True,
        dimensions=(width, height),
        format_detected=fmt,
        quality_metrics=quality,
    )
