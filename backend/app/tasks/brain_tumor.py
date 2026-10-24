import io
import json
import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional
import numpy as np
import tensorflow as tf
from fastapi import HTTPException, status

from app.config import (
    DATASET_DIR,
    DISCLAIMER_TEXT,
    EVAL_METRICS_PATH,
    INPUT_SHAPE,
    LABELS_FILE_PATH,
    METADATA_FILE_PATH,
    MODEL_FILE_PATH,
)
from app.tasks.base import BaseMriTask, PreprocessingConfig, TaskInfo, TaskSetupGuide, TaskStatus
from model.gradcam import (
    find_target_conv_layer,
    generate_gradcam_heatmap,
    get_or_build_grad_model,
    overlay_gradcam_base64,
)
from model.preprocessing import load_and_preprocess_image

logger = logging.getLogger("axonova.tasks.brain_tumor")

class BrainTumorTask(BaseMriTask):
    """
    Modular task for Brain Tumor MRI Classification (Glioma, Meningioma, Pituitary, No Tumor).
    Uses a validated 3-block CNN model with held-out test split evaluation and Grad-CAM explainability.
    """

    task_id = "brain-tumor"
    name = "Brain Tumor MRI Classification"
    short_title = "Brain Tumor"
    category = "Neuro-Oncology"
    tagline = "4-Class axial & coronal brain neoplasm feature classification with Grad-CAM"
    description = (
        "Demonstrates deep convolutional feature extraction for distinguishing three common "
        "intracranial neoplasms (Glioma, Meningioma, Pituitary) from non-tumor control brain MRI scans. "
        "Evaluated on a separate held-out test split with Grad-CAM activation visualization."
    )
    supported_scan_types = ["MRI"]
    required_sequences = ["T1-weighted Contrast-Enhanced", "T2-weighted", "FLAIR"]
    supported_orientations = ["Axial", "Coronal", "Sagittal", "Not specified"]
    supported_formats = [".jpg", ".jpeg", ".png"]
    limitations = [
        "Academic prototype: Output scores are uncalibrated statistical class similarities, not clinical disease likelihoods.",
        "Model has not been validated on diverse scanner hardware or multi-vendor DICOM acquisitions.",
        "Cannot substitute for histopathological biopsy or radiologist differential diagnosis.",
        "Performance varies significantly on non-standardized slice orientations and atypical tumor presentations.",
    ]
    disclaimer = DISCLAIMER_TEXT

    def __init__(self):
        self._model: Optional[tf.keras.Model] = None
        self._labels: Optional[List[str]] = None
        self._metadata: Optional[Dict[str, Any]] = None

    def is_ready(self) -> bool:
        return MODEL_FILE_PATH.exists() and LABELS_FILE_PATH.exists()

    def get_status(self) -> TaskStatus:
        return "SUPPORTED" if self.is_ready() else "setup_required"

    def get_preprocessing_config(self) -> PreprocessingConfig:
        return PreprocessingConfig(
            target_dimensions=[224, 224],
            channels=3,
            normalization="Rescale [0, 1] float32",
            supported_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
        )


    def get_class_labels(self) -> List[str]:
        if not LABELS_FILE_PATH.exists():
            return []
        try:
            with open(LABELS_FILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _get_metadata(self) -> Dict[str, Any]:
        if self._metadata is None and METADATA_FILE_PATH.exists():
            try:
                with open(METADATA_FILE_PATH, "r", encoding="utf-8") as f:
                    self._metadata = json.load(f)
            except Exception:
                self._metadata = {}
        return self._metadata or {}

    def _load_model_and_labels(self):
        if not self.is_ready():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Brain Tumor model checkpoint missing at {MODEL_FILE_PATH}.",
            )

        if self._model is None:
            logger.info("Loading Brain Tumor CNN model from %s...", MODEL_FILE_PATH)
            self._model = tf.keras.models.load_model(str(MODEL_FILE_PATH))
            # Pre-warm
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            _ = self._model(dummy, training=False)
            conv_name = find_target_conv_layer(self._model)
            if conv_name:
                get_or_build_grad_model(self._model, conv_name)

        if self._labels is None:
            self._labels = self.get_class_labels()

        return self._model, self._labels

    def get_task_info(self) -> TaskInfo:
        ready = self.is_ready()
        metadata = self._get_metadata()
        labels = self.get_class_labels()
        accuracy = None

        if EVAL_METRICS_PATH.exists():
            try:
                with open(EVAL_METRICS_PATH, "r", encoding="utf-8") as f:
                    m = json.load(f)
                    accuracy = m.get("overall_accuracy")
            except Exception:
                pass

        return TaskInfo(
            task_id=self.task_id,
            name=self.name,
            short_title=self.short_title,
            category=self.category,
            status=self.get_status(),
            supported_status="SUPPORTED",
            tagline=self.tagline,
            description=self.description,
            supported_scan_types=self.supported_scan_types,
            required_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
            supported_formats=self.supported_formats,
            class_labels=labels,
            model_loaded=ready,
            model_name=metadata.get("model_name", "AXONOVA_Brain_MRI_Classifier" if ready else None),
            model_version=metadata.get("version", "1.0.0" if ready else None),
            input_shape=list(INPUT_SHAPE) if ready else None,
            trainable_parameters=metadata.get("trainable_parameters"),
            evaluation_available=accuracy is not None,
            overall_accuracy=accuracy,
            limitations=self.limitations,
            disclaimer=self.disclaimer,
            setup_guide=None,
            preprocessing_config=self.get_preprocessing_config(),
        )

    def get_model_info(self) -> Dict[str, Any]:
        ready = self.is_ready()
        metadata = self._get_metadata()
        labels = self.get_class_labels()
        return {
            "loaded": ready,
            "task_id": self.task_id,
            "model_name": metadata.get("model_name", "AXONOVA_Brain_MRI_Classifier" if ready else None),
            "model_version": metadata.get("version", "1.0.0" if ready else None),
            "input_shape": list(INPUT_SHAPE) if ready else None,
            "supported_classes": labels,
            "supported_scan_type": "MRI",
            "training_status": "Trained and Ready" if ready else "Model setup required",
            "evaluation_available": EVAL_METRICS_PATH.exists(),
            "architecture_summary": (
                "3-Block Convolutional Neural Network with Batch Normalization, Max Pooling, "
                "Global Average Pooling, Dropout (0.4), and Softmax classification head."
            ) if ready else None,
            "layer_count": 13 if ready else None,
            "trainable_parameters": metadata.get("trainable_parameters"),
            "trained_at": metadata.get("trained_at"),
            "disclaimer": self.disclaimer,
        }

    def get_evaluation(self) -> Dict[str, Any]:
        if not EVAL_METRICS_PATH.exists():
            return {
                "evaluated": False,
                "task_id": self.task_id,
                "disclaimer": self.disclaimer,
            }
        try:
            with open(EVAL_METRICS_PATH, "r", encoding="utf-8") as f:
                metrics = json.load(f)
            metrics["task_id"] = self.task_id
            return metrics
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to read evaluation metrics: {str(e)}",
            )

    def get_dataset_info(self) -> Dict[str, Any]:
        valid_exts = {".jpg", ".jpeg", ".png"}
        if not DATASET_DIR.exists():
            return {
                "available": False,
                "task_id": self.task_id,
                "dataset_name": "Brain MRI Labeled Dataset",
                "source": "Local Directory",
                "total_images": 0,
                "class_distribution": {},
                "split_counts": {},
                "disclaimer": self.disclaimer,
            }

        subdirs = [p for p in DATASET_DIR.iterdir() if p.is_dir()]
        subdir_names = {p.name.lower() for p in subdirs}
        has_splits = "train" in subdir_names

        class_distribution = {}
        split_counts = {}
        total_images = 0

        if has_splits:
            for split_name in ["train", "val", "test"]:
                split_dir = DATASET_DIR / split_name
                if split_dir.exists():
                    count_in_split = 0
                    for c_folder in split_dir.iterdir():
                        if c_folder.is_dir():
                            c_name = c_folder.name
                            files = [p for p in c_folder.iterdir() if p.suffix.lower() in valid_exts]
                            c_count = len(files)
                            count_in_split += c_count
                            class_distribution[c_name] = class_distribution.get(c_name, 0) + c_count
                    split_counts[split_name] = count_in_split
                    total_images += count_in_split

        return {
            "available": total_images > 0,
            "task_id": self.task_id,
            "dataset_name": "Brain MRI Multi-Class Dataset",
            "source": "Educational Brain MRI Dataset Archive",
            "license_terms": "Educational / Research Demonstration Only",
            "folder_layout": "dataset/{split}/{class_name}/*.jpg",
            "class_distribution": class_distribution,
            "split_counts": split_counts,
            "total_images": total_images,
            "input_resolution": "224x224 px",
            "color_mode": "RGB (3 channels)",
            "normalization": "Rescaled to [0.0, 1.0]",
            "disclaimer": self.disclaimer,
        }

    def predict(
        self,
        file_bytes: bytes,
        scan_type: str,
        orientation: str,
        filename: str = "uploaded_scan.jpg",
    ) -> Dict[str, Any]:
        t_start = time.perf_counter()
        model, class_labels = self._load_model_and_labels()

        try:
            img_batch = load_and_preprocess_image(file_bytes)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image preprocessing failed for {self.name}: {str(e)}",
            )

        try:
            predictions = model(img_batch, training=False).numpy()
            probs = predictions[0]
        except Exception as e:
            logger.error("Brain tumor inference failed: %s", str(e), exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Inference failed: {str(e)}",
            )

        if len(probs) != len(class_labels):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Model output dimension ({len(probs)}) mismatch with labels ({len(class_labels)}).",
            )

        top_idx = int(np.argmax(probs))
        predicted_category = class_labels[top_idx]
        top_score = float(probs[top_idx])

        per_class_scores = []
        for idx, class_name in enumerate(class_labels):
            score_val = float(probs[idx])
            per_class_scores.append({
                "class_name": class_name,
                "score": round(score_val, 4),
                "percentage": round(score_val * 100.0, 2),
            })
        per_class_scores.sort(key=lambda x: x["score"], reverse=True)

        uncertainty_notice = None
        if len(per_class_scores) > 1:
            diff_top_two = per_class_scores[0]["score"] - per_class_scores[1]["score"]
            if top_score < 0.50 or diff_top_two < 0.15:
                uncertainty_notice = (
                    f"Notice: The model exhibits distributed output scores between "
                    f"'{per_class_scores[0]['class_name']}' ({per_class_scores[0]['percentage']}%) and "
                    f"'{per_class_scores[1]['class_name']}' ({per_class_scores[1]['percentage']}%). "
                    "Educational CNN outputs are uncalibrated dataset scores, not clinical conclusions."
                )

        gradcam_available = False
        gradcam_base64 = None
        gradcam_explanation = None

        try:
            heatmap = generate_gradcam_heatmap(
                model=model,
                preprocessed_img=img_batch,
                target_class_idx=top_idx,
            )
            if heatmap is not None:
                overlay_b64 = overlay_gradcam_base64(
                    original_img_source=io.BytesIO(file_bytes),
                    heatmap=heatmap,
                )
                if overlay_b64:
                    gradcam_available = True
                    gradcam_base64 = overlay_b64
                    gradcam_explanation = (
                        "The Grad-CAM overlay highlights spatial regions within the scan that most "
                        f"strongly influenced the model's feature representations for the predicted "
                        f"category '{predicted_category}'. Grad-CAM is an algorithmic visualizer and "
                        "does not confirm or rule out clinical pathology."
                    )
        except Exception as e:
            logger.error("Grad-CAM generation failed: %s", str(e), exc_info=True)

        elapsed = time.perf_counter() - t_start
        logger.info("Inference completed for '%s' in %.3fs (%s: %.1f%%)",
                    filename, elapsed, predicted_category, top_score * 100)

        class_probs_map = {label: round(float(probs[i]), 6) for i, label in enumerate(class_labels)}
        developer_diagnostics = {
            "model_loaded": True,
            "raw_output": [round(float(p), 6) for p in probs],
            "class_probabilities": class_probs_map,
            "max_probability": round(top_score, 6),
            "confidence_threshold": 0.55,
            "prediction_before_threshold": predicted_category,
            "final_status": "completed",
        }

        return {
            "task_id": self.task_id,
            "task_name": self.name,
            "predicted_category": predicted_category,
            "model_score": round(top_score, 4),
            "score_label": "Model score (not a disease probability)",
            "per_class_scores": per_class_scores,
            "filename": filename,
            "scan_type": scan_type,
            "orientation_label": orientation,
            "model_name": "AXONOVA_Brain_MRI_Classifier",
            "model_version": "1.0.0",
            "gradcam_available": gradcam_available,
            "gradcam_image_base64": gradcam_base64,
            "gradcam_explanation": gradcam_explanation,
            "uncertainty_notice": uncertainty_notice,
            "developer_diagnostics": developer_diagnostics,
            "disclaimer": self.disclaimer,
        }
