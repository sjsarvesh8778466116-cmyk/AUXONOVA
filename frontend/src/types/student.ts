export interface MriConcept {
  id: string;
  name: string;
  definition: string;
  mri_relevance: string;
  cnn_learning: string;
  medical_interpretation: string;
  example: string;
}

export interface CaseSummary {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sequence: string;
  orientation: string;
  age_range: string;
  image_url: string;
  key_concepts: string[];
}

export interface CaseDetail {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sequence: string;
  orientation: string;
  age_range: string;
  image_url: string;
  clinical_presentation: string;
  imaging_observations: string;
  learning_objectives: string[];
  key_concepts: string[];
  supported_classes: string[];
  disclaimer: string;
}

export interface StudentCaseSubmission {
  selected_category: string;
  selected_concepts: string[];
  reasoning: string;
}

export interface StudentCaseResult {
  case_id: string;
  student_prediction: string;
  verified_outcome: string;
  is_match: boolean;
  student_reasoning: string;
  student_concepts: string[];
  teaching_points: string;
  differential_considerations: string[];
  what_cnn_learns: string;
  model_limitations: string;
  cnn_prediction?: string | null;
  cnn_confidence?: number | null;
  cnn_scores?: Array<{
    class_name: string;
    score: number;
    percentage: number;
  }> | null;
  gradcam_available: boolean;
  gradcam_image_base64?: string | null;
  gradcam_explanation?: string | null;
  educational_feedback: string;
  disclaimer: string;
}

export interface StudentChatResponse {
  reply: string;
  suggested_actions: string[];
  current_hint_level: number;
  max_hint_level: number;
  disclaimer: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty?: string;
  question: string;
  options: string[];
  correct_index?: number;
  explanation: string;
}

export interface QuizSubmitResult {
  question_id: string;
  is_correct: boolean;
  correct_index: number;
  explanation: string;
  topic: string;
}

export interface StudentProgressData {
  student_id: string;
  name: string;
  role: string;
  cases_attempted: number;
  cases_completed: number;
  quizzes_attempted: number;
  quizzes_correct: number;
  streak_days: number;
  concepts_mastered: Record<string, number>;
  completed_case_ids: string[];
  topics_to_revise: string[];
  recent_activity: Array<{
    type: string;
    title: string;
    timestamp: string;
    outcome?: string;
  }>;
}

export interface TumorCurriculumItem {
  title: string;
  category: string;
  overview: string;
  general_location: string;
  imaging_characteristics: string[];
  visual_patterns: string[];
  mri_concepts: string[];
  differentials: string[];
  terminology: string[];
  key_learning_points: string[];
  what_cnn_learns: string;
  what_cnn_cannot_tell: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ExamClientQuestion {
  id: string;
  category: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
}

export interface ExamStartResponse {
  attempt_id: string;
  student_id: string;
  started_at: string;
  expires_at: string;
  duration_seconds: number;
  total_questions: number;
  questions: ExamClientQuestion[];
  anti_cheating_rules: {
    fullscreen_required: boolean;
    tab_switch_monitoring: boolean;
    max_violations_allowed: number;
    copy_paste_disabled: boolean;
    server_scored: boolean;
    camera_required: boolean;
    biometrics_required: boolean;
  };
  is_resumed?: boolean;
}

export interface ExamEventLogResponse {
  success: boolean;
  violations_count: number;
  auto_submitted: boolean;
}

export interface ExamQuestionReview {
  question_id: string;
  question: string;
  category: string;
  topic: string;
  difficulty: string;
  selected_index: number | null;
  correct_index: number;
  is_correct: boolean;
  options: string[];
  explanation: string;
}

export interface ExamTopicScore {
  topic: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface ExamSubmitResult {
  attempt_id: string;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  status: string;
  started_at: string;
  submitted_at: string;
  topic_scores: ExamTopicScore[];
  category_scores: ExamTopicScore[];
  understood_topics: string[];
  topics_to_revise: string[];
  review: ExamQuestionReview[];
  disclaimer: string;
}

export interface VivaTopic {
  id: string;
  name: string;
  description: string;
}

export interface VivaQuestion {
  id: string;
  category: string;
  question: string;
  suggested_answer: string;
  teaching_guidance?: string;
}

export interface VivaEvaluateResponse {
  question_id: string;
  key_points_covered: string[];
  key_points_missing: string[];
  suggested_answer: string;
  feedback: string;
  score_label: string;
  disclaimer: string;
}

export interface PresentationSection {
  id: string;
  title: string;
  subtitle: string;
  script: string;
}

