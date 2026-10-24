from datetime import datetime, timezone
import io
import logging
from typing import Any, Dict, Optional, Tuple
import numpy as np
from PIL import Image

from preprocessing.validation import validate_mri_file
from inference.router import model_router

logger = logging.getLogger("axonova.inference.classifier")

def check_brain_mri_distribution(file_bytes: bytes) -> Tuple[bool, Optional[str]]:
    """
    Checks whether the uploaded image conforms to standard brain MRI characteristics:
    - Background peripheral region should be predominantly dark (air / field of view).
    - Image center should have intracranial contrast.
    - Ratio of border intensity to center intensity.
    If border pixels are extremely bright (like a full-frame outdoor photograph or non-medical document),
    it is flagged as out-of-distribution.
    """
    try:
        pil_img = Image.open(io.BytesIO(file_bytes)).convert("L")
        w, h = pil_img.size
        arr = np.array(pil_img, dtype=np.float32)

        # Border margin: 8% of width and height
        bw = max(2, int(w * 0.08))
        bh = max(2, int(h * 0.08))

        top_border = arr[:bh, :]
        bottom_border = arr[-bh:, :]
        left_border = arr[:, :bw]
        right_border = arr[:, -bw:]

        border_mean = (
            np.mean(top_border)
            + np.mean(bottom_border)
            + np.mean(left_border)
            + np.mean(right_border)
        ) / 4.0

        # Center region: central 40%
        center_crop = arr[int(h * 0.3) : int(h * 0.7), int(w * 0.3) : int(w * 0.7)]
        center_mean = np.mean(center_crop)

        # In typical brain MRI, peripheral border mean is low (< 60/255)
        # If border is bright and nearly equal to or brighter than center, it is not an MRI scan
        if border_mean > 160.0 and (border_mean >= center_mean * 0.9):
            return False, "Peripheral border intensities indicate non-medical or inverted image format."

        # If center is completely empty (no brain tissue)
        if center_mean < 8.0:
            return False, "Central intracranial region contains no detectable anatomical tissue."

        return True, None
    except Exception as e:
        logger.warning("Distribution check encountered error: %s", str(e))
        return True, None  # Allow standard validation to govern


class CentralClassifier:
    """
    Unified Inference Classifier orchestrating validation, routing, OOD detection,
    model inference, low-confidence thresholding, and explainability.
    """

    def __init__(self, router=model_router):
        self.router = router

    def analyze_scan(
        self,
        file_bytes: bytes,
        filename: str = "uploaded_scan.jpg",
        scan_type: str = "MRI",
        sequence: Optional[str] = None,
        target_condition: Optional[str] = None,
        requested_model_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes complete, honest end-to-end MRI analysis pipeline.
        """
        t_upload = datetime.now(timezone.utc).isoformat()
        # 1. Pipeline Stage: File Validation & Quality Check
        val_result = validate_mri_file(
            file_bytes=file_bytes,
            filename=filename,
            scan_type=scan_type,
            sequence=sequence,
        )
        t_validation = datetime.now(timezone.utc).isoformat()

        if not val_result.is_valid:
            return {
                "status": "validation_error",
                "error_code": val_result.error_code,
                "model": "None",
                "model_version": "N/A",
                "prediction": None,
                "confidence": 0.0,
                "supported": False,
                "message": val_result.error_message,
                "quality_metrics": val_result.quality_metrics,
                "upload_timestamp": t_upload,
                "validation_timestamp": t_validation,
            }

        # 2. Pipeline Stage: Out-of-Distribution Check
        is_in_dist, ood_reason = check_brain_mri_distribution(file_bytes)
        if not is_in_dist:
            return {
                "status": "unsupported",
                "error_code": "OUT_OF_DISTRIBUTION",
                "model": "None",
                "model_version": "N/A",
                "prediction": None,
                "confidence": 0.0,
                "supported": False,
                "message": (
                    "Unable to provide a supported AI assessment. "
                    f"Reason: The uploaded scan is outside the supported model scope ({ood_reason})."
                ),
                "quality_metrics": val_result.quality_metrics,
                "upload_timestamp": t_upload,
                "validation_timestamp": t_validation,
            }

        # 3. Pipeline Stage: Intelligent Model Routing
        decision = self.router.route_scan(
            scan_type=scan_type,
            sequence=sequence,
            target_condition=target_condition,
            requested_model_id=requested_model_id,
        )
        t_routing = datetime.now(timezone.utc).isoformat()

        if not decision.can_run:
            if decision.status == "NOT_CONNECTED":
                return {
                    "status": "not_connected",
                    "model": decision.selected_model.name if decision.selected_model else "Target AI Model",
                    "model_version": decision.selected_model.version if decision.selected_model else "N/A",
                    "prediction": None,
                    "confidence": 0.0,
                    "supported": False,
                    "message": (
                        "Model not currently available. This condition is under development."
                    ),
                    "compatible_models": decision.compatible_models,
                    "quality_metrics": val_result.quality_metrics,
                    "upload_timestamp": t_upload,
                    "validation_timestamp": t_validation,
                    "routing_timestamp": t_routing,
                }
            else:
                return {
                    "status": "not_assessed",
                    "model": "None",
                    "model_version": "N/A",
                    "prediction": None,
                    "confidence": 0.0,
                    "supported": False,
                    "message": decision.reason or "Model not currently available. This condition is under development.",
                    "compatible_models": decision.compatible_models,
                    "quality_metrics": val_result.quality_metrics,
                    "upload_timestamp": t_upload,
                    "validation_timestamp": t_validation,
                    "routing_timestamp": t_routing,
                }

        # 4. Pipeline Stage: Model Execution
        active_model = decision.selected_model
        try:
            import inspect
            sig = inspect.signature(active_model.predict)
            if "target_condition" in sig.parameters:
                inference_result = active_model.predict(
                    file_bytes=file_bytes,
                    original_filename=filename,
                    target_condition=target_condition,
                )
            else:
                inference_result = active_model.predict(
                    file_bytes=file_bytes,
                    original_filename=filename,
                )
            t_inference = datetime.now(timezone.utc).isoformat()
            # Attach quality metrics, routing context and real timestamps
            inference_result["quality_metrics"] = val_result.quality_metrics
            inference_result["compatible_models"] = decision.compatible_models
            inference_result["dimensions"] = val_result.dimensions
            inference_result["format_detected"] = val_result.format_detected
            inference_result["upload_timestamp"] = t_upload
            inference_result["validation_timestamp"] = t_validation
            inference_result["routing_timestamp"] = t_routing
            inference_result["inference_timestamp"] = t_inference
            inference_result["explainability_timestamp"] = t_inference
            return inference_result
        except Exception as e:
            logger.error("Inference execution failed on model %s: %s", active_model.name, str(e), exc_info=True)
            return {
                "status": "analysis_error",
                "model": active_model.name,
                "model_version": active_model.version,
                "prediction": None,
                "confidence": 0.0,
                "supported": False,
                "message": f"Analysis failed: {str(e)} — Please retry.",
                "quality_metrics": val_result.quality_metrics,
            }


# Global singleton classifier
central_classifier = CentralClassifier()
