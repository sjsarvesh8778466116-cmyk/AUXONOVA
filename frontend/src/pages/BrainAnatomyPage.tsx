import React, { useState } from 'react';
import {
  Brain,
  Layers,
  Rotate3d,
  Sparkles,
  BookOpen,
  Search,
  ChevronRight,
  Eye,
  Activity,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { BrainAnatomyRegion } from '../types';
import RealisticBrainViewer3D from '../components/anatomy/RealisticBrainViewer3D';

// Curated Educational Neuroanatomy Registry with Natural Clinical Colors
const BRAIN_REGIONS: BrainAnatomyRegion[] = [
  {
    id: 'frontal',
    name: 'Frontal Lobe',
    latinName: 'Lobus frontalis',
    category: 'Cerebrum',
    coordinates: { x: 0, y: 35, z: 20 },
    color: '#0284c7', // Professional clinical sky blue
    summary:
      'The largest lobe, governing executive functions, motor planning (precentral gyrus), personality, reasoning, and expressive speech (Broca’s area).',
    functions: [
      'Primary Motor Cortex (Precentral Gyrus)',
      'Broca’s Motor Speech Area (Inferior frontal gyrus)',
      'Executive Working Memory & Planning',
      'Social Inhibition & Behavioral Control',
    ],
    mriSignalCharacteristics: {
      t1: 'Gray matter cortex is isointense to hypointense; subcortical white matter is hyperintense (bright due to myelin lipid content).',
      t2: 'Cortex appears light gray/intermediate; white matter appears darker than cortex.',
      flair: 'Suppresses dark CSF in frontal sulci to highlight peri-cortical edema and subcortical demyelinating lesions.',
      dwi: 'Normal baseline diffusivity; restricted diffusion (bright on DWI, dark on ADC) indicates acute ischemia or high cellularity.',
    },
    pathologicalPredilections: [
      'High-grade and low-grade astrocytomas / oligodendrogliomas',
      'Olfactory groove and parasagittal convexity meningiomas',
      'Frontotemporal Lobar Degeneration (FTD)',
      'Middle & anterior cerebral artery ischemic strokes',
    ],
    radiologicalLandmarks:
      'Bounded posteriorly by the Central Sulcus (of Rolando) and inferiorly by the Sylvian (Lateral) Fissure. The precentral gyrus serves as the primary motor landmark.',
    clinicalNotes:
      'Lesions in the dominant frontal lobe frequently manifest as expressive non-fluent aphasia, contralateral hemiparesis, or apathy/disinhibition syndromes.',
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    latinName: 'Lobus parietalis',
    category: 'Cerebrum',
    coordinates: { x: 0, y: -20, z: 40 },
    color: '#6366f1', // Indigo / Periwinkle
    summary:
      'Integrates primary somatosensory input (postcentral gyrus), visuospatial processing, mathematical cognition, and sensory perception.',
    functions: [
      'Primary Somatosensory Cortex (Postcentral Gyrus)',
      'Spatial Coordinate Mapping & Proprioception',
      'Sensory Integration & Tactile Object Recognition (Stereognosis)',
      'Calculation and Praxis (Angular & Supramarginal gyri)',
    ],
    mriSignalCharacteristics: {
      t1: 'Demonstrates clean corticomedullary differentiation between cortex and subcortical U-fibers.',
      t2: 'Sulcal CSF hyperintensity serves as contrast against darker cortical ribbons.',
      flair: 'Optimal for identifying cortical swelling, subarachnoid hemorrhage, or parietal watershed infarcts.',
      dwi: 'Rapidly identifies acute ischemic strokes in the MCA/PCA watershed zone.',
    },
    pathologicalPredilections: [
      'Convexity and falcine meningiomas along the superior sagittal sinus',
      'Intra-axial glioblastomas infiltrating the parietal white matter',
      'Cortical Alzheimer’s disease atrophy (posterior cortical atrophy variant)',
      'Metastatic deposits at the gray-white matter junction',
    ],
    radiologicalLandmarks:
      'Bounded anteriorly by the Central Sulcus and posteriorly by the Parieto-Occipital Sulcus (best appreciated on sagittal views).',
    clinicalNotes:
      'Non-dominant parietal lesions commonly produce hemineglect and anosognosia. Dominant angular gyrus lesions can cause Gerstmann syndrome (acalculia, agraphia, finger agnosia).',
  },
  {
    id: 'temporal',
    name: 'Temporal Lobe',
    latinName: 'Lobus temporalis',
    category: 'Cerebrum',
    coordinates: { x: 45, y: -5, z: -15 },
    color: '#8b5cf6', // Soft violet
    summary:
      'Hosts primary auditory processing (Heschl’s gyrus), receptive language comprehension (Wernicke’s area), and medial temporal episodic memory structures (hippocampus).',
    functions: [
      'Primary Auditory Cortex (Transverse temporal gyri)',
      'Receptive Speech Comprehension (Wernicke’s area in dominant hemisphere)',
      'Hippocampus & Parahippocampal Gyrus (Episodic Memory Consolidation)',
      'Amygdala (Emotional valence and threat detection)',
    ],
    mriSignalCharacteristics: {
      t1: 'Hippocampal anatomy best visualized on thin-slice coronal T1 perpendicular to the long axis of the temporal lobe.',
      t2: 'Hippocampal sclerosis appears as increased T2 signal accompanied by volume loss.',
      flair: 'Highly sensitive for limbic encephalitis and herpes simplex encephalitis (temporal lobe hyperintensity).',
      dwi: 'Detects restricted diffusion in acute status epilepticus or temporal ischemia.',
    },
    pathologicalPredilections: [
      'Low-grade gliomas and gangliogliomas causing temporal lobe epilepsy',
      'Medial temporal lobe atrophy in Alzheimer’s dementia (Scheltens MTA scale)',
      'Mesial temporal sclerosis (hippocampal sclerosis)',
      'Sphenoid wing and middle cranial fossa extra-axial meningiomas',
    ],
    radiologicalLandmarks:
      'Separated from the frontal and parietal lobes by the deep Sylvian fissure. Contains the temporal horn of the lateral ventricle.',
    clinicalNotes:
      'Wernicke’s aphasia (fluent nonsense speech) occurs with superior temporal gyrus damage. Medial temporal resections are standard for drug-resistant temporal lobe epilepsy.',
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    latinName: 'Lobus occipitalis',
    category: 'Cerebrum',
    coordinates: { x: 0, y: -65, z: 5 },
    color: '#f59e0b', // Warm amber
    summary:
      'The primary cerebral visual processing hub, housing the striate visual cortex (Brodmann area 17) along the calcarine fissure.',
    functions: [
      'Primary Visual Cortex (V1, Calcarine Fissure)',
      'Visual Association Cortices (Motion, Color, Spatial orientation)',
      'Visual Field Mapping (Retinotopic organization)',
    ],
    mriSignalCharacteristics: {
      t1: 'Calcarine fissure clearly traced on sagittal and coronal slices. Line of Gennari can be distinguished on 3T/7T MRI.',
      t2: 'Displays typical posterior cerebral artery vascular territory architecture.',
      flair: 'Ideal for identifying Posterior Reversible Encephalopathy Syndrome (PRES) with symmetrical occipital subcortical vasogenic edema.',
      dwi: 'Demonstrates acute PCA occlusion infarcts with distinct visual field correlation.',
    },
    pathologicalPredilections: [
      'Posterior Reversible Encephalopathy Syndrome (PRES)',
      'Posterior Cerebral Artery (PCA) ischemic infarctions',
      'Occipital pole metastasis and cortical gliomas',
      'Visual variants of Alzheimer’s disease',
    ],
    radiologicalLandmarks:
      'Calcarine fissure runs on the medial surface, bifurcating the cuneus (superiorly) and lingual gyrus (inferiorly).',
    clinicalNotes:
      'Unilateral damage to the primary visual cortex causes contralateral homonymous hemianopsia, typically with macular sparing if collateral PCA/MCA flow exists.',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    latinName: 'Cerebellum',
    category: 'Cerebellum',
    coordinates: { x: 0, y: -50, z: -35 },
    color: '#c28574', // Natural anatomical tissue tone (NO bright pink/purple)
    summary:
      'Located in the posterior cranial fossa, the cerebellum coordinates voluntary motor movement, maintains balance, posture, and motor learning.',
    functions: [
      'Coordination of Voluntary Muscular Movement',
      'Balance, Equilibrium, and Vestibular Reflexes',
      'Cerebellar Tonsils & Foramen Magnum Protection',
      'Fine-Motor Precision and Smooth Pursuit Eye Movements',
    ],
    mriSignalCharacteristics: {
      t1: 'Fine folial pattern (arbor vitae) exquisitely detailed on sagittal and coronal T1 sequences.',
      t2: 'Cerebellar white matter arborization clearly visible between folia.',
      flair: 'Suppresses 4th ventricle and cisterna magna CSF to highlight cerebellar hemispheric lesions.',
      dwi: 'Critical for diagnosing cerebellar strokes (PICA, AICA, SCA) which can cause life-threatening posterior fossa mass effect.',
    },
    pathologicalPredilections: [
      'Pediatric medulloblastomas and pilocytic astrocytomas',
      'Hemangioblastomas (associated with von Hippel-Lindau disease)',
      'Chiari I Malformation (tonsillar herniation >5mm below foramen magnum)',
      'PICA/AICA territory cerebellar strokes',
    ],
    radiologicalLandmarks:
      'Separated from the occipital lobes above by the tentorium cerebelli. Forms the roof of the 4th ventricle.',
    clinicalNotes:
      'Cerebellar lesions produce ipsilateral ataxia, dysmetria (finger-to-nose overshoot), dysdiadochokinesia, and intention tremor.',
  },
  {
    id: 'brainstem',
    name: 'Brainstem (Midbrain, Pons, Medulla)',
    latinName: 'Truncus encephali',
    category: 'Brainstem',
    coordinates: { x: 0, y: -15, z: -30 },
    color: '#64748b', // Slate tissue tone
    summary:
      'The critical conduit connecting the cerebrum to the spinal cord. Regulates life-sustaining autonomic functions (cardiac rhythm, respiration) and houses cranial nerve nuclei (III–XII).',
    functions: [
      'Midbrain: Pupillary reflexes (CN III/IV), Substantia Nigra (Dopamine), Cerebral Aqueduct',
      'Pons: Cranial nerves V–VIII, Transverse fibers to cerebellum, Respiratory center',
      'Medulla Oblongata: Autonomic cardiac & vasomotor centers, Pyramidal decussation (CN IX–XII)',
      'Reticular Activating System (Arousal & Consciousness)',
    ],
    mriSignalCharacteristics: {
      t1: 'Clear visualization of midbrain tectum, pons bulb, and inferior olive anatomy.',
      t2: 'Crucial for detecting Central Pontine Myelinolysis (Osmotic Demyelination Syndrome) as bat-wing/trident-shaped T2 hyperintensity.',
      flair: 'Identifies brainstem demyelinating lesions in Multiple Sclerosis and neuromyelitis optica (NMO).',
      dwi: 'Detects basilar artery branch occlusions (top-of-the-basilar syndrome, Wallenberg lateral medullary syndrome).',
    },
    pathologicalPredilections: [
      'Diffuse Intrinsic Pontine Glioma (DIPG) in pediatric patients',
      'Basilar artery thrombosis and pontine lacunar infarcts',
      'Osmotic Demyelination Syndrome (CPM)',
      'Cavernous malformations (cavernomas) of the brainstem',
    ],
    radiologicalLandmarks:
      'Lies ventral to the cerebellum and 4th ventricle. The cerebral peduncles form the midbrain "Mickey Mouse" sign on axial images.',
    clinicalNotes:
      'Small brainstem lesions can produce devastating crossed deficits (ipsilateral cranial nerve palsy + contralateral hemiparesis).',
  },
  {
    id: 'ventricles',
    name: 'Ventricular System & CSF',
    latinName: 'Systema ventriculare',
    category: 'Ventricular & CSF',
    coordinates: { x: 0, y: -5, z: 10 },
    color: '#06b6d4', // Clean cyan (CSF fluid)
    summary:
      'A network of communicating cavities (lateral, 3rd, and 4th ventricles) filled with cerebrospinal fluid (CSF) produced by the choroid plexus.',
    functions: [
      'CSF Circulation & Mechanical Brain Buoyancy (Shock Absorption)',
      'Metabolic Waste Clearance (Glymphatic system)',
      'Intracranial Pressure (ICP) Homeostasis',
    ],
    mriSignalCharacteristics: {
      t1: 'CSF is cleanly hypointense (black) on T1-weighted sequences.',
      t2: 'CSF is brightly hyperintense on T2 sequences.',
      flair: 'CSF is intentionally nullified/dark on FLAIR. Incomplete CSF suppression indicates protein, hemorrhage, or meningitis.',
      dwi: 'Free water diffusivity. Epidermoid cysts restrict on DWI, distinguishing them from arachnoid cysts which follow CSF.',
    },
    pathologicalPredilections: [
      'Obstructive Hydrocephalus (e.g. Aqueductal Stenosis, Colloid Cyst of 3rd ventricle)',
      'Normal Pressure Hydrocephalus (NPH) with Evan’s index >0.30 and DESH sign',
      'Ependymomas and subependymomas lining the ventricular walls',
      'Choroid plexus papillomas and intraventricular neurocytomas',
    ],
    radiologicalLandmarks:
      'Foramen of Monro connects lateral ventricles to the 3rd ventricle. The narrow Cerebral Aqueduct connects 3rd to 4th ventricle.',
    clinicalNotes:
      'Acute ventricular dilation produces periventricular transependymal edema (haziness on FLAIR) indicating surgical emergency for CSF diversion.',
  },
  {
    id: 'corpus_callosum',
    name: 'Corpus Callosum',
    latinName: 'Corpus callosum',
    category: 'Diencephalon',
    coordinates: { x: 0, y: 5, z: 25 },
    color: '#d97706', // Warm amber / ivory
    summary:
      'The broad, thick white-matter tract spanning the longitudinal fissure, facilitating interhemispheric communication between left and right cerebral cortices.',
    functions: [
      'Interhemispheric Information Exchange',
      'Subdivided into Rostrum, Genu, Body, and Splenium',
      'Coordination of Binocular Vision & Bimanual Motor Control',
    ],
    mriSignalCharacteristics: {
      t1: 'Dense myelin content renders the corpus callosum prominently hyperintense on mid-sagittal T1 views.',
      t2: 'Uniformly dark to intermediate signal.',
      flair: 'Dawson’s fingers (perivenular demyelinating plaques perpendicular to corpus callosum) are a hallmark of Multiple Sclerosis.',
      dwi: 'Corpus callosum infarcts are rare due to dual blood supply (ACA and pericallosal arteries).',
    },
    pathologicalPredilections: [
      'Butterfly Glioblastoma (Glioblastoma crossing the genu or splenium to both hemispheres)',
      'Multiple Sclerosis callososeptal interface plaques',
      'Marchiafava-Bignami disease (callosal necrosis in chronic alcoholism)',
      'Agenesis of the Corpus Callosum (ACC with "racing car" ventricles on axial view)',
    ],
    radiologicalLandmarks:
      'Forms the roof of the lateral ventricles on coronal views. The genu curves anteriorly and splenium posteriorly on midline sagittal MRI.',
    clinicalNotes:
      'Surgical callosotomy is performed for intractable drop-attack seizures, potentially resulting in disconnection syndromes (alien hand syndrome).',
  },
  {
    id: 'basal_ganglia',
    name: 'Basal Ganglia & Thalamus',
    latinName: 'Nuclei basales et Thalamus',
    category: 'Diencephalon',
    coordinates: { x: 20, y: -5, z: 5 },
    color: '#78716c', // Stone gray / taupe
    summary:
      'Deep gray matter nuclei comprising the caudate nucleus, putamen, globus pallidus, and thalamus. Essential for motor control, procedural learning, and sensory gating.',
    functions: [
      'Thalamus: The grand sensory relay station for all senses except olfaction',
      'Caudate & Putamen (Striatum): Motor initiation and procedural habits',
      'Globus Pallidus & Subthalamic Nucleus: Motor brake and balance regulation',
      'Internal Capsule: White matter highway traversing between basal ganglia nuclei',
    ],
    mriSignalCharacteristics: {
      t1: 'Isointense deep gray matter with dark-white contrast against the adjacent internal capsule.',
      t2: 'Normal age-related iron deposition causes progressive hypointensity in the globus pallidus and substantia nigra.',
      flair: 'Deep watershed ischemia and hypoxic-ischemic encephalopathy cause bilateral basal ganglia hyperintensity.',
      dwi: 'Acute lacunar infarcts of the lenticulostriate territory appear sharply demarcated on DWI.',
    },
    pathologicalPredilections: [
      'Hypertensive intracerebral hemorrhage (Charcot-Bouchard microaneurysm rupture in putamen)',
      'Lacunar ischemic strokes (pure motor stroke via posterior limb of internal capsule)',
      'Parkinson’s disease and Progressive Supranuclear Palsy (PSP)',
      'Huntington’s disease (bilateral caudate head atrophy causing "boxcar" lateral ventricles)',
    ],
    radiologicalLandmarks:
      'Caudate head indents the frontal horn of the lateral ventricle. The internal capsule forms a V-shaped pathway between thalamus and lentiform nucleus.',
    clinicalNotes:
      'A tiny 5mm lacunar stroke in the internal capsule can cause dense contralateral hemiplegia because descending corticospinal fibers are tightly packed here.',
  },
];

export const BrainAnatomyPage: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('frontal');
  const [viewMode, setViewMode] = useState<'3D' | '2D_ATLAS'>('3D');
  const [renderMode, setRenderMode] = useState<'cortex' | 'tracts' | 'xray'>('cortex');
  const [hemisphereFilter, setHemisphereFilter] = useState<'both' | 'left' | 'right'>('both');
  const [activePlane, setActivePlane] = useState<'Axial' | 'Sagittal' | 'Coronal'>('Axial');
  const [sliceDepth, setSliceDepth] = useState<number>(50); // 0 to 100%
  const [enableClipping, setEnableClipping] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedRegion =
    BRAIN_REGIONS.find((r) => r.id === selectedRegionId) || BRAIN_REGIONS[0];

  const filteredRegions = BRAIN_REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Interactive 3D Brain Anatomy & Learning Hub
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                High-fidelity human neuroanatomy model with realistic sulci/gyri, cerebellar folia, and internal structures.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('3D')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === '3D'
                ? 'bg-teal-500 text-slate-950 shadow-teal-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>3D Realistic Model</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2D_ATLAS')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === '2D_ATLAS'
                ? 'bg-teal-500 text-slate-950 shadow-teal-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Educational Atlas</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visualizer Left, Detail Drawer Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visualizer Canvas / Atlas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === '3D' ? (
            <div className="space-y-4">
              <RealisticBrainViewer3D
                selectedRegionId={selectedRegionId}
                onSelectRegion={setSelectedRegionId}
                regions={BRAIN_REGIONS}
                renderMode={renderMode}
                onChangeRenderMode={setRenderMode}
                activePlane={activePlane}
                sliceDepth={sliceDepth}
                enableClipping={enableClipping}
                onToggleClipping={setEnableClipping}
                hemisphereFilter={hemisphereFilter}
                onHemisphereChange={setHemisphereFilter}
              />
            </div>
          ) : (
            <div className="bg-[#090d16] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Visualizer Header Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800/80 bg-slate-950/60">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>Gross Neuroanatomical 2D Schema</span>
                </div>
                <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30 font-mono">
                  Standard MNI-152 Reference Alignment
                </span>
              </div>

              {/* 2D Educational Atlas Mode */}
              <div className="h-[490px] w-full p-6 flex flex-col justify-between relative overflow-y-auto">
                <div className="space-y-3">
                  {/* SVG Anatomical Diagram with Interactive Region Paths */}
                  <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 300"
                      className="w-full h-full drop-shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                    >
                      {/* Stylized Cerebrum Outline */}
                      <path
                        d="M 60,160 C 60,90 120,40 200,40 C 280,40 340,90 340,160 C 340,210 300,240 260,250 C 230,255 210,270 200,280 C 190,270 170,255 140,250 C 100,240 60,210 60,160 Z"
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth="3"
                      />
                      {/* Frontal Lobe Partition */}
                      <path
                        d="M 60,160 C 60,90 120,40 200,40 C 205,80 200,130 190,170 C 140,175 100,190 60,160 Z"
                        fill={selectedRegionId === 'frontal' ? '#0284c744' : '#0284c715'}
                        stroke="#0284c7"
                        strokeWidth={selectedRegionId === 'frontal' ? '3' : '1.5'}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedRegionId('frontal')}
                      />
                      {/* Parietal Lobe Partition */}
                      <path
                        d="M 200,40 C 270,40 310,80 320,130 C 270,140 230,150 190,170 C 200,130 205,80 200,40 Z"
                        fill={selectedRegionId === 'parietal' ? '#6366f144' : '#6366f115'}
                        stroke="#6366f1"
                        strokeWidth={selectedRegionId === 'parietal' ? '3' : '1.5'}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedRegionId('parietal')}
                      />
                      {/* Occipital Lobe */}
                      <path
                        d="M 320,130 C 340,160 340,200 310,225 C 280,210 260,180 270,140 Z"
                        fill={selectedRegionId === 'occipital' ? '#f59e0b44' : '#f59e0b15'}
                        stroke="#f59e0b"
                        strokeWidth={selectedRegionId === 'occipital' ? '3' : '1.5'}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedRegionId('occipital')}
                      />
                      {/* Temporal Lobe */}
                      <path
                        d="M 120,180 C 160,170 210,170 240,200 C 220,230 160,235 120,210 Z"
                        fill={selectedRegionId === 'temporal' ? '#8b5cf644' : '#8b5cf615'}
                        stroke="#8b5cf6"
                        strokeWidth={selectedRegionId === 'temporal' ? '3' : '1.5'}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedRegionId('temporal')}
                      />
                      {/* Cerebellum */}
                      <path
                        d="M 250,215 C 310,215 320,260 270,270 C 230,270 220,240 250,215 Z"
                        fill={selectedRegionId === 'cerebellum' ? '#c2857444' : '#c2857415'}
                        stroke="#c28574"
                        strokeWidth={selectedRegionId === 'cerebellum' ? '3' : '1.5'}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedRegionId('cerebellum')}
                      />
                      {/* Brainstem */}
                      <path
                        d="M 190,200 L 210,200 L 210,285 L 190,285 Z"
                        fill={selectedRegionId === 'brainstem' ? '#64748b44' : '#64748b15'}
                        stroke="#64748b"
                        strokeWidth={selectedRegionId === 'brainstem' ? '3' : '1.5'}
                        className="cursor-pointer transition-all hover:opacity-80"
                        onClick={() => setSelectedRegionId('brainstem')}
                      />
                      {/* Ventricles / Deep Brain Core */}
                      <circle
                        cx="195"
                        cy="145"
                        r="18"
                        fill={selectedRegionId === 'ventricles' ? '#06b6d466' : '#06b6d422'}
                        stroke="#06b6d4"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onClick={() => setSelectedRegionId('ventricles')}
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                  <span>Click on any labeled region in the schema above to inspect details.</span>
                  <span className="font-mono text-teal-400 font-bold">2D Reference Mode</span>
                </div>
              </div>
            </div>
          )}

          {/* Region Selector Pills */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Anatomical Structures ({BRAIN_REGIONS.length} Regions)
              </span>
              <div className="relative w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredRegions.map((region) => {
                const isSelected = region.id === selectedRegionId;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 border ${
                      isSelected
                        ? 'bg-slate-800 text-white border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: region.color }}
                    />
                    <span>{region.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth Neuroanatomy & Radiology Reference Drawer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Title & Category Banner */}
            <div className="border-b border-slate-800 pb-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold bg-slate-800 text-teal-400 border border-slate-700">
                  {selectedRegion.category}
                </span>
                <span className="text-xs font-mono text-slate-400 italic">
                  {selectedRegion.latinName}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2 pt-1">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 inline-block"
                  style={{ backgroundColor: selectedRegion.color }}
                />
                <span>{selectedRegion.name}</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {selectedRegion.summary}
              </p>
            </div>

            {/* Key Functional Roles */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Primary Neurofunctional Roles</span>
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {selectedRegion.functions.map((fn, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{fn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typical MRI Signal Intensity Characteristics */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>MRI Sequence Signal Profiles</span>
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-teal-300">T1-Weighted</span>
                  <p className="text-slate-400 text-[10px] leading-tight font-sans">
                    {selectedRegion.mriSignalCharacteristics.t1}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-teal-300">T2-Weighted</span>
                  <p className="text-slate-400 text-[10px] leading-tight font-sans">
                    {selectedRegion.mriSignalCharacteristics.t2}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-teal-300">T2-FLAIR</span>
                  <p className="text-slate-400 text-[10px] leading-tight font-sans">
                    {selectedRegion.mriSignalCharacteristics.flair}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-teal-300">DWI / ADC</span>
                  <p className="text-slate-400 text-[10px] leading-tight font-sans">
                    {selectedRegion.mriSignalCharacteristics.dwi}
                  </p>
                </div>
              </div>
            </div>

            {/* Pathological Predilections */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Frequent Pathologies & Lesions</span>
              </span>
              <div className="space-y-1">
                {selectedRegion.pathologicalPredilections.map((pathology, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200"
                  >
                    • {pathology}
                  </div>
                ))}
              </div>
            </div>

            {/* Radiological Landmark & Clinical Note */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-teal-400" />
                <span>Radiological Landmark Guidance</span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedRegion.radiologicalLandmarks}
              </p>
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-teal-400 block mb-1">Clinical Pearl:</strong>
                {selectedRegion.clinicalNotes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainAnatomyPage;
