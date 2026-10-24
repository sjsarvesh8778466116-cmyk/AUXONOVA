"""
AXONOVA CNN Architecture
========================
This module defines the Convolutional Neural Network used for classifying
brain MRI images into dataset categories.

Layer Explanation for Students & Researchers:
1. InputLayer:
   Receives normalized 3-channel (RGB) images of shape (224, 224, 3).
2. Conv2D Layers:
   Applies spatial learnable convolution filters that detect low-level features
   (edges, contours, intensity gradients) in early layers and high-level
   visual patterns (tissue texture, regional structures) in deeper layers.
3. BatchNormalization:
   Normalizes the activations of each layer, accelerating training and reducing
   sensitivity to weight initialization.
4. MaxPooling2D:
   Reduces spatial dimensions (height & width) by taking the maximum value in 2x2
   windows. Provides translation invariance and reduces computational load.
5. GlobalAveragePooling2D:
   Calculates the spatial average across feature maps, reducing parameters
   drastically compared to Flatten and reducing overfitting risk.
6. Dense & Dropout Layers:
   Combines learned visual representations into decision features. Dropout
   randomly deactivates neurons during training to prevent co-adaptation.
7. Output Dense Layer (Softmax):
   Outputs normalized confidence distribution summing to 1.0 across classes.
"""

from typing import Tuple
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers

def build_axonova_cnn(
    input_shape: Tuple[int, int, int] = (224, 224, 3),
    num_classes: int = 4,
    learning_rate: float = 0.001,
    dropout_rate: float = 0.3,
) -> models.Model:
    """
    Constructs and compiles the AXONOVA educational CNN classifier.
    Preserves spatial coordinate representations for focal brain lesion detection
    and Grad-CAM convolutional saliency mapping.
    
    Args:
        input_shape: 3D tuple (height, width, channels)
        num_classes: Integer number of target categories in the dataset
        learning_rate: Adam optimizer learning rate
        dropout_rate: Dropout probability in dense classifier
        
    Returns:
        Compiled tf.keras.Model
    """
    model = models.Sequential(name="AXONOVA_Brain_MRI_Classifier")

    # --- Block 1: Low-level spatial features (edges, contours, intensity gradients) ---
    model.add(layers.Input(shape=input_shape, name="input_layer"))
    model.add(layers.Conv2D(32, (3, 3), padding="same", activation="relu", name="conv1_1"))
    model.add(layers.MaxPooling2D(pool_size=(2, 2), name="pool1"))

    # --- Block 2: Intermediate structural patterns (tissue boundaries, ventricles) ---
    model.add(layers.Conv2D(64, (3, 3), padding="same", activation="relu", name="conv2_1"))
    model.add(layers.MaxPooling2D(pool_size=(2, 2), name="pool2"))

    # --- Block 3: High-level visual patterns & complex regional morphology ---
    model.add(layers.Conv2D(128, (3, 3), padding="same", activation="relu", name="conv3_1"))
    model.add(layers.MaxPooling2D(pool_size=(2, 2), name="pool3"))

    # --- Block 4: Regional lesion focus (named explicitly for Grad-CAM explainability) ---
    model.add(layers.Conv2D(128, (3, 3), padding="same", activation="relu", name="last_conv_layer"))
    model.add(layers.MaxPooling2D(pool_size=(2, 2), name="pool4"))
    model.add(layers.MaxPooling2D(pool_size=(2, 2), name="pool5"))

    # --- Spatial Coordinate Preservation ---
    model.add(layers.Flatten(name="flatten"))

    # --- Fully Connected Classifier Head ---
    model.add(layers.Dense(128, activation="relu", name="dense_features"))
    model.add(layers.Dropout(dropout_rate, name="dropout_regularization"))
    
    # --- Output Probability Distribution ---
    model.add(layers.Dense(num_classes, activation="softmax", name="output_probabilities"))

    optimizer = optimizers.Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model
