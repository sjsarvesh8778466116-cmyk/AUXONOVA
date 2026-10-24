import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("axonova.models.stroke_model")

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent.parent
SAVED_MODELS_DIR = BACKEND_DIR / "saved_models"
STROKE_WEIGHTS_PATH = SAVED_MODELS_DIR / "axonova_stroke_best.keras"

class StrokeModelWrapper:
    """
    Wrapper for AXONOVA Stroke Assessment Model.
    Designed for Diffusion-Weighted Imaging (DWI) and ADC map restricted diffusion analysis.
    If real model weights are not loaded on disk, honestly reports MODEL NOT CONNECTED.
    """

    def __init__(self):
        self.model_id = "axonova_stroke_model"
        self.name = "Stroke Assessment Model"
        self.version = "0.8.0-dev"
        self.task = "classification"
        self.supported_conditions = [
            "Acute Ischemic Infarction",
            "Subacute Infarct",
            "Normal Perfusion Baseline",
        ]
        self.supported_sequences = [
            "Diffusion-Weighted Imaging (DWI b=1000)",
            "DWI",
            "ADC Map",
            "Apparent Diffusion Coefficient (ADC) Map",
            "T2-FLAIR",
        ]
        self.input_shape = (256, 256, 1)
        self.confidence_threshold = 0.60
        self.explainability_method = None
        self._is_loaded = STROKE_WEIGHTS_PATH.exists()

    def is_available(self) -> bool:
        return self._is_loaded

    def get_status(self) -> str:
        return "AVAILABLE" if self.is_available() else "IN DEVELOPMENT"

    def get_metrics(self) -> Optional[Dict[str, Any]]:
        # Metrics not yet provided because weights are in development
        return None

    def predict(
        self,
        file_bytes: bytes,
        original_filename: str = "scan.jpg",
    ) -> Dict[str, Any]:
        """
        Executes prediction or returns honest NOT CONNECTED state.
        Never fabricates predictions or heatmaps.
        """
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

        # If weights are added in future, load and run inference here.
        return {
            "status": "not_connected",
            "model": self.name,
            "message": "AI MODEL NOT CONNECTED",
        }
