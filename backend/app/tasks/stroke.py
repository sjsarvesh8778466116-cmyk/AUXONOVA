from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status

from app.config import DISCLAIMER_TEXT, SAVED_MODELS_DIR, WORKSPACE_DIR
from app.tasks.base import BaseMriTask, PreprocessingConfig, TaskInfo, TaskSetupGuide, TaskStatus

class StrokeTask(BaseMriTask):
    """
    Modular task for Stroke-Related MRI Classification & Infarct Assessment.
    Performs Diffusion-Weighted Imaging (DWI) and ADC map restricted diffusion analysis,
    ischemic territory identification, and clinical AI classification.
    Marked as IN DEVELOPMENT until genuine trained model weights and validated datasets are integrated.
    """

    task_id = "stroke"
    name = "Stroke Assessment MRI Analysis"
    short_title = "Stroke Assessment"
    category = "Cerebrovascular Disease"
    tagline = "Diffusion-Weighted (DWI) & ADC map evaluation for acute ischemic patterns"
    description = (
        "Designed for rapid identification of acute cerebral ischemia and cytotoxic edema using "
        "diffusion parameters (restricted diffusion on DWI matched with ADC hypointensity). "
        "Highlights the time-critical hyperacute therapeutic window."
    )
    supported_scan_types = ["MRI"]
    required_sequences = [
        "Diffusion-Weighted Imaging (DWI b=1000)",
        "Apparent Diffusion Coefficient (ADC) Map",
        "T2-FLAIR",
        "DWI",
    ]
    supported_orientations = ["Axial"]
    supported_formats = [".jpg", ".jpeg", ".png"]
    limitations = [
        "Emergency stroke triage must be guided by immediate hospital thrombolysis/thrombectomy protocols.",
        "DWI 'shine-through' artifacts on T2 images require validation with quantitative ADC hypointensity.",
        "AI output represents decision-support research and cannot replace urgent acute stroke team evaluation.",
    ]
    disclaimer = DISCLAIMER_TEXT

    def __init__(self):
        self.model_path = SAVED_MODELS_DIR / "axonova_stroke_best.keras"
        self.dataset_dir = WORKSPACE_DIR / "dataset" / "stroke"

    def is_ready(self) -> bool:
        return self.model_path.exists()

    def get_status(self) -> TaskStatus:
        return "SUPPORTED" if self.is_ready() else "IN_DEVELOPMENT"

    def get_class_labels(self) -> List[str]:
        return [
            "Acute Ischemic Infarction",
            "Subacute Infarction",
            "Normal Perfusion Baseline",
        ]

    def get_preprocessing_config(self) -> PreprocessingConfig:
        return PreprocessingConfig(
            target_dimensions=[256, 256],
            channels=1,
            normalization="Rescale [0, 1] float32 (b=1000 normalized)",
            supported_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
        )

    def get_setup_guide(self) -> TaskSetupGuide:
        return TaskSetupGuide(
            recommended_datasets=[
                "ISLES 2022 (Ischemic Stroke Lesion Segmentation Challenge)",
                "ATLAS (Anatomical Tracings of Lesions After Stroke) v2.0",
                "Clinical Stroke DWI Research Repositories",
            ],
            required_sequences=["Axial DWI (b=1000)", "Apparent Diffusion Coefficient (ADC) Map"],
            split_policy="STRICT SUBJECT AND ONSET-TIME PARTITION: Non-overlapping patient split.",
            target_classes=self.get_class_labels(),
            expected_model_path=str(self.model_path),
            expected_dataset_dir=str(self.dataset_dir),
            data_leakage_risks=[
                "Multi-sequence leakage across co-registered slices.",
                "Temporal leakage between acute and follow-up scans from the same patient.",
            ],
            setup_steps=[
                "1. Pair DWI b=1000 scans with corresponding ADC maps.",
                "2. Standardize voxel resolution and slice thickness.",
                "3. Train dual-channel convolutional network with subject-level cross-validation.",
            ],
        )

    def get_task_info(self) -> TaskInfo:
        ready = self.is_ready()
        return TaskInfo(
            task_id=self.task_id,
            name=self.name,
            short_title=self.short_title,
            category=self.category,
            status=self.get_status(),
            supported_status="SUPPORTED" if ready else "IN_DEVELOPMENT",
            tagline=self.tagline,
            description=self.description,
            supported_scan_types=self.supported_scan_types,
            required_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
            supported_formats=self.supported_formats,
            class_labels=self.get_class_labels(),
            model_loaded=ready,
            model_name="AXONOVA_Stroke_CNN" if ready else None,
            model_version="0.1.0-dev",
            input_shape=[256, 256, 1] if ready else None,
            trainable_parameters=None,
            evaluation_available=False,
            overall_accuracy=None,
            limitations=self.limitations,
            disclaimer=self.disclaimer,
            setup_guide=self.get_setup_guide(),
            preprocessing_config=self.get_preprocessing_config(),
        )

    def get_model_info(self) -> Dict[str, Any]:
        ready = self.is_ready()
        return {
            "loaded": ready,
            "task_id": self.task_id,
            "model_name": "AXONOVA_Stroke_CNN" if ready else "Stroke CNN (In Development)",
            "model_version": "0.1.0-dev",
            "training_status": "Trained & Validated" if ready else "Model not currently available. This condition is under development.",
            "supported_classes": self.get_class_labels(),
            "supported_scan_type": "MRI",
            "evaluation_available": False,
            "overall_accuracy": None,
            "disclaimer": self.disclaimer,
        }

    def get_evaluation(self) -> Dict[str, Any]:
        return {
            "evaluated": False,
            "task_id": self.task_id,
            "message": "Model not currently available. This condition is under development.",
            "disclaimer": self.disclaimer,
        }

    def get_dataset_info(self) -> Dict[str, Any]:
        return {
            "available": False,
            "task_id": self.task_id,
            "dataset_name": "ISLES / ATLAS Stroke Cohort (Required)",
            "total_images": 0,
            "message": "Dataset setup required: Place subject-partitioned stroke MRI data under dataset/stroke/.",
            "disclaimer": self.disclaimer,
        }

    def predict(
        self,
        file_bytes: bytes,
        scan_type: str,
        orientation: str,
        filename: str = "uploaded_scan.jpg",
    ) -> Dict[str, Any]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model not currently available. This condition is under development.",
        )
