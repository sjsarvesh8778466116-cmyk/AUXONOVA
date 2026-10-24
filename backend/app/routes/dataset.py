from pathlib import Path
from fastapi import APIRouter
from app.config import (
    DATASET_DIR,
    DISCLAIMER_TEXT,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
)
from app.schemas import DatasetInfoResponse

router = APIRouter(prefix="/api", tags=["Dataset Information"])

@router.get("/dataset-info", response_model=DatasetInfoResponse)
async def get_dataset_info():
    """
    Scans and returns actual dataset layout, class distribution, and split counts.
    """
    valid_exts = {".jpg", ".jpeg", ".png"}
    
    if not DATASET_DIR.exists():
        return DatasetInfoResponse(
            available=False,
            dataset_name="Brain MRI Labeled Dataset",
            source="Not provided / Local Directory",
            license_terms="Research / Educational Use",
            folder_layout="dataset/ [train / val / test] / [class_name] / *.jpg",
            class_distribution={},
            split_counts={},
            total_images=0,
            input_resolution=f"{IMAGE_WIDTH}x{IMAGE_HEIGHT} px",
            color_mode="RGB (3 channels)",
            normalization="Rescaled to [0.0, 1.0]",
            disclaimer=DISCLAIMER_TEXT,
        )

    # Check for splits
    subdirs = [p for p in DATASET_DIR.iterdir() if p.is_dir()]
    subdir_names = {p.name.lower() for p in subdirs}
    has_splits = "train" in subdir_names

    class_distribution = {}
    split_counts = {}
    total_images = 0

    if has_splits:
        for split_name in ["train", "val", "test"]:
            split_dir = DATASET_DIR / split_name
            if split_dir.exists():
                count_in_split = 0
                for c_folder in split_dir.iterdir():
                    if c_folder.is_dir():
                        c_name = c_folder.name
                        files = [p for p in c_folder.iterdir() if p.suffix.lower() in valid_exts]
                        c_count = len(files)
                        count_in_split += c_count
                        class_distribution[c_name] = class_distribution.get(c_name, 0) + c_count
                split_counts[split_name] = count_in_split
                total_images += count_in_split
    else:
        for c_folder in subdirs:
            c_name = c_folder.name
            files = [p for p in c_folder.iterdir() if p.suffix.lower() in valid_exts]
            c_count = len(files)
            class_distribution[c_name] = c_count
            total_images += c_count
        split_counts["all"] = total_images

    return DatasetInfoResponse(
        available=total_images > 0,
        dataset_name="Brain MRI Multi-Class Dataset",
        source="Educational Brain MRI Dataset Archive",
        license_terms="Educational / Research Demonstration Only",
        folder_layout="dataset/{split}/{class_name}/*.jpg",
        class_distribution=class_distribution,
        split_counts=split_counts,
        total_images=total_images,
        input_resolution=f"{IMAGE_WIDTH}x{IMAGE_HEIGHT} px",
        color_mode="RGB (3 channels)",
        normalization="Rescaled to [0.0, 1.0]",
        disclaimer=DISCLAIMER_TEXT,
    )


@router.get("/sample-scans")
async def get_sample_scans():
    """
    Returns curated sample scans available in dataset/test for quick testing and demonstration.
    """
    samples = []
    test_dir = DATASET_DIR / "test"
    if test_dir.exists():
        classes = ["Glioma", "Meningioma", "No_Tumor", "Pituitary"]
        orientations = {
            "Glioma": "Axial",
            "Meningioma": "Axial",
            "No_Tumor": "Axial",
            "Pituitary": "Coronal",
        }
        titles = {
            "Glioma": "Glioma MRI Scan",
            "Meningioma": "Meningioma MRI Scan",
            "No_Tumor": "Normal Brain MRI (No Tumor)",
            "Pituitary": "Pituitary Region MRI Scan",
        }
        descriptions = {
            "Glioma": "Representative intra-axial glial tissue pattern (Axial)",
            "Meningioma": "Representative extra-axial dural attachment (Axial)",
            "No_Tumor": "Symmetrical baseline ventricular morphology (Axial)",
            "Pituitary": "Sellar / parasellar pituitary fossa view (Coronal)",
        }
        for cls in classes:
            c_dir = test_dir / cls
            if c_dir.exists():
                imgs = sorted([f.name for f in c_dir.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png"}])
                if imgs:
                    fname = imgs[0]
                    samples.append({
                        "id": f"sample-{cls.lower()}",
                        "category": cls,
                        "title": titles.get(cls, cls),
                        "description": descriptions.get(cls, ""),
                        "filename": fname,
                        "orientation": orientations.get(cls, "Axial"),
                        "scan_type": "MRI",
                        "static_url": f"/static/dataset/test/{cls}/{fname}",
                    })
    return {"samples": samples, "disclaimer": DISCLAIMER_TEXT}
