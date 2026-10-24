# AXONOVA: Deep Learning-Based Brain MRI Image Classification & Analysis Platform

> **ACADEMIC & RESEARCH DISCLAIMER:**
> **AXONOVA is strictly an educational demonstration and research prototype.** It is designed to illustrate convolutional neural network (CNN) architectures, visual feature extraction, and model interpretability (Grad-CAM) on brain MRI datasets. **It does NOT provide clinical or medical diagnoses, detection, or treatment recommendations.** Output scores represent statistical class similarities over training image distributions, not calibrated individual disease probabilities. Never use AXONOVA for patient care or medical decision-making.

---

## 🧠 Project Overview

**AXONOVA** is an end-to-end deep learning platform engineered to demonstrate a complete, production-grade medical imaging AI pipeline:
1. **Modular Multi-Condition MRI Architecture:** Extensible task framework isolating distinct clinical neuropathologies:
   - 🟢 **Brain Tumor MRI Classification:** Active, trained, and benchmark-evaluated 4-class CNN (`Glioma`, `Meningioma`, `Pituitary`, `No_Tumor`) with real-time Grad-CAM saliency.
   - 🟡 **Alzheimer’s Disease Structural Atrophy:** High-resolution T1-weighted MPRAGE volumetric analysis for hippocampal and cortical reduction with strict subject-level partitioning guides.
   - 🟡 **Stroke-Related MRI Assessment:** Diffusion-Weighted Imaging (DWI b=1000) and ADC map matching for acute ischemic infarct boundary localization.
   - 🟡 **Multiple Sclerosis Lesion Quantification:** Multi-sequence T2-FLAIR hyperintensity detection across periventricular, juxtacortical, and infratentorial regions.
   - 🟣 **Future Research Horizons:** Susceptibility-weighted imaging (SWI) for Traumatic Brain Injury (TBI) and neuromelanin-sensitive MRI for Parkinson’s Disease.
2. **Deep Learning Model:** Custom multi-stage Convolutional Neural Network (CNN) in TensorFlow/Keras with Conv2D, Batch Normalization, Spatial Pooling, Dropout regularization, and Softmax classification.
3. **Model Interpretability (Explainable AI):** Real-time Gradient-weighted Class Activation Mapping (Grad-CAM) with heatmap visual overlays, opacity controls, and receptive field inspectability.
4. **Backend REST API:** High-performance asynchronous FastAPI service with strict Pydantic schemas, file validation (dimensions, file formats, scan type checks), CORS handling, task routing, and health endpoints.
5. **Modern Frontend Web Workstation:** Medical workstation UI built with React 18, TypeScript, TailwindCSS, Lucide icons, and Recharts. Features dark-mode aesthetics, internationalization (English/Tamil), audit history log, and responsive design.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Deep Learning & CV** | TensorFlow 2.17 / Keras, NumPy, Pillow, Scikit-learn, Matplotlib |
| **Backend API** | FastAPI, Uvicorn, Pydantic v2, Python-Multipart, HTTPX |
| **Modular Tasks & Catalog Engine** | Central condition registry, clinical metadata, modality verification, and zero-simulation policy |
| **Medical Student Hub** | Interactive cases, step-by-step AI visual feature journey, progressive quiz bank, and concept hints |
| **Neuroimaging Reference** | Interactive brain anatomy atlas, multi-sequence MRI comparison tool (T1, T1+C, T2, FLAIR, DWI) |
| **Frontend Workstation** | React 18, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4, Recharts, Lucide-React, Voice Navigation |
| **Testing & CI** | Pytest (48 comprehensive tests), FastAPI TestClient, TypeScript Compiler (`tsc`) |

---

## 📂 Project Directory Structure

