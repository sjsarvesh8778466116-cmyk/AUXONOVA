"""
AXONOVA AI Viva Coach Knowledge Base & Evaluation Engine
=========================================================
Medical student learning-focused viva questions covering MRI physics,
neuroanatomy, brain pathology, radiological features, and clinical
neuroradiology — NOT project architecture explanation.
"""

import re
from typing import Any, Dict, List

# ──────────────────────────────────────────────────────────
# 10 CORE MRI & NEURORADIOLOGY LEARNING TOPICS
# ──────────────────────────────────────────────────────────
VIVA_TOPICS = [
    {
        "id": "mri_physics",
        "name": "MRI Physics & Signal Generation",
        "description": "Proton precession, T1/T2 relaxation, spin-echo & gradient-echo sequences, and magnetic field strength.",
    },
    {
        "id": "mri_sequences",
        "name": "MRI Sequences & Contrast",
        "description": "T1-weighted, T2-weighted, FLAIR, DWI, ADC maps, contrast-enhanced imaging, and sequence selection rationale.",
    },
    {
        "id": "neuroanatomy",
        "name": "Brain Neuroanatomy & Landmarks",
        "description": "Cerebral lobes, basal ganglia, thalamus, brainstem, cerebellum, ventricles, and white matter tracts.",
    },
    {
        "id": "brain_tumors",
        "name": "Brain Tumors & Classification",
        "description": "Gliomas, meningiomas, pituitary adenomas, medulloblastomas, WHO grading, and imaging characteristics.",
    },
    {
        "id": "vascular_pathology",
        "name": "Cerebrovascular Diseases",
        "description": "Ischemic stroke, hemorrhagic stroke, DWI restriction, aneurysms, AVMs, and vessel imaging.",
    },
    {
        "id": "demyelination",
        "name": "Demyelinating & Inflammatory Diseases",
        "description": "Multiple sclerosis plaques, ADEM, neuromyelitis optica, periventricular lesions, and Dawson fingers.",
    },
    {
        "id": "infection_inflammation",
        "name": "CNS Infections & Inflammation",
        "description": "Brain abscess, meningitis, encephalitis, toxoplasmosis, tuberculomas, and ring-enhancing lesions.",
    },
    {
        "id": "radiological_signs",
        "name": "Classic Radiological Signs & Patterns",
        "description": "Mass effect, midline shift, hydrocephalus, herniation syndromes, edema types, and enhancement patterns.",
    },
    {
        "id": "pediatric_neuro",
        "name": "Pediatric & Developmental Neuroradiology",
        "description": "Myelination patterns, congenital malformations, Chiari, Dandy-Walker, posterior fossa tumors.",
    },
    {
        "id": "advanced_techniques",
        "name": "Advanced MRI Techniques",
        "description": "MR spectroscopy, perfusion MRI, DTI tractography, functional MRI (fMRI), and SWI.",
    },
]

