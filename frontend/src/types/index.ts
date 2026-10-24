export type ScanType = 'MRI' | 'CT' | 'X-ray';
export type ScanOrientation = 'Axial' | 'Coronal' | 'Sagittal' | 'Not specified';
export type TaskStatus = 'ready' | 'setup_required' | 'coming_later';

export interface TaskSetupGuide {
  recommended_datasets: string[];
  required_sequences: string[];
  split_policy: string;
  target_classes: string[];
  expected_model_path: string;
  expected_dataset_dir: string;
  data_leakage_risks: string[];
  setup_steps: string[];
}

export interface TaskInfo {
  task_id: string;
  name: string;
  short_title: string;
  category: string;
  status: TaskStatus;
  tagline: string;
  description: string;
  supported_scan_types: string[];
  required_sequences: string[];
  supported_orientations: string[];
  supported_formats: string[];
  class_labels: string[];
  model_loaded: boolean;
  model_name?: string | null;
  model_version?: string | null;
  input_shape?: number[] | null;
  trainable_parameters?: number | null;
  evaluation_available: boolean;
  overall_accuracy?: number | null;
  limitations: string[];
  disclaimer: string;
  setup_guide?: TaskSetupGuide | null;
}

export interface ClassScore {
  class_name: string;
  score: number;
  percentage: number;
}

export interface PredictionResponse {
  task_id?: string;
  task_name?: string;
  predicted_category: string;
  model_score: number;
  score_label: string;
  per_class_scores: ClassScore[];
  filename: string;
  scan_type: string;
  orientation_label: string;
  model_name: string;
  model_version: string;
  gradcam_available: boolean;
  gradcam_image_base64: string | null;
  gradcam_explanation: string | null;
  uncertainty_notice: string | null;
  supporting_features?: Array<{ name: string; desc: string }>;
  clinical_assessment_summary?: string | null;
  timeline?: CaseTimelineEvent[];
  limitations?: string[];
  case_id?: string;
  status?: string;
  is_indeterminate?: boolean;
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  api_version: string;
  model_loaded: boolean;
  model_name: string | null;
  supported_scan_types: string[];
  disabled_scan_types: string[];
  supported_image_formats: string[];
  max_upload_size_mb: number;
  disclaimer: string;
  active_tasks_count?: number;
  total_tasks_count?: number;
}

export interface ModelInfoResponse {
  loaded: boolean;
  model_name: string | null;
  model_version: string | null;
  input_shape: number[] | null;
  supported_classes: string[];
  supported_scan_type: string;
  training_status: string;
  evaluation_available: boolean;
  architecture_summary: string | null;
  layer_count: number | null;
  trainable_parameters: number | null;
  trained_at: string | null;
  disclaimer: string;
}

export interface EvaluationResponse {
  evaluated: boolean;
  model_name?: string;
  model_version?: string;
  evaluated_at?: string;
  dataset_split?: string;
  test_images_count?: number;
  overall_accuracy?: number;
  per_class_metrics?: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
  }>;
  confusion_matrix?: {
    matrix: number[][];
    classes: string[];
  };
  training_history?: Record<string, number[]>;
  metric_interpretations?: Record<string, string>;
  disclaimer: string;
}

export interface DatasetInfoResponse {
  available: boolean;
  dataset_name: string;
  source: string;
  license_terms?: string;
  folder_layout?: string;
  class_distribution: Record<string, number>;
  split_counts: Record<string, number>;
  total_images: number;
  input_resolution?: string;
  color_mode?: string;
  normalization?: string;
  disclaimer: string;
  task_id?: string;
  setup_guide?: TaskSetupGuide;
}

export interface ScanGalleryItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  orientation: ScanOrientation;
  scanType: ScanType;
}

export interface SessionHistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  previewUrl: string;
  prediction: PredictionResponse;
}

export interface SampleScan {
  id: string;
  category: string;
  title: string;
  description: string;
  filename: string;
  orientation: ScanOrientation;
  scan_type: ScanType;
  static_url: string;
}

export type ModelAvailabilityStatus =
  | 'Available'
  | 'In Development'
  | 'Needs Validation'
  | 'Not Available'
  | 'Not Assessed'
  | 'Not Suitable for This Scan';

export type SafeResultState =
  | 'Analysis Complete'
  | 'Indeterminate'
  | 'Not Assessed'
  | 'Image Quality Issue'
  | 'Unsupported File or Sequence'
  | 'Analysis Error';

export interface CatalogCondition {
  id: string;
  name: string;
  category: string;
  category_key: string;
  description: string;
  relevant_sequences: string[];
  model_availability: ModelAvailabilityStatus;
  model_id: string | null;
  imaging_notes: string;
  clinical_caveats: string;
}

export interface ModelRegistryEntry {
  model_id: string;
  name: string;
  version: string;
  task_id: string;
  task_type: string;
  description: string;
  supported_conditions: string[];
  supported_sequences: string[];
  supported_orientations: string[];
  required_dimensions: number[];
  supported_formats: string[];
  output_classes: string[];
  validation_accuracy: number;
  validation_metric_label: string;
  gradcam_supported: boolean;
  status: ModelAvailabilityStatus;
  limitations: string[];
}