```plaintext
AXONOVA/
├── backend/
│   ├── api/                          # High-level REST API endpoints
│   │   ├── analysis.py               # Multimodal analysis & developer diagnostic routes
│   │   ├── reports.py                # Structured radiological report generation
│   │   └── upload.py                 # File ingestion & security validation
│   ├── app/                          # Core FastAPI application
│   │   ├── config.py                 # Configuration, paths, thresholds, disclaimers
│   │   ├── catalog_data.py           # Condition Catalog (Categories A-J) & Model Registry
│   │   ├── student_data.py           # Medical student educational cases, quizzes & hints
│   │   ├── main.py                   # FastAPI entrypoint, middleware, routes mount
│   │   ├── schemas.py                # Pydantic v2 validation models
│   │   ├── routes/
│   │   │   ├── auth.py               # Medical role auth, demo logins & OTP verification
│   │   │   ├── catalog.py            # Clinical condition catalog & scan routing
│   │   │   ├── dataset.py            # Dataset overview & exploration endpoints
│   │   │   ├── evaluation.py         # Test metrics & confusion matrix endpoints
│   │   │   ├── health.py             # Healthcheck & model loaded status
│   │   │   ├── model.py              # Architecture info & layer summary
│   │   │   ├── predict.py            # Image inference & Grad-CAM heatmap generation
│   │   │   ├── student.py            # Student learning hub, cases, quizzes & AI tutor
│   │   │   └── tasks.py              # Modular condition task endpoints (/api/tasks)
│   │   ├── tasks/                    # Modular neuropathology task implementations
│   │   │   ├── __init__.py           # Task exports
│   │   │   ├── base.py               # BaseMriTask abstract interface & Pydantic models
│   │   │   ├── registry.py           # Central task registry
│   │   │   ├── brain_tumor.py        # Active 4-class brain tumor classification task
│   │   │   ├── alzheimers.py         # Alzheimer's T1 atrophy task & setup guide
│   │   │   ├── stroke.py             # Stroke DWI/ADC assessment task & setup guide
│   │   │   ├── multiple_sclerosis.py # MS T2-FLAIR lesion task & setup guide
│   │   │   └── future_research.py    # TBI & Parkinson's future research roadmap
│   │   └── utils/
│   │       ├── gradcam.py            # Gradient-weighted Class Activation Mapping
│   │       ├── helpers.py            # Image sanitization & byte encoding utilities
│   │       └── validation.py         # Input validation & modality security checks
│   ├── evaluation_results/
│   │   ├── confusion_matrix.png      # Generated test confusion matrix
│   │   ├── loss_accuracy_curve.png   # Training vs validation convergence plots
│   │   └── metrics.json              # Evaluated test metrics & per-class stats
│   ├── model/
│   │   ├── architecture.py           # Custom CNN architecture definition
│   │   ├── evaluate.py               # Model evaluation script on test split
│   │   ├── preprocessing.py          # Normalization & image transformation pipeline
│   │   ├── sample_generator.py       # Brain MRI sample generation utility
│   │   └── train.py                  # Training pipeline with early stopping & checkpoints
│   ├── saved_models/
│   │   ├── axonova_brain_mri_best.keras # Trained model weights & topology
│   │   ├── class_labels.json         # Label-to-index mappings
│   │   └── model_metadata.json       # Hyperparameters, input shapes & accuracy stats
│   ├── tests/
│   │   ├── test_auth.py              # Authentication, OTP, demo roles & profile tests
│   │   ├── test_catalog.py           # Condition catalog, category filters & routing tests
│   │   ├── test_health.py            # API health & availability tests
│   │   ├── test_model_info.py        # Model architecture & metadata tests
│   │   ├── test_modular_tasks.py     # Task registry, prediction guards & isolation tests
│   │   ├── test_predict_validation.py# Input validation & image format security tests
│   │   ├── test_preprocessing.py     # Image normalization & tensor shape tests
│   │   ├── test_real_ai_architecture.py # Real AI upload, analysis & diagnostics tests
│   │   └── test_student_module.py    # Student cases, quizzes, hints & progress tests
│   ├── test_live_inference.py        # Live server pipeline verification script
│   └── requirements.txt              # Backend dependencies
├── dataset/
│   ├── train/                        # Training split (Glioma, Meningioma, No_Tumor, Pituitary)
│   ├── val/                          # Validation split
│   └── test/                         # Held-out test split
├── frontend/
│   ├── src/
│   │   ├── api/                      # Axios client & typed API requests
│   │   ├── components/               # UI components (Navbar, Sidebar, GradCAM, Banners, Voice)
│   │   ├── context/                  # History, Language, User, and Condition contexts
│   │   ├── pages/
│   │   │   ├── AboutPage.tsx         # Academic overview, citations & ethics protocol
│   │   │   ├── BrainAnatomyPage.tsx  # Interactive 3-plane anatomical atlas & reference
│   │   │   ├── ConditionCatalogPage.tsx # Categories A-J condition explorer & routing
│   │   │   ├── DatasetExplorerPage.tsx # Multi-task dataset browser & split inspection
│   │   │   ├── EvaluationPage.tsx    # Multi-task confusion matrix & performance metrics
│   │   │   ├── HomePage.tsx          # Platform landing page & features
│   │   │   ├── HowItWorksPage.tsx    # 8-module CNN guide, Grad-CAM & anti-leakage
│   │   │   ├── LoginPage.tsx         # Medical portal login (Student / Clinician / Demo)
│   │   │   ├── ModelCoveragePage.tsx # Live model coverage matrix & sequence support
│   │   │   ├── MriSequenceComparePage.tsx # T1, T2, FLAIR, DWI interactive sequence comparator
│   │   │   ├── ResultsPage.tsx       # Inference outputs, Grad-CAM & radiological report
│   │   │   ├── ScanCenterPage.tsx    # Multi-task MRI upload & analysis portal
│   │   │   ├── SettingsPage.tsx      # System config & preferences
│   │   │   ├── TaskSelectionPage.tsx # Condition selector & setup guide modals
│   │   │   ├── VivaPresentationPage.tsx # Academic defense & viva slide deck with live metrics
│   │   │   └── student/              # Medical student learning hub
│   │   │       ├── BrainTumorLearningPage.tsx # High-yield tumor neuropathology module
│   │   │       ├── CaseLibraryPage.tsx        # Held-out educational case browser
│   │   │       ├── CasePracticePage.tsx       # Interactive diagnosis & AI review practice
│   │   │       ├── LearnMriFeaturesPage.tsx   # Edges, textures, intensity & shapes
│   │   │       ├── QuizzesPage.tsx            # Progressive quiz challenges & scoring
│   │   │       ├── StudentDashboardPage.tsx   # Student home & learning path overview
│   │   │       ├── StudentProfilePage.tsx     # Student statistics & badges
│   │   │       └── VisualCnnJourneyPage.tsx   # Visual CNN layer-by-layer feature journey
│   │   ├── types/                    # TypeScript interfaces & types
│   │   ├── App.tsx                   # Main router & layout shell
│   │   └── index.css                 # Tailwind utilities & dark theme tokens
│   ├── dist/                         # Production build bundle
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── pytest.ini
├── run_axonova.bat                   # One-click Windows batch launcher
├── run_axonova.ps1                   # One-click PowerShell launcher
└── README.md
```

