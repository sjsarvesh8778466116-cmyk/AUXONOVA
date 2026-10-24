import io
from pathlib import Path
from typing import Tuple
from fastapi import HTTPException, UploadFile, status
from PIL import Image

from app.config import (
    ALLOWED_EXTENSIONS,
    ALLOWED_MIMETYPES,
    DISABLED_SCAN_TYPES,
    MAX_UPLOAD_SIZE_BYTES,
    MAX_UPLOAD_SIZE_MB,
    SUPPORTED_ORIENTATIONS,
    SUPPORTED_SCAN_TYPES,
)

async def validate_uploaded_image(
    file: UploadFile,
    scan_type: str,
    orientation: str,
) -> Tuple[bytes, str, str]:
    """
    Validates uploaded file against security, size, format, and clinical constraints.
    
    Returns:
        Tuple of (file_bytes, clean_scan_type, clean_orientation)
    """
    # 1. Validate Scan Type
    clean_scan_type = scan_type.strip().upper()
    if clean_scan_type in [t.upper() for t in DISABLED_SCAN_TYPES]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Classification is currently disabled for {clean_scan_type} scans. "
                "The current model was trained exclusively on Brain MRI images. "
                f"{clean_scan_type} classification requires a separate dedicated dataset and model."
            ),
        )

    if clean_scan_type not in [t.upper() for t in SUPPORTED_SCAN_TYPES]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported scan type '{scan_type}'. Supported types: {', '.join(SUPPORTED_SCAN_TYPES)}.",
        )

    # 2. Validate Orientation Label
    clean_orientation = orientation.strip()
    valid_orientations = {o.lower(): o for o in SUPPORTED_ORIENTATIONS}
    if clean_orientation.lower() not in valid_orientations:
        clean_orientation = "Not specified"
    else:
        clean_orientation = valid_orientations[clean_orientation.lower()]

    # 3. Check Filename and Extension
    filename = file.filename or "upload.jpg"
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file extension '{ext}'. Only standard image formats "
                f"({', '.join(sorted(ALLOWED_EXTENSIONS))}) are accepted. Note that DICOM (.dcm) is not supported."
            ),
        )

    # 4. Read File Content and Check Size
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}",
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes). Please select a valid MRI image.",
        )

    if len(contents) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {MAX_UPLOAD_SIZE_MB}MB. Current size: {len(contents) / (1024 * 1024):.2f}MB.",
        )

    # 5. Verify actual image header and integrity with Pillow
    try:
        stream = io.BytesIO(contents)
        with Image.open(stream) as img:
            img.verify()
            img_format = img.format
            if img_format not in ["JPEG", "PNG"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid image format '{img_format}'. Only genuine JPEG and PNG images are supported.",
                )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Corrupted or unreadable image file. Unable to parse image headers.",
        )

    return contents, "MRI", clean_orientation
