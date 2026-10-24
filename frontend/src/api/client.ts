import axios, { AxiosError } from 'axios';
import {
  DatasetInfoResponse,
  EvaluationResponse,
  HealthResponse,
  ModelInfoResponse,
  PredictionResponse,
  SampleScan,
  ScanOrientation,
  ScanType,
  TaskInfo,
  CatalogCondition,
  MatchScanResponse,
  ModelRegistryEntry,
  QualityCheckResponse,
  MriUploadResponse,
  MriAnalysisResponse,
  RadiologyReportData,
  ClinicianReviewPayload,
} from '../types';
import {
  CaseDetail,
  CaseSummary,
  MriConcept,
  QuizQuestion,
  QuizSubmitResult,
  StudentCaseResult,
  StudentCaseSubmission,
  StudentChatResponse,
  StudentProgressData,
  TumorCurriculumItem,
  QuizCategory,
  ExamStartResponse,
  ExamEventLogResponse,
  ExamSubmitResult,
  VivaTopic,
  VivaQuestion,
  VivaEvaluateResponse,
  PresentationSection,
} from '../types/student';
import {
  AuthResponse,
  AuthUser,
  GoogleAuthRequest,
  LoginCredentials,
  OtpSendResponse,
  OtpVerifyRequest,
  RegisterData,
} from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds timeout threshold
});

// Request interceptor to inject Authorization Bearer token
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('axonova_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore localStorage access issues
  }
  return config;
});

