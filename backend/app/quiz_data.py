"""
AXONOVA Question Bank & Quiz Data
==================================
Comprehensive, peer-reviewed question bank covering 8 core medical AI domains:
1. MRI Basics (terminology, sequence parameters, intensity, safety)
2. Brain Anatomy Basics (structures, compartments, orientations)
3. Brain MRI Learning (visual patterns, contrast differentials, edges, shapes, mass effect)
4. Deep Learning (foundations, architectures, loss functions, generalization, regularization)
5. CNN (convolution, filters, feature maps, activations, pooling, batch norm, dense layers, softmax)
6. AXONOVA (architecture, pipeline, FastAPI, React, TensorFlow/Keras, Grad-CAM, Dataset Explorer, limitations)
7. Explainability (Grad-CAM, saliency maps, confidence calibration, non-diagnostic interpretation)
8. AI Healthcare Safety (bias, out-of-distribution failure, human-in-the-loop, privacy, ethics)
"""

from typing import Any, Dict, List

QUIZ_CATEGORIES = [
    {
        "id": "mri_basics",
        "name": "MRI Basics",
        "description": "Fundamental physics of magnetic resonance, pulse sequences, tissue relaxation, and scanner safety.",
        "icon": "Radio",
    },
    {
        "id": "anatomy_basics",
        "name": "Brain Anatomy Basics",
        "description": "Intracranial compartments, neuroanatomical landmarks, vascular territories, and MRI scan orientations.",
        "icon": "Brain",
    },
    {
        "id": "mri_learning",
        "name": "Brain MRI Learning",
        "description": "Visual features: texture heterogeneity, edge demarcation, cortical buckling, and mass effect interpretation.",
        "icon": "Eye",
    },
    {
        "id": "deep_learning",
        "name": "Deep Learning",
        "description": "Foundational artificial intelligence concepts, gradient descent, overfitting, and validation paradigms.",
        "icon": "Network",
    },
    {
        "id": "cnn",
        "name": "CNN",
        "description": "Convolution kernels, receptive fields, pooling layers, activation functions, and normalization.",
        "icon": "Cpu",
    },
    {
        "id": "axonova",
        "name": "AXONOVA Platform",
        "description": "Engineering architecture, FastAPI backend, React UI, photometric validation, and clinical decision support.",
        "icon": "ShieldCheck",
    },
    {
        "id": "explainability",
        "name": "Explainability",
        "description": "Layer-Targeted Grad-CAM, attention gradients, model confidence scores, and algorithmic interpretability.",
        "icon": "Sparkles",
    },
    {
        "id": "healthcare_safety",
        "name": "AI Healthcare Safety",
        "description": "Clinical governance, diagnostic disclaimers, dataset bias, failure modes, and patient confidentiality.",
        "icon": "AlertTriangle",
    },
]

