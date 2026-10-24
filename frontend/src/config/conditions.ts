import { Brain, Layers, Activity, AlertTriangle, Sparkles, LucideIcon } from 'lucide-react';
import { ScanOrientation, ScanType } from '../types';

export type ConditionId = 'brain-tumor' | 'alzheimers' | 'multiple-sclerosis' | 'stroke' | 'future-research';
export type ConditionStatus = 'active' | 'in_development';
export type ConditionMode = 'implemented' | 'in_development';

export interface EducationalOverview {
  summary: string;
  clinicalContext: string;
  imagingSignatures: string[];
  researchQuestions: string[];
}

export interface ConditionSample {
  category: string;
  title: string;
  filename: string;
  orientation: ScanOrientation;
  scanType: ScanType;
  localUrl: string;
  desc: string;
  clinicalNote: string;
}

export interface ConditionConfig {
  id: ConditionId;
  name: string;
  shortTitle: string;
  category: string;
  status: ConditionStatus;
  mode: ConditionMode;
  modeLabel: string;
  statusBadge: string;
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
  tagline: string;
  description: string;
  supportedScanTypes: string[];
  requiredSequences: string[];
  supportedOrientations: string[];
  supportedFormats: string[];
  classLabels: string[];
  modelLoaded: boolean;
  modelName: string;
  modelVersion: string;
  trainableParameters: number;
  overallAccuracy: number | null;
  accuracyDisplay: string;
  limitations: string[];
  educationalOverview: EducationalOverview;
  recommendedDatasets: string[];
  splitPolicy: string;
  samples: ConditionSample[];
}

