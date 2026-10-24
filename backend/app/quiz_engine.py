"""
AXONOVA Secure Anti-Cheating Quiz & Exam Engine
================================================
Server-side validation, secure randomization, anti-cheating event telemetry,
and objective pedagogical scoring.
"""

from datetime import datetime, timedelta, timezone
import logging
import random
from typing import Any, Dict, List, Optional
import uuid

from app.quiz_data import EXPANDED_QUIZ_BANK, QUESTION_LOOKUP, QUIZ_CATEGORIES

logger = logging.getLogger("axonova.quiz_engine")

# In-memory storage for active and completed exam sessions
EXAM_SESSIONS: Dict[str, Dict[str, Any]] = {}

# Active attempt tracker per student: student_id -> attempt_id
STUDENT_ACTIVE_ATTEMPTS: Dict[str, str] = {}


def start_exam_session(
    student_id: str = "med-student-01",
    category: Optional[str] = "All",
    difficulty: Optional[str] = "All",
    num_questions: int = 10,
    duration_minutes: int = 15,
) -> Dict[str, Any]:
    """
    Creates a new validated exam attempt session with server-side randomization.
    Strips all answers and explanations from the client payload.
    """
    now = datetime.now(timezone.utc)

    # Check for existing active attempt
    if student_id in STUDENT_ACTIVE_ATTEMPTS:
        prev_id = STUDENT_ACTIVE_ATTEMPTS[student_id]
        prev_sess = EXAM_SESSIONS.get(prev_id)
        if prev_sess and prev_sess["status"] == "ACTIVE":
            exp_time = datetime.fromisoformat(prev_sess["expires_at"])
            if now < exp_time:
                # Return active existing attempt
                return {
                    "attempt_id": prev_id,
                    "student_id": student_id,
                    "started_at": prev_sess["started_at"],
                    "expires_at": prev_sess["expires_at"],
                    "duration_seconds": prev_sess["duration_seconds"],
                    "total_questions": len(prev_sess["client_questions"]),
                    "questions": prev_sess["client_questions"],
                    "anti_cheating_rules": prev_sess["anti_cheating_rules"],
                    "is_resumed": True,
                }

    # Filter question candidates
    candidates = list(EXPANDED_QUIZ_BANK)
    if category and category != "All":
        candidates = [q for q in candidates if q.get("category", "").lower() == category.lower()]
    if difficulty and difficulty != "All":
        candidates = [q for q in candidates if q.get("difficulty", "").lower() == difficulty.lower()]

    # Fallback to full bank if filter yields fewer than requested
    if len(candidates) < num_questions:
        candidates = list(EXPANDED_QUIZ_BANK)

    selected_pool = random.sample(candidates, min(num_questions, len(candidates)))

    attempt_id = f"EXAM-{uuid.uuid4().hex[:10].upper()}"
    duration_secs = duration_minutes * 60
    expires_at = now + timedelta(seconds=duration_secs)

    client_questions: List[Dict[str, Any]] = []
    server_questions_map: Dict[str, Dict[str, Any]] = {}

    for q in selected_pool:
        orig_options = list(q["options"])
        orig_correct_text = orig_options[q["correct_index"]]

        # Randomize options order
        shuffled_options = list(orig_options)
        random.shuffle(shuffled_options)
        new_correct_index = shuffled_options.index(orig_correct_text)

        # Store secure server copy with correct answers
        server_questions_map[q["id"]] = {
            "id": q["id"],
            "question": q["question"],
            "category": q.get("category", "General"),
            "topic": q.get("topic", "General"),
            "difficulty": q.get("difficulty", "Medium"),
            "options": shuffled_options,
            "correct_index": new_correct_index,
            "correct_answer_text": orig_correct_text,
            "explanation": q["explanation"],
        }

        # Client version: strictly stripped of correct answers and explanations
        client_questions.append({
            "id": q["id"],
            "category": q.get("category", "General"),
            "topic": q.get("topic", "General"),
            "difficulty": q.get("difficulty", "Medium"),
            "question": q["question"],
            "options": shuffled_options,
        })

    anti_cheating_rules = {
        "fullscreen_required": True,
        "tab_switch_monitoring": True,
        "max_violations_allowed": 3,
        "copy_paste_disabled": True,
        "server_scored": True,
        "camera_required": False,
        "biometrics_required": False,
    }

    session_record = {
        "attempt_id": attempt_id,
        "student_id": student_id,
        "started_at": now.isoformat(),
        "expires_at": expires_at.isoformat(),
        "duration_seconds": duration_secs,
        "client_questions": client_questions,
        "server_questions_map": server_questions_map,
        "status": "ACTIVE",
        "violations_count": 0,
        "events": [],
        "anti_cheating_rules": anti_cheating_rules,
    }

    EXAM_SESSIONS[attempt_id] = session_record
    STUDENT_ACTIVE_ATTEMPTS[student_id] = attempt_id

    logger.info("Exam attempt %s started for student %s with %d questions", attempt_id, student_id, len(client_questions))

    return {
        "attempt_id": attempt_id,
        "student_id": student_id,
        "started_at": now.isoformat(),
        "expires_at": expires_at.isoformat(),
        "duration_seconds": duration_secs,
        "total_questions": len(client_questions),
        "questions": client_questions,
        "anti_cheating_rules": anti_cheating_rules,
        "is_resumed": False,
    }


