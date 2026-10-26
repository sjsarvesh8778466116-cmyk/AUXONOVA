import os
from pathlib import Path
from typing import List, Tuple

# Base Directories
BACKEND_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = BACKEND_DIR.parent

# Model & Preprocessing Settings
IMAGE_HEIGHT: int = int(os.getenv("AXONOVA_IMG_HEIGHT", "224"))
IMAGE_WIDTH: int = int(os.getenv("AXONOVA_IMG_WIDTH", "224"))
IMAGE_CHANNELS: int = 3
IMAGE_SIZE: Tuple[int, int] = (IMAGE_WIDTH, IMAGE_HEIGHT)
INPUT_SHAPE: Tuple[int, int, int] = (IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNELS)

BATCH_SIZE: int = int(os.getenv("AXONOVA_BATCH_SIZE", "32"))
DEFAULT_EPOCHS: int = int(os.getenv("AXONOVA_EPOCHS", "15"))
LEARNING_RATE: float = float(os.getenv("AXONOVA_LR", "0.001"))
RANDOM_SEED: int = 42

# Upload Limits & Security
MAX_UPLOAD_SIZE_MB: int = int(os.getenv("AXONOVA_MAX_UPLOAD_SIZE_MB", "15"))
MAX_UPLOAD_SIZE_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png"}
ALLOWED_MIMETYPES: set = {"image/jpeg", "image/png"}

# Supported Scans
SUPPORTED_SCAN_TYPES: List[str] = ["MRI"]
DISABLED_SCAN_TYPES: List[str] = ["CT", "X-ray"]
SUPPORTED_ORIENTATIONS: List[str] = ["Axial", "Coronal", "Sagittal", "Not specified"]

# Paths
SAVED_MODELS_DIR = BACKEND_DIR / "saved_models"
SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_FILE_PATH = SAVED_MODELS_DIR / "axonova_brain_mri_best.keras"
LABELS_FILE_PATH = SAVED_MODELS_DIR / "class_labels.json"
METADATA_FILE_PATH = SAVED_MODELS_DIR / "model_metadata.json"

EVALUATION_DIR = BACKEND_DIR / "evaluation_results"
EVALUATION_DIR.mkdir(parents=True, exist_ok=True)
EVAL_METRICS_PATH = EVALUATION_DIR / "metrics.json"

DATASET_DIR = Path(os.getenv("AXONOVA_DATASET_DIR", str(WORKSPACE_DIR / "dataset")))

# CORS
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "AXONOVA_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,https://sjsarvesh8778466116-cmyk.github.io"
    ).split(",")
    if origin.strip()
]

# Educational Medical Disclaimer
DISCLAIMER_TEXT = (
    "This system is an academic research prototype. Model outputs are not medical diagnoses "
    "and must not be used for clinical decision-making. AXONOVA is for educational and research use only."
)