---

## ⚡ Quick Start & Run Commands

### 🚀 One-Click Launch (Recommended for Windows)

Simply double-click or run:
```powershell
.\run_axonova.bat
# or
.\run_axonova.ps1
```
This automatically starts both the FastAPI backend on port 8000 and the Vite frontend on port 5173, then opens your default browser directly to the AXONOVA workstation.

### Manual Backend Setup & Startup

From the project root:
```powershell
# Set Python path to backend
$env:PYTHONPATH = "backend"

# (Optional) Install Python dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API and Swagger docs will be accessible at:
- **API Base:** `http://127.0.0.1:8000`
- **Swagger Documentation:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/api/health`
- **Modular Tasks Endpoint:** `http://127.0.0.1:8000/api/tasks`
- **Condition Catalog:** `http://127.0.0.1:8000/api/catalog/conditions`

### Manual Frontend Setup & Startup

From the `frontend` directory:
```powershell
cd frontend

# Install Node dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Or build for production
npm run build
```
The web workstation will open at `http://localhost:5173`.

---

## 🧪 Verified Test Results

### 1. Backend Test Suite (Pytest)
Executed via `python -m pytest backend/tests/ -v`:
- ✅ `test_auth.py`: Medical login, demo roles (Student/Clinician), password reset guards, OTP generation & verification, Google OAuth stub, and session `/me` endpoints.
- ✅ `test_catalog.py`: Full catalog enumeration (Categories A-J), category filtering, availability filters, model registry inventory, and scan sequence compatibility matching.
- ✅ `test_health.py`: Healthcheck API returns 200, checks filesystem integrity, and confirms CNN checkpoint presence.
- ✅ `test_model_info.py`: Model architecture metadata, 4-class labels, layer tensor shapes, and trainable parameters verified.
- ✅ `test_modular_tasks.py`: Modular task registry enumeration, state guards, brain tumor prediction, model metadata, and dataset inspection verified.
- ✅ `test_predict_validation.py`: Rejects empty files, non-image files, unsupported modalities (e.g., CT/X-Ray rejection), and validates payload integrity.
- ✅ `test_preprocessing.py`: Validates $(224, 224, 3)$ normalization, clipping $[0, 1]$, and tensor batch shapes.
- ✅ `test_real_ai_architecture.py`: End-to-end file validation, photometric quality checks, model routing, upload staging, inference analysis, developer diagnostics, and report generation.
- ✅ `test_student_module.py`: Visual concepts retrieval, educational case library, case practice submission, progressive AI tutor hints, quiz evaluation, and student progress tracking.
- **Result:** **48 passed, 0 failed** across all 9 test suites.

