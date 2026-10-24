import numpy as np
from typing import Tuple

def normalize_min_max(arr: np.ndarray, target_range: Tuple[float, float] = (0.0, 1.0)) -> np.ndarray:
    """
    Linearly scales pixel values to the specified target range [min, max].
    """
    min_val = float(np.min(arr))
    max_val = float(np.max(arr))
    if max_val - min_val < 1e-7:
        return np.zeros_like(arr, dtype=np.float32)
    normalized = (arr - min_val) / (max_val - min_val)
    t_min, t_max = target_range
    return (normalized * (t_max - t_min) + t_min).astype(np.float32)


def normalize_z_score(arr: np.ndarray) -> np.ndarray:
    """
    Applies standard z-score normalization (zero mean, unit variance).
    """
    mean = float(np.mean(arr))
    std = float(np.std(arr))
    if std < 1e-7:
        return np.zeros_like(arr, dtype=np.float32)
    return ((arr - mean) / std).astype(np.float32)


def clip_intensity_percentiles(arr: np.ndarray, lower: float = 1.0, upper: float = 99.0) -> np.ndarray:
    """
    Clips extreme outliers (e.g., hyperintense RF coil artifacts or spikes)
    between lower and upper percentiles.
    """
    p_low = np.percentile(arr, lower)
    p_high = np.percentile(arr, upper)
    clipped = np.clip(arr, p_low, p_high)
    return clipped
