from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status

from app.config import DISCLAIMER_TEXT, SAVED_MODELS_DIR, WORKSPACE_DIR
from app.tasks.base import BaseMriTask, PreprocessingConfig, TaskInfo, TaskSetupGuide, TaskStatus

class AlzheimersTask(BaseMriTask):
    """
    Modular task for Alzheimer's Disease Brain MRI Structural Analysis.
    Reserves architecture for volumetric temporal-lobe feature extraction, hippocampal pattern analysis,
    and clinical AI classification (CN, MCI, AD).
    Marked as IN DEVELOPMENT until genuine trained model weights and validated datasets are integrated.
    """

    task_id = "alzheimers"
    name = "Alzheimer’s Disease MRI Classification"
    short_title = "Alzheimer’s Disease"
    category = "Neurodegenerative Disorders"
    tagline = "Structural T1-weighted MPRAGE volumetric analysis for hippocampal & cortical atrophy"
    description = (
        "Demonstrates deep learning approaches to identifying neurodegenerative patterns "
        "and progressive volumetric reduction in structural brain MRI. Emphasizes medial temporal "
        "lobe and entorhinal cortex structural biomarkers with attention mapping."
    )
    supported_scan_types = ["MRI"]
    required_sequences = ["3D T1-weighted MPRAGE", "High-Resolution Coronal T1", "T1-weighted"]
    supported_orientations = ["Coronal", "Sagittal", "Axial"]
    supported_formats = [".jpg", ".jpeg", ".png"]
    limitations = [
        "Clinical diagnosis of Alzheimer's requires comprehensive neuropsychological testing, amyloid/tau PET, and CSF biomarkers.",
        "T1-weighted structural atrophy patterns can overlap with frontotemporal lobar degeneration, vascular dementia, and normal aging.",
        "AI output represents assistive structural research, not independent clinical diagnosis.",
    ]
    disclaimer = DISCLAIMER_TEXT

    def __init__(self):
        self.model_path = SAVED_MODELS_DIR / "axonova_alzheimers_best.keras"
        self.dataset_dir = WORKSPACE_DIR / "dataset" / "alzheimers"

    def is_ready(self) -> bool:
        return self.model_path.exists()

    def get_status(self) -> TaskStatus:
        return "SUPPORTED" if self.is_ready() else "IN_DEVELOPMENT"

    def get_class_labels(self) -> List[str]:
        return [
            "Cognitively Normal (CN)",
            "Mild Cognitive Impairment (MCI)",
            "Alzheimer’s Disease (AD)",
        ]

    def get_preprocessing_config(self) -> PreprocessingConfig:
        return PreprocessingConfig(
            target_dimensions=[224, 224],
            channels=3,
            normalization="Rescale [0, 1] float32",
            supported_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
        )

    def get_setup_guide(self) -> TaskSetupGuide:
        return TaskSetupGuide(
            recommended_datasets=[
                "Alzheimer's Disease Neuroimaging Initiative (ADNI) - adni.loni.usc.edu",
                "Open Access Series of Imaging Studies (OASIS-1 / OASIS-3) - oasis-brains.org",
                "Australian Imaging, Biomarkers and Lifestyle (AIBL) Study",
            ],
            required_sequences=["3D T1-weighted MPRAGE (1mm isotropic recommended)"],
            split_policy="STRICT SUBJECT-LEVEL SPLIT: Evaluated on non-overlapping patient splits.",
            target_classes=self.get_class_labels(),
            expected_model_path=str(self.model_path),
            expected_dataset_dir=str(self.dataset_dir),
            data_leakage_risks=[
                "Cross-slice leakage: Multiple slices from one subject in both train and test.",
                "Longitudinal session leakage: Baseline scan in train and follow-up in test.",
            ],
            setup_steps=[
                "1. Acquire T1 volumetric cohort under subject-isolated directory.",
                "2. Perform skull-stripping and affine alignment to MNI152.",
                "3. Train 3D or multi-slice ResNet with subject-level cross-validation.",
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
            model_name="AXONOVA_Alzheimers_CNN" if ready else None,
            model_version="0.1.0-dev",
            input_shape=[224, 224, 3] if ready else None,
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
            "model_name": "AXONOVA_Alzheimers_CNN" if ready else "Alzheimer's CNN (In Development)",
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
            "dataset_name": "ADNI / OASIS Structural Cohort (Required)",
            "total_images": 0,
            "message": "Dataset setup required: Place subject-partitioned structural MRI data under dataset/alzheimers/.",
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
