import logging
from typing import Any, Dict, List
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.tasks.base import TaskInfo
from app.tasks.registry import task_registry
from app.utils.validation import validate_uploaded_image

logger = logging.getLogger("axonova.routes.tasks")

router = APIRouter(prefix="/api/tasks", tags=["Modular Tasks"])

@router.get("", response_model=List[TaskInfo])
async def list_tasks():
    """
    Returns all registered brain MRI research condition tasks,
    their operational readiness state, sequence requirements, limitations, and setup guides.
    """
    return [task.get_task_info() for task in task_registry.get_all_tasks()]

@router.get("/{task_id}", response_model=TaskInfo)
async def get_task_detail(task_id: str):
    """
    Returns detailed specifications and requirements for a specific task.
    """
    task = task_registry.get_task_or_404(task_id)
    return task.get_task_info()

@router.get("/{task_id}/model-info")
async def get_task_model_info(task_id: str):
    """
    Returns task-specific model architecture metadata.
    """
    task = task_registry.get_task_or_404(task_id)
    return task.get_model_info()

@router.get("/{task_id}/evaluation")
async def get_task_evaluation(task_id: str):
    """
    Returns task-specific held-out test evaluation results.
    Does not invent metrics for unconfigured tasks.
    """
    task = task_registry.get_task_or_404(task_id)
    return task.get_evaluation()

@router.get("/{task_id}/dataset-info")
async def get_task_dataset_info(task_id: str):
    """
    Returns task-specific dataset layout and counts.
    """
    task = task_registry.get_task_or_404(task_id)
    return task.get_dataset_info()

@router.post("/{task_id}/predict")
async def predict_task_mri(
    task_id: str,
    file: UploadFile = File(..., description="Brain MRI scan file (.jpg, .jpeg, .png)"),
    scan_type: str = Form("MRI", description="Scan modality (MRI supported)"),
    orientation: str = Form("Not specified", description="User-reported scan orientation"),
):
    """
    Executes task-specific deep learning inference.
    Only enables execution if the task has a genuine trained model and dataset loaded.
    Prevents cross-task image routing and refuses simulated outputs.
    """
    task = task_registry.get_task_or_404(task_id)

    if not task.is_ready():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model not currently available. This condition is under development.",
        )

    # Validate image upload
    file_bytes, valid_scan_type, valid_orientation = await validate_uploaded_image(
        file=file,
        scan_type=scan_type,
        orientation=orientation,
    )

    # Execute isolated task prediction
    return task.predict(
        file_bytes=file_bytes,
        scan_type=valid_scan_type,
        orientation=valid_orientation,
        filename=file.filename or "uploaded_scan.jpg",
    )
