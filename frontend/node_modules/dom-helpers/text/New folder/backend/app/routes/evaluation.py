import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse

from app.config import DISCLAIMER_TEXT, EVAL_METRICS_PATH, EVALUATION_DIR
from app.schemas import EvaluationResponse

router = APIRouter(prefix="/api", tags=["Model Evaluation"])

@router.get("/evaluation", response_model=EvaluationResponse)
async def get_model_evaluation():
    """
    Returns verified evaluation metrics on held-out test data.
    If evaluation has not been conducted yet, returns an un-evaluated status.
    """
    if not EVAL_METRICS_PATH.exists():
        return EvaluationResponse(
            evaluated=False,
            disclaimer=DISCLAIMER_TEXT,
        )

    try:
        with open(EVAL_METRICS_PATH, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)
        return EvaluationResponse(**metrics_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read evaluation metrics: {str(e)}",
        )


@router.get("/evaluation/confusion-matrix-image")
async def get_confusion_matrix_image():
    """Returns the generated confusion matrix PNG plot."""
    plot_path = EVALUATION_DIR / "confusion_matrix.png"
    if not plot_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Confusion matrix plot has not been generated yet.",
        )
    return FileResponse(plot_path, media_type="image/png")


@router.get("/evaluation/learning-curves-image")
async def get_learning_curves_image():
    """Returns the training/validation loss and accuracy curves PNG plot."""
    plot_path = EVALUATION_DIR / "loss_accuracy_curve.png"
    if not plot_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning curves plot has not been generated yet.",
        )
    return FileResponse(plot_path, media_type="image/png")
