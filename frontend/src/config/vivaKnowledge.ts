import { PresentationSection, VivaQuestion, VivaTopic } from '../types/student';

export const DEFAULT_VIVA_TOPICS: VivaTopic[] = [
  { id: 'intro', name: 'Project Introduction', description: 'Core purpose, clinical problem, and design objectives.' },
  { id: 'ai_dl', name: 'AI & Deep Learning', description: 'Machine learning theory, deep neural representations, and image classification.' },
  { id: 'cnn', name: 'CNN Architecture', description: 'Convolutions, kernels, activation functions, pooling, and regularization.' },
  { id: 'image_proc', name: 'Image Preprocessing', description: 'Resizing, min-max normalization, photometric filtering, and quality checks.' },
  { id: 'backend', name: 'Backend Architecture', description: 'FastAPI, asynchronous ASGI, REST APIs, and TensorFlow integration.' },
  { id: 'frontend', name: 'Frontend Architecture', description: 'React 18, TypeScript, Tailwind CSS, Vite, and reactive state management.' },
  { id: 'model', name: 'Model & Prediction', description: 'Keras CNN model, multi-class outputs, confidence gating, and evaluation.' },
  { id: 'gradcam', name: 'Grad-CAM & Explainability', description: 'Gradient-weighted saliency, receptive fields, and visual verification.' },
  { id: 'healthcare_ai', name: 'Healthcare AI & Safety', description: 'Clinical disclaimers, human-in-the-loop, and regulatory constraints.' },
  { id: 'future_scope', name: 'Future Scope & Expansion', description: 'Multi-sequence 3D volumes, disease-specific models, and federated learning.' },
];

