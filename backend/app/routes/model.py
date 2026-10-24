import json
from fastapi import APIRouter
from app.config import (
    DISCLAIMER_TEXT,
    INPUT_SHAPE,
    LABELS_FILE_PATH,
    METADATA_FILE_PATH,
    MODEL_FILE_PATH,
)
from app.schemas import ModelInfoResponse

router = APIRouter(prefix="/api", tags=["Model Information"])

@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_information():
    """
    Returns metadata about the currently deployed CNN model.
    """
    is_loaded = MODEL_FILE_PATH.exists() and LABELS_FILE_PATH.exists()

    classes = []
    if LABELS_FILE_PATH.exists():
        try:
            with open(LABELS_FILE_PATH, "r", encoding="utf-8") as f:
                classes = json.load(f)
        except Exception:
            classes = []

    metadata = {}
    if METADATA_FILE_PATH.exists():
        try:
            with open(METADATA_FILE_PATH, "r", encoding="utf-8") as f:
                metadata = json.load(f)
        except Exception:
            metadata = {}

    summary_text = (
        "3-Block Convolutional Neural Network with Batch Normalization, Max Pooling, "
        "Global Average Pooling, Dropout (0.4), and Softmax classification head."
    )

    return ModelInfoResponse(
        loaded=is_loaded,
        model_name=metadata.get("model_name", "AXONOVA_Brain_MRI_Classifier" if is_loaded else None),
        model_version=metadata.get("version", "1.0.0" if is_loaded else None),
        input_shape=list(INPUT_SHAPE),
        supported_classes=classes,
        supported_scan_type="MRI",
        training_status="Trained and Ready" if is_loaded else "Model not trained yet",
        evaluation_available=metadata.get("final_val_accuracy") is not None,
        architecture_summary=summary_text if is_loaded else None,
        layer_count=13 if is_loaded else None,
        trainable_parameters=metadata.get("trainable_parameters"),
        trained_at=metadata.get("trained_at"),
        disclaimer=DISCLAIMER_TEXT,
    )
