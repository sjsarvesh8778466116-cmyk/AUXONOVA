from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "MRI" in data["supported_scan_types"]
    assert "CT" in data["disabled_scan_types"]
    assert "X-ray" in data["disabled_scan_types"]
    assert "JPEG" in data["supported_image_formats"]
    assert "educational" in data["disclaimer"].lower() or "academic research prototype" in data["disclaimer"].lower()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "AXONOVA"

def test_security_headers():
    response = client.get("/")
    assert response.status_code == 200
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert "1; mode=block" in response.headers.get("x-xss-protection", "")
    assert response.headers.get("referrer-policy") == "strict-origin-when-cross-origin"
