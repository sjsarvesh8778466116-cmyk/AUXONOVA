import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import tensorflow as tf

from preprocessing.image_processing import preprocess_for_tumor_model
from inference.explainability import generate_explainability_bundle

logger = logging.getLogger("axonova.models.tumor_model")

# Base directory relative to backend
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent.parent
SAVED_MODELS_DIR = BACKEND_DIR / "saved_models"
EVALUATION_DIR = BACKEND_DIR / "evaluation_results"

WEIGHTS_PATH = SAVED_MODELS_DIR / "axonova_brain_mri_best.keras"
LABELS_PATH = SAVED_MODELS_DIR / "class_labels.json"
METADATA_PATH = SAVED_MODELS_DIR / "model_metadata.json"
METRICS_PATH = EVALUATION_DIR / "metrics.json"

class TumorModelWrapper:
    """
    Wrapper for AXONOVA Brain Tumor Classifier.
    Executes real inference on trained Keras weights with Grad-CAM explainability.
    """

    def __init__(self):
        self.model_id = "axonova_brain_tumor_classifier"
        self.name = "Brain Tumor Classifier"
        self.version = "1.0.0"
        self.task = "classification"
        self.supported_conditions = ["Glioma", "Meningioma", "Pituitary", "No_Tumor"]
        self.supported_sequences = [
            "T1",
            "T1-weighted",
            "T1-weighted Contrast-Enhanced",
            "T1-weighted (+contrast)",
            "T1+C",
            "T1-weighted MPRAGE",
            "T2",
            "T2-weighted",
            "FLAIR",
            "T2-FLAIR",
        ]
        self.input_shape = (224, 224, 3)
        self.confidence_threshold = 0.55
        self.explainability_method = "Grad-CAM"

        self._model: Optional[tf.keras.Model] = None
        self._labels: List[str] = []
        self._metadata: Dict[str, Any] = {}
        self._metrics: Optional[Dict[str, Any]] = None
        self._is_loaded = False

        self._initialize()

    def _initialize(self):
        """Attempts to load weights and labels."""
        if not WEIGHTS_PATH.exists() or not LABELS_PATH.exists():
            logger.warning("Tumor model checkpoint not found at %s", WEIGHTS_PATH)
            self._is_loaded = False
            return

        try:
            with open(LABELS_PATH, "r", encoding="utf-8") as f:
                self._labels = json.load(f)

            if METADATA_PATH.exists():
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    self._metadata = json.load(f)

            if METRICS_PATH.exists():
                with open(METRICS_PATH, "r", encoding="utf-8") as f:
                    self._metrics = json.load(f)

            logger.info("Loading Brain Tumor Keras model from %s...", WEIGHTS_PATH)
            self._model = tf.keras.models.load_model(str(WEIGHTS_PATH))

            # Warm-up pass to eliminate initial latency
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            _ = self._model(dummy, training=False)
            self._is_loaded = True
            logger.info("Brain Tumor Classifier initialized and warmed up successfully.")
        except Exception as e:
            logger.error("Failed to load Brain Tumor Classifier: %s", str(e), exc_info=True)
            self._is_loaded = False

    def is_available(self) -> bool:
        return self._is_loaded and self._model is not None

    def get_status(self) -> str:
        return "AVAILABLE" if self.is_available() else "NOT_AVAILABLE"

    def get_metrics(self) -> Optional[Dict[str, Any]]:
        return self._metrics

    def predict(
        self,
        file_bytes: bytes,
        original_filename: str = "scan.jpg",
    ) -> Dict[str, Any]:
        """
        Executes genuine forward pass inference on uploaded scan bytes.
        """
        if not self.is_available():
            return {
                "status": "not_connected",
                "model": self.name,
                "model_version": self.version,
                "prediction": None,
                "confidence": 0.0,
                "supported": False,
                "message": (
                    "AI MODEL NOT CONNECTED. The interface is ready for model integration. "
                    "Connect a trained and validated model to perform actual MRI inference."
                ),
            }

        # 1. Model-specific preprocessing
        preprocessed = preprocess_for_tumor_model(file_bytes, target_size=(224, 224))

        # 2. Genuine Model Forward Pass
        predictions = self._model(preprocessed, training=False).numpy()
        probs = predictions[0]

        top_idx = int(np.argmax(probs))
        top_class = self._labels[top_idx]
        confidence = float(probs[top_idx])

        # Breakdown of all class probabilities
        scores_breakdown = [
            {
                "class_name": label,
                "score": round(float(probs[i]), 4),
                "percentage": round(float(probs[i]) * 100.0, 2),
            }
            for i, label in enumerate(self._labels)
        ]
        scores_breakdown.sort(key=lambda x: x["score"], reverse=True)

        # 3. Low-confidence threshold check
        is_indeterminate = confidence < self.confidence_threshold
        if is_indeterminate:
            result_status = "indeterminate"
            displayed_prediction = "Indeterminate"
            clinical_message = (
                "Indeterminate — the available AI model did not produce a sufficiently reliable classification."
            )
        else:
            result_status = "completed"
            displayed_prediction = top_class
            clinical_message = f"AI Assessment: Pattern consistent with {top_class}."

        # Developer-only diagnostic section
        class_probs_map = {label: round(float(probs[i]), 6) for i, label in enumerate(self._labels)}
        developer_diagnostics = {
            "model_loaded": self.is_available(),
            "raw_output": [round(float(p), 6) for p in probs],
            "class_probabilities": class_probs_map,
            "max_probability": round(confidence, 6),
            "confidence_threshold": self.confidence_threshold,
            "prediction_before_threshold": top_class,
            "final_status": result_status,
        }
        logger.info(
            "TumorModel Inference: model_loaded=%s, max_prob=%.4f, threshold=%.2f, raw_pred=%s, final_status=%s",
            developer_diagnostics["model_loaded"],
            developer_diagnostics["max_probability"],
            developer_diagnostics["confidence_threshold"],
            developer_diagnostics["prediction_before_threshold"],
            developer_diagnostics["final_status"],
        )

        # 4. Generate genuine Grad-CAM explainability
        explainability = generate_explainability_bundle(
            model=self._model,
            preprocessed_batch=preprocessed,
            original_file_bytes=file_bytes,
            target_class_name=top_class,
            target_class_idx=top_idx,
            supports_explainability=True,
        )

        return {
            "status": result_status,
            "model": self.name,
            "model_id": self.model_id,
            "model_version": self.version,
            "task": self.task,
            "prediction": displayed_prediction,
            "raw_prediction": top_class,
            "confidence": round(confidence, 4),
            "confidence_percentage": round(confidence * 100.0, 2),
            "confidence_threshold": self.confidence_threshold,
            "is_indeterminate": is_indeterminate,
            "supported": True,
            "class_scores": scores_breakdown,
            "explainability": explainability,
            "message": clinical_message,
            "developer_diagnostics": developer_diagnostics,
            "limitations": [
                "Single 2D slice analysis does not evaluate full 3D volumetric tumor margins.",
                "Model was trained on 4 specific classes (Glioma, Meningioma, Pituitary, No Tumor).",
                "Requires clinical examination and histopathological confirmation.",
            ],
        }
