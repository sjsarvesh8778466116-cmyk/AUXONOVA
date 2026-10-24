import io
import logging
from typing import Tuple
import numpy as np
from PIL import Image

from preprocessing.normalization import normalize_min_max

logger = logging.getLogger("axonova.preprocessing.image_processing")

def preprocess_for_tumor_model(
    file_bytes: bytes,
    target_size: Tuple[int, int] = (224, 224),
) -> np.ndarray:
    """
    Model-specific preprocessing for AXONOVA Brain Tumor Classifier:
    - Loads image
    - Converts to 3-channel RGB (to handle grayscale single-slice or RGBA)
    - Resizes to (224, 224) using bilinear interpolation
    - Scales pixel values to [0.0, 1.0] (matching the training pipeline)
    - Adds batch dimension, yielding shape (1, 224, 224, 3)
    """
    pil_img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    resized_img = pil_img.resize(target_size, Image.Resampling.BILINEAR)
    img_array = np.array(resized_img, dtype=np.float32) / 255.0
    batch = np.expand_dims(img_array, axis=0)
    return batch


def preprocess_for_stroke_model(
    file_bytes: bytes,
    target_size: Tuple[int, int] = (256, 256),
) -> np.ndarray:
    """
    Model-specific preprocessing for Stroke DWI/ADC protocols:
    - Grayscale conversion
    - 256x256 resizing
    - Intensity min-max normalization
    - Shape (1, 256, 256, 1)
    """
    pil_img = Image.open(io.BytesIO(file_bytes)).convert("L")
    resized_img = pil_img.resize(target_size, Image.Resampling.BILINEAR)
    arr = np.array(resized_img, dtype=np.float32)
    norm = normalize_min_max(arr)
    batch = np.expand_dims(np.expand_dims(norm, axis=-1), axis=0)
    return batch


def preprocess_for_lesion_model(
    file_bytes: bytes,
    target_size: Tuple[int, int] = (224, 224),
) -> np.ndarray:
    """
    Model-specific preprocessing for Multiple Sclerosis FLAIR lesion assessment:
    - FLAIR high-intensity contrast preservation
    - (1, 224, 224, 3)
    """
    pil_img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    resized_img = pil_img.resize(target_size, Image.Resampling.BILINEAR)
    arr = np.array(resized_img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def preprocess_for_structural_model(
    file_bytes: bytes,
    target_size: Tuple[int, int] = (256, 256),
) -> np.ndarray:
    """
    Model-specific preprocessing for T1-3D Structural Ventricular Atrophy:
    - (1, 256, 256, 1)
    """
    pil_img = Image.open(io.BytesIO(file_bytes)).convert("L")
    resized_img = pil_img.resize(target_size, Image.Resampling.BILINEAR)
    arr = np.array(resized_img, dtype=np.float32)
    norm = normalize_min_max(arr)
    return np.expand_dims(np.expand_dims(norm, axis=-1), axis=0)
