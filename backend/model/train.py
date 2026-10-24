"""
AXONOVA CNN Training Pipeline
=============================
Trains the Convolutional Neural Network on labeled brain MRI image folders.

Workflow:
1. Validates dataset folder layout and class distribution.
2. Loads and preprocesses images into normalized batches.
3. Builds the AXONOVA CNN architecture.
4. Trains with Adam optimizer and Sparse Categorical Crossentropy.
5. Employs EarlyStopping and ModelCheckpoint callbacks.
6. Saves best model weights, exact class-name labels, and metadata.
7. Plots and exports training vs validation accuracy and loss curves.
"""

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

from model.architecture import build_axonova_cnn
from model.preprocessing import load_and_preprocess_image

def inspect_dataset(dataset_dir: Path) -> dict:
    """
    Validates dataset directory structure, class folders, and image counts.
    """
    if not dataset_dir.exists():
        raise FileNotFoundError(f"Dataset root directory does not exist: {dataset_dir}")

    # Check if split directories exist (train, val, test) or direct class folders
    subdirs = [p for p in dataset_dir.iterdir() if p.is_dir()]
    subdir_names = {p.name.lower() for p in subdirs}

    has_splits = "train" in subdir_names

    if has_splits:
        train_path = dataset_dir / "train"
        val_path = dataset_dir / "val" if "val" in subdir_names else None
        test_path = dataset_dir / "test" if "test" in subdir_names else None
        class_folders = [p for p in train_path.iterdir() if p.is_dir()]
    else:
        train_path = dataset_dir
        val_path = None
        test_path = None
        class_folders = subdirs

    if not class_folders:
        raise ValueError(f"No class folders found in {train_path}. Expected subdirectories per category.")

    # Sort class names deterministically to guarantee consistent class ordering
    class_names = sorted([f.name for f in class_folders])

    valid_exts = {".jpg", ".jpeg", ".png"}
    distribution = {}
    for c_name in class_names:
        c_dir = train_path / c_name
        files = [p for p in c_dir.iterdir() if p.suffix.lower() in valid_exts]
        distribution[c_name] = len(files)
        if len(files) == 0:
            raise ValueError(f"Class folder '{c_name}' contains 0 supported images (.jpg, .jpeg, .png).")

    return {
        "has_splits": has_splits,
        "train_path": train_path,
        "val_path": val_path,
        "test_path": test_path,
        "class_names": class_names,
        "distribution": distribution,
    }


def load_dataset_arrays(
    split_dir: Path,
    class_names: list,
    img_size=(224, 224),
) -> tuple:
    """
    Loads and preprocesses all images from split_dir into numpy arrays (X, y).
    """
    X_list = []
    y_list = []
    valid_exts = {".jpg", ".jpeg", ".png"}

    for class_idx, class_name in enumerate(class_names):
        c_folder = split_dir / class_name
        if not c_folder.exists():
            continue
        for file_path in c_folder.iterdir():
            if file_path.suffix.lower() in valid_exts:
                try:
                    img_batch = load_and_preprocess_image(str(file_path), target_size=img_size)
                    # Squeeze batch dimension to get (height, width, 3)
                    X_list.append(img_batch[0])
                    y_list.append(class_idx)
                except Exception as e:
                    print(f"Skipping corrupted image {file_path}: {e}")

    X = np.array(X_list, dtype=np.float32)
    y = np.array(y_list, dtype=np.int32)
    return X, y


