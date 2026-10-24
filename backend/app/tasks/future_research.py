from typing import Any, Dict, List
from fastapi import HTTPException, status

from app.config import DISCLAIMER_TEXT
from app.tasks.base import BaseMriTask, PreprocessingConfig, TaskInfo, TaskSetupGuide, TaskStatus

class FutureResearchTask(BaseMriTask):
    """
    Extensible module representing emerging neuroimaging research tasks
    (e.g., DTI Tractography, Resting-State BOLD fMRI, PET-MRI Multimodal synthesis).
    Marked as IN DEVELOPMENT until research pipeline weights are trained and validated.
    """

    task_id = "future-research"
    name = "Future Neuro-AI Emerging Research"
    short_title = "Future Neuro-AI"
    category = "Emerging Neurological Assessment"
    tagline = "Diffusion Tensor Imaging (DTI) tractography & connectome functional representation"
    description = (
        "AXONOVA's advanced architectural direction integrating fractional anisotropy (FA) tractography, "
        "connectomic graph neural networks, and resting-state functional connectivity models."
    )
    supported_scan_types = ["MRI"]
    required_sequences = ["DTI (32-gradient directions)", "Resting-State BOLD fMRI", "Arterial Spin Labeling (ASL)"]
    supported_orientations = ["Axial", "Coronal", "Sagittal"]
    supported_formats = [".jpg", ".jpeg", ".png"]
    limitations = [
        "Emerging research module: Demonstrates advanced tensor connectome feature extraction specifications.",
        "Clinical translation requires correlation with intraoperative cortical mapping and functional testing.",
    ]
    disclaimer = DISCLAIMER_TEXT

    def is_ready(self) -> bool:
        return False

    def get_status(self) -> TaskStatus:
        return "IN_DEVELOPMENT"

    def get_class_labels(self) -> List[str]:
        return [
            "Tract Disruption",
            "Altered Functional Connectivity",
            "Hypoperfusion Core",
        ]

    def get_preprocessing_config(self) -> PreprocessingConfig:
        return PreprocessingConfig(
            target_dimensions=[256, 256],
            channels=3,
            normalization="Rescale [0, 1] float32 (Multi-gradient tensor)",
            supported_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
        )

    def get_setup_guide(self) -> TaskSetupGuide:
        return TaskSetupGuide(
            recommended_datasets=[
                "Human Connectome Project (HCP)",
                "UK Biobank Neuroimaging Cohort",
                "OpenNeuro Multimodal Repositories",
            ],
            required_sequences=self.required_sequences,
            split_policy="STRICT SUBJECT AND SCANNER ISOLATION",
            target_classes=self.get_class_labels(),
            expected_model_path="backend/saved_models/axonova_connectome_best.keras",
            expected_dataset_dir="dataset/future_research",
            data_leakage_risks=[
                "Graph connectome edge leakage across training splits.",
                "Site-specific scanner tensor distortion artifacts.",
            ],
            setup_steps=[
                "1. Download preprocessed DTI or rs-fMRI cohort from HCP.",
                "2. Construct structural/functional adjacency matrices.",
                "3. Train graph convolutional network (GCN) or 3D CNN.",
            ],
        )

    def get_task_info(self) -> TaskInfo:
        return TaskInfo(
            task_id=self.task_id,
            name=self.name,
            short_title=self.short_title,
            category=self.category,
            status=self.get_status(),
            supported_status="IN_DEVELOPMENT",
            tagline=self.tagline,
            description=self.description,
            supported_scan_types=self.supported_scan_types,
            required_sequences=self.required_sequences,
            supported_orientations=self.supported_orientations,
            supported_formats=self.supported_formats,
            class_labels=self.get_class_labels(),
            model_loaded=False,
            model_name=None,
            model_version=None,
            input_shape=None,
            trainable_parameters=None,
            evaluation_available=False,
            overall_accuracy=None,
            limitations=self.limitations,
            disclaimer=self.disclaimer,
            setup_guide=self.get_setup_guide(),
            preprocessing_config=self.get_preprocessing_config(),
        )

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "loaded": False,
            "task_id": self.task_id,
            "model_name": "Future Neuro-AI Connectome Net (Research Roadmap)",
            "model_version": "0.1.0-dev",
            "training_status": "Model not currently available. This condition is under development.",
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
            "dataset_name": "Human Connectome Project (HCP) Roadmap Cohort",
            "total_images": 0,
            "message": "Dataset setup required: Place HCP/UK Biobank DTI scans under dataset/future_research/.",
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
