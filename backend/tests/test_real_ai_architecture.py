import io
from fastapi.testclient import TestClient
import numpy as np
from PIL import Image
import pytest

from app.main import app
from preprocessing.validation import validate_mri_file, compute_photometric_quality
from preprocessing.normalization import normalize_min_max, normalize_z_score
from models.registry import central_registry
from inference.router import model_router
from inference.classifier import check_brain_mri_distribution

client = TestClient(app)

def create_synthetic_mri_bytes(width: int = 224, height: int = 224, center_val: int = 150) -> bytes:
    """
    Creates a synthetic slice mimicking brain MRI distribution:
    Dark background perimeter with an elliptical intracranial brain structure.
    """
    img = Image.new("L", (width, height), color=0)
    arr = np.zeros((height, width), dtype=np.uint8)
    cy, cx = height // 2, width // 2
    ry, rx = int(height * 0.38), int(width * 0.35)

    y, x = np.ogrid[:height, :width]
    mask = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) <= 1.0

    # Add realistic texture variation
    noise = np.random.randint(-15, 15, (height, width))
    intracranial = np.clip(center_val + noise, 30, 240).astype(np.uint8)
    arr[mask] = intracranial[mask]

    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_file_validation_valid_slice():
    valid_bytes = create_synthetic_mri_bytes()
    res = validate_mri_file(valid_bytes, "axial_t1.jpg", scan_type="MRI", sequence="T1")
    assert res.is_valid is True
    assert res.dimensions == (224, 224)
    assert res.quality_metrics["is_acceptable"] is True


def test_file_validation_empty_file():
    res = validate_mri_file(b"", "empty.jpg")
    assert res.is_valid is False
    assert res.error_code == "EMPTY_FILE"


def test_file_validation_unsupported_format():
    res = validate_mri_file(b"dummy text content", "notes.txt")
    assert res.is_valid is False
    assert res.error_code == "UNSUPPORTED_FORMAT"


def test_file_validation_unsupported_modality():
    valid_bytes = create_synthetic_mri_bytes()
    res = validate_mri_file(valid_bytes, "chest.jpg", scan_type="CT")
    assert res.is_valid is False
    assert res.error_code == "UNSUPPORTED_MODALITY"


def test_file_validation_corrupted_image():
    corrupted_bytes = b"\xFF\xD8\xFF\xE0" + b"\x00" * 20  # Incomplete JPEG header
    res = validate_mri_file(corrupted_bytes, "corrupt.jpg")
    assert res.is_valid is False
    assert res.error_code == "CORRUPTED_FILE"


def test_photometric_quality_blank_rejected():
    # Pure black image
    blank = Image.new("L", (100, 100), color=0)
    buf = io.BytesIO()
    blank.save(buf, format="PNG")
    res = validate_mri_file(buf.getvalue(), "blank.png")
    assert res.is_valid is False
    assert res.error_code == "IMAGE_QUALITY_ISSUE"


def test_model_registry_inventory():
    models = central_registry.get_all_models()
    assert len(models) >= 4
    model_ids = [m["model_id"] for m in models]
    assert "axonova_brain_tumor_classifier" in model_ids
    assert "axonova_stroke_model" in model_ids

    tumor_m = next(m for m in models if m["model_id"] == "axonova_brain_tumor_classifier")
    assert tumor_m["status"] == "AVAILABLE"
    assert tumor_m["is_available"] is True
    assert tumor_m["explainability"] == "Grad-CAM"
    assert tumor_m["has_metrics"] is True
    assert tumor_m["evaluation_metrics"]["overall_accuracy"] is not None

    stroke_m = next(m for m in models if m["model_id"] == "axonova_stroke_model")
    assert stroke_m["status"] == "IN DEVELOPMENT"
    assert stroke_m["is_available"] is False
    assert stroke_m["has_metrics"] is False


def test_model_router_compatible_and_not_assessed():
    # Brain tumor with T1 sequence -> Ready
    dec1 = model_router.route_scan(scan_type="MRI", sequence="T1", target_condition="Glioma")
    assert dec1.can_run is True
    assert dec1.status == "READY"
    assert dec1.selected_model.model_id == "axonova_brain_tumor_classifier"

    # Stroke with DWI sequence -> Not Connected (weights in development)
    dec2 = model_router.route_scan(scan_type="MRI", sequence="DWI", target_condition="Acute Ischemic Infarction")
    assert dec2.can_run is False
    assert dec2.status == "NOT_CONNECTED"

    # Completely unrelated/unsupported sequence -> Not Assessed
    dec3 = model_router.route_scan(scan_type="MRI", sequence="SPECT-Research", target_condition="Rare Disorder")
    assert dec3.can_run is False
    assert dec3.status == "NOT_ASSESSED"


def test_api_upload_endpoint():
    valid_bytes = create_synthetic_mri_bytes()
    files = {"file": ("test_mri.jpg", valid_bytes, "image/jpeg")}
    data = {"scan_type": "MRI", "sequence": "T1", "orientation": "Axial"}

    resp = client.post("/api/mri/upload", files=files, data=data)
    assert resp.status_code == 200
    res_data = resp.json()
    assert res_data["status"] == "validated"
    assert "case_id" in res_data
    assert len(res_data["compatible_models"]) > 0


def test_api_analyze_and_report_workflow():
    valid_bytes = create_synthetic_mri_bytes()
    files = {"file": ("brain_scan.jpg", valid_bytes, "image/jpeg")}
    data = {
        "scan_type": "MRI",
        "sequence": "T1-weighted (+contrast)",
        "orientation": "Axial",
        "target_condition": "Glioma",
    }

    # 1. Run real analysis
    resp = client.post("/api/mri/analyze", files=files, data=data)
    assert resp.status_code == 200
    res_data = resp.json()

    assert res_data["status"] in ["completed", "indeterminate"]
    assert res_data["model"] == "Brain Tumor Classifier"
    assert res_data["confidence"] > 0.0
    assert "case_id" in res_data
    assert "explainability" in res_data
    assert res_data["explainability"]["supported"] is True
    assert "The visualization indicates image regions" in res_data["explainability"]["explanation"]

    case_id = res_data["case_id"]

    # 2. Retrieve report by case ID
    report_resp = client.get(f"/api/report/{case_id}")
    assert report_resp.status_code == 200
    report_data = report_resp.json()
    assert report_data["case_id"] == case_id
    assert report_data["review"]["status"] == "PENDING_REVIEW"
    assert len(report_data["conditions_not_assessed"]) > 0

    # 3. Clinician Review Sign-off
    review_payload = {
        "reviewer_name": "Dr. Marcus Vance",
        "reviewer_title": "MD, Senior Neuroradiologist",
        "reviewer_license": "NY-MED-84920",
        "decision": "CONFIRMED",
        "clinical_notes": "Contrast enhancement verified on axial T1 sequence.",
    }
    review_resp = client.post(f"/api/report/{case_id}/review", json=review_payload)
    assert review_resp.status_code == 200
    reviewed_data = review_resp.json()
    assert reviewed_data["review_status"] == "REVIEWED"
    assert reviewed_data["report"]["review"]["status"] == "REVIEWED"
    assert "Dr. Marcus Vance" in reviewed_data["report"]["review"]["status_label"]
