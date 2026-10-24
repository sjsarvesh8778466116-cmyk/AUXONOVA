import io
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)

def test_predict_rejected_for_ct():
    # CT scan type must be rejected with 400
    img = Image.new("RGB", (100, 100), color="white")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/predict",
        files={"file": ("scan.jpg", buf, "image/jpeg")},
        data={"scan_type": "CT", "orientation": "Axial"},
    )
    assert response.status_code == 400
    assert "disabled for CT" in response.json()["detail"]

def test_predict_rejected_for_xray():
    # X-ray scan type must be rejected with 400
    img = Image.new("RGB", (100, 100), color="white")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/predict",
        files={"file": ("scan.jpg", buf, "image/jpeg")},
        data={"scan_type": "X-ray", "orientation": "Axial"},
    )
    assert response.status_code == 400
    assert "disabled for X-RAY" in response.json()["detail"]

def test_predict_rejected_for_text_file():
    # Arbitrary non-image file must be rejected
    response = client.post(
        "/api/predict",
        files={"file": ("notes.txt", b"patient notes text", "text/plain")},
        data={"scan_type": "MRI", "orientation": "Axial"},
    )
    assert response.status_code == 400
    assert "Unsupported file extension" in response.json()["detail"]

def test_predict_rejected_for_empty_file():
    response = client.post(
        "/api/predict",
        files={"file": ("empty.jpg", b"", "image/jpeg")},
        data={"scan_type": "MRI", "orientation": "Axial"},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()
