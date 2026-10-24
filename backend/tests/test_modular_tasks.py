import io
from fastapi.testclient import TestClient
from PIL import Image
import pytest
from app.main import app

client = TestClient(app)

def create_synthetic_image_bytes():
    buf = io.BytesIO()
    img = Image.new("RGB", (224, 224), color=(100, 100, 100))
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_list_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5

    task_map = {t["task_id"]: t for t in data}
    assert "brain-tumor" in task_map
    assert "alzheimers" in task_map
    assert "multiple-sclerosis" in task_map
    assert "stroke" in task_map
    assert "future-research" in task_map

    # Brain tumor must be SUPPORTED if model exists
    bt = task_map["brain-tumor"]
    assert bt["status"] == "SUPPORTED"
    assert bt["model_loaded"] is True
    assert len(bt["class_labels"]) == 4

    # Other tasks are in development until genuine models are trained
    alz = task_map["alzheimers"]
    assert alz["status"] == "IN_DEVELOPMENT"
    assert alz["model_loaded"] is False
    assert len(alz["class_labels"]) == 3

    ms = task_map["multiple-sclerosis"]
    assert ms["status"] == "IN_DEVELOPMENT"
    assert ms["model_loaded"] is False
    assert len(ms["class_labels"]) == 3

    stroke = task_map["stroke"]
    assert stroke["status"] == "IN_DEVELOPMENT"
    assert stroke["model_loaded"] is False
    assert len(stroke["class_labels"]) == 3

    future = task_map["future-research"]
    assert future["status"] == "IN_DEVELOPMENT"
    assert future["model_loaded"] is False

def test_active_task_prediction():
    img_bytes = create_synthetic_image_bytes()
    files = {"file": ("test.jpg", img_bytes, "image/jpeg")}
    data = {"scan_type": "MRI", "orientation": "Coronal"}

    resp = client.post("/api/tasks/alzheimers/predict", files=files, data=data)
    assert resp.status_code == 400
    assert "Model not currently available. This condition is under development." in resp.json()["detail"]

def test_brain_tumor_task_predict():
    img_bytes = create_synthetic_image_bytes()
    files = {"file": ("test_tumor.jpg", img_bytes, "image/jpeg")}
    data = {"scan_type": "MRI", "orientation": "Axial"}

    resp = client.post("/api/tasks/brain-tumor/predict", files=files, data=data)
    assert resp.status_code == 200
    res_data = resp.json()
    assert res_data["task_id"] == "brain-tumor"
    assert res_data["predicted_category"] in ["Glioma", "Meningioma", "No_Tumor", "Pituitary"]
    assert "score_label" in res_data
    assert "disclaimer" in res_data

def test_task_model_info_and_evaluation():
    resp_bt_eval = client.get("/api/tasks/brain-tumor/evaluation")
    assert resp_bt_eval.status_code == 200
    bt_eval = resp_bt_eval.json()
    assert bt_eval["evaluated"] is True
    assert bt_eval["overall_accuracy"] is not None

    resp_alz_eval = client.get("/api/tasks/alzheimers/evaluation")
    assert resp_alz_eval.status_code == 200
    alz_eval = resp_alz_eval.json()
    assert "evaluated" in alz_eval

def test_task_dataset_info():
    resp_bt_ds = client.get("/api/tasks/brain-tumor/dataset-info")
    assert resp_bt_ds.status_code == 200
    bt_ds = resp_bt_ds.json()
    assert bt_ds["available"] is True
    assert bt_ds["total_images"] > 0
    assert "Glioma" in bt_ds["class_distribution"]

    resp_alz_ds = client.get("/api/tasks/alzheimers/dataset-info")
    assert resp_alz_ds.status_code == 200
    alz_ds = resp_alz_ds.json()
    assert "available" in alz_ds

