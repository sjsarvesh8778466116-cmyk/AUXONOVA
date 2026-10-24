"""
AXONOVA Model Evaluation Pipeline
=================================
Evaluates a trained CNN model on held-out test data and computes:
- Overall Accuracy
- Per-class Precision, Recall, and F1-score
- Confusion Matrix
- Metric interpretations and safety disclaimers
"""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import tensorflow as tf
from PIL import Image

from model.preprocessing import load_and_preprocess_image

def evaluate_model_on_dataset(
    model_path: Path,
    labels_path: Path,
    test_dir: Path,
    output_dir: Path,
) -> dict:
    """
    Evaluates the trained model on test directory images and saves metrics.
    """
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found at {model_path}")
    if not labels_path.exists():
        raise FileNotFoundError(f"Class labels file not found at {labels_path}")
    if not test_dir.exists():
        raise FileNotFoundError(f"Test dataset directory not found at {test_dir}")

    # Load labels
    with open(labels_path, "r", encoding="utf-8") as f:
        class_labels = json.load(f)

    print(f"Loading model from: {model_path}")
    model = tf.keras.models.load_model(str(model_path))

    X_test_list = []
    y_true = []
    image_paths = []

    print(f"Scanning test images in: {test_dir}")
    for class_idx, class_name in enumerate(class_labels):
        class_folder = test_dir / class_name
        if not class_folder.exists():
            print(f"Warning: class folder {class_name} not found in test dir.")
            continue

        valid_exts = {".jpg", ".jpeg", ".png"}
        files = [p for p in class_folder.iterdir() if p.suffix.lower() in valid_exts]
        for file_path in files:
            try:
                img_batch = load_and_preprocess_image(str(file_path))
                X_test_list.append(img_batch[0])
                y_true.append(class_idx)
                image_paths.append(str(file_path))
            except Exception as e:
                print(f"Skipping unreadable test image {file_path}: {e}")

    total_evaluated = len(y_true)
    if total_evaluated == 0:
        raise ValueError("No valid test images found for evaluation.")

    X_test = np.array(X_test_list, dtype=np.float32)
    print(f"Running batched model inference on {total_evaluated} test scans...")
    preds = model.predict(X_test, batch_size=32, verbose=0)
    y_pred = [int(np.argmax(p)) for p in preds]

    print(f"Successfully evaluated {total_evaluated} test images.")

    # Calculate metrics using scikit-learn
    report_dict = classification_report(
        y_true,
        y_pred,
        target_names=class_labels,
        output_dict=True,
        zero_division=0,
    )
    cm = confusion_matrix(y_true, y_pred, labels=list(range(len(class_labels))))

    # Formulate per-class metrics
    per_class_metrics = {}
    for class_name in class_labels:
        if class_name in report_dict:
            per_class_metrics[class_name] = {
                "precision": round(float(report_dict[class_name]["precision"]), 4),
                "recall": round(float(report_dict[class_name]["recall"]), 4),
                "f1_score": round(float(report_dict[class_name]["f1-score"]), 4),
                "support": int(report_dict[class_name]["support"]),
            }

    overall_accuracy = round(float(report_dict.get("accuracy", 0.0)), 4)

    # Format confusion matrix for JSON
    cm_data = {
        "matrix": cm.tolist(),
        "classes": class_labels,
    }

    # Plot confusion matrix and save figure
    output_dir.mkdir(parents=True, exist_ok=True)
    cm_plot_path = output_dir / "confusion_matrix.png"
    plt.figure(figsize=(7, 6))
    plt.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    plt.title("Confusion Matrix (Held-out Test Set)")
    plt.colorbar()
    tick_marks = np.arange(len(class_labels))
    plt.xticks(tick_marks, class_labels, rotation=45, ha="right")
    plt.yticks(tick_marks, class_labels)

    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            plt.text(
                j, i, format(cm[i, j], "d"),
                ha="center", va="center",
                color="white" if cm[i, j] > thresh else "black",
            )

    plt.ylabel("True Dataset Category")
    plt.xlabel("Predicted Category")
    plt.tight_layout()
    plt.savefig(cm_plot_path, dpi=150)
    plt.close()

    # Metric interpretations for students
    metric_interpretations = {
        "accuracy": "Proportion of total test images correctly matched to their dataset label.",
        "precision": "Out of all images the model labeled as class X, the fraction that were actually class X.",
        "recall": "Out of all actual images of class X, the fraction that the model correctly identified.",
        "f1_score": "Harmonic mean of precision and recall, balancing false positives and false negatives.",
        "clinical_note": "High benchmark accuracy on an image dataset does not establish clinical reliability or diagnostic safety.",
    }

    metrics_payload = {
        "evaluated": True,
        "model_name": model_path.stem,
        "model_version": "1.0.0",
        "evaluated_at": datetime.now(timezone.utc).isoformat(),
        "dataset_split": "Held-out Test Split",
        "test_images_count": total_evaluated,
        "overall_accuracy": overall_accuracy,
        "per_class_metrics": per_class_metrics,
        "confusion_matrix": cm_data,
        "metric_interpretations": metric_interpretations,
        "disclaimer": (
            "AXONOVA is an educational image-classification prototype. Its output is not a medical "
            "diagnosis and must not be used to make healthcare decisions."
        ),
    }

    # Save metrics JSON
    metrics_json_path = output_dir / "metrics.json"
    with open(metrics_json_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"Evaluation complete! Overall accuracy: {overall_accuracy * 100:.2f}%")
    print(f"Metrics saved to: {metrics_json_path}")
    print(f"Confusion matrix plot saved to: {cm_plot_path}")

    return metrics_payload

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate AXONOVA CNN classifier on held-out test data.")
    base_dir = Path(__file__).resolve().parent.parent
    parser.add_argument("--model-path", type=Path, default=base_dir / "saved_models" / "axonova_brain_mri_best.keras")
    parser.add_argument("--labels-path", type=Path, default=base_dir / "saved_models" / "class_labels.json")
    parser.add_argument("--test-dir", type=Path, default=base_dir.parent / "dataset" / "test")
    parser.add_argument("--output-dir", type=Path, default=base_dir / "evaluation_results")
    args = parser.parse_args()

    evaluate_model_on_dataset(args.model_path, args.labels_path, args.test_dir, args.output_dir)
