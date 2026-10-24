import base64
import io
from typing import Dict, Optional, Tuple
import numpy as np
import tensorflow as tf
from PIL import Image
import matplotlib
import matplotlib.cm as cm

# Cache for constructed Grad-CAM models to prevent rebuilding Keras graphs per request
_GRAD_MODEL_CACHE: Dict[Tuple[int, str], tf.keras.Model] = {}

def find_target_conv_layer(model: tf.keras.Model) -> Optional[str]:
    """Finds the last Conv2D layer in the model for Grad-CAM."""
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    return None

def get_or_build_grad_model(
    model: tf.keras.Model,
    conv_layer_name: str,
) -> Optional[tf.keras.Model]:
    """
    Returns a cached Grad-CAM sub-model or builds one once.
    Re-routes the functional graph to extract the target conv layer activation.
    """
    cache_key = (id(model), conv_layer_name)
    if cache_key in _GRAD_MODEL_CACHE:
        return _GRAD_MODEL_CACHE[cache_key]

    try:
        img_input = tf.keras.Input(shape=(224, 224, 3))
        x = img_input
        target_out = None
        for layer in model.layers:
            x = layer(x)
            if layer.name == conv_layer_name:
                target_out = x

        if target_out is None:
            return None

        grad_model = tf.keras.Model(inputs=img_input, outputs=[target_out, x])
        _GRAD_MODEL_CACHE[cache_key] = grad_model
        return grad_model
    except Exception:
        return None

def generate_gradcam_heatmap(
    model: tf.keras.Model,
    preprocessed_img: np.ndarray,
    target_class_idx: Optional[int] = None,
    conv_layer_name: Optional[str] = None,
) -> Optional[np.ndarray]:
    """
    Computes Grad-CAM heatmap for a single image and model efficiently using cached grad_model.
    """
    try:
        if conv_layer_name is None:
            conv_layer_name = find_target_conv_layer(model)
        
        if not conv_layer_name:
            return None

        grad_model = get_or_build_grad_model(model, conv_layer_name)
        if grad_model is None:
            return None

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(preprocessed_img, training=False)
            if target_class_idx is None:
                target_class_idx = int(tf.argmax(predictions[0]))
            loss = predictions[:, target_class_idx]

        grads = tape.gradient(loss, conv_outputs)
        if grads is None:
            return None

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # ReLU & normalization
        heatmap = tf.maximum(heatmap, 0.0) / (tf.math.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()

    except Exception:
        return None

def overlay_gradcam_base64(
    original_img_source: io.BytesIO,
    heatmap: np.ndarray,
    alpha: float = 0.45,
    colormap: str = "jet",
    max_dimension: int = 768,
) -> Optional[str]:
    """
    Overlays a Grad-CAM heatmap onto the original image and returns a base64 data URI.
    Optimized for high-resolution images by capping preview dimensions and using fast PNG compression.
    """
    try:
        original_img_source.seek(0)
        img = Image.open(original_img_source).convert("RGB")
        
        # Optimize performance: limit maximum dimension for web display
        if max(img.size) > max_dimension:
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.BILINEAR)

        img_w, img_h = img.size

        # Rescale heatmap to match image dimensions
        heatmap_resized = Image.fromarray(np.uint8(255 * heatmap)).resize(
            (img_w, img_h), Image.Resampling.BILINEAR
        )
        heatmap_arr = np.array(heatmap_resized) / 255.0

        # Apply colormap
        try:
            cmap = matplotlib.colormaps[colormap]
        except Exception:
            cmap = cm.get_cmap(colormap)

        colored_heatmap = cmap(heatmap_arr)[:, :, :3]  # Discard alpha
        colored_heatmap = np.uint8(255 * colored_heatmap)
        heatmap_img = Image.fromarray(colored_heatmap)

        # Blend original with colored heatmap
        blended = Image.blend(img, heatmap_img, alpha=alpha)

        # Fast PNG compression for instant network delivery
        buffer = io.BytesIO()
        blended.save(buffer, format="PNG", compress_level=3)
        buffer.seek(0)
        b64_str = base64.b64encode(buffer.read()).decode("utf-8")
        return f"data:image/png;base64,{b64_str}"

    except Exception:
        return None