# ──────────────────────────────────────────────────────────
# 20 COMPREHENSIVE VIVA QUESTIONS (MEDICAL / MRI LEARNING)
# ──────────────────────────────────────────────────────────
VIVA_QUESTIONS: List[Dict[str, Any]] = [
    # ── MRI Physics & Signal Generation ──
    {
        "id": "viva-01",
        "category": "MRI Physics & Signal Generation",
        "question": "Explain the fundamental principle behind MRI signal generation. What role do hydrogen protons play?",
        "key_phrases": [
            "hydrogen", "proton", "precession", "magnetic field", "resonance",
            "radiofrequency", "relaxation", "Larmor frequency", "spin",
        ],
        "suggested_answer": (
            "MRI exploits the magnetic properties of hydrogen protons abundant in body water and fat. "
            "When placed in a strong external magnetic field (B₀), protons align and precess at the Larmor frequency. "
            "A radiofrequency (RF) pulse tilts their net magnetization. As protons relax back to equilibrium, "
            "they emit RF signals detected by receiver coils. The rate of relaxation differs between tissues, "
            "producing T1 (longitudinal) and T2 (transverse) contrast that distinguishes gray matter, white matter, "
            "CSF, and pathological tissue."
        ),
        "teaching_guidance": "Ensure the student understands Larmor precession and the distinction between T1 and T2 relaxation.",
    },
    {
        "id": "viva-02",
        "category": "MRI Physics & Signal Generation",
        "question": "What is the difference between T1 and T2 relaxation times, and how do they affect image contrast?",
        "key_phrases": [
            "T1", "T2", "longitudinal", "transverse", "relaxation",
            "spin-lattice", "spin-spin", "CSF", "fat", "bright", "dark",
        ],
        "suggested_answer": (
            "T1 (spin-lattice) relaxation describes the recovery of longitudinal magnetization after an RF pulse. "
            "Tissues with short T1 (e.g., fat) appear bright on T1-weighted images. T2 (spin-spin) relaxation describes "
            "the decay of transverse magnetization due to spin dephasing. Tissues with long T2 (e.g., CSF, edema) appear "
            "bright on T2-weighted images. Understanding T1 vs T2 contrast is essential for distinguishing normal anatomy "
            "from pathology such as tumors, edema, and hemorrhage."
        ),
        "teaching_guidance": "Ask the student to describe what appears bright vs dark on T1 and T2 images.",
    },
    # ── MRI Sequences & Contrast ──
    {
        "id": "viva-03",
        "category": "MRI Sequences & Contrast",
        "question": "When would you use a FLAIR sequence instead of a standard T2-weighted sequence, and why?",
        "key_phrases": [
            "FLAIR", "fluid", "attenuated", "inversion recovery", "CSF",
            "suppression", "periventricular", "edema", "lesion",
        ],
        "suggested_answer": (
            "FLAIR (Fluid-Attenuated Inversion Recovery) nullifies the bright CSF signal seen on T2-weighted images "
            "by using an inversion pulse timed to the T1 of CSF. This makes periventricular and cortical lesions — "
            "such as multiple sclerosis plaques, gliosis, and vasogenic edema — much more conspicuous against the now-dark "
            "CSF background. FLAIR is indispensable for detecting lesions adjacent to ventricles or subarachnoid spaces."
        ),
        "teaching_guidance": "The student should explain the inversion pulse mechanism and clinical scenarios where FLAIR excels.",
    },
    {
        "id": "viva-04",
        "category": "MRI Sequences & Contrast",
        "question": "Explain what DWI (Diffusion-Weighted Imaging) detects and its clinical importance in acute stroke.",
        "key_phrases": [
            "DWI", "diffusion", "restricted", "cytotoxic edema", "stroke",
            "ischemia", "ADC", "bright", "acute", "infarct",
        ],
        "suggested_answer": (
            "DWI measures the random Brownian motion of water molecules in tissue. In acute ischemic stroke, "
            "cellular swelling (cytotoxic edema) restricts water diffusion, causing the affected area to appear "
            "bright (hyperintense) on DWI and dark on ADC maps. This 'diffusion restriction' pattern is detectable "
            "within minutes of ischemic onset, making DWI the gold-standard sequence for early stroke detection — "
            "far more sensitive than conventional T2 or CT in the hyperacute phase."
        ),
        "teaching_guidance": "Emphasize the DWI bright + ADC dark pattern as the hallmark of acute restricted diffusion.",
    },
    # ── Brain Neuroanatomy & Landmarks ──
    {
        "id": "viva-05",
        "category": "Brain Neuroanatomy & Landmarks",
        "question": "Identify the four cerebral lobes and describe one key function of each.",
        "key_phrases": [
            "frontal", "parietal", "temporal", "occipital",
            "motor", "sensory", "auditory", "visual", "speech", "planning",
        ],
        "suggested_answer": (
            "The four cerebral lobes are: (1) Frontal lobe — responsible for motor function, executive planning, "
            "personality, and Broca's speech area; (2) Parietal lobe — processes somatosensory input, spatial orientation, "
            "and proprioception; (3) Temporal lobe — mediates auditory processing, memory (hippocampus), and Wernicke's "
            "language comprehension; (4) Occipital lobe — the primary visual cortex for processing visual information. "
            "Key anatomical landmarks include the central sulcus (separating frontal/parietal) and the lateral (Sylvian) "
            "fissure (separating temporal from frontal/parietal)."
        ),
        "teaching_guidance": "Have the student point out each lobe on an axial MRI slice and name the separating sulci.",
    },
    {
        "id": "viva-06",
        "category": "Brain Neuroanatomy & Landmarks",
        "question": "Describe the ventricular system of the brain and the flow of cerebrospinal fluid (CSF).",
        "key_phrases": [
            "lateral ventricle", "third ventricle", "fourth ventricle",
            "foramen of Monro", "aqueduct", "Sylvius", "choroid plexus",
            "CSF", "subarachnoid", "hydrocephalus",
        ],
        "suggested_answer": (
            "CSF is produced primarily by the choroid plexus within the ventricles. It flows from the two lateral "
            "ventricles through the foramina of Monro into the third ventricle, then via the cerebral aqueduct (of Sylvius) "
            "into the fourth ventricle. From there it exits through the foramina of Luschka and Magendie into the "
            "subarachnoid space, where it is reabsorbed by arachnoid granulations into the dural venous sinuses. "
            "Obstruction at any point causes hydrocephalus — obstructive (non-communicating) if within the ventricular "
            "system, or communicating if outside it."
        ),
        "teaching_guidance": "Test whether the student can trace the CSF pathway and identify sites of potential obstruction.",
    },
    # ── Brain Tumors & Classification ──
    {
        "id": "viva-07",
        "category": "Brain Tumors & Classification",
        "question": "Compare the typical MRI appearance of a glioblastoma versus a meningioma.",
        "key_phrases": [
            "glioblastoma", "meningioma", "ring enhancement", "heterogeneous",
            "necrosis", "dural tail", "homogeneous", "extra-axial",
            "intra-axial", "edema", "mass effect",
        ],
        "suggested_answer": (
            "Glioblastoma (GBM, WHO Grade IV) is an intra-axial tumor presenting as an irregular heterogeneous mass "
            "with central necrosis, thick irregular ring enhancement on post-contrast T1, surrounding vasogenic edema, "
            "and significant mass effect. In contrast, meningioma is an extra-axial tumor arising from the dura, typically "
            "appearing as a well-circumscribed, homogeneously enhancing mass with a 'dural tail' sign on contrast imaging. "
            "Meningiomas compress rather than infiltrate brain parenchyma, and are usually benign (WHO Grade I)."
        ),
        "teaching_guidance": "Stress intra-axial vs extra-axial location and the contrast enhancement patterns.",
    },
    {
        "id": "viva-08",
        "category": "Brain Tumors & Classification",
        "question": "What are the typical MRI characteristics of a pituitary adenoma, and what hormonal syndromes may it cause?",
        "key_phrases": [
            "pituitary", "sella turcica", "macroadenoma", "microadenoma",
            "suprasellar", "chiasm", "prolactin", "acromegaly", "Cushing",
            "visual field", "bitemporal hemianopia",
        ],
        "suggested_answer": (
            "Pituitary adenomas arise within the sella turcica. Microadenomas (<10mm) may show delayed enhancement relative "
            "to normal pituitary gland on dynamic contrast-enhanced MRI. Macroadenomas (≥10mm) expand the sella, may extend "
            "suprasellarly compressing the optic chiasm (causing bitemporal hemianopia), and can invade the cavernous sinuses "
            "laterally. Functional adenomas produce hormonal excess: prolactinomas cause galactorrhea/amenorrhea, GH-secreting "
            "adenomas cause acromegaly, and ACTH-secreting adenomas cause Cushing's disease."
        ),
        "teaching_guidance": "Connect anatomical location to clinical visual and endocrine manifestations.",
    },
    # ── Cerebrovascular Diseases ──
    {
        "id": "viva-09",
        "category": "Cerebrovascular Diseases",
        "question": "How do you differentiate ischemic from hemorrhagic stroke on MRI?",
        "key_phrases": [
            "ischemic", "hemorrhagic", "DWI", "restriction", "T2*",
            "GRE", "SWI", "blooming", "hyperacute", "cytotoxic",
            "vasogenic", "hematoma", "territory",
        ],
        "suggested_answer": (
            "Ischemic stroke shows restricted diffusion on DWI (bright signal, dark on ADC) conforming to a vascular "
            "territory distribution. T2/FLAIR signal increases after 6-12 hours. Hemorrhagic stroke appears as a "
            "hyperdense focus with characteristic 'blooming' artifact on T2*/GRE/SWI sequences due to susceptibility "
            "effects of blood products. The MRI signal of hemorrhage evolves over time: hyperacute (oxyhemoglobin — "
            "isointense T1, bright T2) → acute (deoxyhemoglobin — dark T2) → subacute (methemoglobin — bright T1) → "
            "chronic (hemosiderin — dark T1 and T2)."
        ),
        "teaching_guidance": "Have the student describe the temporal evolution of hemorrhage signal on T1 and T2.",
    },
    {
        "id": "viva-10",
        "category": "Cerebrovascular Diseases",
        "question": "What vascular territories do the anterior, middle, and posterior cerebral arteries supply?",
        "key_phrases": [
            "ACA", "MCA", "PCA", "anterior cerebral", "middle cerebral",
            "posterior cerebral", "medial", "lateral", "occipital",
            "watershed", "territory", "infarct",
        ],
        "suggested_answer": (
            "The anterior cerebral artery (ACA) supplies the medial surfaces of the frontal and parietal lobes, including "
            "the leg area of the motor/sensory homunculus. The middle cerebral artery (MCA) — the largest branch — supplies "
            "the lateral cortical surface including the face/arm motor areas, Broca's and Wernicke's areas, and the insular "
            "cortex. The posterior cerebral artery (PCA) supplies the occipital lobe (visual cortex), medial temporal lobe, "
            "and thalamus. Watershed (border zone) infarcts occur at the boundaries between these territories during "
            "hypotensive episodes."
        ),
        "teaching_guidance": "Ask the student to predict neurological deficits based on the infarcted territory.",
    },
    # ── Demyelinating Diseases ──
    {
        "id": "viva-11",
        "category": "Demyelinating & Inflammatory Diseases",
        "question": "Describe the classic MRI findings of multiple sclerosis (MS).",
        "key_phrases": [
            "multiple sclerosis", "periventricular", "Dawson fingers",
            "juxtacortical", "infratentorial", "demyelination",
            "ovoid", "FLAIR", "enhancing", "dissemination",
        ],
        "suggested_answer": (
            "MS classically shows multiple ovoid T2/FLAIR hyperintense lesions in characteristic locations: "
            "periventricular (Dawson fingers — lesions oriented perpendicular to the lateral ventricles along medullary "
            "veins), juxtacortical/cortical, infratentorial (brainstem, cerebellum, cerebellar peduncles), and spinal cord. "
            "Active lesions show incomplete ring or nodular gadolinium enhancement. The McDonald criteria require "
            "dissemination in space (lesions in ≥2 characteristic locations) and dissemination in time (simultaneous "
            "enhancing and non-enhancing lesions, or new lesions on follow-up)."
        ),
        "teaching_guidance": "Test whether the student can explain Dawson fingers and the McDonald dissemination criteria.",
    },
    # ── CNS Infections ──
    {
        "id": "viva-12",
        "category": "CNS Infections & Inflammation",
        "question": "How does a brain abscess appear on MRI, and how can you distinguish it from a necrotic tumor?",
        "key_phrases": [
            "abscess", "ring enhancement", "DWI", "restricted diffusion",
            "capsule", "smooth", "thin wall", "necrotic tumor",
            "spectroscopy", "amino acid", "lactate",
        ],
        "suggested_answer": (
            "A brain abscess typically shows a smooth, thin-walled ring-enhancing lesion with surrounding vasogenic edema. "
            "The critical differentiating feature is that abscess contents show marked restricted diffusion on DWI "
            "(bright signal) due to viscous purulent material, whereas necrotic tumor cavities generally do NOT restrict "
            "diffusion. On MR spectroscopy, abscesses show characteristic amino acid peaks (valine, leucine, isoleucine), "
            "succinate, and lactate — peaks not seen in tumors. The abscess wall is typically thinner on the medial "
            "(ventricular) side due to less vascular supply."
        ),
        "teaching_guidance": "Emphasize DWI restriction as the key differentiator between abscess and necrotic tumor.",
    },
    {
        "id": "viva-13",
        "category": "CNS Infections & Inflammation",
        "question": "What MRI features suggest herpes simplex encephalitis (HSE), and why is early diagnosis critical?",
        "key_phrases": [
            "herpes", "temporal lobe", "insular", "limbic",
            "T2 hyperintense", "hemorrhagic", "bilateral",
            "asymmetric", "acyclovir", "emergency",
        ],
        "suggested_answer": (
            "HSE characteristically involves the temporal lobes (medial > lateral), insular cortex, and inferior frontal "
            "regions — reflecting the limbic tropism of the herpes simplex virus. MRI shows asymmetric (often bilateral) "
            "T2/FLAIR hyperintensity with cortical swelling, often with hemorrhagic components visible on GRE/SWI. "
            "DWI restriction may be present in early stages. Early diagnosis is critical because untreated HSE has "
            ">70% mortality, but IV acyclovir dramatically improves outcomes when started within 48 hours."
        ),
        "teaching_guidance": "Stress the medial temporal/insular distribution and the urgency of antiviral treatment.",
    },
    # ── Classic Radiological Signs ──
    {
        "id": "viva-14",
        "category": "Classic Radiological Signs & Patterns",
        "question": "Explain vasogenic versus cytotoxic cerebral edema — what causes each and how do they look on MRI?",
        "key_phrases": [
            "vasogenic", "cytotoxic", "edema", "extracellular",
            "intracellular", "blood-brain barrier", "white matter",
            "gray matter", "DWI", "ADC",
        ],
        "suggested_answer": (
            "Vasogenic edema results from breakdown of the blood-brain barrier, allowing plasma fluid to leak into "
            "the extracellular space — predominantly affecting white matter. It appears as finger-like T2/FLAIR "
            "hyperintensity following white matter tracts, with increased ADC (facilitated diffusion). Common causes "
            "include tumors, abscesses, and inflammation. Cytotoxic edema involves intracellular water accumulation "
            "due to cellular energy failure — affecting both gray and white matter. It shows restricted diffusion "
            "(DWI bright, ADC dark) and is the hallmark of acute ischemic stroke."
        ),
        "teaching_guidance": "Have the student correlate each edema type with its DWI/ADC signature.",
    },
    {
        "id": "viva-15",
        "category": "Classic Radiological Signs & Patterns",
        "question": "What is midline shift on brain MRI, and what clinical urgency does it indicate?",
        "key_phrases": [
            "midline shift", "septum pellucidum", "falx", "herniation",
            "mass effect", "uncal", "subfalcine", "tonsillar",
            "emergency", "neurosurgery",
        ],
        "suggested_answer": (
            "Midline shift refers to displacement of midline brain structures (septum pellucidum, third ventricle, "
            "pineal gland) away from the midline falx cerebri, measured in millimeters. It indicates significant mass "
            "effect from an expanding lesion (tumor, hemorrhage, abscess, or edema). A shift >5mm is clinically "
            "significant and may herald herniation syndromes: subfalcine (cingulate gyrus under the falx), uncal "
            "(medial temporal lobe through the tentorial notch compressing CN III and the PCA), or tonsillar "
            "(cerebellar tonsils through the foramen magnum). This is a neurosurgical emergency requiring urgent "
            "decompression."
        ),
        "teaching_guidance": "Ask the student to name the three major herniation types and their clinical consequences.",
    },
    # ── Pediatric Neuroradiology ──
    {
        "id": "viva-16",
        "category": "Pediatric & Developmental Neuroradiology",
        "question": "What is a Chiari I malformation and what symptoms does it typically cause?",
        "key_phrases": [
            "Chiari", "cerebellar tonsils", "foramen magnum",
            "5mm", "syringomyelia", "headache", "cough",
            "Valsalva", "posterior fossa",
        ],
        "suggested_answer": (
            "Chiari I malformation is defined as herniation of the cerebellar tonsils ≥5mm below the foramen magnum "
            "on a sagittal MRI. It is the most common Chiari malformation in adults. Symptoms include suboccipital "
            "headaches exacerbated by coughing, sneezing, or Valsalva maneuvers, neck pain, and progressive "
            "neurological deficits. CSF flow obstruction at the craniocervical junction may lead to syringomyelia "
            "(a fluid-filled cavity within the spinal cord). Phase-contrast MRI can assess CSF flow dynamics, and "
            "severe cases require posterior fossa decompression surgery."
        ),
        "teaching_guidance": "Ask the student to identify the measurement method on sagittal MRI.",
    },
    {
        "id": "viva-17",
        "category": "Pediatric & Developmental Neuroradiology",
        "question": "Compare medulloblastoma and ependymoma — the two most common posterior fossa tumors in children.",
        "key_phrases": [
            "medulloblastoma", "ependymoma", "posterior fossa",
            "fourth ventricle", "vermis", "floor", "midline",
            "DWI", "restricted", "drop metastases", "hydrocephalus",
        ],
        "suggested_answer": (
            "Medulloblastoma is the most common malignant posterior fossa tumor in children, arising from the cerebellar "
            "vermis and projecting into the fourth ventricle. It appears as a midline solid mass with homogeneous "
            "enhancement and restricted diffusion on DWI (due to high cellularity). It has a tendency for CSF "
            "dissemination (drop metastases) requiring craniospinal imaging. Ependymoma arises from the floor of "
            "the fourth ventricle and characteristically 'squeezes' through the foramina of Luschka and Magendie "
            "(plastic ependymoma). It shows heterogeneous enhancement and calcification. Both can cause obstructive "
            "hydrocephalus by blocking CSF flow."
        ),
        "teaching_guidance": "Emphasize the origin (vermis vs floor of 4th ventricle) and metastatic potential differences.",
    },
    # ── Advanced MRI Techniques ──
    {
        "id": "viva-18",
        "category": "Advanced MRI Techniques",
        "question": "What is MR Spectroscopy (MRS) and what metabolite ratios help differentiate tumors from non-neoplastic lesions?",
        "key_phrases": [
            "spectroscopy", "MRS", "NAA", "choline", "creatine",
            "lactate", "lipid", "metabolite", "ratio",
            "neoplastic", "demyelination",
        ],
        "suggested_answer": (
            "MR Spectroscopy measures chemical metabolite concentrations within a brain voxel. Key metabolites include: "
            "N-acetylaspartate (NAA, a neuronal integrity marker — decreased in tumors and neuronal damage), Choline "
            "(a cell membrane turnover marker — elevated in tumors due to rapid proliferation), Creatine (energy "
            "metabolism — relatively stable reference), Lactate (anaerobic metabolism — elevated in necrosis/ischemia), "
            "and Lipids (cellular breakdown). High Choline/NAA and Choline/Creatine ratios suggest neoplastic pathology. "
            "The presence of amino acid peaks suggests abscess rather than tumor."
        ),
        "teaching_guidance": "Ask the student to interpret a sample MRS spectrum and identify elevated choline.",
    },
    {
        "id": "viva-19",
        "category": "Advanced MRI Techniques",
        "question": "Explain DTI (Diffusion Tensor Imaging) tractography. How does it help in neurosurgical planning?",
        "key_phrases": [
            "DTI", "diffusion tensor", "tractography", "white matter",
            "anisotropy", "fractional anisotropy", "FA",
            "corticospinal tract", "neurosurgery", "eloquent",
        ],
        "suggested_answer": (
            "DTI measures the directionality (anisotropy) of water diffusion along white matter fiber tracts. "
            "By computing fractional anisotropy (FA) at each voxel and applying fiber-tracking algorithms, DTI "
            "reconstructs 3D maps of major white matter pathways such as the corticospinal tract (motor), arcuate "
            "fasciculus (language), and optic radiations (vision). In neurosurgical planning, DTI tractography reveals "
            "the spatial relationship between a tumor and eloquent tracts, allowing surgeons to plan maximal safe "
            "resection while preserving critical neurological function."
        ),
        "teaching_guidance": "Discuss how FA values decrease when tumors infiltrate or displace fiber tracts.",
    },
    {
        "id": "viva-20",
        "category": "Advanced MRI Techniques",
        "question": "What is perfusion MRI, and how does it help distinguish tumor recurrence from radiation necrosis?",
        "key_phrases": [
            "perfusion", "rCBV", "cerebral blood volume", "dynamic",
            "susceptibility", "contrast", "tumor recurrence",
            "radiation necrosis", "neovascularization",
        ],
        "suggested_answer": (
            "Perfusion MRI (DSC — Dynamic Susceptibility Contrast) measures regional cerebral blood volume (rCBV) by "
            "tracking the first pass of a gadolinium bolus through brain vasculature. Recurrent high-grade tumors show "
            "elevated rCBV due to tumor neovascularization (angiogenesis), whereas radiation necrosis typically shows "
            "decreased rCBV due to vascular damage and fibrosis. An rCBV ratio >1.8-2.0 (relative to contralateral "
            "normal white matter) favors tumor recurrence. This distinction is critical because management differs "
            "dramatically: recurrence may warrant re-operation or chemotherapy, while radiation necrosis is managed "
            "conservatively or with bevacizumab."
        ),
        "teaching_guidance": "Stress that rCBV is elevated in recurrent tumor but decreased in radiation necrosis.",
    },
]