### 2. Frontend Production Verification
Executed via `tsc && vite build`:
- ✅ TypeScript type-checking passed with 0 errors.
- ✅ Production bundle generated into `frontend/dist/` (1,154 kB JS / 61 kB CSS).
- ✅ Complete responsive layout, dark theme tokens, and routing verified.

---

## 📊 Model Evaluation & Metrics

---

## 📊 Model Evaluation & Metrics

The baseline model was evaluated against the held-out test split (`dataset/test/`):
- **Condition:** Brain Tumor MRI Classification
- **Classes:** `Glioma`, `Meningioma`, `No_Tumor`, `Pituitary`
- **Test Set Size:** 40 images (balanced 10 per category)
- **Artifacts:**
  - **Confusion Matrix:** `backend/evaluation_results/confusion_matrix.png`
  - **Convergence Curves:** `backend/evaluation_results/loss_accuracy_curve.png`
  - **Raw Metrics:** `backend/evaluation_results/metrics.json`
- **Model Checkpoint:** `backend/saved_models/axonova_brain_mri_best.keras` (304,932 parameters, 3.7 MB)

---

## 🔒 Safety, Ethics & Limitations

1. **Zero-Simulation Policy:** Unconfigured tasks (Alzheimer's, Stroke, MS) strictly refuse simulated or placeholder outputs. Execution requires validated models and data.
2. **Subject-Level Partitioning:** Slices from individual patients must not cross train/test splits.
3. **Modalities Supported:** Strictly brain MRI scans (Axial, Coronal, Sagittal). Non-MRI modalities (CT, Chest X-rays) are rejected.
4. **No Patient PII Storage:** Uploaded scans are evaluated in volatile memory and are not permanently saved to disk or database.
5. **Educational Scope:** Under no circumstances should AXONOVA be utilized as a substitute for certified radiological review or professional clinical judgment.
