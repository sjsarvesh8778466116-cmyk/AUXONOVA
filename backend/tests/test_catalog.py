import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.catalog_data import CONDITION_CATALOG, LIVE_MODEL_REGISTRY, match_scan_to_model

client = TestClient(app)

def test_catalog_endpoint():
    response = client.get("/api/catalog")
    assert response.status_code == 200
    data = response.json()
    assert "conditions" in data
    assert len(data["conditions"]) >= 35
    assert data["total_count"] == len(data["conditions"])

def test_catalog_category_filter():
    response = client.get("/api/catalog?category=tumors_masses")
    assert response.status_code == 200
    data = response.json()
    assert all(c["category_key"] == "tumors_masses" for c in data["conditions"])

def test_catalog_availability_filter():
    response = client.get("/api/catalog?availability=Available")
    assert response.status_code == 200
    data = response.json()
    assert all(c["model_availability"] == "Available" for c in data["conditions"])

def test_model_registry_endpoint():
    response = client.get("/api/models/registry")
    assert response.status_code == 200
    data = response.json()
    assert "registry" in data
    assert len(data["registry"]) >= 4
    # Check that brain tumor model exists
    tumor_model = next((m for m in data["registry"] if m["model_id"] == "axonova-brain-tumor-cnn"), None)
    assert tumor_model is not None
    assert tumor_model["status"] == "Available"

def test_scan_matching_logic():
    # 1. Matching valid scan
    match1 = match_scan_to_model("glioma-glioblastoma", "T1-weighted Contrast-Enhanced", "Axial")
    assert match1["matched"] is True
    assert match1["status"] == "Available"
    assert match1["compatible_model"]["model_id"] == "axonova-brain-tumor-cnn"

    # 2. Sequence mismatch
    match2 = match_scan_to_model("ischemic-stroke", "T1-weighted Contrast-Enhanced", "Axial")
    assert match2["matched"] is False
    assert match2["status"] == "Not Suitable for This Scan"

    # 3. Unsupported condition in catalog (e.g. brain metastases)
    match3 = match_scan_to_model("unknown-experimental-pathology", "T1-weighted Contrast-Enhanced", "Axial")
    assert match3["matched"] is False
    assert match3["status"] == "Not Assessed"
