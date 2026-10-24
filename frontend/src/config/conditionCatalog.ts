import { CatalogCondition } from '../types';

export interface CatalogCategoryMeta {
  key: string;
  name: string;
  letter: string;
  description: string;
  color: string;
}

export const CATALOG_CATEGORIES: CatalogCategoryMeta[] = [
  {
    key: 'tumors_masses',
    letter: 'A',
    name: 'Tumors and other masses',
    description: 'Primary and secondary intra-axial and extra-axial intracranial neoplasms and cyst-like mass lesions.',
    color: 'emerald',
  },
  {
    key: 'vascular_stroke',
    letter: 'B',
    name: 'Vascular and stroke-related findings',
    description: 'Ischemia, acute arterial territory infarction, intracranial hemorrhage, aneurysms, and vascular malformations.',
    color: 'rose',
  },
  {
    key: 'demyelinating_inflammatory',
    letter: 'C',
    name: 'Demyelinating and inflammatory conditions',
    description: 'Autoimmune white-matter demyelination, perivenular plaques, encephalitis, and meningeal inflammations.',
    color: 'teal',
  },
  {
    key: 'infection',
    letter: 'D',
    name: 'Infection-related conditions',
    description: 'Pyogenic abscesses, parasitic cysts, ventriculitis, and granulomatous intracranial infections.',
    color: 'amber',
  },
  {
    key: 'neurodegenerative_cognitive',
    letter: 'E',
    name: 'Neurodegenerative and cognitive findings',
    description: 'Structural volumetric atrophy patterns, hippocampal volume loss, frontotemporal thinning, and parkinsonian signatures.',
    color: 'purple',
  },
  {
    key: 'trauma',
    letter: 'F',
    name: 'Trauma-related findings',
    description: 'Parenchymal contusions, diffuse axonal shearing injuries, and traumatic extra-axial hematomas.',
    color: 'amber',
  },
  {
    key: 'structural_csf',
    letter: 'G',
    name: 'Structural, developmental, and CSF findings',
    description: 'Ventricular enlargement, hydrocephalus, congenital malformations, Chiari herniation, and leukoencephalopathies.',
    color: 'blue',
  },
  {
    key: 'epilepsy',
    letter: 'H',
    name: 'Epilepsy-related imaging assessment',
    description: 'Hippocampal sclerosis, focal cortical dysplasias, and structural epileptogenic substrates.',
    color: 'indigo',
  },
  {
    key: 'pituitary_cranial_region',
    letter: 'I',
    name: 'Pituitary, cranial nerve, & region-specific',
    description: 'Sellar/parasellar pathology, optic pathway lesions, cerebellopontine-angle masses, and posterior fossa anomalies.',
    color: 'cyan',
  },
  {
    key: 'incidental_other',
    letter: 'J',
    name: 'Other / incidental findings',
    description: 'Benign pineal cysts, sinus/mastoid mucosal opacification, vascular anatomic variations, and indeterminate lesions.',
    color: 'slate',
  },
];

