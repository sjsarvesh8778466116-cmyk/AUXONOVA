import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_student_concepts():
    response = client.get("/api/student/concepts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 7
    concept_names = [c["name"] for c in data]
    assert "Edges" in concept_names
    assert "Textures" in concept_names
    assert "Shapes & Morphology" in concept_names

def test_student_cases_list():
    response = client.get("/api/student/cases")
    assert response.status_code == 200
    cases = response.json()
    assert isinstance(cases, list)
    assert len(cases) >= 4
    for c in cases:
        assert "id" in c
        assert "title" in c
        assert "difficulty" in c
        assert "category" not in c  # Verification: Answer must NOT be leaked in summary!

def test_student_case_detail():
    response = client.get("/api/student/cases/AXO-CASE-GLI-01")
    assert response.status_code == 200
    case = response.json()
    assert case["id"] == "AXO-CASE-GLI-01"
    assert "category" not in case  # Verification: Answer must NOT be leaked in detail before submission!
    assert "clinical_presentation" in case
    assert "learning_objectives" in case
    assert len(case["supported_classes"]) == 4

def test_student_case_submission_match():
    payload = {
        "selected_category": "Glioma",
        "selected_concepts": ["Edges", "Textures"],
        "reasoning": "The intra-axial location and heterogeneous infiltrative appearance suggest a glioma."
    }
    response = client.post("/api/student/cases/AXO-CASE-GLI-01/submit", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["case_id"] == "AXO-CASE-GLI-01"
    assert res["verified_outcome"] == "Glioma"
    assert res["is_match"] is True
    assert "teaching_points" in res
    assert "what_cnn_learns" in res
    assert "model_limitations" in res

def test_student_case_submission_non_match():
    payload = {
        "selected_category": "Meningioma",
        "selected_concepts": ["Shapes"],
        "reasoning": "Thought it might be a meningioma."
    }
    response = client.post("/api/student/cases/AXO-CASE-GLI-01/submit", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["is_match"] is False
    assert res["verified_outcome"] == "Glioma"
    assert "Let's learn from this case" in res["educational_feedback"]

def test_student_chat_hints():
    # Hint 1
    req1 = {"case_id": "AXO-CASE-GLI-01", "message": "Can you give me a hint?", "hint_level": 0}
    res1 = client.post("/api/student/chat", json=req1)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["current_hint_level"] == 1
    assert "Hint 1" in data1["reply"]

    # Hint 2
    req2 = {"case_id": "AXO-CASE-GLI-01", "message": "Give me another hint", "hint_level": 1}
    res2 = client.post("/api/student/chat", json=req2)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["current_hint_level"] == 2
    assert "Hint 2" in data2["reply"]

def test_student_chat_concepts():
    req = {"message": "What does texture mean in MRI?"}
    res = client.post("/api/student/chat", json=req)
    assert res.status_code == 200
    reply = res.json()["reply"]
    assert "texture" in reply.lower()

def test_student_quizzes_and_submit():
    res = client.get("/api/student/quizzes")
    assert res.status_code == 200
    quizzes = res.json()
    assert len(quizzes) >= 5

    # Submit answer
    first_q = quizzes[0]
    submit_payload = {
        "question_id": first_q["id"],
        "selected_index": first_q["correct_index"]
    }
    sub_res = client.post("/api/student/quizzes/submit", json=submit_payload)
    assert sub_res.status_code == 200
    assert sub_res.json()["is_correct"] is True

def test_student_progress():
    res = client.get("/api/student/progress")
    assert res.status_code == 200
    prog = res.json()
    assert "cases_attempted" in prog
    assert "concepts_mastered" in prog
    assert "topics_to_revise" in prog