export const CONDITIONS: ConditionConfig[] = [
  {
    id: 'brain-tumor',
    name: 'Brain Tumor MRI Classification',
    shortTitle: 'Brain Tumor',
    category: 'Neuro-Oncology',
    status: 'active',
    mode: 'implemented',
    modeLabel: 'AI Assessment Available',
    statusBadge: '● SUPPORTED (Trained & Evaluated)',
    icon: Brain,
    iconColor: 'text-teal-400',
    accentColor: 'teal',
    tagline: 'Deep learning classification of Glioma, Meningioma, Pituitary, or Normal Brain tissue',
    description:
      'Trained deep convolutional neural network for automated classification of primary brain tumors. Evaluates axial, coronal, and sagittal T1 post-contrast sequences with integrated Grad-CAM explainability.',
    supportedScanTypes: ['MRI'],
    requiredSequences: ['T1-weighted Contrast-Enhanced', 'T2-weighted', 'FLAIR'],
    supportedOrientations: ['Axial', 'Coronal', 'Sagittal'],
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    classLabels: ['Glioma', 'Meningioma', 'Pituitary Tumor', 'No Tumor / Normal'],
    modelLoaded: true,
    modelName: 'axonova_brain_mri_best.keras',
    modelVersion: 'CNN v1.0 (TensorFlow/Keras)',
    trainableParameters: 304932,
    overallAccuracy: 0.975,
    accuracyDisplay: '97.5% Accuracy (Held-out Test Split)',
    limitations: [
      'Inference model trained specifically on structural T1/T2 MRI slices; not validated for non-MRI modalities.',
      'Classification outputs must be correlated with histopathological confirmation and clinical neuro-oncology assessment.',
      'Academic research prototype: Outputs are not medical diagnoses and must not be used for clinical decision-making.',
    ],
    educationalOverview: {
      summary:
        'Comprehensive multi-class neuro-oncology model differentiating the three most common primary brain tumor classes from normal brain architecture.',
      clinicalContext:
        'Accurate preoperative identification of tumor subtype directs surgical approach (e.g. transsphenoidal hypophysectomy for pituitary adenomas vs. craniotomy with maximal safe resection for high-grade gliomas).',
      imagingSignatures: [
        'Glioma: Infiltrative, heterogeneous T1 post-contrast enhancement with surrounding non-enhancing vasogenic edema.',
        'Meningioma: Extra-axial, sharply circumscribed mass with intense homogeneous contrast enhancement and dural tail sign.',
        'Pituitary Tumor: Sellar mass expanding into the suprasellar cistern, causing optic chiasm compression.',
        'Normal Baseline: Symmetrical ventricles, preserved gray-white differentiation, and absence of mass effect.',
      ],
      researchQuestions: [
        'How does spatial resolution variation impact transfer learning feature representations in deep residual layers?',
        'Can Grad-CAM attention maps reliably correlate with histological tumor margins identified by intraoperative neuropathology?',
      ],
    },
    recommendedDatasets: [
      'Figshare Brain Tumor Dataset (Cheng et al., 3,064 scans)',
      'BraTS (Brain Tumor Image Segmentation Benchmark)',
      'Harvard Whole Brain Atlas',
    ],
    splitPolicy: 'Strict patient/subject split: No overlapping patient sessions between training, validation, and held-out test splits.',
    samples: [
      {
        category: 'Glioma',
        title: 'Glioma Brain MRI Scan',
        filename: 'glioma_sample_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/glioma_sample_axial.jpg',
        desc: 'Representative axial slice with infiltrative hyperintense tissue',
        clinicalNote: 'Heterogeneous contrast enhancement with vasogenic edema boundary in right frontal lobe.',
      },
      {
        category: 'Meningioma',
        title: 'Meningioma Brain MRI Scan',
        filename: 'meningioma_sample_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/meningioma_sample_axial.jpg',
        desc: 'Extra-axial dural attachment pattern',
        clinicalNote: 'Circumscribed hemispherical dural mass with hyperostosis and homogeneous contrast uptake.',
      },
      {
        category: 'Pituitary',
        title: 'Pituitary Region Scan',
        filename: 'pituitary_sample_coronal.jpg',
        orientation: 'Coronal',
        scanType: 'MRI',
        localUrl: '/samples/pituitary_sample_coronal.jpg',
        desc: 'Coronal slice through sellar/pituitary region',
        clinicalNote: 'Intrasellar mass with suprasellar cistern extension towards the optic chiasm.',
      },
      {
        category: 'No_Tumor',
        title: 'Normal Brain MRI Scan',
        filename: 'notumor_sample_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/notumor_sample_axial.jpg',
        desc: 'Symmetrical baseline ventricular morphology',
        clinicalNote: 'Preserved gray-white differentiation with no midline shift or focal mass effect.',
      },
    ],
  },
  {
    id: 'alzheimers',
    name: 'Alzheimer’s Disease MRI Classification',
    shortTitle: 'Alzheimer’s Disease',
    category: 'Neurodegenerative Disorder',
    status: 'in_development',
    mode: 'in_development',
    modeLabel: 'Model Under Development',
    statusBadge: '○ IN DEVELOPMENT (Weights Pending)',
    icon: Layers,
    iconColor: 'text-amber-400',
    accentColor: 'amber',
    tagline: 'Structural T1-weighted MPRAGE volumetric analysis for medial temporal & hippocampal atrophy',
    description:
      'Demonstrates deep learning approaches to identifying neurodegenerative patterns and progressive volumetric reduction in structural brain MRI. Emphasizes medial temporal lobe and hippocampal biomarkers.',
    supportedScanTypes: ['MRI'],
    requiredSequences: ['3D T1-weighted MPRAGE', 'High-Resolution Coronal T1'],
    supportedOrientations: ['Coronal', 'Sagittal', 'Axial'],
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    classLabels: ['Cognitively Normal (CN)', 'Mild Cognitive Impairment (MCI)', 'Alzheimer’s Disease (AD)'],
    modelLoaded: false,
    modelName: 'None (Checkpoint Required)',
    modelVersion: '0.1.0-dev',
    trainableParameters: 0,
    overallAccuracy: null,
    accuracyDisplay: 'In Development (Model & Dataset Required)',
    limitations: [
      'Model not currently available. This condition is under development.',
      'Clinical diagnosis of Alzheimer’s requires comprehensive neuropsychological testing, amyloid/tau PET, and CSF biomarkers.',
      'Academic research prototype: Outputs are not medical diagnoses and must not be used for clinical decision-making.',
    ],
    educationalOverview: {
      summary:
        'Focuses on neurodegenerative structural biomarkers including entorhinal cortex thinning, hippocampal volume reduction, and ventricular enlargement.',
      clinicalContext:
        'Early detection of Mild Cognitive Impairment (MCI) before irreversible neocortical neurodegeneration is the cornerstone of disease-modifying therapeutic trials.',
      imagingSignatures: [
        'Hippocampal Atrophy: Progressive loss of volume in the CA1-CA3 subfields and dentate gyrus visible on coronal T1.',
        'Entorhinal Cortex Thinning: Early cortical thinning in the medial temporal lobe prior to overt hippocampal loss.',
        'Ventricular Enlargement (Ex Vacuo): Secondary enlargement of the temporal horns of the lateral ventricles.',
        'Parietal/Temporal Cortical Thinning: Widening of cerebral sulci with preserved motor and sensory strips.',
      ],
      researchQuestions: [
        'What cross-sectional slice representations best correlate with longitudinal MMSE score declines?',
        'How can subject-level cross-validation prevent leakage across multi-session baseline and follow-up scans?',
      ],
    },
    recommendedDatasets: [
      'Alzheimer\'s Disease Neuroimaging Initiative (ADNI) - adni.loni.usc.edu',
      'Open Access Series of Imaging Studies (OASIS-1 / OASIS-3) - oasis-brains.org',
      'AIBL Flagship Study of Ageing',
    ],
    splitPolicy: 'Strict subject-level partition: All longitudinal sessions and slices from any subject are isolated to either train or test.',
    samples: [
      {
        category: 'AD',
        title: 'Alzheimer’s Disease (Severe Atrophy)',
        filename: 'ad_severe_coronal.jpg',
        orientation: 'Coronal',
        scanType: 'MRI',
        localUrl: '/samples/ad_severe_coronal.jpg',
        desc: 'Pronounced bilateral hippocampal volume loss and dilated temporal horns',
        clinicalNote: 'Ex-vacuo hydrocephalus and widening of choroid fissures bilaterally consistent with advanced AD pattern.',
      },
      {
        category: 'MCI',
        title: 'Mild Cognitive Impairment (MCI)',
        filename: 'ad_mci_coronal.jpg',
        orientation: 'Coronal',
        scanType: 'MRI',
        localUrl: '/samples/ad_mci_coronal.jpg',
        desc: 'Moderate medial temporal lobe atrophy with entorhinal cortical thinning',
        clinicalNote: 'Subtle temporal horn dilation with preserved global cortical volume.',
      },
      {
        category: 'CN',
        title: 'Cognitively Normal Control',
        filename: 'ad_control_coronal.jpg',
        orientation: 'Coronal',
        scanType: 'MRI',
        localUrl: '/samples/ad_control_coronal.jpg',
        desc: 'Preserved hippocampal volume and snug temporal horns',
        clinicalNote: 'Symmetric medial temporal structures without focal atrophy.',
      },
    ],
  },
  {
    id: 'multiple-sclerosis',
    name: 'Multiple Sclerosis MRI Analysis',
    shortTitle: 'Multiple Sclerosis',
    category: 'Demyelinating Disease',
    status: 'in_development',
    mode: 'in_development',
    modeLabel: 'Model Under Development',
    statusBadge: '○ IN DEVELOPMENT (Weights Pending)',
    icon: Activity,
    iconColor: 'text-rose-400',
    accentColor: 'rose',
    tagline: 'FLAIR & T2 hyperintense demyelinating plaque detection & McDonald criteria lesion distribution',
    description:
      'Demonstrates automated spatial mapping of periventricular, juxtacortical, and infratentorial demyelinating lesions. Emphasizes dissemination in space (DIS) and time (DIT) criteria.',
    supportedScanTypes: ['MRI'],
    requiredSequences: ['Axial T2-FLAIR', 'Sagittal 3D FLAIR', 'Dual-Echo Proton Density'],
    supportedOrientations: ['Axial', 'Sagittal'],
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    classLabels: ['Periventricular Plaque', 'Juxtacortical / Infratentorial', 'Normal White Matter'],
    modelLoaded: false,
    modelName: 'None (Checkpoint Required)',
    modelVersion: '0.1.0-dev',
    trainableParameters: 0,
    overallAccuracy: null,
    accuracyDisplay: 'In Development (Model & Dataset Required)',
    limitations: [
      'Model not currently available. This condition is under development.',
      'Demyelinating plaque quantification requires dual-sequence FLAIR and contrast T1 to assess dissemination in time.',
      'Small vessel ischemic white matter hyperintensities (Fazekas scale) frequently confound automated lesion segmentation.',
      'Academic research prototype: Outputs are not medical diagnoses and must not be used for clinical decision-making.',
    ],
    educationalOverview: {
      summary:
        'Explores autoimmune inflammatory demyelination of central nervous system white matter tracts adhering to McDonald 2017 diagnostic criteria.',
      clinicalContext:
        'Quantifying lesion burden and identifying new gadolinium-enhancing lesions guides disease-modifying therapy (DMT) escalation.',
      imagingSignatures: [
        'Dawson Fingers: Ovoid demyelinating plaques perpendicular to the lateral ventricles along medullary venules.',
        'Juxtacortical Lesions: Direct abutment of the subcortical U-fibers and cerebral cortex on FLAIR.',
        'Infratentorial Plaques: Hyperintense focus within the pons, middle cerebellar peduncles, or medulla.',
        'Black Holes: Chronic, non-enhancing hypointense T1 lesions representing irreversible axonal destruction.',
      ],
      researchQuestions: [
        'Can 3D U-Net segmentation reliably delineate confluent periventricular plaques from isolated punctate foci?',
        'How does non-uniform magnetic field bias field correction affect multi-site lesion volume quantifications?',
      ],
    },
    recommendedDatasets: [
      'ISBI 2015 Longitudinal MS Lesion Segmentation Challenge',
      'MICCAI 2016 MS Lesion Segmentation Benchmark',
      'MSD Task01',
    ],
    splitPolicy: 'Strict scanner and subject-level split: Training and testing cohorts separated by patient ID and clinical institution.',
    samples: [
      {
        category: 'Periventricular',
        title: 'Periventricular Plaque (Dawson Fingers)',
        filename: 'ms_periventricular_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/ms_periventricular_axial.jpg',
        desc: 'Ovoid FLAIR hyperintensities perpendicular to lateral ventricle body',
        clinicalNote: 'Classic Dawson\'s fingers along deep medullary venules fulfilling spatial dissemination criteria.',
      },
      {
        category: 'Juxtacortical',
        title: 'Juxtacortical / Subcortical Plaque',
        filename: 'ms_juxtacortical_sagittal.jpg',
        orientation: 'Sagittal',
        scanType: 'MRI',
        localUrl: '/samples/ms_juxtacortical_sagittal.jpg',
        desc: 'Callosal-septal interface demyelinating hyperintensities on sagittal FLAIR',
        clinicalNote: 'Discrete callosal lesions abutting the undersurface of the corpus callosum.',
      },
      {
        category: 'Normal_WM',
        title: 'Normal White Matter Baseline',
        filename: 'ms_control_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/ms_control_axial.jpg',
        desc: 'Homogeneous parenchymal white matter without focal hyperintensity',
        clinicalNote: 'Intact myelinated white matter tracts with preserved internal capsule signal.',
      },
    ],
  },
  {
    id: 'stroke',
    name: 'Stroke Assessment MRI Analysis',
    shortTitle: 'Stroke Assessment',
    category: 'Cerebrovascular Disease',
    status: 'in_development',
    mode: 'in_development',
    modeLabel: 'Model Under Development',
    statusBadge: '○ IN DEVELOPMENT (Weights Pending)',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    accentColor: 'cyan',
    tagline: 'Diffusion-Weighted Imaging (DWI) & ADC map ischemia detection within hyperacute windows',
    description:
      'Demonstrates rapid evaluation of cytotoxic edema using paired DWI hyperintensity and ADC hypointensity, highlighting the time-critical hyperacute therapeutic window.',
    supportedScanTypes: ['MRI'],
    requiredSequences: ['Diffusion-Weighted Imaging (DWI)', 'Apparent Diffusion Coefficient (ADC)', 'T2-FLAIR'],
    supportedOrientations: ['Axial'],
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    classLabels: ['Acute Ischemic Infarction', 'Subacute Infarction', 'Normal Perfusion Baseline'],
    modelLoaded: false,
    modelName: 'None (Checkpoint Required)',
    modelVersion: '0.1.0-dev',
    trainableParameters: 0,
    overallAccuracy: null,
    accuracyDisplay: 'In Development (Model & Dataset Required)',
    limitations: [
      'Model not currently available. This condition is under development.',
      'Emergency stroke triage must be guided by immediate non-contrast CT/CTA or direct clinical thrombolysis protocols.',
      'T2 shine-through artifact on DWI must always be cross-referenced with quantitative ADC map hypointensity.',
      'Academic research prototype: Outputs are not medical diagnoses and must not be used for clinical decision-making.',
    ],
    educationalOverview: {
      summary:
        'Illustrates the physical principles of restricted Brownian motion of water molecules during cytotoxic edema in acute cerebral infarction.',
      clinicalContext:
        'Determining DWI-FLAIR mismatch enables identification of stroke onset within the thrombolysis/thrombectomy treatment window.',
      imagingSignatures: [
        'DWI Hyperintensity: Bright signal indicating restricted intracellular water diffusion due to cytotoxic cell swelling.',
        'ADC Hypointensity: Corresponding dark signal on Apparent Diffusion Coefficient map confirming genuine restricted diffusion.',
        'DWI-FLAIR Mismatch: Evident DWI lesion without parenchymal FLAIR hyperintensity signifies hyperacute stroke (< 4.5 hours).',
        'Vascular Territory Distribution: Lesions conforming to MCA, ACA, PCA, or basilar artery territorial boundaries.',
      ],
      researchQuestions: [
        'How can dual-input DWI/ADC neural networks filter out T2 shine-through artifacts without false positive triggers?',
        'Can penumbral volumetric estimation from multiparametric MRI predict clinical outcomes following endovascular thrombectomy?',
      ],
    },
    recommendedDatasets: [
      'ISLES 2022 (Ischemic Stroke Lesion Segmentation Challenge)',
      'ATLAS (Anatomical Tracings of Lesions After Stroke) v2.0',
      'Kaggle Brain Ischemia DWI Multicenter Research Corpus',
    ],
    splitPolicy: 'Strict subject and onset-time partition: Ensures acute, subacute, and chronic scans from same subjects are not leaked.',
    samples: [
      {
        category: 'Acute_Stroke',
        title: 'Acute Ischemic Infarction (MCA Territory)',
        filename: 'stroke_acute_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/stroke_acute_axial.jpg',
        desc: 'Marked DWI hyperintensity in left MCA cortical and subcortical territory',
        clinicalNote: 'Acute cytotoxic edema with restricted water diffusion conforming to middle cerebral artery distribution.',
      },
      {
        category: 'Subacute_Stroke',
        title: 'Subacute Infarction with Gyral Swelling',
        filename: 'stroke_subacute_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/stroke_subacute_axial.jpg',
        desc: 'Demarcated cortical infarct with parenchymal edema and gyral effacement',
        clinicalNote: 'Subacute infarction phase with early luxury perfusion and pseudonormalizing ADC signal.',
      },
      {
        category: 'Normal_Stroke',
        title: 'Normal Perfusion Baseline',
        filename: 'stroke_normal_axial.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/stroke_normal_axial.jpg',
        desc: 'Homogeneous parenchymal diffusion signal without acute restriction',
        clinicalNote: 'Symmetric cerebral hemispheres with preserved cortical sulci and no diffusion restriction.',
      },
    ],
  },
  {
    id: 'future-research',
    name: 'Future Neuro-AI Emerging Research',
    shortTitle: 'Future Neuro-AI',
    category: 'Emerging Neurological Assessment',
    status: 'in_development',
    mode: 'in_development',
    modeLabel: 'Research Roadmap',
    statusBadge: '○ RESEARCH ROADMAP',
    icon: Sparkles,
    iconColor: 'text-indigo-400',
    accentColor: 'indigo',
    tagline: 'Diffusion Tensor Imaging (DTI) tractography, fMRI connectivity, and PET-MRI multimodal synthesis',
    description:
      'Long-term architectural research directions including fractional anisotropy tractography for axonal injury and resting-state functional connectome modeling.',
    supportedScanTypes: ['MRI'],
    requiredSequences: ['DTI (32-gradient directions)', 'Resting-State BOLD fMRI', 'Arterial Spin Labeling (ASL)'],
    supportedOrientations: ['Axial', 'Coronal', 'Sagittal'],
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    classLabels: ['Tract Disruption', 'Altered Functional Connectivity', 'Hypoperfusion Core'],
    modelLoaded: false,
    modelName: 'None (Roadmap)',
    modelVersion: '0.1.0-dev',
    trainableParameters: 0,
    overallAccuracy: null,
    accuracyDisplay: 'Research Roadmap (Protocol Specification)',
    limitations: [
      'Model not currently available. This condition is under development.',
      'Advanced research module: Demonstrates high-dimensional tensor connectome feature extraction.',
      'Academic research prototype: Outputs are not medical diagnoses and must not be used for clinical decision-making.',
    ],
    educationalOverview: {
      summary:
        'Explores advanced biophysical MRI modalities extending beyond conventional structural anatomical scans.',
      clinicalContext:
        'Pre-surgical tractography maps corticospinal tracts and arcuate fasciculus to prevent motor and speech deficits.',
      imagingSignatures: [
        'DTI White Matter Tractography: Color-coded directional anisotropy (Red: Left-Right, Green: Anterior-Posterior, Blue: Superior-Inferior).',
        'BOLD Functional Connectivity: Correlated spontaneous low-frequency fluctuations in default mode network (DMN).',
        'ASL Perfusion: Non-contrast cerebral blood flow (CBF) quantification using magnetically labeled arterial blood water.',
      ],
      researchQuestions: [
        'Can graph neural networks directly decode structural connectome alterations prior to detectable clinical symptom onset?',
      ],
    },
    recommendedDatasets: [
      'Human Connectome Project (HCP)',
      'UK Biobank Neuroimaging Cohort',
      'OpenNeuro Multimodal Datasets',
    ],
    splitPolicy: 'Strict cohort isolation and cross-scanner validation.',
    samples: [
      {
        category: 'DTI_Tractography',
        title: 'DTI White Matter Tractography',
        filename: 'future_dti_tractography.jpg',
        orientation: 'Axial',
        scanType: 'MRI',
        localUrl: '/samples/future_dti_tractography.jpg',
        desc: 'Color-coded directional fractional anisotropy tensor representation',
        clinicalNote: 'Transverse corpus callosum fibers (red) and longitudinal projection tracts (green/blue) mapped across cerebral hemispheres.',
      },
    ],
  },
];

export const ACTIVE_CONDITIONS = CONDITIONS;

export const getConditionById = (id: string): ConditionConfig => {
  const found = CONDITIONS.find((c) => c.id === id);
  return found || CONDITIONS[0]; // defaults to brain-tumor
};

export const isModelImplemented = (id: string): boolean => {
  return id === 'brain-tumor';
};
