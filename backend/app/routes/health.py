from fastapi import APIRouter
from app.config import (
    DISABLED_SCAN_TYPES,
    DISCLAIMER_TEXT,
    MAX_UPLOAD_SIZE_MB,
    MODEL_FILE_PATH,
    SUPPORTED_SCAN_TYPES,
)
from app.schemas import HealthResponse
from app.tasks.registry import task_registry

router = APIRouter(prefix="/api", tags=["System Health"])

@router.get("/health", response_model=HealthResponse)
async def get_health_status():
    """
    Returns API operational status, model availability, modular task counts, and upload constraints.
    """
    is_model_present = MODEL_FILE_PATH.exists()
    all_tasks = task_registry.get_all_tasks()
    ready_tasks = task_registry.get_ready_tasks()

    return HealthResponse(
        status="operational",
        api_version="1.0.0",
        model_loaded=is_model_present,
        model_name="AXONOVA_Brain_MRI_Classifier" if is_model_present else None,
        supported_scan_types=SUPPORTED_SCAN_TYPES,
        disabled_scan_types=DISABLED_SCAN_TYPES,
        supported_image_formats=["JPEG", "PNG"],
        max_upload_size_mb=MAX_UPLOAD_SIZE_MB,
        disclaimer=DISCLAIMER_TEXT,
        active_tasks_count=len(ready_tasks),
        total_tasks_count=len(all_tasks),
    )
