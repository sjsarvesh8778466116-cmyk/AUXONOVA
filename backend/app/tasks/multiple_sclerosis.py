from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status

from app.config import DISCLAIMER_TEXT, SAVED_MODELS_DIR, WORKSPACE_DIR
from app.tasks.base import BaseMriTask, PreprocessingConfig, TaskInfo, TaskSetupGuide, TaskStatus

class MultipleSclerosisTask(BaseMriTask):
    """
    Modular task for Multiple Sclerosis Brain MRI Plaque & Lesion Analysis.
    Reserves architecture for T2-FLAIR hyperintensity clustering, periventricular lesion mapping,
    and clinical AI classification according to McDonald criteria.
    Marked as IN DEVELOPMENT until genuine trained model weights and validated datasets are integrated.
    """

    task_id = "multiple-sclerosis"
    name = "Multiple Sclerosis MRI Analysis"
    short_title = "Multiple Sclerosis"
    category = "Demyelinating Disease"
    tagline = "FLAIR & T2 hyperintense demyelinating plaque detection & McDonald criteria lesion distribution"
    description = (
        "Demonstrates automated spatial mapping of periventricular, juxtacortical, and infratentorial "
        "demyelinating lesions. Emphasizes dissemination in space (DIS) and time (DIT) criteria."
    )
    supported_scan_types = ["MRI"]
    required_sequences = ["Axial T2-FLAIR", "Sagittal 3D FLAIR", "Dual-Echo Proton Density", "T2-FLAIR"]
    supported_orientations = ["Axial", "Sagittal"]
    supported_formats = [".jpg", ".jpeg", ".png"]
    limitations = [
        "Demyelinating plaque quantification requires correlation with contrast T1 for active vs chronic phase.",
        "Small vessel ischemic white matter changes (Fazekas scale) can mimic demyelinating hyperintensities.",
        "AI output represents assistive lesion research, not standalone clinical diagnosis.",
    ]
    disclaimer = DISCLAIMER_TEXT

    def __init__(self):
        self.model_path = SAVED_MODELS_DIR / "axonova_ms_best.keras"
        self.dataset_dir = WORKSPACE_DIR / "dataset" / "multiple-sclerosis"

    def is_ready(self) -> bool:
        return self.model_path.exists()

    def get_status(self) -> TaskStatus:
        return "SUPPORTED" if self.is_ready() else "IN_DEVELOPMENT"

    def get_class_labels(self) -> List[str]:
        return [
            "Periventricular Plaque",
            "Juxtacortical / Infratentorial",
            "Normal White Matter",
        ]

    def get_preprocessing_config(self) -> PreprocessingConfig:
        return PreprocessingConfig(
            target_dimensions=[256, 256],
            channels=1,
            normalization="Rescale [0, 1] float32 (FLAIR signal)",
            supported_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
        )

    def get_setup_guide(self) -> TaskSetupGuide:
        return TaskSetupGuide(
            recommended_datasets=[
                "ISBI 2015 Longitudinal MS Lesion Segmentation Challenge",
                "MICCAI 2016 MS Lesion Segmentation Benchmark",
                "MSD Task01 Brain Lesions",
            ],
            required_sequences=["Axial T2-FLAIR", "3D Sagittal FLAIR"],
            split_policy="STRICT SCANNER AND SUBJECT-LEVEL SPLIT: Patient ID isolated across splits.",
            target_classes=self.get_class_labels(),
            expected_model_path=str(self.model_path),
            expected_dataset_dir=str(self.dataset_dir),
            data_leakage_risks=[
                "Cross-institutional scanner bias leakage.",
                "Longitudinal session leakage from same patient follow-up MRI.",
            ],
            setup_steps=[
                "1. Perform N4 bias field correction and skull stripping on FLAIR volumes.",
                "2. Register FLAIR scans to standard anatomical template.",
                "3. Train 2D/3D segmentation or multi-class CNN with cross-site validation.",
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
            model_name="AXONOVA_MS_CNN" if ready else None,
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
            "model_name": "AXONOVA_MS_CNN" if ready else "Multiple Sclerosis CNN (In Development)",
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
            "dataset_name": "ISBI / MICCAI MS Lesion Cohort (Required)",
            "total_images": 0,
            "message": "Dataset setup required: Place subject-partitioned MS FLAIR MRI data under dataset/multiple-sclerosis/.",
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
