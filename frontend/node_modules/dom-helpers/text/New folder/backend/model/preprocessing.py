import io
from typing import Tuple, Union
import numpy as np
from PIL import Image

def load_and_preprocess_image(
    image_source: Union[str, bytes, io.BytesIO],
    target_size: Tuple[int, int] = (224, 224),
) -> np.ndarray:
    """
    Standard preprocessing function used by both training and inference pipelines.
    
    1. Loads image from file path, bytes, or BytesIO stream.
    2. Converts any format (Grayscale, RGBA, CMYK, etc.) to 3-channel RGB.
    3. Resizes to target_size (width, height) using bilinear interpolation.
    4. Normalizes pixel values from [0, 255] uint8 to [0.0, 1.0] float32.
    5. Returns a 4D batch array of shape (1, height, width, 3).
    
    Raises:
        ValueError: If image is corrupt, empty, or cannot be parsed.
    """
    try:
        if isinstance(image_source, (bytes, bytearray)):
            stream = io.BytesIO(image_source)
            img = Image.open(stream)
        elif isinstance(image_source, io.BytesIO):
            image_source.seek(0)
            img = Image.open(image_source)
        else:
            img = Image.open(image_source)

        # Verify image integrity
        img.verify()

        # Reopen after verify() because verify() clears some internal state
        if isinstance(image_source, (bytes, bytearray)):
            stream.seek(0)
            img = Image.open(stream)
        elif isinstance(image_source, io.BytesIO):
            image_source.seek(0)
            img = Image.open(image_source)
        else:
            img = Image.open(image_source)

        # Force conversion to RGB (3 channels: Red, Green, Blue)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Resize image using bilinear resampling
        img = img.resize(target_size, Image.Resampling.BILINEAR)

        # Convert to numpy array with float32 type
        img_array = np.asarray(img, dtype=np.float32)

        # Rescale pixel intensities to [0.0, 1.0]
        normalized_array = img_array / 255.0

        # Validate shape
        expected_shape = (target_size[1], target_size[0], 3)
        if normalized_array.shape != expected_shape:
            raise ValueError(
                f"Processed image shape {normalized_array.shape} does not match expected {expected_shape}."
            )

        # Expand batch dimension for model input: (1, height, width, channels)
        batch_array = np.expand_dims(normalized_array, axis=0)
        return batch_array

    except Exception as exc:
        raise ValueError(f"Failed to preprocess image: {str(exc)}") from exc


def get_image_dimensions(image_source: Union[str, bytes, io.BytesIO]) -> Tuple[int, int]:
    """Helper to inspect the raw dimensions (width, height) without altering."""
    try:
        if isinstance(image_source, (bytes, bytearray)):
            stream = io.BytesIO(image_source)
            img = Image.open(stream)
        elif isinstance(image_source, io.BytesIO):
            image_source.seek(0)
            img = Image.open(image_source)
        else:
            img = Image.open(image_source)
        return img.size
    except Exception as exc:
        raise ValueError(f"Cannot read image dimensions: {str(exc)}") from exc
