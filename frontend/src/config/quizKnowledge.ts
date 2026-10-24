import { QuizCategory, QuizQuestion } from '../types/student';

export const FALLBACK_QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'mri_basics',
    name: 'MRI Basics',
    description: 'Fundamental physics of magnetic resonance, pulse sequences, tissue relaxation, and scanner safety.',
    icon: 'Radio',
  },
  {
    id: 'anatomy_basics',
    name: 'Brain Anatomy Basics',
    description: 'Intracranial compartments, neuroanatomical landmarks, vascular territories, and MRI scan orientations.',
    icon: 'Brain',
  },
  {
    id: 'mri_learning',
    name: 'Brain MRI Learning',
    description: 'Visual features: texture heterogeneity, edge demarcation, cortical buckling, and mass effect interpretation.',
    icon: 'Eye',
  },
  {
    id: 'deep_learning',
    name: 'Deep Learning',
    description: 'Foundational artificial intelligence concepts, gradient descent, overfitting, and validation paradigms.',
    icon: 'Network',
  },
  {
    id: 'cnn',
    name: 'CNN',
    description: 'Convolution kernels, receptive fields, pooling layers, activation functions, and normalization.',
    icon: 'Cpu',
  },
  {
    id: 'axonova',
    name: 'AXONOVA Platform',
    description: 'Engineering architecture, FastAPI backend, React UI, photometric validation, and clinical decision support.',
    icon: 'ShieldCheck',
  },
  {
    id: 'explainability',
    name: 'Explainability',
    description: 'Layer-Targeted Grad-CAM, attention gradients, model confidence scores, and algorithmic interpretability.',
    icon: 'Sparkles',
  },
  {
    id: 'healthcare_safety',
    name: 'AI Healthcare Safety',
    description: 'Clinical governance, diagnostic disclaimers, dataset bias, failure modes, and patient confidentiality.',
    icon: 'AlertTriangle',
  },
];

