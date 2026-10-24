from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class ClassScore(BaseModel):
    class_name: str = Field(..., description="Dataset category name")
    score: float = Field(..., description="Raw model confidence score (0.0 to 1.0)")
    percentage: float = Field(..., description="Model score represented as a percentage")

class HealthResponse(BaseModel):
    status: str
    api_version: str
    model_loaded: bool
    model_name: Optional[str] = None
    supported_scan_types: List[str]
    disabled_scan_types: List[str]
    supported_image_formats: List[str]
    max_upload_size_mb: int
    disclaimer: str
    active_tasks_count: Optional[int] = None
    total_tasks_count: Optional[int] = None

class ModelInfoResponse(BaseModel):
    loaded: bool
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    input_shape: Optional[List[int]] = None
    supported_classes: List[str] = []
    supported_scan_type: str = "MRI"
    training_status: str
    evaluation_available: bool
    architecture_summary: Optional[str] = None
    layer_count: Optional[int] = None
    trainable_parameters: Optional[int] = None
    trained_at: Optional[str] = None
    disclaimer: str

class PredictionResponse(BaseModel):
    task_id: Optional[str] = "brain-tumor"
    task_name: Optional[str] = "Brain Tumor MRI Classification"
    predicted_category: str
    model_score: float = Field(..., description="Model score for predicted category, not a clinical probability")
    score_label: str = "Model score (not a disease probability)"
    per_class_scores: List[ClassScore]
    filename: str
    scan_type: str
    orientation_label: str
    model_name: str
    model_version: str
    gradcam_available: bool = False
    gradcam_image_base64: Optional[str] = None
    gradcam_explanation: Optional[str] = None
    uncertainty_notice: Optional[str] = None
    developer_diagnostics: Optional[Dict[str, Any]] = None
    disclaimer: str

class EvaluationResponse(BaseModel):
    evaluated: bool
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    evaluated_at: Optional[str] = None
    dataset_split: Optional[str] = None
    test_images_count: Optional[int] = None
    overall_accuracy: Optional[float] = None
    per_class_metrics: Optional[Dict[str, Dict[str, float]]] = None
    confusion_matrix: Optional[Dict[str, Any]] = None
    training_history: Optional[Dict[str, List[float]]] = None
    metric_interpretations: Optional[Dict[str, str]] = None
    disclaimer: str

class DatasetInfoResponse(BaseModel):
    available: bool
    dataset_name: str
    source: str
    license_terms: str
    folder_layout: str
    class_distribution: Dict[str, int]
    split_counts: Dict[str, int]
    total_images: int
    input_resolution: str
    color_mode: str
    normalization: str
    disclaimer: str

# ==========================================
# Medical Student Learning Module Schemas
# ==========================================

class MriConceptItem(BaseModel):
    id: str
    name: str
    definition: str
    mri_relevance: str
    cnn_learning: str
    medical_interpretation: str
    example: str

class CaseSummary(BaseModel):
    id: str
    title: str
    difficulty: str
    sequence: str
    orientation: str
    age_range: str
    image_url: str
    key_concepts: List[str]

class CaseDetail(BaseModel):
    id: str
    title: str
    difficulty: str
    sequence: str
    orientation: str
    age_range: str
    image_url: str
    clinical_presentation: str
    imaging_observations: str
    learning_objectives: List[str]
    key_concepts: List[str]
    supported_classes: List[str]
    disclaimer: str

class StudentCaseSubmission(BaseModel):
    selected_category: str = Field(..., description="Student's predicted category")
    selected_concepts: List[str] = Field(default=[], description="MRI concepts selected by student")
    reasoning: str = Field(default="", description="Student's text explanation of why they chose this category")

class StudentCaseResult(BaseModel):
    case_id: str
    student_prediction: str
    verified_outcome: str
    is_match: bool
    student_reasoning: str
    student_concepts: List[str]
    teaching_points: str
    differential_considerations: List[str]
    what_cnn_learns: str
    model_limitations: str
    cnn_prediction: Optional[str] = None
    cnn_confidence: Optional[float] = None
    cnn_scores: Optional[List[ClassScore]] = None
    gradcam_available: bool = False
    gradcam_image_base64: Optional[str] = None
    gradcam_explanation: Optional[str] = None
    educational_feedback: str
    disclaimer: str

class StudentChatRequest(BaseModel):
    case_id: Optional[str] = None
    message: str
    hint_level: Optional[int] = 0

class StudentChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    current_hint_level: int = 0
    max_hint_level: int = 3
    disclaimer: str

class QuizQuestionSchema(BaseModel):
    id: str
    topic: str
    category: Optional[str] = "General"
    difficulty: Optional[str] = "Medium"
    question: str
    options: List[str]
    correct_index: int
    explanation: str

class QuizSubmitRequest(BaseModel):
    question_id: str
    selected_index: int

