import logging
from typing import Any, Dict, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from inference.classifier import central_classifier
from models.registry import central_registry
from reports.report_generator import report_generator

logger = logging.getLogger("axonova.api.analysis")

router = APIRouter(prefix="/api", tags=["MRI AI Analysis & Model Registry"])

@router.post("/mri/analyze")
async def analyze_mri_scan(
    file: UploadFile = File(..., description="Brain MRI scan file (.jpg, .jpeg, .png, .dcm)"),
    scan_type: str = Form("MRI", description="Scan modality (must be MRI)"),
    sequence: Optional[str] = Form(None, description="Acquired MRI sequence (e.g. T1, T2, FLAIR, DWI)"),
    orientation: Optional[str] = Form("Not specified", description="Scan acquisition plane"),
    target_condition: Optional[str] = Form(None, description="Target condition or study focus"),
    case_id: Optional[str] = Form(None, description="Existing Case ID from upload step"),
    requested_model_id: Optional[str] = Form(None, description="Specific Model ID to invoke"),
):
    """
    Executes full AI inference pipeline:
    File Validation → Quality Check → Model Routing → Real AI Inference →
    Confidence Evaluation → Grad-CAM Explainability → Radiology Report Creation.
    """
    filename = file.filename or "uploaded_scan.jpg"
    file_bytes = await file.read()

    analysis_result = central_classifier.analyze_scan(
        file_bytes=file_bytes,
        filename=filename,
        scan_type=scan_type,
        sequence=sequence,
        target_condition=target_condition,
        requested_model_id=requested_model_id,
    )

    # If file validation error occurred, raise 400 with clean string detail
    if analysis_result.get("status") == "validation_error":
        msg = analysis_result.get("message") or "Image validation failed."
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=msg,
        )

    # Generate and store structured radiology-style report
    active_case_id = case_id or report_generator.generate_case_id()
    full_report = report_generator.create_report(
        analysis_result=analysis_result,
        case_id=active_case_id,
        filename=filename,
        scan_type=scan_type,
        sequence=sequence,
        orientation=orientation,
    )

    expl = analysis_result.get("explainability", {})
    return {
        "status": analysis_result.get("status"),
        "model": analysis_result.get("model"),
        "model_version": analysis_result.get("model_version"),
        "prediction": analysis_result.get("prediction"),
        "confidence": analysis_result.get("confidence", 0.0),
        "supported": analysis_result.get("supported", False),
        "is_indeterminate": analysis_result.get("is_indeterminate", False),
        "case_id": active_case_id,
        "message": analysis_result.get("message"),
        "class_scores": analysis_result.get("class_scores", []),
        "explainability": expl,
        "gradcam_overlay_base64": expl.get("overlay_base64"),
        "gradcam_heatmap_base64": expl.get("heatmap_base64"),
        "quality_metrics": analysis_result.get("quality_metrics", {}),
        "developer_diagnostics": analysis_result.get("developer_diagnostics", {}),
        "timeline": full_report.get("timeline", []),
        "limitations": analysis_result.get("limitations", []),
        "report": full_report,
    }


@router.get("/mri/result/{case_id}")
async def get_mri_result(case_id: str):
    """Retrieves the analysis result and generated report for a given case ID."""
    report = report_generator.get_report(case_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report for Case ID '{case_id}' was not found.",
        )
    return report


@router.get("/models")
async def list_registry_models():
    """Returns all models registered in the Central Model Registry with status and metrics."""
    return central_registry.get_all_models()


@router.get("/models/{model_id}")
async def get_registry_model_detail(model_id: str):
    """Returns specifications, status, requirements, and metrics for a specific model."""
    model = central_registry.get_model_by_id(model_id)
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with ID '{model_id}' was not found in the registry.",
        )
    metrics = model.get_metrics()
    return {
        "model_id": model.model_id,
        "model_name": model.name,
        "version": model.version,
        "task": model.task,
        "supported_conditions": model.supported_conditions,
        "supported_sequences": model.supported_sequences,
        "input_size": f"{model.input_shape[0]}x{model.input_shape[1]}",
        "status": model.get_status(),
        "is_available": model.is_available(),
        "explainability": model.explainability_method or "None",
        "confidence_threshold": model.confidence_threshold,
        "evaluation_metrics": metrics if metrics else "Validation metrics have not been provided.",
        "has_metrics": metrics is not None,
    }