export interface QualityCheckResponse {
  verdict: 'pass' | 'warning' | 'fail';
  status: string;
  passed: boolean;
  filename: string;
  dimensions: { width: number; height: number };
  metrics: {
    mean_luminance: number;
    contrast_std: number;
    dynamic_range: number;
    sharpness_score: number;
  };
  warnings: string[];
  message: string;
}

export interface MatchScanResponse {
  matched: boolean;
  status: ModelAvailabilityStatus;
  condition_name?: string;
  model_name?: string;
  uploaded_sequence?: string;
  required_sequences?: string[];
  message: string;
  compatible_model: ModelRegistryEntry | null;
}

export interface MriUploadResponse {
  status: string;
  case_id: string;
  filename: string;
  file_size_bytes: number;
  dimensions: [number, number];
  format_detected: string;
  modality: string;
  sequence: string;
  orientation: string;
  quality_metrics: {
    sharpness_variance: number;
    contrast_std: number;
    mean_luminance: number;
    dynamic_range: number;
    quality_verdict: string;
    quality_warning?: string;
    is_acceptable: boolean;
  };
  compatible_models: Array<{
    model_id: string;
    model_name: string;
    status: string;
    is_available: boolean;
    task: string;
  }>;
  message: string;
}

export interface MriAnalysisResponse {
  status: 'completed' | 'indeterminate' | 'not_connected' | 'not_assessed' | 'unsupported' | 'analysis_error' | 'validation_error';
  model: string;
  model_version?: string;
  prediction: string | null;
  confidence: number;
  supported: boolean;
  is_indeterminate?: boolean;
  case_id: string;
  message: string;
  class_scores?: Array<{
    class_name: string;
    score: number;
    percentage: number;
  }>;
  explainability?: {
    supported: boolean;
    method?: string;
    heatmap_base64?: string | null;
    overlay_base64?: string | null;
    target_class?: string | null;
    explanation?: string;
  };
    review?: {
      status: 'PENDING_REVIEW' | 'REVIEWED';
      status_label: string;
      reviewed_by: string | null;
      reviewer_title: string | null;
      reviewer_license: string | null;
      reviewed_at: string | null;
      decision: string | null;
      clinical_notes: string | null;
    };
    timeline?: CaseTimelineEvent[];
    limitations?: string[];
    report?: RadiologyReportData;
    disclaimer?: string;
}

export interface CaseTimelineEvent {
  stage: 'upload' | 'validation' | 'model_routing' | 'inference' | 'explainability' | 'report_creation' | 'professional_review';
  title: string;
  description: string;
  timestamp: string | null;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'SKIPPED' | 'REVIEWED' | 'PENDING_REVIEW';
  elapsed_ms?: number;
  details?: Record<string, any>;
}

export interface RadiologyReportData {
  case_id: string;
  created_at: string;
  patient_reference: string;
  clinical_facility: string;
  clinical_indication: string;
  examination: {
    study_type: string;
    filename: string;
    modality: string;
    sequence: string;
    plane: string;
    dimensions: [number | string, number | string];
    quality_metrics?: Record<string, any>;
  };
  ai_findings: {
    status: string;
    model_name: string;
    model_version: string;
    task: string;
    primary_finding: string | null;
    confidence_score: number;
    confidence_percentage: number;
    per_class_scores: Array<{
      class_name: string;
      score: number;
      percentage: number;
    }>;
    explainability: {
      supported: boolean;
      method?: string;
      heatmap_base64?: string | null;
      overlay_base64?: string | null;
      explanation?: string;
    };
  };
  impression: string;
  conditions_not_assessed: Array<{
    category: string;
    details: string;
  }>;
  limitations: string[];
  review: {
    status: 'PENDING_REVIEW' | 'REVIEWED';
    status_label: string;
    reviewed_by: string | null;
    reviewer_title: string | null;
    reviewer_license: string | null;
    reviewed_at: string | null;
    decision: string | null;
    clinical_notes: string | null;
  };
  timeline?: CaseTimelineEvent[];
  disclaimer: string;
}

export interface ClinicianReviewPayload {
  reviewer_name: string;
  reviewer_title: string;
  reviewer_license?: string;
  decision: 'CONFIRMED' | 'DISAGREE' | 'MODIFIED';
  clinical_notes?: string;
}

export interface BrainAnatomyRegion {
  id: string;
  name: string;
  latinName?: string;
  category: 'Cerebrum' | 'Brainstem' | 'Cerebellum' | 'Diencephalon' | 'Ventricular & CSF' | 'Endocrine & Sella';
  coordinates: { x: number; y: number; z: number };
  color: string;
  summary: string;
  functions: string[];
  mriSignalCharacteristics: {
    t1: string;
    t2: string;
    flair: string;
    dwi: string;
  };
  pathologicalPredilections: string[];
  radiologicalLandmarks: string;
  clinicalNotes: string;
}

export interface MriSequenceInfo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  repetitionTime?: string;
  echoTime?: string;
  clinicalUtility: string;
  appearance: {
    csf: string;
    whiteMatter: string;
    grayMatter: string;
    tumorTissue: string;
    edema: string;
    blood: string;
  };
}