# ──────────────────────────────────────────────────────────
# PRESENTATION PRACTICE SCRIPT — MRI LEARNING FOCUSED
# ──────────────────────────────────────────────────────────
PRESENTATION_SECTIONS = [
    {
        "id": "sec-01",
        "title": "1. MRI Fundamentals",
        "subtitle": "How Magnetic Resonance Creates Images",
        "script": (
            "MRI exploits the magnetic properties of hydrogen protons in body tissues. When placed in a strong "
            "magnetic field, protons precess at the Larmor frequency. Radiofrequency pulses perturb their alignment, "
            "and as protons relax back to equilibrium, they emit signals that are spatially encoded into images. "
            "The relaxation properties — T1 and T2 — produce tissue-specific contrast without ionizing radiation."
        ),
    },
    {
        "id": "sec-02",
        "title": "2. T1 vs T2 Contrast",
        "subtitle": "Understanding What Makes Tissues Bright or Dark",
        "script": (
            "On T1-weighted images, fat and subacute blood (methemoglobin) appear bright, while CSF is dark. "
            "T1 is excellent for anatomy and post-contrast evaluation. On T2-weighted images, water-containing "
            "structures (CSF, edema, cysts) appear bright. T2 is ideal for detecting pathology. FLAIR suppresses "
            "CSF signal, making periventricular and cortical lesions conspicuous."
        ),
    },
    {
        "id": "sec-03",
        "title": "3. Essential MRI Sequences",
        "subtitle": "T1, T2, FLAIR, DWI, and Contrast-Enhanced Imaging",
        "script": (
            "A standard brain MRI protocol includes: T1-weighted (anatomical detail), T2-weighted (pathology detection), "
            "FLAIR (periventricular lesions), DWI/ADC (acute ischemia and abscesses), T2*/GRE/SWI (hemorrhage and "
            "calcification), and post-gadolinium T1 (blood-brain barrier breakdown and enhancement). Each sequence "
            "provides complementary diagnostic information."
        ),
    },
    {
        "id": "sec-04",
        "title": "4. Brain Neuroanatomy on MRI",
        "subtitle": "Identifying Key Structures on Axial, Coronal & Sagittal Planes",
        "script": (
            "Systematic MRI reading requires confident identification of: cerebral lobes and their boundaries (central "
            "sulcus, Sylvian fissure), basal ganglia (caudate, putamen, globus pallidus), thalamus, internal capsule, "
            "corpus callosum, brainstem (midbrain, pons, medulla), cerebellum, and the ventricular system. Multi-planar "
            "review on axial, coronal, and sagittal planes ensures comprehensive evaluation."
        ),
    },
    {
        "id": "sec-05",
        "title": "5. Brain Tumor Imaging",
        "subtitle": "Recognizing Gliomas, Meningiomas & Pituitary Adenomas",
        "script": (
            "Glioblastomas present as intra-axial heterogeneous masses with ring enhancement and central necrosis. "
            "Meningiomas are extra-axial, well-circumscribed, homogeneously enhancing masses with a dural tail. "
            "Pituitary adenomas expand the sella turcica and may compress the optic chiasm. Location (intra-axial vs "
            "extra-axial), enhancement pattern, and associated features guide the differential diagnosis."
        ),
    },
    {
        "id": "sec-06",
        "title": "6. Stroke & Cerebrovascular Imaging",
        "subtitle": "DWI, Vascular Territories & Hemorrhage Evolution",
        "script": (
            "Acute ischemic stroke shows DWI restriction within minutes of onset, conforming to a vascular territory. "
            "The ACA, MCA, and PCA each supply specific brain regions, and territory recognition predicts neurological "
            "deficits. Hemorrhagic stroke shows characteristic signal evolution on MRI as hemoglobin degrades through "
            "oxyhemoglobin, deoxyhemoglobin, methemoglobin, and hemosiderin stages."
        ),
    },
    {
        "id": "sec-07",
        "title": "7. Demyelinating Diseases",
        "subtitle": "Multiple Sclerosis & Inflammatory Conditions",
        "script": (
            "Multiple sclerosis produces ovoid T2/FLAIR hyperintense lesions in periventricular (Dawson fingers), "
            "juxtacortical, infratentorial, and spinal cord locations. Active plaques show gadolinium enhancement. "
            "The McDonald criteria require dissemination in space and time for diagnosis. Other demyelinating conditions "
            "include ADEM, NMO, and progressive multifocal leukoencephalopathy."
        ),
    },
    {
        "id": "sec-08",
        "title": "8. CNS Infections on MRI",
        "subtitle": "Abscess, Meningitis, Encephalitis & Ring-Enhancing Lesions",
        "script": (
            "Brain abscesses show smooth thin-walled ring enhancement with restricted diffusion on DWI — the key "
            "feature distinguishing them from necrotic tumors. Herpes encephalitis targets the temporal lobes and insular "
            "cortex. Meningitis shows leptomeningeal enhancement. Toxoplasmosis in immunocompromised patients produces "
            "multiple ring-enhancing lesions in the basal ganglia."
        ),
    },
    {
        "id": "sec-09",
        "title": "9. Mass Effect & Herniation",
        "subtitle": "Recognizing Neurosurgical Emergencies",
        "script": (
            "Mass effect describes displacement and compression of adjacent brain structures by an expanding lesion. "
            "Critical findings include midline shift (>5mm is significant), effacement of sulci and cisterns, and "
            "ventricular compression. Herniation syndromes — subfalcine, uncal, and tonsillar — represent life-threatening "
            "emergencies requiring urgent neurosurgical intervention."
        ),
    },
    {
        "id": "sec-10",
        "title": "10. Pediatric Brain MRI",
        "subtitle": "Developmental Anomalies & Posterior Fossa Tumors",
        "script": (
            "Pediatric neuroradiology requires understanding normal myelination patterns, which progress from posterior "
            "to anterior and inferior to superior. Key developmental anomalies include Chiari malformations, Dandy-Walker "
            "spectrum, and agenesis of the corpus callosum. Common posterior fossa tumors in children include "
            "medulloblastoma (vermis, restricted diffusion) and ependymoma (4th ventricle floor)."
        ),
    },
    {
        "id": "sec-11",
        "title": "11. Advanced MRI Techniques",
        "subtitle": "Spectroscopy, Perfusion, DTI & fMRI",
        "script": (
            "MR Spectroscopy measures metabolite ratios to characterize lesions: elevated choline suggests neoplasm, "
            "while amino acid peaks suggest abscess. Perfusion MRI (rCBV) differentiates tumor recurrence from radiation "
            "necrosis. DTI tractography maps white matter pathways for neurosurgical planning. Functional MRI maps "
            "cortical activation for pre-surgical language and motor localization."
        ),
    },
    {
        "id": "sec-12",
        "title": "12. Systematic MRI Interpretation",
        "subtitle": "A Structured Approach to Brain MRI Reading",
        "script": (
            "Always follow a systematic approach: (1) Check technical adequacy and patient demographics; (2) Assess "
            "symmetry and midline structures; (3) Evaluate gray matter, white matter, and CSF spaces; (4) Review "
            "the ventricular system for size and symmetry; (5) Examine the posterior fossa and skull base; (6) Correlate "
            "findings across all sequences; (7) Formulate a structured differential diagnosis."
        ),
    },
    {
        "id": "sec-13",
        "title": "13. Clinical Correlation & Safety",
        "subtitle": "Integrating Imaging with Clinical Findings",
        "script": (
            "MRI findings must always be correlated with clinical history, neurological examination, and laboratory data. "
            "AI-assisted tools like AXONOVA can highlight features and accelerate learning, but final diagnostic judgment "
            "requires qualified radiologists and clinicians. Always remember: treat the patient, not the scan."
        ),
    },
]