export const DEFAULT_VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 'viva-01',
    category: 'Project Introduction',
    question: 'What is AXONOVA, and what core clinical problem does it aim to address?',
    suggested_answer:
      'AXONOVA is an AI-powered Brain MRI research and medical student learning platform. It addresses radiologist diagnostic fatigue caused by mounting scan volumes and counters untrustworthy black-box AI systems by combining rigorous pre-ingestion photometric validation, real CNN inference, Layer-Targeted Grad-CAM explainability, and an interactive learning laboratory for clinical trainees.',
    teaching_guidance: 'Focus on the dual purpose: clinical decision-support research and medical student education.',
  },
  {
    id: 'viva-02',
    category: 'Project Introduction',
    question: 'What is the primary technical objective of the AXONOVA platform?',
    suggested_answer:
      'The objective is to establish an end-to-end transparent neuroimaging pipeline: validating raw MRI slices before inference, routing to validated convolutional models, generating calibrated probabilistic predictions, producing transparent visual heatmaps via Grad-CAM, and enforcing clinical safety via explicit Indeterminate gating and mandatory medical disclaimers.',
    teaching_guidance: 'Highlight that safety and explainability take precedence over autonomous diagnosis.',
  },
  {
    id: 'viva-03',
    category: 'AI & Deep Learning',
    question: 'Why is Deep Learning specifically advantageous for Brain MRI analysis compared to traditional computer vision?',
    suggested_answer:
      'Traditional computer vision relied on brittle, hand-crafted features (such as manual texture filters or contour extraction) that fail across varying scanner noise and patient anatomy. Deep learning automatically discovers hierarchical feature representations directly from raw voxel intensity values, progressing from localized edges to complex pathological textures.',
    teaching_guidance: 'Contrast manual feature engineering with hierarchical automatic representation learning.',
  },
  {
    id: 'viva-04',
    category: 'CNN Architecture',
    question: 'Explain the role of Convolutional layers, ReLU, and Max Pooling in AXONOVA neural network.',
    suggested_answer:
      'Convolutional layers apply localized sliding kernels to calculate spatial dot products and generate feature maps. ReLU introduces non-linearity by zeroing negative values (max(0, x)), mitigating vanishing gradients. Max Pooling downsamples spatial dimensions, reducing parameter count and computation while conferring spatial translation invariance.',
    teaching_guidance: 'Walk through the sequential progression from kernel convolution to non-linear activation and pooling.',
  },
  {
    id: 'viva-05',
    category: 'CNN Architecture',
    question: 'Why does the network employ Global Average Pooling and Dropout before the final dense layer?',
    suggested_answer:
      'Global Average Pooling (GAP) collapses each 2D feature map into a single scalar average, drastically decreasing parameter count compared to a traditional Flatten layer and preventing catastrophic memorization. Dropout randomly zeroes a fraction of unit activations during training, regularizing the network to prevent co-adaptation.',
    teaching_guidance: 'Explain how GAP and Dropout protect against overfitting on medical datasets.',
  },
  {
    id: 'viva-06',
    category: 'Image Preprocessing',
    question: 'What preprocessing steps are executed when a brain MRI scan is uploaded to AXONOVA?',
    suggested_answer:
      'AXONOVA first performs photometric validation: rejecting non-image formats, blank or corrupt slices, and extreme intensity clipping. The image is standardized to a 224x224 input matrix, converted to RGB/3-channel tensor representation, and normalized to standard floating-point intervals ([0, 1] or z-score) to match the distribution expected by the neural network weights.',
    teaching_guidance: 'Emphasize validation before normalization: garbage-in garbage-out protection.',
  },
  {
    id: 'viva-07',
    category: 'Backend Architecture',
    question: 'Why did you choose FastAPI and Python for the AXONOVA backend architecture?',
    suggested_answer:
      'Python is the standard ecosystem for scientific deep learning with native TensorFlow/Keras support. FastAPI provides asynchronous ASGI concurrency, automated OpenAPI/Swagger documentation, strict Pydantic data schema validation, high throughput, and effortless decoupling of AI inference routines from HTTP request lifecycles.',
    teaching_guidance: 'Mention asynchronous ASGI, Pydantic type safety, and direct native TensorFlow integration.',
  },
  {
    id: 'viva-08',
    category: 'Frontend Architecture',
    question: 'Why is the AXONOVA frontend built with React, TypeScript, and Tailwind CSS?',
    suggested_answer:
      'React enables modular, component-driven UI architecture suitable for complex medical workstations. TypeScript enforces compile-time type safety across complex clinical schemas, preventing runtime crashes. Tailwind CSS provides high-performance, responsive medical styling, while Vite ensures instant Hot Module Replacement (HMR).',
    teaching_guidance: 'Connect UI architecture to developer ergonomics and clinical interface reliability.',
  },
  {
    id: 'viva-09',
    category: 'Model & Prediction',
    question: 'What classes are classified by the baseline Brain Tumor CNN model, and how is confidence computed?',
    suggested_answer:
      'The core brain tumor classifier supports four distinct categories: Glioma, Meningioma, Pituitary Tumor, and No Tumor (healthy baseline). The model output is projected through a Softmax function to produce a calibrated multinomial probability distribution summing to 1.0, where the highest score represents the model statistical confidence.',
    teaching_guidance: 'List the exact 4 classes and explain that Softmax outputs statistical probabilities, not certainty.',
  },
  {
    id: 'viva-10',
    category: 'Grad-CAM & Explainability',
    question: 'What is Grad-CAM, and why is it critical for clinical safety in neuroimaging AI?',
    suggested_answer:
      'Grad-CAM (Gradient-weighted Class Activation Mapping) computes the gradients of the target class score with respect to the feature maps of the final convolutional layer. By overlaying this heat distribution onto the original MRI slice, clinicians can verify whether the AI focused on genuine anatomical pathology or spurious background artifacts, eliminating black-box opacity.',
    teaching_guidance: 'Clarify that Grad-CAM visualizes network attention, not histopathological margins.',
  },
  {
    id: 'viva-11',
    category: 'Healthcare AI & Safety',
    question: 'Can AXONOVA diagnose a patient autonomously? What is the official medical disclaimer?',
    suggested_answer:
      'No, AXONOVA strictly cannot and does not diagnose patients. It is an educational and research prototype. Its official disclaimer states: AXONOVA provides AI-assisted educational assessments, not confirmed medical diagnoses. All predictions represent statistical model patterns and must be evaluated by a qualified healthcare professional.',
    teaching_guidance: 'Never equivocate: clinical diagnosis requires licensed human medical judgment.',
  },
  {
    id: 'viva-12',
    category: 'Future Scope & Expansion',
    question: 'How can the AXONOVA platform be expanded in the future for multicenter hospital deployment?',
    suggested_answer:
      'Future expansion pathways include: (1) Transitioning from 2D slices to 3D volumetric convolutions across full DICOM series; (2) Multi-sequence co-registration (simultaneously ingesting T1, T2, FLAIR, and DWI); (3) Federated learning across distributed teaching hospitals to protect patient privacy without centralizing data; and (4) Longitudinal tracking of tumor volume post-therapy.',
    teaching_guidance: 'Discuss 3D volumetric MRI, multi-modal fusion, and federated learning.',
  },
];