EXPANDED_QUIZ_BANK: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # Category 1: MRI Basics
    # -------------------------------------------------------------
    {
        "id": "quiz-02",
        "category": "MRI Basics",
        "topic": "MRI Basics",
        "difficulty": "Easy",
        "question": "Which visual characteristic is the primary initial radiological clue distinguishing an extra-axial mass from an intra-axial mass?",
        "options": [
            "The color of the patient's hair",
            "Broad dural attachment, cortical buckling, and presence of a CSF cleft",
            "Patient body temperature",
            "Blood pressure reading"
        ],
        "correct_index": 1,
        "explanation": "Extra-axial masses arise outside the brain parenchyma (e.g., from meninges), causing inward buckling of the cortex, broad dural base, and often a CSF cleft."
    },
    {
        "id": "mri-01",
        "category": "MRI Basics",
        "topic": "Physics & Relaxation",
        "difficulty": "Easy",
        "question": "On a standard T1-weighted brain MRI without contrast, what signal intensity does cerebrospinal fluid (CSF) exhibit relative to brain parenchyma?",
        "options": [
            "Hyperintense (very bright white)",
            "Hypointense (dark/black)",
            "Isointense (identical brightness to grey matter)",
            "Pulsatile rainbow spectrum"
        ],
        "correct_index": 1,
        "explanation": "Due to the long T1 longitudinal relaxation time of pure water, CSF appears hypointense (dark) on standard T1-weighted images and hyperintense (bright) on T2-weighted images."
    },
    {
        "id": "mri-02",
        "category": "MRI Basics",
        "topic": "Pulse Sequences",
        "difficulty": "Medium",
        "question": "What is the primary diagnostic advantage of Fluid-Attenuated Inversion Recovery (FLAIR) over standard T2-weighted imaging?",
        "options": [
            "It turns bone transparent on coronal projections",
            "It selectively nulls pure CSF signal, highlighting periventricular hyperintensities and vasogenic edema",
            "It reduces patient acquisition scan time to under 50 milliseconds",
            "It eliminates all need for radiofrequency pulses"
        ],
        "correct_index": 1,
        "explanation": "FLAIR utilizes an inversion time (TI) matched to the null point of free water (~2000-2500ms at 3T), suppressing bright CSF so that pathological hyperintensities (edema, MS plaques, gliomas) are conspicuous."
    },
    {
        "id": "mri-03",
        "category": "MRI Basics",
        "topic": "Sequence Parameters",
        "difficulty": "Medium",
        "question": "In MRI pulse sequence physics, what do TR (Repetition Time) and TE (Echo Time) fundamentally control?",
        "options": [
            "Scanner bed motor speed and gantry tilt angle",
            "Image contrast weighting (T1, T2, or Proton Density)",
            "Audio speaker volume in the scan room",
            "The patient's heart rate"
        ],
        "correct_index": 1,
        "explanation": "TR controls the amount of T1 longitudinal recovery between consecutive RF pulses, while TE controls the degree of T2 transverse decay allowed before signal readout."
    },
    {
        "id": "mri-04",
        "category": "MRI Basics",
        "topic": "MRI Safety",
        "difficulty": "Hard",
        "question": "What primary biophysical hazard is governed by the Specific Absorption Rate (SAR) limit during clinical high-field MRI scans?",
        "options": [
            "Auditory permanent hearing threshold shifts",
            "Radiofrequency (RF) power deposition leading to patient tissue heating",
            "Radiation-induced chromosomal double-strand DNA breaks",
            "Static magnetic field missile effect"
        ],
        "correct_index": 1,
        "explanation": "SAR measures the rate at which RF electromagnetic energy is absorbed by biological tissue (expressed in Watts per kilogram, W/kg). Regulatory limits prevent dangerous thermal burns and core heating."
    },
    {
        "id": "mri-05",
        "category": "MRI Basics",
        "topic": "Diffusion Imaging",
        "difficulty": "Hard",
        "question": "In acute ischemic stroke, what biophysical mechanism causes cytotoxic edema to demonstrate bright signal on Diffusion-Weighted Imaging (DWI) and dark signal on ADC maps?",
        "options": [
            "Rapid leakage of paramagnetic blood into the subarachnoid cisterns",
            "Failure of the Na+/K+ ATPase pump causing intracellular water trapping and restricted Brownian motion",
            "Demyelination of periventricular oligodendrocyte axons",
            "Calcification of the choroid plexus glomus"
        ],
        "correct_index": 1,
        "explanation": "Ischemic energy depletion halts the Na+/K+ ATPase pump. Water shifts from the extracellular space into swollen cells, severely restricting Brownian motion of water molecules (restricted diffusion)."
    },

    # -------------------------------------------------------------
    # Category 2: Brain Anatomy Basics
    # -------------------------------------------------------------
    {
        "id": "anat-01",
        "category": "Brain Anatomy Basics",
        "topic": "Intracranial Compartments",
        "difficulty": "Easy",
        "question": "What fibrous dural structure separates the supratentorial compartment (cerebrum) from the infratentorial compartment (cerebellum and brainstem)?",
        "options": [
            "Falx cerebri",
            "Tentorium cerebelli",
            "Diaphragma sellae",
            "Corpus callosum"
        ],
        "correct_index": 1,
        "explanation": "The tentorium cerebelli is a crescentic dural fold separating the occipital and temporal lobes from the cerebellum and posterior cranial fossa."
    },
    {
        "id": "anat-02",
        "category": "Brain Anatomy Basics",
        "topic": "Sellar Anatomy",
        "difficulty": "Medium",
        "question": "Which critical visual pathway structure rests directly superior to the sella turcica and is vulnerable to compression by expanding pituitary macroadenomas?",
        "options": [
            "Optic chiasm",
            "Superior colliculus",
            "Olfactory bulb",
            "Internal auditory canal"
        ],
        "correct_index": 0,
        "explanation": "The optic chiasm lies directly above the diaphragma sellae. Upward compression of decussating nasal retinal fibers causes classic bitemporal hemianopsia."
    },
    {
        "id": "quiz-08",
        "category": "Brain Anatomy Basics",
        "topic": "Case Reasoning",
        "difficulty": "Medium",
        "question": "A patient presents with bitemporal hemianopsia (loss of peripheral vision in both eyes). Which anatomical structure is being compressed by the mass?",
        "options": [
            "Optic chiasm",
            "Auditory nerve",
            "Spinal cord",
            "Olfactory bulb"
        ],
        "correct_index": 0,
        "explanation": "The optic chiasm sits directly above the sella turcica. Suprasellar expansion of a pituitary macroadenoma compresses crossing nasal retinal fibers, causing bitemporal hemianopsia."
    },
    {
        "id": "anat-03",
        "category": "Brain Anatomy Basics",
        "topic": "Ventricular System",
        "difficulty": "Medium",
        "question": "Through which narrow channel does cerebrospinal fluid flow from the third ventricle into the fourth ventricle within the midbrain?",
        "options": [
            "Foramen of Monro",
            "Cerebral aqueduct (of Sylvius)",
            "Foramen of Magendie",
            "Foramen of Luschka"
        ],
        "correct_index": 1,
        "explanation": "The cerebral aqueduct of Sylvius connects the third and fourth ventricles through the dorsal midbrain; its obstruction causes non-communicating (obstructive) triventricular hydrocephalus."
    },
    {
        "id": "anat-04",
        "category": "Brain Anatomy Basics",
        "topic": "Cerebral Meninges",
        "difficulty": "Hard",
        "question": "Which layer of the cranial meninges closely invests every cerebral convolution (gyrus) and dips into the depths of all cerebral sulci?",
        "options": [
            "Dura mater (periosteal layer)",
            "Arachnoid mater",
            "Pia mater",
            "Ependyma"
        ],
        "correct_index": 2,
        "explanation": "The pia mater is a delicate, vascular connective tissue membrane adhering intimate to the cortical surface, dipping into all sulci, unlike the arachnoid which bridges across them."
    },
    {
        "id": "quiz-05",
        "category": "Brain Anatomy Basics",
        "topic": "Brain Tumor Categories",
        "difficulty": "Easy",
        "question": "Which dedicated MRI orientation is considered most critical when evaluating sellar and suprasellar pituitary masses?",
        "options": [
            "Axial view only",
            "Dedicated thin-section Coronal view",
            "Oblique dental view",
            "Extremity projection"
        ],
        "correct_index": 1,
        "explanation": "Coronal T1 and T2 images are essential for evaluating the sella turcica, visualizing suprasellar optic chiasm compression, and assessing cavernous sinus invasion."
    },

    # -------------------------------------------------------------
    # Category 3: Brain MRI Learning
    # -------------------------------------------------------------
    {
        "id": "quiz-03",
        "category": "Brain MRI Learning",
        "topic": "Edges",
        "difficulty": "Easy",
        "question": "How does an infiltrative glioma border typically differ from a classic convexity meningioma border on structural MRI?",
        "options": [
            "Gliomas have sharp encapsulated borders, whereas meningiomas have no visible borders",
            "Gliomas typically display ill-defined, infiltrative borders; meningiomas display well-circumscribed, crisp margins",
            "Both lesions have completely identical borders in all sequences",
            "Neither lesion has any border on MRI"
        ],
        "correct_index": 1,
        "explanation": "Gliomas invade surrounding white matter tracks, creating diffuse, irregular borders. Meningiomas are extra-axial and generally well-demarcated from the brain."
    },
    {
        "id": "quiz-04",
        "category": "Brain MRI Learning",
        "topic": "Textures",
        "difficulty": "Easy",
        "question": "In MRI feature analysis, what does regional 'texture' primarily represent to a convolutional neural network?",
        "options": [
            "The physical roughness of the MRI scanner machine",
            "Local spatial arrangements and recurring statistical variations in pixel intensity",
            "The sound frequency of the gradient coils during acquisition",
            "The patient's clinical chart text"
        ],
        "correct_index": 1,
        "explanation": "Texture reflects spatial variations in pixel brightness across a receptive field, indicating tissue heterogeneity, necrosis, or cellular density."
    },
    {
        "id": "learn-01",
        "category": "Brain MRI Learning",
        "topic": "Mass Effect",
        "difficulty": "Medium",
        "question": "What combination of radiological signs definitively confirms significant intracranial mass effect?",
        "options": [
            "Effacement of adjacent cortical sulci, compression of the lateral ventricle, and midline shift",
            "Bright signal of the scalp hair and increased skull bone density",
            "Uniform widening of all cerebellar folia bilaterally",
            "Presence of normal venous sinus flow voids"
        ],
        "correct_index": 0,
        "explanation": "Mass effect describes the mechanical distortion of normal brain parenchyma by an expanding lesion, leading to sulcal effacement, ventricular compression, and subfalcine midline shift."
    },
    {
        "id": "learn-02",
        "category": "Brain MRI Learning",
        "topic": "Enhancement Patterns",
        "difficulty": "Medium",
        "question": "A ring-enhancing brain mass with a thick, irregular wall and central liquefactive necrosis is classically associated with which condition?",
        "options": [
            "High-Grade Glioma (Glioblastoma, WHO Grade 4)",
            "Benign microadenoma of the pituitary",
            "Diffuse axonal injury grade 1",
            "Normal age-related cerebral atrophy"
        ],
        "correct_index": 0,
        "explanation": "High-grade gliomas (such as glioblastoma) typically exhibit thick, nodular, irregular peripheral contrast enhancement surrounding a non-enhancing necrotic core, with surrounding vasogenic edema."
    },
    {
        "id": "learn-03",
        "category": "Brain MRI Learning",
        "topic": "Dural Signs",
        "difficulty": "Hard",
        "question": "Why is the classic 'dural tail sign' helpful but NOT 100% pathognomonic for intracranial meningioma?",
        "options": [
            "Because the dural tail only appears on plain skull radiographs",
            "Because reactive dural thickening and enhancement can also occur in dural metastases, sarcoidosis, and schwannomas",
            "Because it only exists when MRI machines overheat",
            "Because normal brains without lesions exhibit diffuse dural tails"
        ],
        "correct_index": 1,
        "explanation": "While seen in 60-72% of meningiomas, a tapering dural tail represents hypervascularity or tumor infiltration of the adjacent dura, which also occurs in dural metastases, lymphoma, and fungal pachymeningitis."
    },

    # -------------------------------------------------------------
    # Category 4: Deep Learning
    # -------------------------------------------------------------
    {
        "id": "dl-01",
        "category": "Deep Learning",
        "topic": "Foundations",
        "difficulty": "Easy",
        "question": "What is the core distinction between traditional machine learning with hand-crafted features and Deep Learning for medical imaging?",
        "options": [
            "Deep learning requires no data to produce accurate results",
            "Deep learning automatically discovers hierarchical visual feature representations directly from raw pixel arrays",
            "Traditional machine learning only works on color photographs, not grayscale MRI",
            "Deep learning is guaranteed to never make an erroneous prediction"
        ],
        "correct_index": 1,
        "explanation": "Deep learning uses multi-layered neural networks to learn representations of data with multiple levels of abstraction, discovering edges, textures, and morphological patterns directly from raw pixels."
    },
    {
        "id": "dl-02",
        "category": "Deep Learning",
        "topic": "Generalization & Overfitting",
        "difficulty": "Medium",
        "question": "During training of a medical image classifier, what phenomenon occurs when training loss continues decreasing while validation loss begins to diverge upward?",
        "options": [
            "Underfitting due to excessive learning rate decay",
            "Overfitting (the model memorizes training noise rather than generalizable pathological features)",
            "The model has achieved optimal clinical deployment readiness",
            "Hardware gradient accumulation overflow"
        ],
        "correct_index": 1,
        "explanation": "Overfitting happens when a model fits the training dataset too closely, capturing idiosyncratic artifacts and noise, resulting in poor generalization to unseen validation and test data."
    },
    {
        "id": "dl-03",
        "category": "Deep Learning",
        "topic": "Regularization",
        "difficulty": "Medium",
        "question": "How does Dropout regularize a deep neural network during the training phase?",
        "options": [
            "It permanently deletes half of the dataset files from disk",
            "It randomly deactivates a fraction of unit activations at each forward/backward pass to prevent co-adaptation of weights",
            "It forces all weights in the network to zero",
            "It increases the batch size exponentially"
        ],
        "correct_index": 1,
        "explanation": "Dropout randomly sets a fraction (e.g., 20-50%) of hidden neuron activations to zero during training iterations, forcing neurons to learn robust, independent features without relying on specific neighboring units."
    },
    {
        "id": "dl-04",
        "category": "Deep Learning",
        "topic": "Optimization",
        "difficulty": "Hard",
        "question": "Why is the Adam (Adaptive Moment Estimation) optimizer widely adopted for training convolutional networks on MRI datasets?",
        "options": [
            "It completely guarantees 100% test accuracy in a single epoch",
            "It computes individual adaptive learning rates for different parameters from estimates of first and second moments of gradients",
            "It replaces the need for any loss function",
            "It works without calculating gradients or performing backpropagation"
        ],
        "correct_index": 1,
        "explanation": "Adam combines the advantages of AdaGrad (handling sparse gradients) and RMSProp (handling non-stationary objectives), maintaining exponentially decaying averages of past gradients and squared gradients."
    },

    # -------------------------------------------------------------
    # Category 5: CNN (Convolutional Neural Networks)
    # -------------------------------------------------------------
    {
        "id": "quiz-01",
        "category": "CNN",
        "topic": "CNN Basics",
        "difficulty": "Easy",
        "question": "What visual information do early convolutional layers in a deep learning model typically extract?",
        "options": [
            "Clinical diagnosis and treatment decisions",
            "Simple low-level patterns such as edges, gradients, and orientations",
            "Patient age, clinical history, and demographic data",
            "Cellular histological subtypes and genetic mutations"
        ],
        "correct_index": 1,
        "explanation": "Early convolutional layers apply localized filters (e.g. 3x3 kernels) that respond primarily to spatial intensity gradients, basic edges, and line orientations."
    },
    {
        "id": "cnn-01",
        "category": "CNN",
        "topic": "Convolution Operation",
        "difficulty": "Easy",
        "question": "What is the mathematical role of a convolutional kernel (filter) as it slides across a 2D brain MRI slice?",
        "options": [
            "It computes local element-wise products and sums them to generate an activation feature map",
            "It compresses the image into an audio sound wave",
            "It measures the physical temperature of the CPU",
            "It flips the orientation from Axial to Sagittal"
        ],
        "correct_index": 0,
        "explanation": "A convolution kernel slides across the input tensor computing localized spatial inner products, producing a feature map that reflects the presence of specific visual patterns across coordinates."
    },
    {
        "id": "cnn-02",
        "category": "CNN",
        "topic": "Activation Functions",
        "difficulty": "Medium",
        "question": "Why is the Rectified Linear Unit (ReLU), defined as f(x) = max(0, x), preferred over the sigmoid function in deep CNN backbones?",
        "options": [
            "It prevents negative numbers from ever being used in computers",
            "It avoids the vanishing gradient problem for positive activations and is computationally inexpensive to evaluate",
            "It guarantees that outputs sum to 1.0 like a probability distribution",
            "It produces curved sinusoidal waves"
        ],
        "correct_index": 1,
        "explanation": "Sigmoid saturates at 0 and 1, causing vanishing gradients during backpropagation in deep architectures. ReLU has a constant derivative of 1 for positive inputs, maintaining gradient flow."
    },
    {
        "id": "cnn-03",
        "category": "CNN",
        "topic": "Pooling & Downsampling",
        "difficulty": "Medium",
        "question": "What is the primary architectural purpose of Max Pooling layers placed between convolutional blocks?",
        "options": [
            "To increase the pixel resolution of the input image tenfold",
            "To downsample spatial dimensions, expand receptive fields, and confer translation invariance",
            "To convert grayscale values into 32-bit RGB colors",
            "To encrypt patient data according to HIPAA standards"
        ],
        "correct_index": 1,
        "explanation": "Max pooling downsamples spatial height and width by keeping the maximum value within localized windows (e.g. 2x2), reducing parameters and computation while providing spatial translation invariance."
    },
    {
        "id": "cnn-04",
        "category": "CNN",
        "topic": "Global Average Pooling",
        "difficulty": "Hard",
        "question": "Why does modern CNN architecture (e.g. in AXONOVA's backbone) utilize Global Average Pooling (GAP) before the dense classification layer instead of a massive Flatten layer?",
        "options": [
            "GAP drastically reduces parameter count and prevents severe overfitting compared to flattening thousands of spatial units",
            "GAP makes the model run exclusively on quantum processors",
            "GAP forces every class to receive an identical probability of 25%",
            "Flatten layers cannot be computed by TensorFlow"
        ],
        "correct_index": 0,
        "explanation": "Global Average Pooling averages each feature map across all spatial coordinates into a single scalar, reducing tens of thousands of weights to a compact vector and significantly mitigating overfitting."
    },
    {
        "id": "cnn-05",
        "category": "CNN",
        "topic": "Softmax Classification",
        "difficulty": "Hard",
        "question": "In the final layer of a multi-class CNN, what does the Softmax activation function mathematically guarantee?",
        "options": [
            "All output logits are strictly equal to zero",
            "Output values are mapped between 0 and 1, and the sum of all class probabilities strictly equals 1.0",
            "The model output is certified as an official clinical diagnosis",
            "The image is saved to a permanent SQL database"
        ],
        "correct_index": 1,
        "explanation": "Softmax exponentiates raw logits and divides each by the sum of all exponentiated logits, converting unbounded real numbers into a valid multinomial probability distribution summing to 1.0."
    },

    # -------------------------------------------------------------
    # Category 6: AXONOVA Platform
    # -------------------------------------------------------------
    {
        "id": "axo-01",
        "category": "AXONOVA",
        "topic": "System Objective",
        "difficulty": "Easy",
        "question": "What is the primary mission and technical design objective of the AXONOVA platform?",
        "options": [
            "To replace human radiologists and perform fully autonomous brain surgery",
            "To provide an educational neuroimaging laboratory for medical trainees and a transparent, explainable decision-support research prototype",
            "To sell commercial MRI hardware systems to diagnostic imaging centers",
            "To generate artistic synthetic wallpapers from brain scans"
        ],
        "correct_index": 1,
        "explanation": "AXONOVA is specifically engineered as an educational and clinical research decision-support prototype, emphasizing reasoning-first learning, photometric safety checks, and explainability."
    },
    {
        "id": "axo-02",
        "category": "AXONOVA",
        "topic": "Technology Stack",
        "difficulty": "Easy",
        "question": "Which software engineering technologies power the AXONOVA core platform architecture?",
        "options": [
            "WordPress, PHP, and MySQL",
            "React 18, TypeScript, and Tailwind CSS on frontend; FastAPI, Python, and TensorFlow/Keras on backend",
            "Cobol, Fortran, and Microsoft Access",
            "Ruby on Rails and jQuery"
        ],
        "correct_index": 1,
        "explanation": "AXONOVA utilizes modern enterprise medical software architecture: a reactive TypeScript/Tailwind UI built with Vite, connected via typed REST APIs to an asynchronous FastAPI Python backend running Keras deep learning models."
    },
    {
        "id": "axo-03",
        "category": "AXONOVA",
        "topic": "Pre-Ingestion Validation",
        "difficulty": "Medium",
        "question": "What critical quality assurance check does AXONOVA perform BEFORE feeding an uploaded MRI slice into its neural network?",
        "options": [
            "It checks the user's credit card billing address",
            "It performs photometric quality validation (rejecting blank slices, corrupted files, non-MRI modalities, and abnormal intensity distributions)",
            "It automatically rotates the scan upside down",
            "It converts the MRI into a 3D hologram video"
        ],
        "correct_index": 1,
        "explanation": "To prevent garbage-in garbage-out failure, AXONOVA's validation pipeline checks file integrity, rejects blank or corrupted images, verifies structural intensity contrast, and ensures compliance with Brain MRI characteristics."
    },
    {
        "id": "axo-04",
        "category": "AXONOVA",
        "topic": "Indeterminate Gating",
        "difficulty": "Hard",
        "question": "How does AXONOVA handle a scan where the neural network's top predicted class confidence falls below the calibrated clinical threshold (e.g., < 65%)?",
        "options": [
            "It forces a random diagnosis so the user is never left without an answer",
            "It flags the study as 'Indeterminate', warning the clinician that the scan lacks decisive features and requires manual expert review",
            "It crashes the server to prevent errors",
            "It deletes the patient's record permanently"
        ],
        "correct_index": 1,
        "explanation": "A core tenet of safe medical AI is knowing what the model does not know. If classification confidence is low or ambiguous, AXONOVA marks the result as Indeterminate rather than presenting an overconfident hallucination."
    },

    # -------------------------------------------------------------
    # Category 7: Explainability
    # -------------------------------------------------------------
    {
        "id": "quiz-07",
        "category": "Explainability",
        "topic": "Grad-CAM Explainability",
        "difficulty": "Easy",
        "question": "What does a Grad-CAM heatmap visualization represent in an explainable AI system?",
        "options": [
            "Proof of cancer cells in the highlighted area",
            "A clinical biopsy report confirming malignancy",
            "Image regions that strongly influenced the model's feature representations for a specific predicted class",
            "A surgical cutting guide for brain surgery"
        ],
        "correct_index": 2,
        "explanation": "Grad-CAM is an algorithmic visualization tool that computes gradients of the target class score with respect to convolutional feature maps to show where the model 'focused'."
    },
    {
        "id": "expl-01",
        "category": "Explainability",
        "topic": "Grad-CAM Mathematics",
        "difficulty": "Medium",
        "question": "How does Gradient-weighted Class Activation Mapping (Grad-CAM) determine the importance weight of each feature map in the final convolutional layer?",
        "options": [
            "By asking the user to manually click on the lesion",
            "By computing the global average pooling of the gradients of the target class score with respect to that feature map",
            "By assigning a random number between 0 and 1",
            "By taking the square root of the image file size"
        ],
        "correct_index": 1,
        "explanation": "Grad-CAM calculates the gradient of the predicted class score $y^c$ with respect to feature map activations $A^k$, averaging these gradients globally across spatial dimensions to yield neuron importance weights $\\alpha_k^c$."
    },
    {
        "id": "expl-02",
        "category": "Explainability",
        "topic": "Receptive Field Interpretation",
        "difficulty": "Hard",
        "question": "Why does a Grad-CAM heatmap typically appear smooth and somewhat coarse rather than tracing the exact single-pixel cellular boundary of a brain tumor?",
        "options": [
            "Because the image was corrupted during transmission",
            "Because the final convolutional layer has undergone multiple pooling/stride operations, having a low spatial resolution that is upsampled back to input size",
            "Because the hospital printer ran out of color ink",
            "Because Grad-CAM uses 8-bit retro arcade graphics"
        ],
        "correct_index": 1,
        "explanation": "Deep convolutional layers capture high-level semantic features across large receptive fields at reduced spatial resolutions (e.g. 7x7 or 14x14). Bilinear upsampling to 224x224 yields a smooth regional heat distribution rather than pixel-level segmentation."
    },
    {
        "id": "quiz-06",
        "category": "Explainability",
        "topic": "Model Limitations",
        "difficulty": "Easy",
        "question": "Why can an educational CNN prediction NOT be used as a definitive clinical medical diagnosis?",
        "options": [
            "CNNs only detect statistical image patterns and lack clinical history, physical exam, and histopathological ground truth",
            "Because computers are not allowed to be plugged in at hospitals",
            "Because MRI images cannot be processed digitally",
            "Because deep learning models always make 100% random guesses"
        ],
        "correct_index": 0,
        "explanation": "Deep learning models learn statistical pixel correlations on training sets. Clinical diagnosis requires holistic physician evaluation, history, lab tests, and pathology."
    },

    # -------------------------------------------------------------
    # Category 8: AI Healthcare Safety
    # -------------------------------------------------------------
    {
        "id": "safe-01",
        "category": "AI Healthcare Safety",
        "topic": "Clinical Governance",
        "difficulty": "Easy",
        "question": "What is the mandatory regulatory role of an AI medical imaging software prototype like AXONOVA in actual patient care?",
        "options": [
            "Autonomous diagnostic authority without needing physician review",
            "An educational and investigational decision-support tool where all clinical findings must be confirmed by qualified medical professionals",
            "A replacement for hospital radiology departments",
            "An automated prescription generator"
        ],
        "correct_index": 1,
        "explanation": "Health authority frameworks (FDA, EMA) require that decision-support AI tools operate with a qualified human specialist in the loop; AI predictions must never replace clinical judgement."
    },
    {
        "id": "safe-02",
        "category": "AI Healthcare Safety",
        "topic": "Dataset Bias",
        "difficulty": "Medium",
        "question": "What critical failure mode can arise if a brain MRI AI model is trained entirely on scans from one hospital with a specific 1.5T scanner vendor?",
        "options": [
            "The model will run faster on all other scanners worldwide",
            "The model may suffer domain shift (poor generalization) when exposed to scans from different field strengths (3.0T) or other manufacturer protocols",
            "The model will automatically upgrade the hardware of other hospitals",
            "There is no difference between MRI scanners"
        ],
        "correct_index": 1,
        "explanation": "Differences in scanner hardware, magnetic field strength (1.5T vs 3T), gradient coils, and sequence parameter timing introduce domain shift, which can degrade classifier accuracy on external cohorts."
    },
    {
        "id": "safe-03",
        "category": "AI Healthcare Safety",
        "topic": "Patient Privacy",
        "difficulty": "Medium",
        "question": "Under HIPAA Safe Harbor and GDPR regulations, what procedure must be performed on DICOM brain MRI metadata prior to sharing for research or AI training?",
        "options": [
            "Converting all files to Microsoft Word format",
            "De-identification (stripping direct identifiers such as patient name, MRN, date of birth, and study dates)",
            "Publishing the patient's full medical chart on open social media",
            "Encrypting the file with the patient's social security number"
        ],
        "correct_index": 1,
        "explanation": "HIPAA Safe Harbor mandates the removal of 18 specific identifiers (including names, addresses, dates, medical record numbers, and biometric identifiers) to protect patient privacy."
    },
    {
        "id": "safe-04",
        "category": "AI Healthcare Safety",
        "topic": "Shortcut Learning",
        "difficulty": "Hard",
        "question": "What dangerous phenomenon is 'shortcut learning' in medical deep learning models?",
        "options": [
            "When the model learns in fewer epochs than expected",
            "When the model relies on spurious confounders (such as hospital orientation markers, calvarial artifacts, or text burned into slices) rather than true anatomical pathology",
            "When the model utilizes shortcut keyboard keys in the IDE",
            "When students skip lessons in the learning lab"
        ],
        "correct_index": 1,
        "explanation": "Shortcut learning occurs when neural networks achieve high training performance by latching onto unintended visual cues (e.g. scanner-specific fiducials, radiology text burned into corners) instead of genuine biological pathology."
    },
]

# Quick lookup map by question id
QUESTION_LOOKUP: Dict[str, Dict[str, Any]] = {q["id"]: q for q in EXPANDED_QUIZ_BANK}
