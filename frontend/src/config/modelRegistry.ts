import { MatchScanResponse, ModelRegistryEntry } from '../types';
import { BROAD_CONDITION_CATALOG } from './conditionCatalog';

export const CLIENT_MODEL_REGISTRY: ModelRegistryEntry[] = [
  {
    "model_id": "axonova-brain-tumor-cnn",
    "name": "AXONOVA Brain Neoplasm Classifier",
    "version": "1.0.0",
    "task_id": "brain-tumor",
    "task_type": "Multi-class Neoplasm Classification",
    "description": "Deep Convolutional Neural Network classifying primary brain tumors (Glioma, Meningioma, Pituitary), metastases, and intracranial masses with Grad-CAM heatmaps.",
    "supported_conditions": [
      "glioma-glioblastoma",
      "meningioma",
      "pituitary-adenoma",
      "brain-metastases",
      "primary-cns-lymphoma",
      "other-intracranial-tumors",
      "benign-cysts"
    ],
    "supported_sequences": [
      "T1-weighted Contrast-Enhanced",
      "T2-weighted",
      "FLAIR",
      "Thin-slice 3D T1+Gd (3T)",
      "Dedicated Coronal Dynamic T1+Gd",
      "CISS / FIESTA",
      "DWI"
    ],
    "supported_orientations": [
      "Axial",
      "Coronal",
      "Sagittal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Glioma",
      "Meningioma",
      "Pituitary Tumor",
      "No Tumor / Normal"
    ],
    "validation_accuracy": 0.975,
    "validation_metric_label": "97.5% Accuracy on held-out test split (BRATS/Figshare benchmark)",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Trained specifically on axial/coronal slices; does not assess whole 3D multi-sequence volumetric DICOM sets.",
      "AI assessment requires histopathological biopsy confirmation."
    ]
  },
  {
    "model_id": "axonova-stroke-cnn",
    "name": "AXONOVA Acute Ischemia & Vascular Classifier",
    "version": "1.3.0",
    "task_id": "stroke",
    "task_type": "Restricted Diffusion & Vascular Abnormality Detection",
    "description": "DWI (b=1000) and ADC map matching for cytotoxic edema, arterial infarction territories, and chronic cerebrovascular changes.",
    "supported_conditions": [
      "ischemic-stroke",
      "hemorrhagic-stroke",
      "chronic-small-vessel",
      "cerebral-aneurysm",
      "vascular-malformations",
      "cerebral-venous-thrombosis",
      "old-infarct-changes"
    ],
    "supported_sequences": [
      "Diffusion-Weighted Imaging (DWI b=1000)",
      "Apparent Diffusion Coefficient (ADC) Map",
      "T2-FLAIR",
      "SWI (Susceptibility-Weighted)",
      "3D Time-of-Flight (TOF) MRA",
      "MR Venography (MRV 2D-TOF or Contrast)"
    ],
    "supported_orientations": [
      "Axial",
      "Coronal",
      "Sagittal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Acute Ischemic Infarction",
      "Subacute Infarction",
      "Normal Perfusion Baseline"
    ],
    "validation_accuracy": 0.963,
    "validation_metric_label": "96.3% Accuracy on ISLES / ATLAS open benchmarks",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Emergency acute stroke management requires immediate hospital stroke code triage.",
      "DWI T2 shine-through artifacts require mandatory verification against quantitative ADC hypointensity."
    ]
  },
  {
    "model_id": "axonova-ms-cnn",
    "name": "AXONOVA Demyelinating Plaque & Neuro-Inflammation Classifier",
    "version": "1.1.0",
    "task_id": "multiple-sclerosis",
    "task_type": "Demyelinating Plaque & Inflammatory Detection",
    "description": "Multi-sequence T2-FLAIR hyperintensity pattern recognition for periventricular (Dawson's fingers), juxtacortical plaques, and autoimmune encephalitis.",
    "supported_conditions": [
      "multiple-sclerosis",
      "other-demyelinating-lesions",
      "encephalitis-related-findings",
      "meningitis-related-findings",
      "autoimmune-inflammatory-brain"
    ],
    "supported_sequences": [
      "T2-FLAIR",
      "T2-weighted",
      "T1+Gd",
      "DWI"
    ],
    "supported_orientations": [
      "Axial",
      "Sagittal",
      "Coronal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Periventricular Plaque (Dawson's Fingers)",
      "Juxtacortical / Infratentorial Plaque",
      "Normal White Matter Baseline"
    ],
    "validation_accuracy": 0.948,
    "validation_metric_label": "94.8% Accuracy on ISBI / MICCAI MSSEG cohorts",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Diagnostic fulfillment requires dissemination in time and space under McDonald 2017 Criteria."
    ]
  },
  {
    "model_id": "axonova-infection-cnn",
    "name": "AXONOVA Intracranial Infection & Abscess Classifier",
    "version": "1.0.0",
    "task_id": "infection",
    "task_type": "Infectious Lesion & Abscess Detection",
    "description": "DWI restriction and ring-enhancing lesion classifier differentiating pyogenic brain abscesses from cystic necrotic tumors.",
    "supported_conditions": [
      "brain-abscess",
      "infectious-lesions",
      "suspected-intracranial-infection"
    ],
    "supported_sequences": [
      "DWI (b=1000)",
      "ADC Map",
      "T1+Gd",
      "T2-weighted",
      "FLAIR"
    ],
    "supported_orientations": [
      "Axial",
      "Coronal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Pyogenic Abscess Cavity",
      "Parasitic / Granulomatous Lesion",
      "Non-Infectious Baseline"
    ],
    "validation_accuracy": 0.952,
    "validation_metric_label": "95.2% Accuracy on clinical multicenter infection cohorts",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Serological confirmation and CSF analysis required for microbiological diagnosis."
    ]
  },
  {
    "model_id": "axonova-alzheimers-cnn",
    "name": "AXONOVA Structural Atrophy & Neurodegenerative Classifier",
    "version": "1.2.0",
    "task_id": "alzheimers",
    "task_type": "Volumetric Structural Atrophy Classification",
    "description": "Volumetric T1 structural assessment for medial temporal lobe/hippocampal volume reduction, frontotemporal thinning, and ventricular dilation.",
    "supported_conditions": [
      "alzheimers-structural",
      "frontotemporal-dementia",
      "lewy-body-dementia",
      "parkinsonian-disorders",
      "brain-atrophy-patterns",
      "mild-cognitive-impairment"
    ],
    "supported_sequences": [
      "T1-weighted MPRAGE",
      "T1-weighted",
      "Coronal 3D T1",
      "T2-FLAIR"
    ],
    "supported_orientations": [
      "Coronal",
      "Axial",
      "Sagittal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Cognitive Normal Control",
      "Mild Cognitive Impairment (MCI)",
      "Alzheimer\u2019s Disease (AD)"
    ],
    "validation_accuracy": 0.942,
    "validation_metric_label": "94.2% Accuracy on ADNI / OASIS-3 validation splits",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "MRI atrophy alone does not establish clinical dementia diagnosis; correlate with MMSE and cognitive scoring."
    ]
  },
  {
    "model_id": "axonova-trauma-tbi-net",
    "name": "AXONOVA Traumatic Brain Injury & Contusion Analyzer",
    "version": "1.0.0",
    "task_id": "trauma",
    "task_type": "TBI, Microbleed & Shearing Injury Analysis",
    "description": "Susceptibility-weighted and gradient-echo classifier detecting punctate diffuse axonal injury, cortical contusions, and traumatic hematomas.",
    "supported_conditions": [
      "tbi-abnormalities",
      "traumatic-intracranial-bleeding",
      "subdural-epidural-hematoma",
      "brain-contusion",
      "diffuse-axonal-injury"
    ],
    "supported_sequences": [
      "SWI / GRE",
      "T2* GRE",
      "T2-FLAIR",
      "T1-weighted",
      "Diffusion Tensor Imaging (DTI)"
    ],
    "supported_orientations": [
      "Axial",
      "Coronal",
      "Sagittal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Parenchymal Contusion",
      "Diffuse Axonal Shearing",
      "Traumatic Extra-Axial Collection",
      "Normal Post-Trauma Baseline"
    ],
    "validation_accuracy": 0.958,
    "validation_metric_label": "95.8% Accuracy on traumatic neuroimaging registry datasets",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Acute clinical stability and emergency airway status take precedence over diagnostic MRI."
    ]
  },
  {
    "model_id": "axonova-structural-csf-net",
    "name": "AXONOVA Ventriculomegaly & Structural Malformation Network",
    "version": "1.0.0",
    "task_id": "structural-csf",
    "task_type": "Ventricular Volumetry & Malformation Assessment",
    "description": "Automated Evans index calculation, aqueductal patency screening, and craniocervical tonsillar herniation measurement.",
    "supported_conditions": [
      "hydrocephalus-enlarged-ventricles",
      "congenital-developmental",
      "chiari-malformation",
      "structural-seizure-abnormalities",
      "white-matter-abnormalities"
    ],
    "supported_sequences": [
      "T1-weighted",
      "T2-weighted",
      "Sagittal 3D T1",
      "T2-FLAIR",
      "CISS / FIESTA"
    ],
    "supported_orientations": [
      "Sagittal",
      "Axial",
      "Coronal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Obstructive Hydrocephalus",
      "Communicating Hydrocephalus / NPH",
      "Chiari Malformation",
      "Normal Ventricular Geometry"
    ],
    "validation_accuracy": 0.961,
    "validation_metric_label": "96.1% Accuracy on morphometric radiological validation sets",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Correlate tonsillar ectopia extent with CSF flow cine phase-contrast studies."
    ]
  },
  {
    "model_id": "axonova-epilepsy-mri-net",
    "name": "AXONOVA Epileptogenic Foci & Hippocampal Sclerosis Network",
    "version": "1.0.0",
    "task_id": "epilepsy",
    "task_type": "Epileptogenic Substrate & Asymmetry Profiling",
    "description": "Dedicated coronal oblique 3mm hippocampal volumetry, T2 hyperintensity detection, and cortical mantle thickness assessment.",
    "supported_conditions": [
      "epilepsy-structural-lesions",
      "hippocampal-sclerosis"
    ],
    "supported_sequences": [
      "Coronal Oblique T2-FLAIR (perpendicular to long axis of hippocampus)",
      "Coronal 3D T1 IR-SPGR",
      "T2-weighted",
      "SWI"
    ],
    "supported_orientations": [
      "Coronal",
      "Axial"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Mesial Temporal Sclerosis",
      "Focal Cortical Dysplasia",
      "Epileptogenic Cavernoma",
      "Non-Lesional Normal Pattern"
    ],
    "validation_accuracy": 0.947,
    "validation_metric_label": "94.7% Accuracy on surgical epilepsy center MRI series",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Requires continuous video-EEG correlation for surgical focus concordance."
    ]
  },
  {
    "model_id": "axonova-sellar-cpa-net",
    "name": "AXONOVA Sellar & Cerebellopontine-Angle (CPA) Classifier",
    "version": "1.0.0",
    "task_id": "pituitary-cranial-region",
    "task_type": "Targeted Regional Skull-Base Neoplasm Classification",
    "description": "High-spatial-resolution thin-section contrast evaluation for pituitary adenomas, vestibular schwannomas, and trigeminal nerve root compression.",
    "supported_conditions": [
      "sellar-pituitary-abnormalities",
      "optic-pathway-abnormalities",
      "cpa-cranial-nerve-masses",
      "posterior-fossa-abnormalities"
    ],
    "supported_sequences": [
      "Dedicated Sellar Coronal Dynamic T1+Gd",
      "CISS / FIESTA (High-Resolution Steady-State)",
      "Axial Thin-Section IAC T1+Gd",
      "T2-weighted"
    ],
    "supported_orientations": [
      "Coronal",
      "Axial",
      "Sagittal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Pituitary Macroadenoma / Microadenoma",
      "Vestibular Schwannoma",
      "Neurovascular Conflict",
      "Normal Regional Anatomy"
    ],
    "validation_accuracy": 0.971,
    "validation_metric_label": "97.1% Accuracy on skull-base and cranial nerve imaging cohorts",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Microadenomas <3mm require dynamic contrast wash-in kinetic tracking."
    ]
  },
  {
    "model_id": "axonova-incidental-atlas",
    "name": "AXONOVA Incidental Finding & Normative Brain Baseline Atlas",
    "version": "1.0.0",
    "task_id": "incidental-other",
    "task_type": "Incidental Variant Classification & Normative Verification",
    "description": "Benign non-pathological anatomical variant classifier filtering pineal cysts, cavum septum pellucidum, and paranasal mucosal thickening.",
    "supported_conditions": [
      "pineal-incidental-cysts",
      "sinus-mastoid-findings",
      "other-incidental-findings",
      "unclassified-indeterminate-abnormality"
    ],
    "supported_sequences": [
      "T1-weighted",
      "T2-weighted",
      "T2-FLAIR",
      "3D T1+Gd"
    ],
    "supported_orientations": [
      "Axial",
      "Coronal",
      "Sagittal"
    ],
    "required_dimensions": [
      224,
      224,
      3
    ],
    "supported_formats": [
      ".jpg",
      ".jpeg",
      ".png"
    ],
    "output_classes": [
      "Benign Pineal / Choroid Cyst",
      "Mucosal Paranasal Finding",
      "Normal Intracranial Baseline"
    ],
    "validation_accuracy": 0.967,
    "validation_metric_label": "96.7% Accuracy on population normative brain MRI cohorts",
    "gradcam_supported": true,
    "status": "Available",
    "limitations": [
      "Incidental findings must be evaluated for interval stability on serial follow-up imaging."
    ]
  },
];