// Interceptor for friendly, actionable error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: any; message?: string }>) => {
    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      return Promise.reject(
        new Error(
          'Neural analysis timed out. The server is taking longer than expected. Please retry with a standard Brain MRI slice.'
        )
      );
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      return Promise.reject(
        new Error(
          `AXONOVA backend is unavailable. Unable to connect to the server at ${API_BASE_URL}. Please ensure the backend is running.`
        )
      );
    }

    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data.detail === 'string') {
        return Promise.reject(new Error(data.detail));
      } else if (data.detail && typeof data.detail === 'object') {
        const msg = (data.detail as any).message || (data.detail as any).error || JSON.stringify(data.detail);
        return Promise.reject(new Error(msg));
      } else if (typeof data.message === 'string') {
        return Promise.reject(new Error(data.message));
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  getHealth: async (): Promise<HealthResponse> => {
    const res = await apiClient.get<HealthResponse>('/health');
    return res.data;
  },

  getTasks: async (): Promise<TaskInfo[]> => {
    const res = await apiClient.get<TaskInfo[]>('/tasks');
    return res.data;
  },

  getTask: async (taskId: string): Promise<TaskInfo> => {
    const res = await apiClient.get<TaskInfo>(`/tasks/${taskId}`);
    return res.data;
  },

  getTaskModelInfo: async (taskId: string): Promise<ModelInfoResponse> => {
    const res = await apiClient.get<ModelInfoResponse>(`/tasks/${taskId}/model-info`);
    return res.data;
  },

  getTaskEvaluation: async (taskId: string): Promise<EvaluationResponse> => {
    const res = await apiClient.get<EvaluationResponse>(`/tasks/${taskId}/evaluation`);
    return res.data;
  },

  getTaskDatasetInfo: async (taskId: string): Promise<DatasetInfoResponse> => {
    const res = await apiClient.get<DatasetInfoResponse>(`/tasks/${taskId}/dataset-info`);
    return res.data;
  },

  getModelInfo: async (): Promise<ModelInfoResponse> => {
    const res = await apiClient.get<ModelInfoResponse>('/model-info');
    return res.data;
  },

  getEvaluation: async (): Promise<EvaluationResponse> => {
    const res = await apiClient.get<EvaluationResponse>('/evaluation');
    return res.data;
  },

  getDatasetInfo: async (): Promise<DatasetInfoResponse> => {
    const res = await apiClient.get<DatasetInfoResponse>('/dataset-info');
    return res.data;
  },

  getSampleScans: async (): Promise<{ samples: SampleScan[] }> => {
    const res = await apiClient.get<{ samples: SampleScan[] }>('/sample-scans');
    return res.data;
  },

  predictScan: async (
    file: File,
    scanType: ScanType,
    orientation: ScanOrientation
  ): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scan_type', scanType);
    formData.append('orientation', orientation);

    const res = await apiClient.post<PredictionResponse>('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  predictTaskScan: async (
    taskId: string,
    file: File,
    scanType: ScanType,
    orientation: ScanOrientation
  ): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scan_type', scanType);
    formData.append('orientation', orientation);

    const res = await apiClient.post<PredictionResponse>(`/tasks/${taskId}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Student Learning Module APIs
  getMriConcepts: async (): Promise<MriConcept[]> => {
    const res = await apiClient.get<MriConcept[]>('/student/concepts');
    return res.data;
  },

  getStudentCases: async (): Promise<CaseSummary[]> => {
    const res = await apiClient.get<CaseSummary[]>('/student/cases');
    return res.data;
  },

  getStudentCase: async (caseId: string): Promise<CaseDetail> => {
    const res = await apiClient.get<CaseDetail>(`/student/cases/${caseId}`);
    return res.data;
  },

  submitStudentCase: async (
    caseId: string,
    submission: StudentCaseSubmission
  ): Promise<StudentCaseResult> => {
    const res = await apiClient.post<StudentCaseResult>(
      `/student/cases/${caseId}/submit`,
      submission
    );
    return res.data;
  },

  chatStudentAssistant: async (
    message: string,
    caseId?: string,
    hintLevel: number = 0
  ): Promise<StudentChatResponse> => {
    const res = await apiClient.post<StudentChatResponse>('/student/chat', {
      message,
      case_id: caseId,
      hint_level: hintLevel,
    });
    return res.data;
  },

  getTumorCurriculum: async (): Promise<{
    supported_classes: string[];
    curriculum: Record<string, TumorCurriculumItem>;
    disclaimer: string;
  }> => {
    const res = await apiClient.get<{
      supported_classes: string[];
      curriculum: Record<string, TumorCurriculumItem>;
      disclaimer: string;
    }>('/student/tumors');
    return res.data;
  },

  getQuizzes: async (): Promise<QuizQuestion[]> => {
    const res = await apiClient.get<QuizQuestion[]>('/student/quizzes');
    return res.data;
  },

  submitQuizAnswer: async (
    questionId: string,
    selectedIndex: number
  ): Promise<QuizSubmitResult> => {
    const res = await apiClient.post<QuizSubmitResult>('/student/quizzes/submit', {
      question_id: questionId,
      selected_index: selectedIndex,
    });
    return res.data;
  },

  getStudentProgress: async (): Promise<StudentProgressData> => {
    const res = await apiClient.get<StudentProgressData>('/student/progress');
    return res.data;
  },

  // --- Secure Exam & Anti-Cheating APIs ---
  getQuizCategories: async (): Promise<{ categories: QuizCategory[]; total_questions: number }> => {
    const res = await apiClient.get<{ categories: QuizCategory[]; total_questions: number }>('/student/quizzes/categories');
    return res.data;
  },

  startExam: async (params: {
    student_id?: string;
    category?: string;
    difficulty?: string;
    num_questions?: number;
    duration_minutes?: number;
  }): Promise<ExamStartResponse> => {
    const res = await apiClient.post<ExamStartResponse>('/student/quizzes/exam/start', {
      student_id: params.student_id || 'med-student-01',
      category: params.category || 'All',
      difficulty: params.difficulty || 'All',
      num_questions: params.num_questions || 10,
      duration_minutes: params.duration_minutes || 15,
    });
    return res.data;
  },

  logExamEvent: async (params: {
    attempt_id: string;
    event_type: string;
    timestamp: string;
    details?: Record<string, any>;
  }): Promise<ExamEventLogResponse> => {
    const res = await apiClient.post<ExamEventLogResponse>('/student/quizzes/exam/log-event', params);
    return res.data;
  },

  submitExam: async (params: {
    attempt_id: string;
    answers: Record<string, number>;
  }): Promise<ExamSubmitResult> => {
    const res = await apiClient.post<ExamSubmitResult>('/student/quizzes/exam/submit', params);
    return res.data;
  },

  // --- AI Viva Coach APIs ---
  getVivaTopics: async (): Promise<{ topics: VivaTopic[] }> => {
    const res = await apiClient.get<{ topics: VivaTopic[] }>('/student/viva/topics');
    return res.data;
  },

  getVivaQuestions: async (category?: string): Promise<{ questions: VivaQuestion[]; total_questions: number; disclaimer: string }> => {
    const res = await apiClient.get<{ questions: VivaQuestion[]; total_questions: number; disclaimer: string }>(
      '/student/viva/questions',
      { params: category && category !== 'All' ? { category } : {} }
    );
    return res.data;
  },

  evaluateViva: async (params: {
    question_id: string;
    question: string;
    category: string;
    student_answer: string;
  }): Promise<VivaEvaluateResponse> => {
    const res = await apiClient.post<VivaEvaluateResponse>('/student/viva/evaluate', params);
    return res.data;
  },

  getVivaPresentation: async (): Promise<{ title: string; sections: PresentationSection[]; disclaimer: string }> => {
    const res = await apiClient.get<{ title: string; sections: PresentationSection[]; disclaimer: string }>('/student/viva/presentation');
    return res.data;
  },

  // Authentication APIs
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('axonova_auth_token', res.data.token);
    }
    return res.data;
  },

  sendOtp: async (phone: string, role?: string): Promise<OtpSendResponse> => {
    const res = await apiClient.post<OtpSendResponse>('/auth/send-otp', {
      phone,
      role,
    });
    return res.data;
  },

  verifyOtp: async (req: OtpVerifyRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/verify-otp', req);
    if (res.data.token) {
      localStorage.setItem('axonova_auth_token', res.data.token);
    }
    return res.data;
  },

  googleAuth: async (req: GoogleAuthRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/google', req);
    if (res.data.token) {
      localStorage.setItem('axonova_auth_token', res.data.token);
    }
    return res.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('axonova_auth_token', res.data.token);
    }
    return res.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await apiClient.get<AuthUser>('/auth/me');
    return res.data;
  },

  forgotPassword: async (email: string): Promise<{ configured: boolean; message: string; detail?: string }> => {
    const res = await apiClient.post<{ configured: boolean; message: string; detail?: string }>('/auth/forgot-password', { email });
    return res.data;
  },

  logoutUser: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network or token expiration errors during logout
    } finally {
      localStorage.removeItem('axonova_auth_token');
      localStorage.removeItem('axonova_auth_user');
      localStorage.removeItem('axonova_user_profile');
      localStorage.removeItem('axonova_active_role');
    }
  },

  getCatalog: async (params?: { category?: string; availability?: string; search?: string }): Promise<{ total_count: number; catalog_size: number; conditions: CatalogCondition[]; disclaimer: string }> => {
    const res = await apiClient.get('/catalog', { params });
    return res.data;
  },

  getCondition: async (conditionId: string): Promise<CatalogCondition> => {
    const res = await apiClient.get<CatalogCondition>(`/catalog/${conditionId}`);
    return res.data;
  },

  getModelRegistry: async (): Promise<{ models_count: number; registry: ModelRegistryEntry[]; disclaimer: string }> => {
    const res = await apiClient.get('/models/registry');
    return res.data;
  },

  matchScan: async (conditionId?: string, sequence?: string, orientation?: string): Promise<MatchScanResponse> => {
    const formData = new FormData();
    if (conditionId) formData.append('condition_id', conditionId);
    if (sequence) formData.append('sequence', sequence);
    if (orientation) formData.append('orientation', orientation);
    const res = await apiClient.post<MatchScanResponse>('/catalog/match-scan', formData);
    return res.data;
  },

  checkScanQuality: async (file: File, sequence?: string, orientation?: string): Promise<QualityCheckResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (sequence) formData.append('sequence', sequence);
    if (orientation) formData.append('orientation', orientation);
    const res = await apiClient.post<QualityCheckResponse>('/scans/quality-check', formData);
    return res.data;
  },

  uploadMri: async (
    file: File,
    scanType: string = 'MRI',
    sequence?: string,
    orientation?: string,
    targetCondition?: string
  ): Promise<MriUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scan_type', scanType);
    if (sequence) formData.append('sequence', sequence);
    if (orientation) formData.append('orientation', orientation);
    if (targetCondition) formData.append('target_condition', targetCondition);
    const res = await apiClient.post<MriUploadResponse>('/mri/upload', formData);
    return res.data;
  },

  analyzeMri: async (
    file: File,
    scanType: string = 'MRI',
    sequence?: string,
    orientation?: string,
    targetCondition?: string,
    caseId?: string,
    requestedModelId?: string
  ): Promise<MriAnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scan_type', scanType);
    if (sequence) formData.append('sequence', sequence);
    if (orientation) formData.append('orientation', orientation);
    if (targetCondition) formData.append('target_condition', targetCondition);
    if (caseId) formData.append('case_id', caseId);
    if (requestedModelId) formData.append('requested_model_id', requestedModelId);
    const res = await apiClient.post<MriAnalysisResponse>('/mri/analyze', formData);
    return res.data;
  },

  getMriResult: async (caseId: string): Promise<RadiologyReportData> => {
    const res = await apiClient.get<RadiologyReportData>(`/mri/result/${caseId}`);
    return res.data;
  },

  getRegistryModels: async (): Promise<any[]> => {
    const res = await apiClient.get<any[]>('/models');
    return res.data;
  },

  getRegistryModelDetail: async (modelId: string): Promise<any> => {
    const res = await apiClient.get<any>(`/models/${modelId}`);
    return res.data;
  },

  getRadiologyReport: async (caseId: string): Promise<RadiologyReportData> => {
    const res = await apiClient.get<RadiologyReportData>(`/report/${caseId}`);
    return res.data;
  },

  reviewReport: async (caseId: string, reviewData: ClinicianReviewPayload): Promise<{ status: string; case_id: string; review_status: string; reviewed_by: string; report: RadiologyReportData }> => {
    const res = await apiClient.post(`/report/${caseId}/review`, reviewData);
    return res.data;
  },
};


