# AXONOVA Brain MRI Dataset Directory

This directory holds the labeled brain MRI image dataset used to train and evaluate the AXONOVA CNN classifier.

## Supported File Formats
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
*Note: DICOM (`.dcm`) is not supported in this version. Scans must be converted to standard image formats.*

## Expected Directory Structure

You can organize images either with explicit `train`, `val`, and `test` splits, or as flat category folders:

### Option A: Explicit Train / Validation / Test Splits (Recommended)
```text
dataset/
├── train/
│   ├── Glioma/
│   ├── Meningioma/
│   ├── Pituitary/
│   └── No_Tumor/
├── val/
│   ├── Glioma/
│   ├── Meningioma/
│   ├── Pituitary/
│   └── No_Tumor/
└── test/
    ├── Glioma/
    ├── Meningioma/
    ├── Pituitary/
    └── No_Tumor/
```

### Option B: Flat Class Directories
```text
dataset/
├── Glioma/
├── Meningioma/
├── Pituitary/
└── No_Tumor/
```
*(If flat directories are provided, the training pipeline automatically creates an 80/20 train/validation split).*

## Generating Educational Synthetic Data for Immediate Testing
If you do not have an external dataset downloaded yet, you can generate a synthetic brain phantom dataset instantly:
```bash
python -m model.sample_generator
```

## Dataset Licensing & Privacy Notice
- Never upload identifying patient health information (PHI).
- Adhere to the license terms of the dataset provider (e.g., Kaggle, Figshare, The Cancer Imaging Archive).
- AXONOVA processes all images locally without sending data to external cloud services.
