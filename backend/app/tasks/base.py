from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Tuple
from pydantic import BaseModel, Field

TaskStatus = Literal["SUPPORTED", "IN_DEVELOPMENT", "ready", "setup_required", "coming_later"]

class PreprocessingConfig(BaseModel):
    target_dimensions: List[int] = Field(default_factory=lambda: [224, 224])
    channels: int = 3
    normalization: str = "Rescale [0, 1] float32"
    supported_sequences: List[str] = Field(default_factory=list)
    supported_orientations: List[str] = Field(default_factory=list)

class TaskSetupGuide(BaseModel):
    recommended_datasets: List[str]
    required_sequences: List[str]
    split_policy: str
    target_classes: List[str]
    expected_model_path: str
    expected_dataset_dir: str
    data_leakage_risks: List[str]
    setup_steps: List[str]

class TaskInfo(BaseModel):
    task_id: str
    name: str
    short_title: str
    category: str
    status: TaskStatus
    supported_status: str = "IN_DEVELOPMENT"  # "SUPPORTED" or "IN_DEVELOPMENT"
    tagline: str
    description: str
    supported_scan_types: List[str]
    required_sequences: List[str]
    supported_orientations: List[str]
    supported_formats: List[str]
    class_labels: List[str]
    model_loaded: bool
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    input_shape: Optional[List[int]] = None
    trainable_parameters: Optional[int] = None
    evaluation_available: bool = False
    overall_accuracy: Optional[float] = None
    limitations: List[str]
    disclaimer: str
    setup_guide: Optional[TaskSetupGuide] = None
    preprocessing_config: Optional[PreprocessingConfig] = None


class BaseMriTask(ABC):
    """
    Abstract base class for all condition-specific brain MRI research tasks.
    Enforces strict separation of preprocessing, sequence requirements, class labels,
    model files, evaluation results, and safety limits.
    """

    task_id: str
    name: str
    short_title: str
    category: str
    tagline: str
    description: str
    supported_scan_types: List[str] = ["MRI"]
    required_sequences: List[str]
    supported_orientations: List[str]
    supported_formats: List[str] = [".jpg", ".jpeg", ".png"]
    limitations: List[str]
    disclaimer: str

    @abstractmethod
    def get_status(self) -> TaskStatus:
        """Determines if the task has genuine data and a real model loaded."""
        pass

    @abstractmethod
    def is_ready(self) -> bool:
        """True if task is verified and can accept inference."""
        pass

    @abstractmethod
    def get_task_info(self) -> TaskInfo:
        """Returns standard metadata for UI rendering."""
        pass

    @abstractmethod
    def get_class_labels(self) -> List[str]:
        """Returns actual class labels, never fabricated."""
        pass

    @abstractmethod
    def get_model_info(self) -> Dict[str, Any]:
        """Returns real model architecture metadata."""
        pass

    @abstractmethod
    def get_evaluation(self) -> Dict[str, Any]:
        """Returns real evaluation metrics on held-out test split."""
        pass

    @abstractmethod
    def get_dataset_info(self) -> Dict[str, Any]:
        """Returns verified dataset split counts and distributions."""
        pass

    @abstractmethod
    def get_preprocessing_config(self) -> PreprocessingConfig:
        """Returns task-specific preprocessing and sequence compatibility specifications."""
        pass

    @abstractmethod
    def predict(
        self,
        file_bytes: bytes,
        scan_type: str,
        orientation: str,
        filename: str = "uploaded_scan.jpg",
    ) -> Dict[str, Any]:
        """
        Executes task-specific inference.
        Raises HTTPException or ValueError if task is not ready.
        """
        pass