export const DEFAULT_PRESENTATION_SECTIONS: PresentationSection[] = [
  {
    id: 'sec-01',
    title: '1. Introduction',
    subtitle: 'Welcome & High-Level Platform Overview',
    script:
      'Honorable panel, welcome to the technical presentation of AXONOVA: an AI-Powered Brain MRI Intelligence and Medical Student Learning Platform. In this defense, we present a hospital-grade engineering solution that bridges the critical divide between deep learning computer vision and safe radiological clinical decision-support.',
  },
  {
    id: 'sec-02',
    title: '2. Problem Statement',
    subtitle: 'Diagnostic Fatigue & The Black-Box Paradigm',
    script:
      'Globally, neuro-radiologists face escalating scan volumes, contributing to cognitive fatigue and diagnostic error. Concurrently, existing commercial AI prototypes suffer from opaque black-box reasoning, uncalibrated overconfidence, and complete detachment from medical student training curricula. A transparent, educational AI framework is urgently required.',
  },
  {
    id: 'sec-03',
    title: '3. Project Objective',
    subtitle: 'Transparent AI Decision-Support & Training',
    script:
      'AXONOVA mission is twofold: First, to develop a validated deep learning pipeline that validates MRI slices, routes them to specialized convolutional neural backbones, and generates Layer-Targeted Grad-CAM explainability heatmaps. Second, to empower medical students with an interactive, reasoning-first learning laboratory that teaches visual feature synthesis.',
  },
  {
    id: 'sec-04',
    title: '4. Technology Architecture',
    subtitle: 'Modern Scalable Full-Stack Engineering',
    script:
      'The system is built on a resilient decoupled architecture: A React 18, TypeScript, and Tailwind CSS frontend powered by Vite for high responsiveness; and an asynchronous Python FastAPI backend utilizing TensorFlow and Keras 3 for deep learning inference, structured Pydantic data validation, and automated OpenAPI documentation.',
  },
  {
    id: 'sec-05',
    title: '5. Processing Workflow',
    subtitle: 'From Raw File Ingestion to Clinical Reporting',
    script:
      'The operational pipeline executes in five sequential stages: (1) Pre-ingestion validation enforcing photometric contrast, integrity, and modality checks; (2) Preprocessing to 224x224 normalized tensors; (3) Forward-pass convolutional inference; (4) Saliency gradient computation via Grad-CAM; and (5) Structured report compilation with indeterminate gating thresholds.',
  },
  {
    id: 'sec-06',
    title: '6. Convolutional Neural Network (CNN)',
    subtitle: 'Feature Hierarchy & Optimization',
    script:
      'The neural network employs deep convolutional blocks. Early layers learn low-level spatial gradients and edges; intermediate layers capture histological textures and signal contrast; and deep layers synthesize morphological shapes. Global Average Pooling and Dropout regularize the model, while Softmax generates normalized class probabilities.',
  },
  {
    id: 'sec-07',
    title: '7. Model Prediction & Decision Gating',
    subtitle: 'Calibrated Probabilities & Safety Gating',
    script:
      'AXONOVA classifies scans across four validated categories: Glioma, Meningioma, Pituitary Adenoma, and Healthy Baseline (No Tumor). Crucially, if the maximum predicted confidence falls below our calibrated threshold (65%), the system refuses to guess, flagging the study as Indeterminate and mandating manual expert radiological evaluation.',
  },
  {
    id: 'sec-08',
    title: '8. Grad-CAM Explainability',
    subtitle: 'Visualizing Attention & Building Trust',
    script:
      'To dismantle black-box opacity, AXONOVA integrates Layer-Targeted Grad-CAM. By computing class-score gradients with respect to the final convolutional activation maps, the platform renders a color-coded thermal overlay showing exactly where the network detected features, ensuring predictions are anchored in real anatomical hallmarks rather than artifactual noise.',
  },
  {
    id: 'sec-09',
    title: '9. Model Evaluation & Benchmarking',
    subtitle: 'Rigorous Empirical Validation',
    script:
      'Model performance was evaluated on strictly held-out test splits. Metrics tracked include categorical Accuracy, Precision, Recall/Sensitivity, Specificity, F1-Scores, Confusion Matrices, and ROC-AUC curves. The platform transparently displays these evaluation metrics on the Evaluation page for complete institutional auditing.',
  },
  {
    id: 'sec-10',
    title: '10. Medical Student Learning Module',
    subtitle: 'Reasoning-First Educational Lab',
    script:
      'Rather than treating AI as an oracle, the student module challenges trainees to practice reasoning-first. Students review de-identified cases, identify radiological features (edges, textures, shapes), formulate their differential, and compare their clinical hypothesis against both the verified ground truth and the neural network Grad-CAM heatmap.',
  },
  {
    id: 'sec-11',
    title: '11. Clinical Safety & Limitations',
    subtitle: 'Ethical Constraints & Failure Modes',
    script:
      'We emphasize that AXONOVA is not an autonomous diagnostic device. It operates strictly under human-in-the-loop governance. Known limitations include 2D slice analysis versus 3D volumetric context, sensitivity to severe motion artifacts, and reliance on clinical correlation with laboratory, endocrine, and histopathological findings.',
  },
  {
    id: 'sec-12',
    title: '12. Future Scope',
    subtitle: 'Pathways for Multicenter Deployment',
    script:
      'Future work will focus on: expanding to 3D volumetric DICOM architectures; incorporating multi-parametric sequences (FLAIR, T2*, DWI); implementing federated learning across healthcare systems; and integrating automated longitudinal tumor volumetry to evaluate treatment response in neuro-oncology clinical trials.',
  },
  {
    id: 'sec-13',
    title: '13. Conclusion & Summary',
    subtitle: 'Summary of Scientific Contribution',
    script:
      'In summary, AXONOVA demonstrates that artificial intelligence in neuroimaging is most potent when designed for transparency, rigorous safety validation, and clinician education. It provides both a powerful decision-support prototype and a transformative pedagogical tool for the next generation of medical specialists. Thank you, and I invite your questions.',
  },
];