def evaluate_viva_answer(
    question_id: str,
    question: str,
    category: str,
    student_answer: str,
) -> Dict[str, Any]:
    """
    Evaluates a student's spoken or typed answer against established key concepts.
    Provides honest, formative educational feedback without claiming omniscience.
    """
    matched_q = next((q for q in VIVA_QUESTIONS if q["id"] == question_id), None)
    if not matched_q:
        matched_q = {
            "id": question_id,
            "category": category,
            "question": question,
            "key_phrases": ["mri", "brain", "signal", "contrast", "lesion", "sequence"],
            "suggested_answer": "A comprehensive response should cover relevant MRI physics, anatomical considerations, and clinical significance.",
            "teaching_guidance": "Review the relevant neuroradiology and MRI fundamentals chapter.",
        }

    answer_lower = student_answer.lower().strip()
    key_phrases = matched_q.get("key_phrases", [])

    covered = []
    missing = []

    for phrase in key_phrases:
        pattern = r"\b" + re.escape(phrase.lower()) + r"\b"
        if re.search(pattern, answer_lower) or phrase.lower() in answer_lower:
            covered.append(phrase)
        else:
            missing.append(phrase)

    # Determine qualitative feedback score
    ratio = len(covered) / len(key_phrases) if key_phrases else 0.5
    if ratio >= 0.65:
        score_label = "Strong Clinical Understanding"
        feedback = (
            "Excellent! You demonstrated solid command of the MRI concepts and clinical implications. "
            "Your answer integrates key radiological terminology and reasoning effectively."
        )
    elif ratio >= 0.35:
        score_label = "Good Foundational Knowledge"
        feedback = (
            "Good start! You covered several key concepts. To strengthen your answer for clinical practice, "
            "try to incorporate the missing radiological and anatomical points highlighted below."
        )
    else:
        score_label = "Needs Further Study"
        feedback = (
            "Your answer touches on the topic, but is missing several important MRI and clinical concepts. "
            "Review the suggested answer below and focus on understanding the imaging characteristics and "
            "clinical significance of each finding."
        )

    return {
        "question_id": question_id,
        "key_points_covered": covered,
        "key_points_missing": missing,
        "suggested_answer": matched_q["suggested_answer"],
        "feedback": feedback,
        "score_label": score_label,
        "disclaimer": (
            "AXONOVA Viva feedback is an automated educational aid designed for medical student MRI learning practice. "
            "It does not represent formal academic grading or clinical diagnostic guidance."
        ),
    }
