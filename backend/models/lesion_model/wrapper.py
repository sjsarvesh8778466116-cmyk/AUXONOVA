import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("axonova.models.lesion_model")

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent.parent
SAVED_MODELS_DIR = BACKEND_DIR / "saved_models"
LESION_WEIGHTS_PATH = SAVED_MODELS_DIR / "axonova_ms_best.keras"

class LesionModelWrapper:
    """
    Wrapper for AXONOVA Multiple Sclerosis Lesion Detection Model.
    Designed for T2-FLAIR periventricular and juxtacortical lesion assessment.
    """

    def __init__(self):
        self.model_id = "axonova_ms_lesion_model"
        self.name = "Multiple Sclerosis Lesion Model"
        self.version = "0.7.0-dev"
        self.task = "detection"
        self.supported_conditions = [
            "Demyelinating FLAIR Lesions",
            "Non-Specific White Matter Gliosis",
            "Normal White Matter",
        ]
        self.supported_sequences = ["T2-FLAIR", "FLAIR", "PD/T2"]
        self.input_shape = (224, 224, 3)
        self.confidence_threshold = 0.55
        self.explainability_method = None
        self._is_loaded = LESION_WEIGHTS_PATH.exists()

    def is_available(self) -> bool:
        return self._is_loaded

    def get_status(self) -> str:
        return "AVAILABLE" if self.is_available() else "IN DEVELOPMENT"

    def get_metrics(self) -> Optional[Dict[str, Any]]:
        return None

    def predict(
        self,
        file_bytes: bytes,
        original_filename: str = "scan.jpg",
    ) -> Dict[str, Any]:
        if not self.is_available():
            return {
                "status": "not_connected",
                "model": self.name,
                "model_id": self.model_id,
                "model_version": self.version,
                "prediction": None,
                "confidence": 0.0,
                "supported": False,
                "is_indeterminate": False,
                "message": (
                    "Model not currently available. This condition is under development."
                ),

                "explainability": {
                    "supported": False,
                    "method": None,
                    "heatmap_base64": None,
                    "overlay_base64": None,
                    "target_class": None,
                    "explanation": "Explainability visualization is not available for this model.",
                },
                "limitations": [
                    "Model weights are currently in research development pipeline.",
                    "Validation metrics have not been provided.",
                ],
            }

        return {
            "status": "not_connected",
            "model": self.name,
            "message": "AI MODEL NOT CONNECTED",
        }