export const FALLBACK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-01',
    topic: 'MRI Basics',
    difficulty: 'Beginner',
    question: 'Why does cerebrospinal fluid (CSF) appear hypointense (dark) on T1-weighted images and hyperintense (bright) on T2-weighted images?',
    options: [
      'CSF has a very long T1 relaxation time and a long T2 relaxation time',
      'CSF contains paramagnetic hemoglobin that extinguishes signal on T1',
      'T1-weighted pulse sequences nullify all mobile fluid via inversion prep pulses',
      'CSF is diamagnetic and rejects RF excitation pulses entirely'
    ],
    explanation: 'CSF is pure free water with very slow molecular tumbling, resulting in long T1 (takes long to recover longitudinal magnetization, appearing dark on T1) and long T2 (slow transverse dephasing, remaining bright on T2).'
  },
  {
    id: 'quiz-02',
    topic: 'MRI Basics',
    difficulty: 'Intermediate',
    question: 'What is the primary diagnostic utility of the T2-FLAIR (Fluid-Attenuated Inversion Recovery) pulse sequence?',
    options: [
      'Directly measures cerebral blood flow without gadolinium contrast',
      'Nullifies free CSF signal to highlight periventricular hyperintense edema and demyelination',
      'Produces millimeter-scale bone detail comparable to high-resolution CT',
      'Detects microscopic calcium deposits via T2* phase angle calculation'
    ],
    explanation: 'T2-FLAIR applies an inversion time (TI ~2000-2500ms) that matches CSF null point, making bright ventricular/sulcal CSF black. This renders periventricular vasogenic edema and MS plaques immediately conspicuous.'
  },
  {
    id: 'quiz-03',
    topic: 'Brain Anatomy Basics',
    difficulty: 'Beginner',
    question: 'Which anatomical landmark marks the boundary between the frontal lobe and the parietal lobe?',
    options: [
      'Sylvian (Lateral) Fissure',
      'Central Sulcus (of Rolando)',
      'Parieto-Occipital Sulcus',
      'Calcarine Fissure'
    ],
    explanation: 'The Central Sulcus separates the precentral gyrus (primary motor cortex of frontal lobe) from the postcentral gyrus (primary somatosensory cortex of parietal lobe).'
  },
  {
    id: 'quiz-04',
    topic: 'Brain Anatomy Basics',
    difficulty: 'Intermediate',
    question: 'A mass occupying the sella turcica with suprasellar extension most commonly compresses which neural structure first?',
    options: [
      'Optic Chiasm, causing bitemporal hemianopsia',
      'Abducens nerve (CN VI), causing medial strabismus',
      'Trigeminal ganglion (V1), causing facial numbness',
      'Posterior communicating artery, causing third nerve palsy'
    ],
    explanation: 'The optic chiasm lies directly superior to the diaphragma sellae. Expanding pituitary macroadenomas compress the decussating nasal fibers of the chiasm, producing classic bitemporal hemianopsia.'
  },
  {
    id: 'quiz-05',
    topic: 'Brain MRI Learning',
    difficulty: 'Intermediate',
    question: 'How do radiologists and deep learning feature detectors differentiate vasogenic edema from non-enhancing infiltrative tumor on MRI?',
    options: [
      'Vasogenic edema respects gray-white matter junctions and finger-spares cortical ribbons, whereas infiltrative tumor invades cortex',
      'Vasogenic edema shows strong post-gadolinium rim enhancement',
      'Vasogenic edema exhibits profound diffusion restriction with dark ADC',
      'Infiltrative tumor is always dark on T2-FLAIR sequences'
    ],
    explanation: 'Vasogenic edema flows along low-resistance extracellular white matter pathways, sparing the dense cortex and producing a characteristic digitate or "glove-finger" pattern. Infiltrative gliomas blur and thicken the overlying cortex.'
  },
  {
    id: 'quiz-06',
    topic: 'Brain MRI Learning',
    difficulty: 'Advanced',
    question: 'What radiologic feature on post-contrast T1 MRI is most characteristic of an extra-axial meningioma?',
    options: [
      'Central necrotic cavitary breakdown without dural contact',
      'Broad-based dural attachment with a tapering enhancing "dural tail"',
      'Crossing of the corpus callosum with bilateral butterfly infiltration',
      'Predilection for the periventricular Dawson fingers orientation'
    ],
    explanation: 'Classic meningiomas arise from arachnoid cap cells, demonstrating a wide dural base, homogeneous intense enhancement, and an adjacent tapering thickening termed the "dural tail sign".'
  },
  {
    id: 'quiz-07',
    topic: 'Deep Learning',
    difficulty: 'Beginner',
    question: 'Why is Dropout regularization employed during the training of deep neural networks on medical datasets?',
    options: [
      'To prevent co-adaptation of features and mitigate overfitting on small patient cohorts',
      'To accelerate floating-point arithmetic on Nvidia Tensor Cores',
      'To automatically normalize pixel intensities between 0 and 255',
      'To force the network output probabilities to sum to 1.0'
    ],
    explanation: 'Dropout randomly deactivates a fraction of neurons during training, forcing individual units to learn robust, generalized features rather than relying on brittle memorization of training cases.'
  },
  {
    id: 'quiz-08',
    topic: 'Deep Learning',
    difficulty: 'Intermediate',
    question: 'What is the primary purpose of the Softmax activation function in the terminal layer of the AXONOVA classifier?',
    options: [
      'Converts raw unnormalized logit values into a calibrated categorical probability distribution summing to 1.0',
      'Eliminates the vanishing gradient problem across recurrent connections',
      'Computes the spatial pixel attention map for Grad-CAM overlay',
      'Filters out high-frequency noise from raw DICOM inputs'
    ],
    explanation: 'Softmax exponentiates raw logits and divides by the sum of exponentials, creating a normalized probability distribution representing class likelihoods across candidate diagnostic categories.'
  },
  {
    id: 'quiz-09',
    topic: 'CNN',
    difficulty: 'Beginner',
    question: 'What visual features are typically extracted by the earliest convolutional layers of a brain MRI classification CNN?',
    options: [
      'Low-level spatial primitives such as directional edges, luminance gradients, and simple corners',
      'High-level whole-organ anatomical contours and tumor boundaries',
      'Volumetric ventricle chamber fluid pressure estimations',
      'Calibrated histological cellular grade predictions'
    ],
    explanation: 'Early CNN kernels act like classical spatial gradient operators (e.g. Sobel filters), detecting local edges, line orientations, and contrast transitions before deeper layers combine them into textures and shapes.'
  },
  {
    id: 'quiz-10',
    topic: 'CNN',
    difficulty: 'Intermediate',
    question: 'What is the role of Max Pooling layers in convolutional neural network architectures?',
    options: [
      'Provides spatial downsampling, reduces computational parameters, and introduces translational invariance',
      'Calculates the backpropagated gradient with respect to class loss',
      'Normalizes batch activations to have zero mean and unit variance',
      'Ensures patient metadata is safely stripped according to HIPAA standards'
    ],
    explanation: 'Max pooling selects the peak activation over small receptive windows (e.g. 2x2), reducing spatial dimensionality, lowering computational cost, and rendering the network less sensitive to minor pixel shifts.'
  },
  {
    id: 'quiz-11',
    topic: 'AXONOVA Platform',
    difficulty: 'Intermediate',
    question: 'Before passing an uploaded brain MRI to the TensorFlow model, what automated checks are performed by the AXONOVA Photometric QA pipeline?',
    options: [
      'Image dimensions, sharpness score, dynamic range contrast, and orientation plane validation',
      'Billing insurance code verification and hospital PACS credentialing',
      'Cellular Ki-67 proliferation index prediction from pixel histograms',
      'Patient genomic sequencing alignment with glioblastoma IDH mutation databases'
    ],
    explanation: 'AXONOVA runs photometric image quality telemetry (checking adequate spatial resolution, Laplacian sharpness variance, contrast dynamic range, and axial orientation) to reject invalid or corrupted inputs before inference.'
  },
  {
    id: 'quiz-12',
    topic: 'Explainability',
    difficulty: 'Intermediate',
    question: 'How does Gradient-Weighted Class Activation Mapping (Grad-CAM) generate its visual explainability heatmap?',
    options: [
      'By computing gradients of the predicted class score with respect to feature maps of the final convolutional layer',
      'By randomly masking pixel squares to see which changes drop prediction confidence',
      'By training a secondary separate network to draw bounding boxes around tumors',
      'By looking up matched healthy templates in a reference neuroanatomy atlas'
    ],
    explanation: 'Grad-CAM takes the gradient of the winning class score $y^c$ with respect to feature activation maps $A^k$ in the deepest convolutional layer, weighting each map by importance and passing through ReLU to produce a spatial activation heat map.'
  },
  {
    id: 'quiz-13',
    topic: 'Explainability',
    difficulty: 'Advanced',
    question: 'Why does AXONOVA explicitly emphasize that Grad-CAM heatmaps do NOT represent surgical margins?',
    options: [
      'Grad-CAM reflects model receptive field gradients, which can be influenced by surrounding edema, background artifacts, and low spatial resolution',
      'Grad-CAM uses RGB color palettes that are banned by surgical navigation systems',
      'The convolution layers discard all high-frequency spatial coordinate information permanently',
      'Because Grad-CAM is only capable of operating on synthetic phantom scans'
    ],
    explanation: 'Grad-CAM visualizes what pixel regions influenced the network classification; it has coarse spatial resolution (due to multiple pooling layers) and may illuminate surrounding parenchyma or peri-tumoral edema rather than the microscopic neoplastic margin.'
  },
  {
    id: 'quiz-14',
    topic: 'AI Healthcare Safety',
    difficulty: 'Beginner',
    question: 'Why must AI diagnostic platforms like AXONOVA operate strictly as Clinical Decision Support (CDS) rather than autonomous diagnostic agents?',
    options: [
      'AI models can fail on out-of-distribution artifacts, lack clinical history, and require human physician verification for patient safety',
      'Because FDA regulations prohibit computers from running in hospital server rooms',
      'Convolutional neural networks cannot process images larger than 512x512 pixels',
      'Modern MRI scanners already have built-in autonomous surgery capabilities'
    ],
    explanation: 'AI systems evaluate images in isolation without access to laboratory biomarkers, patient history, physical examination, or longitudinal changes. Human-in-the-loop oversight is mandatory to prevent catastrophic diagnostic errors.'
  },
  {
    id: 'quiz-15',
    topic: 'AI Healthcare Safety',
    difficulty: 'Intermediate',
    question: 'What is "distribution shift" or "out-of-distribution (OOD) failure" in medical imaging AI?',
    options: [
      'Degraded performance when a model trained on one scanner protocol is applied to scans with different field strengths, coils, or contrast agents',
      'The gradual physical movement of the patient during long acquisition sequences',
      'The loss of neural weights when deploying from Python to mobile devices',
      'The difference between axial, sagittal, and coronal slice thicknesses'
    ],
    explanation: 'Distribution shift occurs when inference data deviates from the training distribution (e.g. 1.5T vs 3.0T scanner, different manufacturer pulse sequences, or pediatric patients), causing models to make confident but erroneous predictions.'
  }
];
