from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)

def test_quiz_categories_endpoint():
    res = client.get("/api/student/quizzes/categories")
    assert res.status_code == 200
    data = res.json()
    assert "categories" in data
    assert len(data["categories"]) == 8
    assert data["total_questions"] >= 25

def test_exam_start_strips_answers():
    """Verify that exam questions do NOT leak correct_index or explanation to client."""
    payload = {
        "student_id": "test-student-exam-01",
        "category": "All",
        "difficulty": "All",
        "num_questions": 5,
        "duration_minutes": 10,
    }
    res = client.post("/api/student/quizzes/exam/start", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "attempt_id" in data
    assert data["total_questions"] == 5
    assert len(data["questions"]) == 5

    for q in data["questions"]:
        assert "id" in q
        assert "question" in q
        assert "options" in q
        assert len(q["options"]) == 4
        # CRITICAL SECURITY CHECK:
        assert "correct_index" not in q
        assert "explanation" not in q

def test_exam_event_telemetry():
    """Verify suspicious event logging and violation counter."""
    # Start attempt
    start_res = client.post("/api/student/quizzes/exam/start", json={
        "student_id": "test-student-exam-02",
        "num_questions": 5,
    })
    attempt_id = start_res.json()["attempt_id"]

    # Log tab switch event
    event_payload = {
        "attempt_id": attempt_id,
        "event_type": "TAB_SWITCH",
        "timestamp": "2026-10-03T12:00:00Z",
        "details": {"reason": "User switched browser tab"}
    }
    res = client.post("/api/student/quizzes/exam/log-event", json=event_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["violations_count"] == 1
    assert data["auto_submitted"] is False

def test_exam_server_side_scoring_and_review():
    """Verify server-side objective scoring and detailed feedback generation."""
    start_res = client.post("/api/student/quizzes/exam/start", json={
        "student_id": "test-student-exam-03",
        "num_questions": 5,
    })
    attempt = start_res.json()
    attempt_id = attempt["attempt_id"]

    # Submit answers (select option 0 for all)
    answers = {q["id"]: 0 for q in attempt["questions"]}
    sub_res = client.post("/api/student/quizzes/exam/submit", json={
        "attempt_id": attempt_id,
        "answers": answers,
    })
    assert sub_res.status_code == 200
    result = sub_res.json()
    assert result["attempt_id"] == attempt_id
    assert result["total_questions"] == 5
    assert "score_percentage" in result
    assert "topic_scores" in result
    assert "review" in result
    assert len(result["review"]) == 5

    # Review items now legitimately contain explanations and correct answers
    first_review = result["review"][0]
    assert "correct_index" in first_review
    assert "explanation" in first_review

def test_viva_endpoints():
    """Verify viva topics, questions, evaluation, and presentation script."""
    # Topics
    topics_res = client.get("/api/student/viva/topics")
    assert topics_res.status_code == 200
    assert len(topics_res.json()["topics"]) == 10

    # Questions
    q_res = client.get("/api/student/viva/questions")
    assert q_res.status_code == 200
    assert q_res.json()["total_questions"] >= 10

    # Presentation
    pres_res = client.get("/api/student/viva/presentation")
    assert pres_res.status_code == 200
    assert len(pres_res.json()["sections"]) == 13

    # Evaluation
    eval_payload = {
        "question_id": "viva-01",
        "question": "Explain the fundamental principle behind MRI signal generation. What role do hydrogen protons play?",
        "category": "MRI Physics & Signal Generation",
        "student_answer": "MRI signals rely on hydrogen protons which undergo precession in an external magnetic field and emit resonance signals during relaxation."
    }
    eval_res = client.post("/api/student/viva/evaluate", json=eval_payload)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert len(eval_data["key_points_covered"]) >= 2
    assert "suggested_answer" in eval_data
    assert "score_label" in eval_data
