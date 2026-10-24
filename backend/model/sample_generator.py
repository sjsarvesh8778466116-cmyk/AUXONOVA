"""
AXONOVA Educational Synthetic Dataset Generator
================================================
Generates a small, well-formed synthetic brain MRI dataset for demonstration,
local testing, and verifying the training/inference pipeline when an external
labeled dataset is not yet downloaded.

Classes:
  - Glioma
  - Meningioma
  - Pituitary
  - No_Tumor
"""

import argparse
import math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def create_synthetic_mri_slice(
    class_name: str,
    size: int = 224,
    index: int = 0,
    seed: int = 42,
) -> Image.Image:
    """Generates an educational synthetic brain phantom image."""
    rng = np.random.RandomState(seed + index * 13)
    
    # 1. Base dark background
    img = Image.new("L", (size, size), color=10)
    draw = ImageDraw.Draw(img)

    # 2. Outer skull / scalp ellipse
    skull_margin = 20 + rng.randint(-3, 4)
    skull_box = [skull_margin, skull_margin, size - skull_margin, size - skull_margin]
    draw.ellipse(skull_box, fill=50, outline=180, width=4)

    # 3. Brain parenchyma / cerebral cortex ellipse
    brain_margin = skull_margin + 12
    brain_box = [brain_margin, brain_margin, size - brain_margin, size - brain_margin]
    draw.ellipse(brain_box, fill=110, outline=80, width=2)

    # 4. Ventricles (bilateral CSF spaces, darker)
    cx, cy = size // 2, size // 2
    draw.ellipse([cx - 24, cy - 30, cx - 8, cy + 20], fill=30)
    draw.ellipse([cx + 8, cy - 30, cx + 24, cy + 20], fill=30)
    # Interhemispheric fissure (central line)
    draw.line([cx, brain_margin + 5, cx, size - brain_margin - 5], fill=40, width=2)

    # 5. Class-specific synthetic visual pattern (for classifier training demonstration)
    if class_name == "Glioma":
        # Irregular hyperintense cortical/subcortical mass with surrounding edema
        gx = cx + rng.randint(25, 45)
        gy = cy + rng.randint(-30, 20)
        r = rng.randint(18, 26)
        draw.ellipse([gx - r - 6, gy - r - 6, gx + r + 6, gy + r + 6], fill=140)
        draw.ellipse([gx - r, gy - r, gx + r, gy + r], fill=210)
    elif class_name == "Meningioma":
        # Dural-based well-circumscribed hyperintense mass
        mx = brain_margin + 14
        my = cy + rng.randint(-20, 20)
        r = rng.randint(14, 20)
        draw.ellipse([mx - r, my - r, mx + r, my + r], fill=230)
    elif class_name == "Pituitary":
        # Sellar / suprasellar central hyperintense mass
        px = cx + rng.randint(-4, 5)
        py = cy + 40 + rng.randint(-5, 5)
        r = rng.randint(12, 16)
        draw.ellipse([px - r, py - r, px + r, py + r], fill=225)
    elif class_name == "No_Tumor":
        # Normal symmetric brain anatomy without mass effect
        pass

    # 6. Apply realistic Gaussian blur for anatomical tissue transitions
    blurred = img.filter(ImageFilter.GaussianBlur(radius=1.8))

    # 7. Add mild MRI Rician/Gaussian noise texture
    arr = np.array(blurred, dtype=np.float32)
    noise = rng.normal(loc=0.0, scale=4.5, size=(size, size))
    noisy_arr = np.clip(arr + noise, 0, 255).astype(np.uint8)

    # Convert to 3-channel RGB image
    final_img = Image.fromarray(noisy_arr).convert("RGB")
    return final_img


def generate_synthetic_dataset(
    output_dir: Path,
    images_per_class_train: int = 30,
    images_per_class_val: int = 10,
    images_per_class_test: int = 10,
) -> None:
    """Generates train, val, and test splits with synthetic MRI images."""
    classes = ["Glioma", "Meningioma", "Pituitary", "No_Tumor"]
    splits = {
        "train": images_per_class_train,
        "val": images_per_class_val,
        "test": images_per_class_test,
    }

    print(f"Generating educational synthetic dataset in: {output_dir}")
    total_count = 0
    for split_name, count in splits.items():
        for class_name in classes:
            folder = output_dir / split_name / class_name
            folder.mkdir(parents=True, exist_ok=True)
            for i in range(count):
                seed_offset = 1000 if split_name == "val" else (2000 if split_name == "test" else 0)
                img = create_synthetic_mri_slice(class_name, size=224, index=i, seed=42 + seed_offset)
                filename = f"{class_name.lower()}_synth_{split_name}_{i:03d}.jpg"
                img.save(folder / filename, quality=95)
                total_count += 1

    print(f"Dataset generated successfully! Total images: {total_count} across {len(classes)} classes.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic MRI dataset for AXONOVA.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent.parent / "dataset",
        help="Destination directory for dataset",
    )
    args = parser.parse_args()
    generate_synthetic_dataset(args.output_dir)