def train_axonova(
    dataset_dir: Path,
    output_model_dir: Path,
    eval_results_dir: Path,
    epochs: int = 15,
    batch_size: int = 32,
    learning_rate: float = 0.001,
) -> None:
    """Executes the complete training workflow."""
    print("=" * 60)
    print("AXONOVA CNN Model Training")
    print("=" * 60)

    # 1. Dataset inspection
    info = inspect_dataset(dataset_dir)
    class_names = info["class_names"]
    print(f"Detected {len(class_names)} classes: {class_names}")
    for c_name, count in info["distribution"].items():
        print(f"  - {c_name}: {count} training images")

    output_model_dir.mkdir(parents=True, exist_ok=True)
    eval_results_dir.mkdir(parents=True, exist_ok=True)

    # 2. Load training data
    print("\nLoading and preprocessing training set...")
    X_train, y_train = load_dataset_arrays(info["train_path"], class_names)
    print(f"Loaded {len(X_train)} training images of shape {X_train.shape[1:]}")

    # 3. Validation data handling
    if info["val_path"] and info["val_path"].exists():
        print("Loading explicit validation set from val directory...")
        X_val, y_val = load_dataset_arrays(info["val_path"], class_names)
    else:
        print("Creating deterministic 80/20 train/validation split...")
        indices = np.arange(len(X_train))
        rng = np.random.RandomState(42)
        rng.shuffle(indices)
        split_idx = int(0.8 * len(X_train))
        train_idx, val_idx = indices[:split_idx], indices[split_idx:]
        X_val, y_val = X_train[val_idx], y_train[val_idx]
        X_train, y_train = X_train[train_idx], y_train[train_idx]

    # Explicitly shuffle training samples so batches contain balanced class distributions
    shuff_idx = np.arange(len(X_train))
    np.random.RandomState(42).shuffle(shuff_idx)
    X_train, y_train = X_train[shuff_idx], y_train[shuff_idx]

    print(f"Final training set size: {len(X_train)} | Validation set size: {len(X_val)}")

    # 4. Save class names JSON early to ensure synchronization
    labels_file = output_model_dir / "class_labels.json"
    with open(labels_file, "w", encoding="utf-8") as f:
        json.dump(class_names, f, indent=2)
    print(f"Saved class labels order to: {labels_file}")

    # 5. Build CNN Model
    model = build_axonova_cnn(
        input_shape=(224, 224, 3),
        num_classes=len(class_names),
        learning_rate=learning_rate,
        dropout_rate=0.4,
    )
    model.summary()

    # 6. Callbacks
    best_model_path = output_model_dir / "axonova_brain_mri_best.keras"
    callbacks = [
        EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),
        ModelCheckpoint(
            filepath=str(best_model_path),
            monitor="val_loss",
            save_best_only=True,
            verbose=1,
        ),
    ]

    # 7. Training Execution
    print(f"\nTraining for up to {epochs} epochs with batch size {batch_size}...")
    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        verbose=1,
    )

    # 8. Save Model Metadata
    total_params = int(model.count_params())
    trainable_params = int(np.sum([np.prod(v.shape) for v in model.trainable_weights]))
    metadata = {
        "model_name": "AXONOVA_Brain_MRI_Classifier",
        "version": "1.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "input_shape": [224, 224, 3],
        "supported_classes": class_names,
        "supported_scan_type": "MRI",
        "total_parameters": total_params,
        "trainable_parameters": trainable_params,
        "epochs_trained": len(history.history["loss"]),
        "batch_size": batch_size,
        "learning_rate": learning_rate,
        "final_train_loss": round(float(history.history["loss"][-1]), 4),
        "final_train_accuracy": round(float(history.history["accuracy"][-1]), 4),
        "final_val_loss": round(float(history.history["val_loss"][-1]), 4),
        "final_val_accuracy": round(float(history.history["val_accuracy"][-1]), 4),
    }

    metadata_path = output_model_dir / "model_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved model metadata to: {metadata_path}")

    # 9. Plot and Save Learning Curves
    curve_plot_path = eval_results_dir / "loss_accuracy_curve.png"
    plt.figure(figsize=(12, 5))

    # Accuracy Plot
    plt.subplot(1, 2, 1)
    plt.plot(history.history["accuracy"], label="Training Accuracy", color="#0d9488", lw=2)
    plt.plot(history.history["val_accuracy"], label="Validation Accuracy", color="#3b82f6", lw=2, linestyle="--")
    plt.title("Model Accuracy per Epoch", fontsize=12, fontweight="bold")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.grid(True, alpha=0.3)
    plt.legend()

    # Loss Plot
    plt.subplot(1, 2, 2)
    plt.plot(history.history["loss"], label="Training Loss", color="#0d9488", lw=2)
    plt.plot(history.history["val_loss"], label="Validation Loss", color="#ef4444", lw=2, linestyle="--")
    plt.title("Model Loss per Epoch", fontsize=12, fontweight="bold")
    plt.xlabel("Epoch")
    plt.ylabel("Loss (Sparse Categorical Cross-Entropy)")
    plt.grid(True, alpha=0.3)
    plt.legend()

    plt.tight_layout()
    plt.savefig(curve_plot_path, dpi=150)
    plt.close()
    print(f"Training curves saved to: {curve_plot_path}")

    print("\nTraining completed successfully!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train AXONOVA Brain MRI CNN Classifier.")
    base_dir = Path(__file__).resolve().parent.parent
    parser.add_argument("--dataset-dir", type=Path, default=base_dir.parent / "dataset")
    parser.add_argument("--output-model-dir", type=Path, default=base_dir / "saved_models")
    parser.add_argument("--eval-results-dir", type=Path, default=base_dir / "evaluation_results")
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=0.001)
    args = parser.parse_args()

    train_axonova(
        dataset_dir=args.dataset_dir,
        output_model_dir=args.output_model_dir,
        eval_results_dir=args.eval_results_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr,
    )
