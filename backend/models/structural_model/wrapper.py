import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("axonova.models.structural_model")

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent.parent
SAVED_MODELS_DIR = BACKEND_DIR / "saved_models"
STRUCTURAL_WEIGHTS_PATH = SAVED_MODELS_DIR / "axonova_structural_best.keras"

class StructuralModelWrapper:
    """
    Wrapper for AXONOVA Structural Atrophy & Ventricular Volumetry Model.
    Designed for 3D T1 MPRAGE sequence analysis of ventricular enlargement and cortical atrophy.
    """

    def __init__(self):
        self.model_id = "axonova_structural_model"
        self.name = "Structural Atrophy & Ventricular Model"
        self.version = "0.5.0-research"
        self.task = "segmentation"
        self.supported_conditions = [
            "Brain Atrophy Patterns",
            "Hydrocephalus / Enlarged Ventricles",
            "Mild Cognitive Impairment Structural Biomarkers",
        ]
        self.supported_sequences = [
            "T1 3D Volumetric (MPRAGE)",
            "T1-3D",
            "Coronal T1",
        ]
        self.input_shape = (256, 256, 1)
        self.confidence_threshold = 0.60
        self.explainability_method = None
        self._is_loaded = STRUCTURAL_WEIGHTS_PATH.exists()

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
                    "Requires volumetric 3D T1-weighted series; single slices cannot quantify intracranial volume.",
                    "Validation metrics have not been provided.",
                ],
            }

        return {
            "status": "not_connected",
            "model": self.name,
            "message": "AI MODEL NOT CONNECTED",
        }
