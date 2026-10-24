import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  HelpCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Eye,
  Grid,
  Maximize2,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

interface ConceptDetail {
  id: string;
  letter: string;
  title: string;
  definition: string;
  mriRelevance: string;
  cnnLearning: string;
  medicalInterpretation: string;
  example: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

const CONCEPTS: ConceptDetail[] = [
  {
    id: 'edges',
    letter: 'A',
    title: 'Edges & Boundary Gradients',
    definition: 'An edge is a sharp boundary where image voxel brightness changes significantly between adjacent spatial locations.',
    mriRelevance: 'Delineates natural anatomical interfaces (e.g., grey-white matter junction, dural margins) and separates mass lesions from healthy parenchyma.',
    cnnLearning: 'Early convolutional layers (Conv2D layer 1) apply directional gradient filters (like 3x3 Sobel kernels) that respond vigorously to horizontal, vertical, and diagonal edges.',
    medicalInterpretation: 'Sharp, circumscribed edges suggest encapsulated or extra-axial lesions; fuzzy or infiltrative edges indicate parenchymal invasion. However, edge detection alone is NEVER diagnostic.',
    example: 'Sharp dural boundary of convexity meningioma vs infiltrative margins of glioblastoma.',
    quiz: {
      question: 'Why do early CNN layers naturally detect edges in brain MRI scans?',
      options: [
        'They are programmed with medical textbooks',
        'Small convolutional filters mathematically calculate spatial brightness gradients between pixels',
        'They measure the patient blood pressure',
        'Edges only exist in corrupted images'
      ],
      correct: 1,
      explanation: 'Small (e.g., 3x3) convolutional kernels slide across pixels calculating differences between adjacent voxels, mathematically highlighting intensity transitions (edges).'
    }
  },
  {
    id: 'textures',
    letter: 'B',
    title: 'Textures & Regional Heterogeneity',
    definition: 'Texture describes recurring statistical patterns and spatial variations in voxel brightness across a local tissue neighborhood.',
    mriRelevance: 'Provides insight into tissue micro-architecture, reflecting necrosis, cystic degeneration, cellular density, and microvascular proliferation.',
    cnnLearning: 'Intermediate convolutional blocks combine multiple edge responses into receptive field textures (e.g., granular, mottled, smooth, or striated).',
    medicalInterpretation: 'Heterogeneous texture often reflects biological complexity or necrosis in high-grade lesions, whereas homogeneous texture is typical of benign cellular tumors. Must be interpreted with sequence parameters.',
    example: 'Mottled heterogeneous necrotic center in high-grade glioma vs dense homogeneous enhancement in meningioma.',
    quiz: {
      question: 'What does a heterogeneous (mottled) texture on contrast-enhanced MRI often signify?',
      options: [
        'A single perfectly uniform fluid cyst',
        'Mixed tissue histology such as viable tumor mixed with necrosis, cystic fluid, and hemorrhage',
        'A totally normal healthy baseline scan',
        'An error in scanner electricity'
      ],
      correct: 1,
      explanation: 'Heterogeneous enhancement reflects mixed internal pathology: areas of hypervascular tumor cells alongside necrotic voids and cystic fluid.'
    }
  },
  {
    id: 'shapes',
    letter: 'C',
    title: 'Shapes & Morphological Contours',
    definition: 'The geometric silhouette, contour regularity, and symmetry of a detected region of interest.',
    mriRelevance: 'Indicates lesion growth vector, anatomical compartment constraint (e.g. sella turcica), and invasiveness.',
    cnnLearning: 'Deep convolutional layers with large receptive fields synthesize edges and textures into spatial shapes (e.g., circular, lobulated, snowman/figure-8, or amoebic).',
    medicalInterpretation: 'Globular, broad-based shapes suggest extra-axial origin; dendritic or infiltrative shapes indicate invasive parenchymal migration.',
    example: 'Suprasellar snowman configuration of pituitary macroadenoma vs hemispherical convexity meningioma.',
    quiz: {
      question: 'Which anatomical structure causes the characteristic "snowman" waist constriction in pituitary macroadenomas?',
      options: [
        'Diaphragma sellae aperture',
        'Frontal sinus',
        'Occipital bone',
        'Lateral ventricle'
      ],
      correct: 0,
      explanation: 'As pituitary tumors expand superiorly from the sella turcica, the constricting dural fold of the diaphragma sellae pinches the mass, creating a classic figure-eight / snowman contour.'
    }
  },
  {
    id: 'intensity',
    letter: 'D',
    title: 'Intensity & Contrast Differentials',
    definition: 'The relative numerical brightness or darkness of voxels, determined by physical relaxation times (T1, T2) and pulse sequence timing.',
    mriRelevance: 'Defines whether tissue is hypointense (dark), isointense (similar), or hyperintense (bright) relative to reference gray matter cortex.',
    cnnLearning: 'Convolutional weights calibrate to statistical contrast ratios between the suspected abnormality and the background brain envelope.',
    medicalInterpretation: 'Intensity is sequence-dependent! Hyperintensity on T2-FLAIR represents fluid/edema; hyperintensity on post-contrast T1 indicates blood-brain barrier breakdown.',
    example: 'T2-FLAIR perilesional hyperintensity (vasogenic edema) surrounding an intra-axial mass.',
    quiz: {
      question: 'True or False: A hyperintense region on T1-contrast MRI represents the exact same physical property as a hyperintense region on T2-FLAIR.',
      options: [
        'True: Hyperintensity always means cancer',
        'False: T1-contrast hyperintensity indicates gadolinium accumulation / leaky BBB, whereas T2-FLAIR hyperintensity indicates fluid / edema',
        'True: All MRI sequences measure bone density only',
        'False: MRI machines cannot measure intensity'
      ],
      correct: 1,
      explanation: 'Different MRI sequences measure distinct biophysical relaxation properties. T1 with gadolinium shows vascular enhancement, whereas T2-FLAIR suppresses free CSF to highlight interstitial fluid/edema.'
    }
  },
  {
    id: 'patterns',
    letter: 'E',
    title: 'Patterns of Enhancement & Spread',
    definition: 'The spatial architectural organization of signal changes—such as rim enhancement, nodular clusters, or diffuse infiltration.',
    mriRelevance: 'Critical for constructing prioritized differential diagnoses and evaluating tumor vascularization.',
    cnnLearning: 'Higher-level feature maps combine spatial layers to recognize concentric ring patterns, patchy clusters, or diffuse spreads.',
    medicalInterpretation: 'Ring-enhancement is non-specific: glioblastoma, metastasis, and cerebral abscess all present with ring patterns and require clinical differentiation.',
    example: 'Irregular thick ring-enhancement in glioblastoma vs smooth thin ring in brain abscess.',
    quiz: {
      question: 'Why should a clinician never diagnose glioblastoma based solely on the presence of ring-enhancement?',
      options: [
        'Because ring enhancement does not exist on MRI',
        'Because metastases, brain abscesses, and demyelinating lesions can also produce ring enhancement (the "MAGIC DR" differential)',
        'Because glioblastomas never enhance',
        'Because ring enhancement only occurs in the lungs'
      ],
      correct: 1,
      explanation: 'Ring-enhancement is shared across neoplastic, infectious (abscess), and inflammatory (tumefactive MS) pathologies. Clinical context and multi-sequence evaluation are mandatory.'
    }
  },
  {
    id: 'spatial',
    letter: 'F',
    title: 'Spatial Compartmentalization',
    definition: 'Anatomical assignment to specific intracranial compartments: intra-axial (brain parenchyma) vs extra-axial (meninges/dura/calvarium).',
    mriRelevance: 'The foundational first branching question in neuro-radiological diagnosis.',
    cnnLearning: 'Deep network layers learn coordinates and positional relationships relative to ventricles, midline falx, and skull borders.',
    medicalInterpretation: 'Intra-axial masses displace gray-white matter outward; extra-axial masses buckle the cortex inward and often exhibit a CSF cleft sign.',
    example: 'Cortical buckling under a convexity meningioma vs subcortical white matter expansion by astrocytoma.',
    quiz: {
      question: 'What is the "CSF cleft sign" on brain MRI?',
      options: [
        'A crack in the skull bone',
        'A rim of cerebrospinal fluid trapped between an extra-axial tumor and the underlying compressed brain cortex',
        'An infected ventricular shunt',
        'A normal finding only seen in infants'
      ],
      correct: 1,
      explanation: 'The CSF cleft sign appears as a crescent of high T2 signal between a mass and the adjacent brain, confirming that the mass is extra-axial (outside the brain parenchyma).'
    }
  },
  {
    id: 'high_level',
    letter: 'G',
    title: 'High-Level Feature Synergy',
    definition: 'The integrated synthesis of location, margins, internal architecture, edema, and secondary mass effect.',
    mriRelevance: 'Corresponds to the physician’s holistic radiologic synthesis combining all clues into a reasoned diagnostic differential.',
    cnnLearning: 'Dense fully connected layers and global average pooling collapse hundreds of distributed feature maps into categorical probability distributions.',
    medicalInterpretation: 'CNNs model statistical correlation patterns across pixels, but lack clinical patient history, laboratory values, and pathological truth.',
    example: 'Correlating third ventricular compression and midline shift with patient neurological lethargy.',
    quiz: {
      question: 'What is the key difference between how a CNN classifies an MRI and how a medical doctor evaluates it?',
      options: [
        'Doctors use mathematical filters; CNNs use clinical intuition',
        'CNNs map statistical pixel co-occurrences; doctors synthesize clinical history, physical exam, multi-sequence imaging, and pathophysiology',
        'There is zero difference; CNNs and doctors operate identically',
        'CNNs can perform physical brain surgery automatically'
      ],
      correct: 1,
      explanation: 'CNNs optimize statistical feature correlations on training images without true conceptual understanding. Doctors evaluate clinical onset, lab values, symptoms, and biological pathophysiology.'
    }
  }
];

const LearnMriFeaturesPage: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptDetail>(CONCEPTS[0]);
  const [quizState, setQuizState] = useState<{ [key: string]: { selected: number | null; submitted: boolean } }>({});