class QuizSubmitResult(BaseModel):
    question_id: str
    is_correct: bool
    correct_index: int
    explanation: str
    topic: str

# --- Anti-Cheating Exam Schemas ---

class ExamStartRequest(BaseModel):
    student_id: str = "med-student-01"
    category: Optional[str] = "All"
    difficulty: Optional[str] = "All"
    num_questions: int = Field(default=10, ge=5, le=30)
    duration_minutes: int = Field(default=15, ge=5, le=60)

class ExamClientQuestion(BaseModel):
    id: str
    category: str
    topic: str
    difficulty: str
    question: str
    options: List[str]

class ExamStartResponse(BaseModel):
    attempt_id: str
    student_id: str
    started_at: str
    expires_at: str
    duration_seconds: int
    total_questions: int
    questions: List[ExamClientQuestion]
    anti_cheating_rules: Dict[str, Any]

class ExamEventLogRequest(BaseModel):
    attempt_id: str
    event_type: str
    timestamp: str
    details: Optional[Dict[str, Any]] = None

class ExamEventLogResponse(BaseModel):
    success: bool
    violations_count: int
    auto_submitted: bool

class ExamSubmitRequest(BaseModel):
    attempt_id: str
    answers: Dict[str, int]

class ExamQuestionReview(BaseModel):
    question_id: str
    question: str
    category: str
    topic: str
    difficulty: str
    selected_index: Optional[int]
    correct_index: int
    is_correct: bool
    options: List[str]
    explanation: str

class ExamTopicScore(BaseModel):
    topic: str
    total: int
    correct: int
    percentage: float

class ExamSubmitResult(BaseModel):
    attempt_id: str
    total_questions: int
    correct_count: int
    score_percentage: float
    status: str
    started_at: str
    submitted_at: str
    topic_scores: List[ExamTopicScore]
    category_scores: List[ExamTopicScore]
    understood_topics: List[str]
    topics_to_revise: List[str]
    review: List[ExamQuestionReview]
    disclaimer: str

# --- AI Viva Coach Schemas ---

class VivaEvaluateRequest(BaseModel):
    question_id: str
    question: str
    category: str
    student_answer: str

class VivaEvaluateResponse(BaseModel):
    question_id: str
    key_points_covered: List[str]
    key_points_missing: List[str]
    suggested_answer: str
    feedback: str
    score_label: str
    disclaimer: str


class StudentProgressData(BaseModel):
    student_id: str = "med-student-01"
    name: str = "Medical Student"
    role: str = "Medical Student"
    cases_attempted: int = 0
    cases_completed: int = 0
    quizzes_attempted: int = 0
    quizzes_correct: int = 0
    streak_days: int = 1
    concepts_mastered: Dict[str, int] = {}
    completed_case_ids: List[str] = []
    topics_to_revise: List[str] = []
    recent_activity: List[Dict[str, Any]] = []

# --- Authentication Schemas ---

class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email address or Student ID / Username")
    password: str = Field(..., min_length=4, description="User password")
    role: Optional[str] = Field("student", description="Requested role: 'student' or 'patient'")

class OtpSendRequest(BaseModel):
    phone: str = Field(..., description="E.164 or formatted mobile number with country code")
    role: Optional[str] = Field("student", description="Role to associate with session")

class OtpSendResponse(BaseModel):
    success: bool
    message: str
    phone: str
    expires_in_seconds: int = 300
    demo_otp: Optional[str] = "123456"

class OtpVerifyRequest(BaseModel):
    phone: str = Field(..., description="Mobile number where OTP was requested")
    otp: str = Field(..., min_length=4, max_length=6, description="Verification code")
    role: Optional[str] = Field("student", description="Role to associate with session")

class GoogleAuthRequest(BaseModel):
    email: str = Field(..., description="Google account email")
    name: str = Field(..., description="Google account display name")
    picture: Optional[str] = Field(None, description="Google profile photo URL")
    id_token: Optional[str] = Field(None, description="Google OAuth ID token or simulated credential")
    role: Optional[str] = Field("student", description="Assigned role: 'student' or 'patient'")

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Full Name")
    email: str = Field(..., description="Email address")
    password: str = Field(..., min_length=6, description="Password")
    phone: Optional[str] = Field(None, description="Optional phone number")
    role: str = Field("student", description="'student' or 'patient'")
    institution: Optional[str] = Field("Medical Neuroscience & Imaging Lab", description="Academic or Clinical affiliation")

class AuthUser(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    avatar: Optional[str] = None
    title: Optional[str] = None
    institution: Optional[str] = None
    auth_method: str = "password"

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str
    user: AuthUser

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., description="Registered email address (Gmail)")

class ForgotPasswordResponse(BaseModel):
    configured: bool
    message: str
    detail: Optional[str] = None