def log_exam_event(
    attempt_id: str,
    event_type: str,
    timestamp: str,
    details: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Logs suspicious or lifecycle events for an active exam attempt.
    Enforces the 3-violation anti-cheating policy.
    """
    session = EXAM_SESSIONS.get(attempt_id)
    if not session:
        return {"success": False, "violations_count": 0, "auto_submitted": False}

    event_record = {
        "event_type": event_type,
        "timestamp": timestamp,
        "details": details or {},
    }
    session["events"].append(event_record)

    # Check for violation event types
    violation_events = [
        "TAB_SWITCH",
        "WINDOW_BLUR",
        "FULLSCREEN_EXIT",
        "COPY_ATTEMPT",
        "PASTE_ATTEMPT",
        "RIGHT_CLICK",
    ]
    if event_type in violation_events:
        session["violations_count"] += 1
        logger.warning(
            "Violation recorded for attempt %s: %s (Count: %d/3)",
            attempt_id,
            event_type,
            session["violations_count"],
        )

    auto_submitted = False
    if session["violations_count"] >= session["anti_cheating_rules"]["max_violations_allowed"]:
        auto_submitted = True
        logger.warning("Attempt %s exceeded violation limit; flagged for auto-submission", attempt_id)

    return {
        "success": True,
        "violations_count": session["violations_count"],
        "auto_submitted": auto_submitted,
    }


def score_exam_submission(
    attempt_id: str,
    answers: Dict[str, int],
    student_progress_ref: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Performs server-side validation and objective scoring of the exam attempt.
    """
    session = EXAM_SESSIONS.get(attempt_id)
    if not session:
        raise ValueError(f"Exam attempt '{attempt_id}' not found.")

    now = datetime.now(timezone.utc)
    server_map = session["server_questions_map"]
    expires_at = datetime.fromisoformat(session["expires_at"])

    # Grace period of 30 seconds for network latency
    if now > expires_at + timedelta(seconds=30) and session["status"] == "ACTIVE":
        session["status"] = "EXPIRED"

    correct_count = 0
    review_items: List[Dict[str, Any]] = []

    # Category and topic trackers: name -> {"total": int, "correct": int}
    category_tracker: Dict[str, Dict[str, int]] = {}
    topic_tracker: Dict[str, Dict[str, int]] = {}
    understood_topics = set()
    topics_to_revise = set()

    for q_id, q_data in server_map.items():
        cat = q_data["category"]
        top = q_data["topic"]

        if cat not in category_tracker:
            category_tracker[cat] = {"total": 0, "correct": 0}
        if top not in topic_tracker:
            topic_tracker[top] = {"total": 0, "correct": 0}

        category_tracker[cat]["total"] += 1
        topic_tracker[top]["total"] += 1

        selected_idx = answers.get(q_id)
        is_correct = (selected_idx is not None and selected_idx == q_data["correct_index"])

        if is_correct:
            correct_count += 1
            category_tracker[cat]["correct"] += 1
            topic_tracker[top]["correct"] += 1
            understood_topics.add(top)
        else:
            topics_to_revise.add(top)

        review_items.append({
            "question_id": q_id,
            "question": q_data["question"],
            "category": cat,
            "topic": top,
            "difficulty": q_data["difficulty"],
            "selected_index": selected_idx,
            "correct_index": q_data["correct_index"],
            "is_correct": is_correct,
            "options": q_data["options"],
            "explanation": q_data["explanation"],
        })

    total_q = len(server_map)
    percentage = round((correct_count / total_q) * 100.0, 1) if total_q > 0 else 0.0

    category_scores = [
        {
            "topic": cat,
            "total": val["total"],
            "correct": val["correct"],
            "percentage": round((val["correct"] / val["total"]) * 100.0, 1),
        }
        for cat, val in category_tracker.items()
    ]

    topic_scores = [
        {
            "topic": top,
            "total": val["total"],
            "correct": val["correct"],
            "percentage": round((val["correct"] / val["total"]) * 100.0, 1),
        }
        for top, val in topic_tracker.items()
    ]

    session["status"] = "COMPLETED"
    session["submitted_at"] = now.isoformat()
    session["score_percentage"] = percentage

    # Clear active attempt for this student
    if session["student_id"] in STUDENT_ACTIVE_ATTEMPTS:
        del STUDENT_ACTIVE_ATTEMPTS[session["student_id"]]

    # Update in-memory student progress if provided
    if student_progress_ref is not None:
        student_progress_ref["quizzes_attempted"] = student_progress_ref.get("quizzes_attempted", 0) + total_q
        student_progress_ref["quizzes_correct"] = student_progress_ref.get("quizzes_correct", 0) + correct_count
        for t in topics_to_revise:
            if t not in student_progress_ref.get("topics_to_revise", []):
                student_progress_ref["topics_to_revise"].insert(0, t)
        student_progress_ref["topics_to_revise"] = student_progress_ref["topics_to_revise"][:6]

        # Record activity
        student_progress_ref.setdefault("recent_activity", []).insert(0, {
            "type": "exam",
            "title": f"Examination Attempt ({percentage}%)",
            "timestamp": "Just now",
            "score": f"{correct_count}/{total_q}",
        })

    return {
        "attempt_id": attempt_id,
        "total_questions": total_q,
        "correct_count": correct_count,
        "score_percentage": percentage,
        "status": session["status"],
        "started_at": session["started_at"],
        "submitted_at": now.isoformat(),
        "topic_scores": topic_scores,
        "category_scores": category_scores,
        "understood_topics": list(understood_topics),
        "topics_to_revise": list(topics_to_revise),
        "review": review_items,
        "disclaimer": (
            "AXONOVA examination evaluation is an educational learning metric. "
            "Results are calculated by automated scoring algorithms and do not constitute formal institutional accreditation."
        ),
    }