export function matchClientScanToModel(
  conditionId: string | null,
  sequence: string | null
): MatchScanResponse {
  if (!conditionId) {
    return {
      matched: false,
      status: 'Not Assessed',
      message: 'Select a clinical condition or general evaluation target.',
      compatible_model: null,
    };
  }

  const catalogItem = BROAD_CONDITION_CATALOG.find((c) => c.id === conditionId);
  if (!catalogItem) {
    return {
      matched: false,
      status: 'Not Assessed',
      message: `Condition ID '${conditionId}' not found in the catalog.`,
      compatible_model: null,
    };
  }

  if (catalogItem.model_availability !== 'Available') {
    return {
      matched: false,
      status: 'Not Assessed',
      condition_name: catalogItem.name,
      message: 'Model not currently available. This condition is under development.',
      compatible_model: null,
    };
  }

  const model = CLIENT_MODEL_REGISTRY.find((m) => m.model_id === catalogItem.model_id);
  if (!model) {
    return {
      matched: false,
      status: 'Not Available',
      message: `Target model '${catalogItem.model_id}' is not loaded.`,
      compatible_model: null,
    };
  }

  // Check sequence match if specified
  if (sequence && sequence !== 'Not specified' && sequence !== 'MRI') {
    const seqLower = sequence.toLowerCase();
    const isMatched = model.supported_sequences.some((req) => {
      const reqLower = req.toLowerCase();
      if (reqLower.includes(seqLower) || seqLower.includes(reqLower)) return true;
      // Sequence modality equivalence:
      if ((seqLower.includes('t1') || seqLower.includes('mprage')) && (reqLower.includes('t1') || reqLower.includes('mprage'))) return true;
      if (seqLower.includes('t2') && reqLower.includes('t2') && !seqLower.includes('flair') && !reqLower.includes('flair')) return true;
      if (seqLower.includes('flair') && reqLower.includes('flair')) return true;
      if ((seqLower.includes('dwi') || seqLower.includes('adc')) && (reqLower.includes('dwi') || reqLower.includes('adc'))) return true;
      return false;
    });

    if (!isMatched) {
      return {
        matched: false,
        status: 'Not Suitable for This Scan',
        condition_name: catalogItem.name,
        model_name: model.name,
        uploaded_sequence: sequence,
        required_sequences: model.supported_sequences,
        message: `Sequence '${sequence}' does not match the requirements for ${model.name}. Supported sequences: ${model.supported_sequences.join(', ')}.`,
        compatible_model: model,
      };
    }
  }

  return {
    matched: true,
    status: 'Available',
    condition_name: catalogItem.name,
    model_name: model.name,
    message: `Compatible model '${model.name}' (${model.version}) is ready.`,
    compatible_model: model,
  };
}
