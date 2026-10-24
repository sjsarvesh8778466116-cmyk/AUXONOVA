import io
import numpy as np
import pytest
from PIL import Image

from model.preprocessing import load_and_preprocess_image

def test_preprocessing_rgb():
    # Create sample RGB image in memory
    img = Image.new("RGB", (300, 400), color=(128, 64, 200))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)

    processed = load_and_preprocess_image(buffer.getvalue(), target_size=(224, 224))
    assert isinstance(processed, np.ndarray)
    assert processed.shape == (1, 224, 224, 3)
    assert processed.dtype == np.float32
    assert processed.min() >= 0.0
    assert processed.max() <= 1.0

def test_preprocessing_grayscale():
    # Test grayscale to RGB conversion
    img = Image.new("L", (180, 180), color=150)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    processed = load_and_preprocess_image(buffer.getvalue(), target_size=(224, 224))
    assert processed.shape == (1, 224, 224, 3)

def test_preprocessing_corrupted_data():
    # Corrupt byte stream
    corrupted = b"NOT_A_REAL_IMAGE_DATA_STREAM_12345"
    with pytest.raises(ValueError, match="Failed to preprocess image"):
        load_and_preprocess_image(corrupted)