export const BROAD_CONDITION_CATALOG: CatalogCondition[] = [
  {
    "id": "glioma-glioblastoma",
    "name": "Glioma and Glioblastoma",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Intra-axial neuroepithelial neoplasms ranging from low-grade astrocytoma / oligodendroglioma to grade IV glioblastoma, showing infiltrative borders and variable ring enhancement.",
    "relevant_sequences": [
      "T1-weighted Contrast-Enhanced",
      "T2-weighted",
      "FLAIR",
      "Perfusion MRI",
      "MR Spectroscopy"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "T1 post-contrast demonstrates heterogeneous peripheral ring enhancement with central necrosis in glioblastoma; FLAIR demonstrates surrounding vasogenic edema.",
    "clinical_caveats": "Definitive diagnosis requires stereotactic or open biopsy with IDH mutation and MGMT promoter methylation profiling."
  },
  {
    "id": "meningioma",
    "name": "Meningioma",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Predominantly benign extra-axial intracranial tumors arising from arachnoid cap cells, commonly adherent to the dura mater along cerebral convexities, falx, or sphenoid wing.",
    "relevant_sequences": [
      "T1-weighted Contrast-Enhanced",
      "T2-weighted",
      "FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "Characterized by broad dural attachment, prominent homogeneous post-contrast enhancement, and the classic 'dural tail' sign.",
    "clinical_caveats": "Atypical (Grade II) and anaplastic (Grade III) meningiomas can mimic aggressive dural metastases."
  },
  {
    "id": "pituitary-adenoma",
    "name": "Pituitary-Region Tumors (Pituitary Adenoma)",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Benign neoplasms arising from anterior pituitary cells within the sella turcica, categorized into microadenomas (<10mm) and macroadenomas (>=10mm).",
    "relevant_sequences": [
      "Dedicated Coronal Dynamic T1+Gd",
      "T2-weighted",
      "Sagittal T1"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "Macroadenomas show sellar enlargement with upward suprasellar extension, causing compression of the optic chiasm ('snowman' or figure-of-8 appearance).",
    "clinical_caveats": "Endocrine hormone panels (prolactin, GH, ACTH, cortisol) and visual field testing are essential for management."
  },
  {
    "id": "brain-metastases",
    "name": "Brain Metastases",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Secondary intracranial malignant lesions originating most commonly from primary lung, breast, melanoma, renal cell, or colorectal carcinomas.",
    "relevant_sequences": [
      "Thin-slice 3D T1+Gd (3T)",
      "FLAIR",
      "DWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "Typically multiple, well-circumscribed rounded masses located at gray-white matter junctions with disproportionate surrounding vasogenic edema.",
    "clinical_caveats": "Must be differentiated from primary high-grade glioma and multifocal pyogenic abscesses."
  },
  {
    "id": "primary-cns-lymphoma",
    "name": "Primary CNS Lymphoma",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Aggressive extranodal non-Hodgkin lymphoma restricted to brain, leptomeninges, eyes, or spinal cord, showing high cellular density.",
    "relevant_sequences": [
      "T1+Gd",
      "DWI (b=1000)",
      "ADC Map",
      "T2-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "Deep periventricular or subependymal masses exhibiting marked restricted diffusion on DWI/ADC and dense, uniform enhancement.",
    "clinical_caveats": "Corticosteroids must be withheld prior to biopsy to avoid non-diagnostic histology."
  },
  {
    "id": "other-intracranial-tumors",
    "name": "Other Intracranial Tumors or Masses",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Heterogeneous category encompassing ependymomas, medulloblastomas, craniopharyngiomas, chordomas, and pineal parenchymal tumors.",
    "relevant_sequences": [
      "Multiplanar T1+Gd",
      "T2-weighted",
      "FLAIR",
      "CISS / FIESTA"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "Anatomical location (posterior fossa, sellar/suprasellar, pineal) strongly guides differential diagnosis.",
    "clinical_caveats": "Requires pediatric or adult multidisciplinary neuro-oncology board review."
  },
  {
    "id": "benign-cysts",
    "name": "Benign-Appearing Cysts & Cystic Lesions",
    "category": "A. Tumors and other masses",
    "category_key": "tumors_masses",
    "description": "Fluid-filled non-neoplastic spaces including arachnoid cysts, epidermoid cysts, colloid cysts of the third ventricle, and enlarged Virchow-Robin spaces.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "FLAIR",
      "DWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-brain-tumor-cnn",
    "imaging_notes": "Arachnoid cysts follow pure CSF signal on all sequences and completely suppress on FLAIR; epidermoid cysts restrict on DWI.",
    "clinical_caveats": "Colloid cysts at the foramen of Monro carry risk of acute obstructive hydrocephalus and sudden death."
  },
  {
    "id": "ischemic-stroke",
    "name": "Ischemic Stroke / Cerebral Infarction",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Acute focal brain tissue infarction caused by thrombotic or embolic occlusion of a cerebral artery, leading to cytotoxic intracellular edema.",
    "relevant_sequences": [
      "Diffusion-Weighted Imaging (DWI b=1000)",
      "Apparent Diffusion Coefficient (ADC) Map",
      "T2-FLAIR",
      "MRA Head & Neck"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Acute phase (<24h) exhibits bright hyperintensity on DWI with corresponding dark hypointensity on ADC map within a vascular territory.",
    "clinical_caveats": "Time from symptom onset is paramount; thrombolysis and mechanical thrombectomy eligibility require immediate emergency team assessment."
  },
  {
    "id": "hemorrhagic-stroke",
    "name": "Hemorrhagic Stroke / Intracranial Hemorrhage",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Spontaneous extravasation of blood into the brain parenchyma, subarachnoid space, or ventricles, most commonly from hypertensive vasculopathy or amyloid angiopathy.",
    "relevant_sequences": [
      "T2* GRE",
      "SWI (Susceptibility-Weighted)",
      "T1-weighted",
      "CT Angiography"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Signal depends on hemoglobin oxidation state (hyperacute oxyhemoglobin, acute deoxyhemoglobin, subacute methemoglobin, chronic hemosiderin rim on SWI/GRE).",
    "clinical_caveats": "Emergency non-contrast CT is first-line; MRI SWI offers superior sensitivity for chronic microbleeds."
  },
  {
    "id": "chronic-small-vessel",
    "name": "Chronic Small-Vessel Ischemic Changes",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Microvascular cerebral ischemic changes manifested by deep and periventricular white matter hyperintensities, enlarged perivascular spaces, and lacunes.",
    "relevant_sequences": [
      "T2-FLAIR",
      "T2-weighted",
      "T1-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Bilateral, symmetric patchy or confluent T2/FLAIR hyperintensities graded by the Fazekas scale; sparing subcortical U-fibers.",
    "clinical_caveats": "Strongly correlated with vascular risk factors (hypertension, diabetes), vascular cognitive impairment, and gait dysfunction."
  },
  {
    "id": "cerebral-aneurysm",
    "name": "Cerebral Aneurysm",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Focal dilation of an intracranial arterial wall, most commonly saccular ('berry') aneurysms located at Circle of Willis bifurcations.",
    "relevant_sequences": [
      "3D Time-of-Flight (TOF) MRA",
      "Contrast MRA",
      "CTA",
      "DSA"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Focal outpouching from an arterial lumen on TOF MRA, frequently showing signal void on spin-echo T2 images due to rapid turbulent flow.",
    "clinical_caveats": "Rupture risk increases with size (>7mm), anterior communicating / posterior communicating location, and daughter sac morphology."
  },
  {
    "id": "vascular-malformations",
    "name": "Vascular Malformations",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Congenital vascular anomalies including Arteriovenous Malformations (AVM), Cavernous Malformations (cavernomas), and Developmental Venous Anomalies (DVA).",
    "relevant_sequences": [
      "SWI / GRE",
      "T2-weighted",
      "3D TOF MRA",
      "Catheter Angiography"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Cavernomas show a classic 'popcorn' appearance on T2 with a complete surrounding ring of dark hemosiderin blooming on SWI.",
    "clinical_caveats": "High-flow AVMs carry risk of intracranial hemorrhage and seizure generation; Spetzler-Martin grading guides surgical resection."
  },
  {
    "id": "cerebral-venous-thrombosis",
    "name": "Cerebral Venous Thrombosis-Related Findings",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Occlusion of dural venous sinuses (superior sagittal, transverse, sigmoid) or deep cerebral veins, causing venous congestion and venous infarction.",
    "relevant_sequences": [
      "MR Venography (MRV 2D-TOF or Contrast)",
      "T1+Gd",
      "FLAIR",
      "SWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Absence of normal flow void on spin echo and 'empty delta sign' on contrast-enhanced MRV within the superior sagittal sinus.",
    "clinical_caveats": "Presents with severe headache, papilledema, and seizures; requires anticoagulation even in the presence of venous hemorrhage."
  },
  {
    "id": "old-infarct-changes",
    "name": "Old Infarct or Stroke-Related Changes",
    "category": "B. Vascular and stroke-related findings",
    "category_key": "vascular_stroke",
    "description": "Chronic sequelae of prior territorial or lacunar cerebral infarction characterized by encephalomalacia, gliosis, and ex-vacuo ventricular dilatation.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-FLAIR",
      "T2-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-stroke-cnn",
    "imaging_notes": "Tissue loss with CSF-like signal intensity on T1 and T2, surrounded by a rim of hyperintense gliosis on FLAIR without restricted diffusion.",
    "clinical_caveats": "Indicates established vascular disease and elevated risk of recurrent cerebrovascular events."
  },
  {
    "id": "multiple-sclerosis",
    "name": "Multiple Sclerosis (MS)",
    "category": "C. Demyelinating and inflammatory conditions",
    "category_key": "demyelinating_inflammatory",
    "description": "Chronic autoimmune inflammatory disease of the central nervous system resulting in multifocal perivenular demyelination and neuro-axonal degeneration.",
    "relevant_sequences": [
      "T2-FLAIR Sagittal & Axial",
      "T1+Gd",
      "DIR (Double Inversion Recovery)",
      "Spinal Cord MRI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-ms-cnn",
    "imaging_notes": "Ovoid T2-FLAIR hyperintensities perpendicular to the ventricles ('Dawson\u2019s fingers'), callosal-septal interface lesions, and juxtacortical plaques.",
    "clinical_caveats": "Active inflammatory lesions demonstrate transient nodular or open-ring contrast enhancement lasting 4-6 weeks."
  },
  {
    "id": "other-demyelinating-lesions",
    "name": "Other Demyelinating Lesions (ADEM / NMOSD / MOGAD)",
    "category": "C. Demyelinating and inflammatory conditions",
    "category_key": "demyelinating_inflammatory",
    "description": "Non-MS demyelinating syndromes including Neuromyelitis Optica Spectrum Disorder (AQP4-positive), MOG antibody-associated disease, and Acute Disseminated Encephalomyelitis.",
    "relevant_sequences": [
      "T2-FLAIR",
      "Orbit T1+Gd with Fat Suppression",
      "Spinal Cord MRI",
      "T1+Gd"
    ],
    "model_availability": "Available",
    "model_id": "axonova-ms-cnn",
    "imaging_notes": "NMOSD features longitudinally extensive optic neuritis and transverse myelitis (>3 vertebral segments) with hypothalamic/periependymal involvement.",
    "clinical_caveats": "Serum AQP4-IgG and MOG-IgG titers are diagnostic and critical for initiating disease-specific immunotherapy."
  },
  {
    "id": "encephalitis-related-findings",
    "name": "Encephalitis-Related Abnormalities",
    "category": "C. Demyelinating and inflammatory conditions",
    "category_key": "demyelinating_inflammatory",
    "description": "Acute or subacute inflammation of the brain parenchyma caused by viral infection (e.g. Herpes Simplex Virus) or autoimmune antibodies (e.g. anti-NMDAR).",
    "relevant_sequences": [
      "T2-FLAIR",
      "DWI",
      "T1+Gd"
    ],
    "model_availability": "Available",
    "model_id": "axonova-ms-cnn",
    "imaging_notes": "HSV encephalitis shows marked asymmetric temporal and inferior frontal lobe T2/FLAIR hyperintensity with restricted diffusion and gyral enhancement.",
    "clinical_caveats": "Emergency CSF PCR analysis and empiric IV acyclovir must be initiated without waiting for MRI completion in suspected HSV."
  },
  {
    "id": "meningitis-related-findings",
    "name": "Meningitis-Related Abnormalities",
    "category": "C. Demyelinating and inflammatory conditions",
    "category_key": "demyelinating_inflammatory",
    "description": "Inflammation of the pia and arachnoid mater; visible on brain MRI when accompanied by pachymeningeal or leptomeningeal enhancement or complications.",
    "relevant_sequences": [
      "Post-contrast 3D FLAIR",
      "T1+Gd with Fat Saturation",
      "DWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-ms-cnn",
    "imaging_notes": "Diffuse smooth or nodular leptomeningeal enhancement tracking into cortical sulci; post-contrast FLAIR is significantly more sensitive than T1+Gd.",
    "clinical_caveats": "Lumbar puncture with CSF culture, Gram stain, and viral/fungal panels is the mandatory diagnostic gold standard."
  },
  {
    "id": "autoimmune-inflammatory-brain",
    "name": "Autoimmune or Inflammatory Brain Abnormalities",
    "category": "C. Demyelinating and inflammatory conditions",
    "category_key": "demyelinating_inflammatory",
    "description": "Systemic or primary autoimmune inflammatory conditions affecting brain tissue, including CNS vasculitis, neurosarcoidosis, and SLE cerebritis.",
    "relevant_sequences": [
      "T2-FLAIR",
      "High-Resolution Vessel Wall MRI",
      "T1+Gd",
      "DWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-ms-cnn",
    "imaging_notes": "CNS vasculitis demonstrates multifocal subcortical ischemic lesions of varying ages with concentric arterial vessel-wall enhancement.",
    "clinical_caveats": "Autoimmune serum/CSF antibody panels and brain biopsy remain necessary for definitive diagnosis."
  },
  {
    "id": "brain-abscess",
    "name": "Brain Abscess",
    "category": "D. Infection-related conditions",
    "category_key": "infection",
    "description": "Focal intracerebral pyogenic infection progressing through early and late cerebritis to an organized, encapsulated purulent cavity.",
    "relevant_sequences": [
      "DWI (b=1000)",
      "ADC Map",
      "T1+Gd",
      "T2-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-infection-cnn",
    "imaging_notes": "Classic hallmark is central cavity hyperintensity on DWI with very low ADC (marked restricted diffusion due to viscous pus) and thin smooth rim enhancement.",
    "clinical_caveats": "Must be differentiated from necrotic high-grade glioblastoma or cystic metastasis, which show facilitated diffusion in the necrotic core."
  },
  {
    "id": "infectious-lesions",
    "name": "Infectious Lesions (Toxoplasmosis / Tuberculoma / Neurocysticercosis)",
    "category": "D. Infection-related conditions",
    "category_key": "infection",
    "description": "Parasitic, fungal, or mycobacterial focal infectious masses commonly seen in endemic regions or immunocompromised hosts.",
    "relevant_sequences": [
      "T1+Gd",
      "T2-weighted",
      "FLAIR",
      "SWI / T2* GRE"
    ],
    "model_availability": "Available",
    "model_id": "axonova-infection-cnn",
    "imaging_notes": "Neurocysticercosis demonstrates scolex on CISS/FIESTA; tuberculomas exhibit central T2 hypointensity with nodular/ring enhancement; toxoplasmosis shows 'eccentric target sign'.",
    "clinical_caveats": "Serological testing (HIV, Toxoplasma IgG, cysticercus western blot) and chest imaging guide diagnostic management."
  },
  {
    "id": "suspected-intracranial-infection",
    "name": "Other Suspected Intracranial Infection-Related Abnormalities",
    "category": "D. Infection-related conditions",
    "category_key": "infection",
    "description": "Includes subdural empyema, epidural abscess, ventriculitis, fungal cerebritis (e.g. Aspergillosis, Mucormycosis), and cryptococcal gelatinous pseudocysts.",
    "relevant_sequences": [
      "DWI",
      "T1+Gd",
      "FLAIR",
      "Post-contrast FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-infection-cnn",
    "imaging_notes": "Ventriculitis shows intraventricular debris with restricted diffusion and ependymal enhancement; subdural empyema demonstrates extra-axial restricted fluid.",
    "clinical_caveats": "Neurosurgical emergency: empyema requires urgent surgical evacuation to prevent uncal herniation and venous infarction."
  },
  {
    "id": "alzheimers-structural",
    "name": "Alzheimer\u2019s Disease-Related Structural Changes",
    "category": "E. Neurodegenerative and cognitive-disorder-related findings",
    "category_key": "neurodegenerative_cognitive",
    "description": "Characteristic progressive neurodegenerative pattern marked by disproportionate medial temporal lobe, hippocampal, and parietal cortical atrophy.",
    "relevant_sequences": [
      "T1-weighted MPRAGE",
      "T1-weighted",
      "T2-FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-alzheimers-cnn",
    "imaging_notes": "Bilateral hippocampal volume reduction, widening of the choroidal fissure, and dilation of the temporal horn of the lateral ventricle (Scheltens MTA Scale >= 2).",
    "clinical_caveats": "MRI findings alone do not establish Alzheimer's diagnosis; clinical cognitive testing, CSF amyloid/tau, and amyloid PET are required."
  },
  {
    "id": "frontotemporal-dementia",
    "name": "Frontotemporal Dementia-Related Patterns",
    "category": "E. Neurodegenerative and cognitive-disorder-related findings",
    "category_key": "neurodegenerative_cognitive",
    "description": "Heterogeneous neurodegenerative disorder with prominent asymmetric lobar atrophy of the frontal and anterior temporal lobes, sparing the parietal lobes.",
    "relevant_sequences": [
      "T1-weighted MPRAGE",
      "T2-FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-alzheimers-cnn",
    "imaging_notes": "'Knife-blade' gyral thinning selectively localized to fronto-insular and anterior temporal cortices; marked asymmetry is common in semantic variant PPA.",
    "clinical_caveats": "Behavioral variant FTD requires clinical psychiatric assessment, neuropsychological testing, and FDG-PET hypometabolism correlation."
  },
  {
    "id": "lewy-body-dementia",
    "name": "Lewy Body Dementia-Related Imaging Assessment",
    "category": "E. Neurodegenerative and cognitive-disorder-related findings",
    "category_key": "neurodegenerative_cognitive",
    "description": "Neurodegenerative dementia characterized by alpha-synuclein Lewy bodies; MRI structural atrophy is often mild and less temporally localized than AD.",
    "relevant_sequences": [
      "T1-weighted",
      "DaTscan (SPECT/PET)",
      "T2-FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-alzheimers-cnn",
    "imaging_notes": "Relative preservation of medial temporal lobe volume compared to Alzheimer's disease; structural MRI is primarily used to rule out vascular pathology.",
    "clinical_caveats": "Diagnosis relies on clinical hallmarks (fluctuating cognition, visual hallucinations, REM sleep behavior disorder, parkinsonism) and DaTscan."
  },
  {
    "id": "parkinsonian-disorders",
    "name": "Parkinsonian Disorder-Related Imaging Assessment",
    "category": "E. Neurodegenerative and cognitive-disorder-related findings",
    "category_key": "neurodegenerative_cognitive",
    "description": "Evaluation for atypical parkinsonian syndromes (Progressive Supranuclear Palsp, Multiple System Atrophy, Corticobasal Degeneration).",
    "relevant_sequences": [
      "T2-weighted",
      "SWI",
      "T1-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-alzheimers-cnn",
    "imaging_notes": "PSP shows midbrain atrophy with thinning of the superior colliculus ('hummingbird sign' on sagittal T1); MSA shows 'hot cross bun sign' in the pons.",
    "clinical_caveats": "Idiopathic Parkinson's disease shows normal structural MRI; neuromelanin-sensitive MRI and DaTscan provide functional correlation."
  },
  {
    "id": "brain-atrophy-patterns",
    "name": "Brain Atrophy Patterns",
    "category": "E. Neurodegenerative and cognitive-disorder-related findings",
    "category_key": "neurodegenerative_cognitive",
    "description": "Generalized or regional reduction in parenchymal brain volume, sulcal enlargement, and ventricular dilatation secondary to aging, toxic exposures, or chronic disease.",
    "relevant_sequences": [
      "T1-weighted MPRAGE",
      "T1-weighted",
      "T2-FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-alzheimers-cnn",
    "imaging_notes": "Distinguishes symmetric generalized physiological involution from accelerated focal regional lobar loss.",
    "clinical_caveats": "Must be interpreted in the context of the patient's exact chronological age and cognitive status."
  },
  {
    "id": "mild-cognitive-impairment",
    "name": "Mild Cognitive Impairment-Related Research Assessment",
    "category": "E. Neurodegenerative and cognitive-disorder-related findings",
    "category_key": "neurodegenerative_cognitive",
    "description": "Transitional intermediate state between age-appropriate cognitive decline and dementia; evaluated for subtle longitudinal entorhinal thinning.",
    "relevant_sequences": [
      "T1-weighted MPRAGE",
      "Resting-State fMRI",
      "DTI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-alzheimers-cnn",
    "imaging_notes": "Subtle, borderline hippocampal and entorhinal volume reduction that does not meet full criteria for marked cortical dementia.",
    "clinical_caveats": "A substantial proportion of MCI cases remain stable or revert to normal; multimodal risk scores (APOE, CSF p-tau) refine prognosis."
  },
  {
    "id": "tbi-abnormalities",
    "name": "Traumatic Brain Injury-Related Abnormalities",
    "category": "F. Trauma-related findings",
    "category_key": "trauma",
    "description": "Acute or chronic biomechanical insult to the brain parenchyma resulting from blunt impact, acceleration-deceleration, or blast injury.",
    "relevant_sequences": [
      "SWI / GRE",
      "T2-FLAIR",
      "DWI",
      "Non-contrast CT"
    ],
    "model_availability": "Available",
    "model_id": "axonova-trauma-tbi-net",
    "imaging_notes": "Detects parenchymal petechiae, cortical contusions, traumatic subarachnoid hemorrhage, and secondary edema.",
    "clinical_caveats": "Initial acute trauma evaluation requires emergency CT to rule out surgical mass lesions and skull fractures."
  },
  {
    "id": "traumatic-intracranial-bleeding",
    "name": "Traumatic Intracranial Bleeding",
    "category": "F. Trauma-related findings",
    "category_key": "trauma",
    "description": "Post-traumatic hemorrhage across intracranial compartments, including subarachnoid hemorrhage, intraventricular bleeding, and intraparenchymal hematoma.",
    "relevant_sequences": [
      "SWI",
      "T2* GRE",
      "FLAIR",
      "CT Head"
    ],
    "model_availability": "Available",
    "model_id": "axonova-trauma-tbi-net",
    "imaging_notes": "SWI demonstrates hypointense signal blooming from paramagnetic blood breakdown products.",
    "clinical_caveats": "May rapidly evolve; repeat imaging is indicated upon clinical neurological deterioration."
  },
  {
    "id": "subdural-epidural-hematoma",
    "name": "Subdural or Epidural Hematoma",
    "category": "F. Trauma-related findings",
    "category_key": "trauma",
    "description": "Extra-axial traumatic collections: Epidural hematoma (arterial, middle meningeal artery) vs. Subdural hematoma (venous, bridging veins).",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "FLAIR",
      "CT Head"
    ],
    "model_availability": "Available",
    "model_id": "axonova-trauma-tbi-net",
    "imaging_notes": "Epidural: biconvex (lenticular) lens-shaped extra-axial mass limited by cranial sutures. Subdural: crescentic collection crossing suture lines but limited by dural reflections.",
    "clinical_caveats": "Acute epidural and large subdural hematomas with midline shift >5mm are neurosurgical emergencies requiring immediate operative craniotomy."
  },
  {
    "id": "brain-contusion",
    "name": "Brain Contusion",
    "category": "F. Trauma-related findings",
    "category_key": "trauma",
    "description": "Coup and contrecoup parenchymal focal bruises, commonly involving the inferior frontal lobes and anterior temporal poles against the rough sphenoid ridge.",
    "relevant_sequences": [
      "T2-FLAIR",
      "SWI",
      "T2* GRE"
    ],
    "model_availability": "Available",
    "model_id": "axonova-trauma-tbi-net",
    "imaging_notes": "Heterogeneous, patchy areas of T2/FLAIR hyperintense edema interspersed with microhemorrhagic punctate hypointensities on SWI.",
    "clinical_caveats": "Contusions frequently 'blossom' (expand and increase hemorrhage volume) over the first 24 to 72 hours post-injury."
  },
  {
    "id": "diffuse-axonal-injury",
    "name": "Diffuse Axonal Injury-Related Findings",
    "category": "F. Trauma-related findings",
    "category_key": "trauma",
    "description": "Rotational shearing injury of white matter tracts occurring at gray-white junctions, corpus callosum, and dorsolateral rostral brainstem.",
    "relevant_sequences": [
      "Diffusion Tensor Imaging (DTI)",
      "SWI",
      "T2-FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-trauma-tbi-net",
    "imaging_notes": "Multiple punctate microhemorrhages on SWI along the splenium of the corpus callosum and white matter bundles with fractional anisotropy reduction on DTI.",
    "clinical_caveats": "Frequently presents with profound coma and severe neurological impairment despite relatively modest findings on initial CT."
  },
  {
    "id": "hydrocephalus-enlarged-ventricles",
    "name": "Hydrocephalus / Enlarged Ventricles",
    "category": "G. Structural, developmental, and CSF findings",
    "category_key": "structural_csf",
    "description": "Abnormal accumulation of cerebrospinal fluid causing ventricular dilatation; classified into obstructive (non-communicating) and communicating (e.g. Normal Pressure Hydrocephalus).",
    "relevant_sequences": [
      "T2-weighted",
      "FLAIR",
      "T1-weighted",
      "CSF Flow Phase Contrast MRI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-structural-csf-net",
    "imaging_notes": "Evans index > 0.30, acute ventricular angle, transependymal interstitial edema (periventricular FLAIR halo), and disproportionate subarachnoid-space enlargement (DESH) in NPH.",
    "clinical_caveats": "NPH features the classic triad: gait disturbance, urinary incontinence, and dementia; CSF tap test evaluates shunt responsiveness."
  },
  {
    "id": "congenital-developmental",
    "name": "Congenital or Developmental Brain Abnormalities",
    "category": "G. Structural, developmental, and CSF findings",
    "category_key": "structural_csf",
    "description": "Structural malformations of cortical development, including lissencephaly, pachygyria, polymicrogyria, schizencephaly, and agenesis of the corpus callosum.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted Multiplanar"
    ],
    "model_availability": "Available",
    "model_id": "axonova-structural-csf-net",
    "imaging_notes": "Agenesis of corpus callosum shows parallel lateral ventricles ('racing car' sign) and Colpocephaly; polymicrogyria shows irregular thickened cortex with bumpy gray-white interface.",
    "clinical_caveats": "Major cause of refractory pediatric and adult epilepsy; requires correlation with clinical genetics."
  },
  {
    "id": "chiari-malformation",
    "name": "Chiari Malformation",
    "category": "G. Structural, developmental, and CSF findings",
    "category_key": "structural_csf",
    "description": "Cerebellar tonsillar herniation through the foramen magnum into the upper cervical spinal canal (Chiari I: >=5mm below the basion-opisthion line).",
    "relevant_sequences": [
      "Sagittal T1-weighted",
      "Sagittal T2-weighted",
      "Cervical Spine T2"
    ],
    "model_availability": "Available",
    "model_id": "axonova-structural-csf-net",
    "imaging_notes": "Pointed, peg-like tonsillar descent below foramen magnum; frequent association with cervical spinal cord syrinx (syringomyelia).",
    "clinical_caveats": "Posterior fossa decompression is indicated in symptomatic tonsillar crowding or progressive syringomyelia."
  },
  {
    "id": "structural-seizure-abnormalities",
    "name": "Structural Abnormalities Associated with Seizure Disorders",
    "category": "G. Structural, developmental, and CSF findings",
    "category_key": "structural_csf",
    "description": "Focal epileptogenic architectural substrates including focal cortical dysplasia (FCD), subcortical heterotopia, and cavernous malformations.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-structural-csf-net",
    "imaging_notes": "FCD Type II demonstrates cortical thickening, blurring of gray-white matter junction, and a linear T2/FLAIR hyperintense band tapering toward the ventricle ('transmantle sign').",
    "clinical_caveats": "High-resolution 3T MRI with dedicated thin-slice oblique sequences perpendicular to the long axis of the hippocampus is required."
  },
  {
    "id": "white-matter-abnormalities",
    "name": "White Matter Abnormalities (Leukoencephalopathy)",
    "category": "G. Structural, developmental, and CSF findings",
    "category_key": "structural_csf",
    "description": "Diffuse or confluent white matter hyperintensities stemming from hereditary leukodystrophies, toxic leukoencephalopathy, radiation necrosis, or vasculitis.",
    "relevant_sequences": [
      "Diffusion Tensor Imaging (DTI)",
      "T2-FLAIR",
      "DWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-structural-csf-net",
    "imaging_notes": "Bilateral, symmetric deep white matter T2 prolongation; sparing vs. involvement of subcortical U-fibers aids differential diagnosis.",
    "clinical_caveats": "Requires detailed occupational/toxic exposure history and metabolic / genetic screening."
  },
  {
    "id": "epilepsy-structural-lesions",
    "name": "Structural Lesions Associated with Seizures",
    "category": "H. Epilepsy-related imaging assessment",
    "category_key": "epilepsy",
    "description": "Low-grade epileptogenic tumors such as Dysembryoplastic Neuroepithelial Tumors (DNET), Gangliogliomas, and hypothalamic hamartomas.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-epilepsy-mri-net",
    "imaging_notes": "DNET exhibits a 'soap-bubble' multinodular cortical/subcortical T2 hyperintense appearance; gangliogliomas show cystic mass with an enhancing mural nodule.",
    "clinical_caveats": "Often drug-resistant; surgical lesionectomy provides high rates of seizure freedom."
  },
  {
    "id": "hippocampal-sclerosis",
    "name": "Hippocampal Sclerosis / Mesial Temporal Sclerosis",
    "category": "H. Epilepsy-related imaging assessment",
    "category_key": "epilepsy",
    "description": "Most common pathology in adult drug-resistant temporal lobe epilepsy, characterized by neuronal loss and astrogliosis within the CA1, CA4, and dentate regions.",
    "relevant_sequences": [
      "Coronal Oblique T2",
      "Coronal FLAIR",
      "T1-weighted MPRAGE"
    ],
    "model_availability": "Available",
    "model_id": "axonova-epilepsy-mri-net",
    "imaging_notes": "Unilateral hippocampal volume loss, loss of normal internal digitations, and elevated T2/FLAIR signal intensity in the hippocampal body and head.",
    "clinical_caveats": "Concordance with video-EEG telemetry and neuropsychological memory assessment is mandatory prior to anterior temporal lobectomy."
  },
  {
    "id": "sellar-pituitary-abnormalities",
    "name": "Pituitary Gland & Sellar-Region Abnormalities",
    "category": "I. Pituitary, cranial nerve, and region-specific findings",
    "category_key": "pituitary_cranial_region",
    "description": "Non-adenomatous sellar pathology including Rathke cleft cysts, craniopharyngiomas, lymphocytic hypophysitis, and empty sella syndrome.",
    "relevant_sequences": [
      "T1-weighted Contrast-Enhanced",
      "T2-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-sellar-cpa-net",
    "imaging_notes": "Rathke cleft cysts feature non-enhancing intra-sellar cystic fluid with an intracystic non-enhancing waxy nodule; craniopharyngiomas feature calcification and cystic suprasellar mass.",
    "clinical_caveats": "Pituitary infundibular thickening >3mm suggests inflammatory hypophysitis, germinoma, or histiocytosis."
  },
  {
    "id": "optic-pathway-abnormalities",
    "name": "Optic Pathway Abnormalities",
    "category": "I. Pituitary, cranial nerve, and region-specific findings",
    "category_key": "pituitary_cranial_region",
    "description": "Lesions affecting the intra-orbital, canalicular, or cisternal optic nerves, optic chiasm, and optic tracts (e.g. optic neuritis, optic glioma, meningioma).",
    "relevant_sequences": [
      "Orbit T1+Gd Fat-Suppressed",
      "Coronal T2 FS",
      "FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-sellar-cpa-net",
    "imaging_notes": "Optic neuritis shows focal hyperintensity and avid contrast enhancement of the optic nerve; optic sheath meningioma shows 'tram-track' enhancement on axial images.",
    "clinical_caveats": "Often the presenting sign of MS or MOGAD; standard brain MRI alone frequently misses isolated intra-orbital pathology without dedicated orbit sequences."
  },
  {
    "id": "cpa-cranial-nerve-masses",
    "name": "Cranial Nerve or Cerebellopontine-Angle (CPA) Masses",
    "category": "I. Pituitary, cranial nerve, and region-specific findings",
    "category_key": "pituitary_cranial_region",
    "description": "Masses in the CPA cistern, most commonly Vestibular Schwannoma (acoustic neuroma, CN VIII), meningioma, and epidermoid cyst.",
    "relevant_sequences": [
      "Thin-slice CISS / FIESTA",
      "Internal Auditory Canal T1+Gd",
      "T2-weighted"
    ],
    "model_availability": "Available",
    "model_id": "axonova-sellar-cpa-net",
    "imaging_notes": "Vestibular schwannoma displays an 'ice-cream cone' configuration with the cone extending into the expanded internal acoustic canal and avid contrast enhancement.",
    "clinical_caveats": "Presents with unilateral sensorineural hearing loss and tinnitus; audiometry is mandatory."
  },
  {
    "id": "posterior-fossa-abnormalities",
    "name": "Posterior Fossa Abnormalities",
    "category": "I. Pituitary, cranial nerve, and region-specific findings",
    "category_key": "pituitary_cranial_region",
    "description": "Brainstem and cerebellar pathology including Dandy-Walker malformation, cerebellar hemangioblastoma, pontine myelinolysis, and rhombencephalitis.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "FLAIR",
      "DWI"
    ],
    "model_availability": "Available",
    "model_id": "axonova-sellar-cpa-net",
    "imaging_notes": "Dandy-Walker: cystic dilation of the 4th ventricle, vermian hypoplasia, and elevated tentorium; hemangioblastoma shows hypervascular nodule with prominent flow voids.",
    "clinical_caveats": "Posterior fossa lesions carry acute risk of tonsillar herniation and obstructive hydrocephalus due to tight compartmental anatomy."
  },
  {
    "id": "pineal-incidental-cysts",
    "name": "Pineal Cysts and Other Incidental Cysts",
    "category": "J. Other / incidental findings",
    "category_key": "incidental_other",
    "description": "Common, benign fluid-filled incidental spaces in the pineal gland, choroid plexus, or cavum septum pellucidum / cavum vergae.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "T1+Gd"
    ],
    "model_availability": "Available",
    "model_id": "axonova-incidental-atlas",
    "imaging_notes": "Well-circumscribed unilocular pineal cyst with thin (<2mm) smooth peripheral enhancing rim, without internal septations or nodularity.",
    "clinical_caveats": "Typically asymptomatic; follow-up is only required if >15mm, atypically nodular, or causing tectal compression with Parinaud syndrome."
  },
  {
    "id": "sinus-mastoid-findings",
    "name": "Sinus or Mastoid Findings Visible in Scan Field",
    "category": "J. Other / incidental findings",
    "category_key": "incidental_other",
    "description": "Extracranial inflammatory or mucosal findings captured in the peripheral field of view, including maxillary/ethmoid/frontal sinusitis, retention cysts, and mastoid opacification.",
    "relevant_sequences": [
      "T2-weighted",
      "T1-weighted",
      "FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-incidental-atlas",
    "imaging_notes": "T2 hyperintense mucosal thickening and air-fluid levels in paranasal sinuses and mastoid air cells.",
    "clinical_caveats": "Usually benign incidental sinusitis; however, acute mastoiditis with bony erosion requires urgent ENT evaluation to prevent intracranial abscess."
  },
  {
    "id": "other-incidental-findings",
    "name": "Other Incidental Findings",
    "category": "J. Other / incidental findings",
    "category_key": "incidental_other",
    "description": "Benign anatomic variations such as prominent perivascular spaces, mega cisterna magna, asymptomatic developmental venous anomalies, and calvarial hemangiomas.",
    "relevant_sequences": [
      "T1-weighted",
      "T2-weighted",
      "FLAIR"
    ],
    "model_availability": "Available",
    "model_id": "axonova-incidental-atlas",
    "imaging_notes": "Signal characteristics match normal anatomic structures without mass effect, diffusion restriction, or pathological enhancement.",
    "clinical_caveats": "Identification prevents unnecessary invasive diagnostic workups."
  },
  {
    "id": "unclassified-indeterminate-abnormality",
    "name": "Unclassified or Indeterminate Abnormality",
    "category": "J. Other / incidental findings",
    "category_key": "incidental_other",
    "description": "Atypical parenchymal or extra-axial signal alteration that does not conform to standardized diagnostic criteria or lacks pathognomonic radiological features.",
    "relevant_sequences": [
      "Multimodal Comprehensive MRI Study"
    ],
    "model_availability": "Available",
    "model_id": "axonova-incidental-atlas",
    "imaging_notes": "Visual findings require advanced imaging (MR spectroscopy, perfusion, 7T MRI) or longitudinal interval scanning.",
    "clinical_caveats": "Clinical decision-support rule: AXONOVA will NOT force an indeterminate scan into a disease class. Formal neuroradiologist review is strictly indicated."
  },
];