  const handleSelectAnswer = (conceptId: string, idx: number) => {
    setQuizState((prev) => ({
      ...prev,
      [conceptId]: { selected: idx, submitted: true },
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Interactive Student Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How CNN Understands an MRI: Visual Feature Extraction
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Explore the core visual building blocks that convolutional neural networks extract from 2D brain MRI slices. Learn how each mathematical feature relates to medical neuro-radiology.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Concept Selector Tabs (A to G) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedConcept(c)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center space-x-2 ${
              selectedConcept.id === c.id
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                selectedConcept.id === c.id
                  ? 'bg-slate-950 text-teal-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {c.letter}
            </span>
            <span>{c.title.split('&')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Concept Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detailed Educational Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm">
                  {selectedConcept.letter}
                </span>
                <h2 className="text-lg font-bold text-white">
                  {selectedConcept.title}
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Concept {CONCEPTS.indexOf(selectedConcept) + 1} of {CONCEPTS.length}
              </span>
            </div>

            {/* Definition */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                1. Simple Definition
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {selectedConcept.definition}
              </p>
            </div>

            {/* Why it Matters in MRI */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                2. Why it Matters in MRI Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {selectedConcept.mriRelevance}
              </p>
            </div>

            {/* What the CNN Learns */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                3. What the CNN Actually Learns
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
                {selectedConcept.cnnLearning}
              </p>
            </div>

            {/* Medical Interpretation & Safety */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                4. Medical Interpretation & Safe Reasoning
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
                {selectedConcept.medicalInterpretation}
              </p>
            </div>

            {/* Real World MRI Example */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                5. Representative Example
              </h3>
              <p className="text-xs font-mono text-emerald-300 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                💡 {selectedConcept.example}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Concept Quiz & Quick Interactive Check (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>Concept Check: {selectedConcept.title.split('&')[0]}</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                {selectedConcept.quiz.question}
              </p>

              <div className="space-y-2">
                {selectedConcept.quiz.options.map((opt, idx) => {
                  const state = quizState[selectedConcept.id];
                  const isSelected = state?.selected === idx;
                  const isCorrect = idx === selectedConcept.quiz.correct;
                  const submitted = state?.submitted;

                  let btnStyle =
                    'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300';
                  if (submitted) {
                    if (isCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
                    } else if (isSelected) {
                      btnStyle =
                        'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold';
                    } else {
                      btnStyle = 'border-slate-800/40 opacity-50 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(selectedConcept.id, idx)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${btnStyle}`}
                    >
                      <span className="font-mono font-bold mt-0.5 shrink-0">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizState[selectedConcept.id]?.submitted && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
                    quizState[selectedConcept.id].selected ===
                    selectedConcept.quiz.correct
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold">
                    {quizState[selectedConcept.id].selected ===
                    selectedConcept.quiz.correct ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct Understanding!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-amber-400" />
                        <span>Review the Core Concept:</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {selectedConcept.quiz.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next Action Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-teal-950/40 to-slate-900 border border-teal-500/20 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-teal-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Ready to See the Complete Pipeline?</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Now that you understand edges, textures, and shapes, explore how the neural network connects them sequentially from raw MRI to final class prediction.
            </p>
            <Link
              to="/student/journey"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all"
            >
              <span>Explore Visual CNN Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature → Concept Learning Table Matrix (Section 5 Requirement) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Grid className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              Feature → Concept Learning Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-400">Radiology & Machine Learning Alignment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">MRI Concept</th>
                <th className="py-2.5 px-3">What Student Learns</th>
                <th className="py-2.5 px-3">Why it Matters</th>
                <th className="py-2.5 px-3">CNN Connection</th>
                <th className="py-2.5 px-3">Medical Interpretation Safe Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-bold text-teal-400">Edges</td>
                <td className="py-3 px-3">Spatial boundaries where intensity changes sharply</td>
                <td className="py-3 px-3">Differentiates circumscribed vs infiltrative margins</td>
                <td className="py-3 px-3">Early Conv2D filters compute directional gradients</td>
                <td className="py-3 px-3 text-slate-400">Edge presence alone is not pathognomonic for malignancy</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-cyan-400">Texture</td>
                <td className="py-3 px-3">Differences in local intensity patterns across a region</td>
                <td className="py-3 px-3">Reflects necrosis, cystic fluid, and hypervascularity</td>
                <td className="py-3 px-3">Intermediate filters group edge responses into textures</td>
                <td className="py-3 px-3 text-slate-400">Texture alone cannot differentiate abscess from glioblastoma</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-purple-400">Shapes</td>
                <td className="py-3 px-3">Macroscopic contours and geometric compartments</td>
                <td className="py-3 px-3">Reveals broad dural bases, sellar remodeling, and mass effect</td>
                <td className="py-3 px-3">Deep feature maps integrate multi-layer receptive fields</td>
                <td className="py-3 px-3 text-slate-400">Extra-axial shapes can be mimicked by peripherally growing intra-axial masses</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-amber-400">Intensity & Contrast</td>
                <td className="py-3 px-3">Voxel brightness determined by T1/T2 pulse timing</td>
                <td className="py-3 px-3">Identifies vasogenic edema, blood products, and leaky BBB</td>
                <td className="py-3 px-3">Weight matrices calibrate to relative contrast ratios</td>
                <td className="py-3 px-3 text-slate-400">Intensity must ALWAYS be evaluated in the context of the exact sequence</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-emerald-400">Spatial Pattern</td>
                <td className="py-3 px-3">Intracranial compartment (intra-axial vs extra-axial)</td>
                <td className="py-3 px-3">The foundational initial diagnostic fork in brain mass workup</td>
                <td className="py-3 px-3">Global average pooling retains spatial coordinates</td>
                <td className="py-3 px-3 text-slate-400">Cortical buckling and CSF cleft are helpful but require multi-planar confirmation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LearnMriFeaturesPage;
