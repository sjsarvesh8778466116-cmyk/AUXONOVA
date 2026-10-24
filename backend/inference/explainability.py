import base64
import io
import logging
from typing import Any, Dict, Optional, Tuple
import matplotlib
matplotlib.use("Agg")
import matplotlib.cm as cm
import numpy as np
from PIL import Image
import tensorflow as tf

logger = logging.getLogger("axonova.inference.explainability")

_GRAD_MODEL_CACHE: Dict[Tuple[int, str], tf.keras.Model] = {}

def find_target_conv_layer(model: tf.keras.Model) -> Optional[str]:
    """Finds the name of the last Conv2D layer in the Keras model."""
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    return None


def get_or_build_grad_model(
    model: tf.keras.Model,
    conv_layer_name: str,
) -> Optional[tf.keras.Model]:
    """
    Constructs and caches a sub-model that outputs both the target conv activations
    and the final model predictions.
    """
    cache_key = (id(model), conv_layer_name)
    if cache_key in _GRAD_MODEL_CACHE:
        return _GRAD_MODEL_CACHE[cache_key]

    try:
        # Build functional sub-model
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
    except Exception as e:
        logger.error("Failed to construct Grad-CAM graph: %s", str(e))
        return None


def compute_gradcam_heatmap(
    model: tf.keras.Model,
    preprocessed_batch: np.ndarray,
    target_class_idx: Optional[int] = None,
    conv_layer_name: Optional[str] = None,
) -> Optional[np.ndarray]:
    """
    Computes a genuine 2D Grad-CAM heatmap normalized to [0, 1].
    """
    try:
        if conv_layer_name is None:
            conv_layer_name = find_target_conv_layer(model)
        if not conv_layer_name:
            return None

        grad_model = get_or_build_grad_model(model, conv_layer_name)
        if grad_model is None:
            return None

        input_tensor = tf.cast(preprocessed_batch, tf.float32)

        with tf.GradientTape() as tape:
            tape.watch(input_tensor)
            conv_outputs, predictions = grad_model(input_tensor, training=False)
            if target_class_idx is None:
                target_class_idx = int(tf.argmax(predictions[0]))
            loss = predictions[:, target_class_idx]

        # Gradients of target class score with respect to feature map activations
        grads = tape.gradient(loss, conv_outputs)
        if grads is None:
            return None

        # Global average pooling of gradients gives channel importance weights
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # Weight feature map activations
        conv_outputs_val = conv_outputs[0]
        heatmap = conv_outputs_val @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # Apply ReLU to retain only features with positive influence
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()
    except Exception as e:
        logger.error("Grad-CAM computation failed: %s", str(e), exc_info=True)
        return None


def generate_explainability_bundle(
    model: Optional[tf.keras.Model],
    preprocessed_batch: np.ndarray,
    original_file_bytes: bytes,
    target_class_name: str,
    target_class_idx: int,
    supports_explainability: bool = True,
) -> Dict[str, Any]:
    """
    Generates explainability package including overlay base64 and mandatory clinical notice.
    If explainability is unavailable or unsupported, honestly returns unsupported=False with zero fabrication.
    """
    explanation_notice = (
        "The visualization indicates image regions that contributed to the model's prediction. "
        "It is not proof of disease location."
    )

    if not supports_explainability or model is None:
        return {
            "supported": False,
            "method": None,
            "heatmap_base64": None,
            "overlay_base64": None,
            "target_class": target_class_name,
            "explanation": "Explainability visualization is not available for this model.",
        }

    heatmap = compute_gradcam_heatmap(
        model=model,
        preprocessed_batch=preprocessed_batch,
        target_class_idx=target_class_idx,
    )

    if heatmap is None:
        return {
            "supported": False,
            "method": "Grad-CAM",
            "heatmap_base64": None,
            "overlay_base64": None,
            "target_class": target_class_name,
            "explanation": "Explainability visualization could not be generated for this scan.",
        }

    try:
        # Load original image
        pil_orig = Image.open(io.BytesIO(original_file_bytes)).convert("RGB")
        w, h = pil_orig.size

        # Resize heatmap to original image dimensions
        heatmap_pil = Image.fromarray(np.uint8(255 * heatmap))
        heatmap_resized = heatmap_pil.resize((w, h), Image.Resampling.BILINEAR)
        heatmap_arr = np.array(heatmap_resized, dtype=np.float32) / 255.0

        # Apply jet colormap
        try:
            cmap = matplotlib.colormaps["jet"]
        except Exception:
            cmap = cm.get_cmap("jet")
        colored_heatmap = cmap(heatmap_arr)[:, :, :3]  # drop alpha, shape (H, W, 3)

        # Raw heatmap base64
        heatmap_img = Image.fromarray(np.uint8(255 * colored_heatmap))
        buf_hm = io.BytesIO()
        heatmap_img.save(buf_hm, format="PNG")
        b64_hm = "data:image/png;base64," + base64.b64encode(buf_hm.getvalue()).decode("utf-8")

        # Alpha blend overlay (0.6 original + 0.4 heatmap)
        orig_arr = np.array(pil_orig, dtype=np.float32) / 255.0
        overlay_arr = 0.55 * orig_arr + 0.45 * colored_heatmap
        overlay_arr = np.clip(overlay_arr * 255.0, 0, 255).astype(np.uint8)

        overlay_img = Image.fromarray(overlay_arr)
        buf_ov = io.BytesIO()
        overlay_img.save(buf_ov, format="PNG")
        b64_ov = "data:image/png;base64," + base64.b64encode(buf_ov.getvalue()).decode("utf-8")

        return {
            "supported": True,
            "method": "Layer-Targeted Grad-CAM",
            "heatmap_base64": b64_hm,
            "overlay_base64": b64_ov,
            "gradcam_heatmap_base64": b64_hm,
            "gradcam_overlay_base64": b64_ov,
            "target_class": target_class_name,
            "explanation": explanation_notice,
        }
    except Exception as e:
        logger.error("Failed to generate explainability overlay images: %s", str(e), exc_info=True)
        return {
            "supported": False,
            "method": "Grad-CAM",
            "heatmap_base64": None,
            "overlay_base64": None,
            "target_class": target_class_name,
            "explanation": "Explainability visualization is not available for this model.",
        }
