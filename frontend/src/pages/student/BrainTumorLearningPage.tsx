import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Layers,
  BookOpen,
  HelpCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Compass,
  Eye,
  Info,
} from 'lucide-react';
import { api } from '../../api/client';
import { TumorCurriculumItem } from '../../types/student';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const BrainTumorLearningPage: React.FC = () => {
  const [curriculumData, setCurriculumData] = useState<Record<string, TumorCurriculumItem> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Glioma');
  const [loading, setLoading] = useState(true);
  const [activeMiniQuizIndex, setActiveMiniQuizIndex] = useState<{ [cat: string]: number | null }>({});
  const [miniQuizSubmitted, setMiniQuizSubmitted] = useState<{ [cat: string]: boolean }>({});

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await api.getTumorCurriculum();
        setCurriculumData(res.curriculum);
      } catch (err) {
        console.error('Failed to load tumor curriculum:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, []);

  const supportedClasses = ['Glioma', 'Meningioma', 'Pituitary', 'No_Tumor'];
  const activeItem = curriculumData ? curriculumData[selectedCategory] : null;

  // Mini quiz questions for each category
  const categoryQuizzes: Record<string, { q: string; opts: string[]; correct: number; exp: string }> = {
    Glioma: {
      q: 'Which imaging feature is most characteristic of an infiltrative high-grade glioma?',
      opts: [
        'A sharp, encapsulated dural tail without edema',
        'Heterogeneous enhancement with ill-defined infiltrative margins and surrounding vasogenic edema',
        'Normal symmetric ventricular caliber',
        'A midline sella turcica expansion with snowman shape'
      ],
      correct: 1,
      exp: 'Gliomas are intra-axial neuroepithelial tumors that invade along white matter tracks, displaying ill-defined borders and irregular internal texture.'
    },
    Meningioma: {
      q: 'What is the primary anatomical clue confirming that a meningioma is extra-axial?',
      opts: [
        'Origin inside the cerebellar parenchyma',
        'Broad dural attachment, inward cortical buckling, and often a CSF cleft sign',
        'Absence of a skull bone',
        'Ring-enhancement in the thalamus'
      ],
      correct: 1,
      exp: 'Meningiomas arise from arachnoid cap cells, causing broad-based dural attachment and displacement (buckling) of the underlying brain cortex.'
    },
    Pituitary: {
      q: 'Which visual field defect is classically associated with suprasellar compression of the optic chiasm by a pituitary macroadenoma?',
      opts: [
        'Complete bilateral blindness in 1 second',
        'Bitemporal hemianopsia (loss of peripheral lateral vision in both eyes)',
        'Loss of color vision only in the left ear',
        'No visual symptoms ever occur'
      ],
      correct: 1,
      exp: 'Because crossing nasal retinal fibers reside in the central optic chiasm directly above the sella turcica, upward compression produces bitemporal hemianopsia.'
    },
    No_Tumor: {
      q: 'When interpreting a baseline brain MRI without mass lesions, what fundamental radiological principle must be verified first?',
      opts: [
        'Assuming every bright spot is an emergency malignancy',
        'Bilateral neuroanatomical symmetry across the midline, normal ventricular caliber, and absence of mass effect',
        'Predicting future brain tumors that might appear in 10 years',
        'Relying solely on an AI prediction percentage'
      ],
      correct: 1,
      exp: 'Normal radiological interpretation relies on assessing symmetry across hemispheres, proper ventricular volume, and the clear preservation of gray-white matter differentiation.'
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Curriculum on Model-Supported Categories</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Supported Brain MRI Categories & Neuropathology
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          In accordance with strict AI research safety standards, this module exclusively covers the <strong>4 categories actually supported</strong> by the trained AXONOVA CNN model. Explore the 12 radiological hallmarks, differential considerations, and CNN capability boundaries for each class.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Category Tabs (Glioma, Meningioma, Pituitary, No_Tumor) */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {supportedClasses.map((catKey) => {
          const isActive = selectedCategory === catKey;
          const displayLabel = catKey === 'No_Tumor' ? 'No Tumor (Normal)' : catKey;
          return (
            <button
              key={catKey}
              onClick={() => {
                setSelectedCategory(catKey);
                setActiveMiniQuizIndex({});
                setMiniQuizSubmitted({});
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center space-x-2 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Brain className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>{displayLabel}</span>
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Overview & General Location Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1 & 2: Overview & What It Is */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Section 1 & 2 • Clinical Overview
              </span>
              <h2 className="text-lg font-bold text-white">{activeItem.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {activeItem.overview}
              </p>
            </div>

            {/* 3: General Location / Anatomical Context */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
                Section 3 • Anatomical Context
              </span>
              <h2 className="text-lg font-bold text-white">Typical Anatomical Compartment</h2>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                📍 {activeItem.general_location}
              </p>
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0 text-teal-400" />
                <span>
                  Compartmentalization (intra-axial vs extra-axial) determines surgical access and primary differentials.
                </span>
              </div>
            </div>
          </div>

          {/* 4 & 5: Imaging Characteristics & Possible Visual Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 4: Imaging Characteristics */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  4. Common Imaging Characteristics (Evidence-Based)
                </h3>
              </div>
              <ul className="space-y-2">
                {activeItem.imaging_characteristics.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5: Visual Patterns */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  5. Possible Visual Patterns on MRI Slices
                </h3>
              </div>
              <ul className="space-y-2">
                {activeItem.visual_patterns.map((pat, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6, 7 & 8: MRI Concepts, Differentials, Terminology */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 6: Relevant MRI Concepts */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Section 6 • MRI Concepts
              </span>
              <h4 className="text-xs font-bold text-white">Key Concepts to Evaluate</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeItem.mri_concepts.map((concept, i) => (
                  <li key={i} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 leading-relaxed">
                    {concept}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7: Differential Considerations */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono">
                Section 7 • Differentials
              </span>
              <h4 className="text-xs font-bold text-white">Typical Differential Considerations</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeItem.differentials.map((diff, i) => (
                  <li key={i} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 leading-relaxed text-rose-300/90">
                    • {diff}
                  </li>
                ))}
              </ul>
            </div>

            {/* 8: Important Terminology */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Section 8 • Terminology
              </span>
              <h4 className="text-xs font-bold text-white">Essential Radiological Terms</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeItem.terminology.map((term, i) => (
                  <li key={i} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 leading-relaxed text-emerald-300/90 text-[11px]">
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 9: Key Learning Points */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
              Section 9 • Clinical Pearls
            </span>
            <h3 className="text-sm font-bold text-white">Key Medical Learning Points</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {activeItem.key_learning_points.map((pt, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-2">
                  <span className="text-teal-400 font-bold font-mono">0{i + 1}.</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 11 & 12: What CNN Learns vs What CNN CANNOT Tell You */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 11: What CNN May Learn */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-teal-500/20 space-y-3">
              <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>11. What the CNN Actually Learns</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {activeItem.what_cnn_learns}
              </p>
            </div>

            {/* 12: What CNN Cannot Reliably Tell You */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/20 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>12. What the CNN CANNOT Reliably Tell You</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {activeItem.what_cnn_cannot_tell}
              </p>
            </div>
          </div>

          {/* 10: Mini Quiz Section */}
          {categoryQuizzes[selectedCategory] && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>10. Category Mini-Quiz: {selectedCategory}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Immediate Feedback</span>
              </div>

              <p className="text-xs font-semibold text-slate-200">
                {categoryQuizzes[selectedCategory].q}
              </p>

              <div className="space-y-2">
                {categoryQuizzes[selectedCategory].opts.map((opt, idx) => {
                  const isSelected = activeMiniQuizIndex[selectedCategory] === idx;
                  const isCorrect = idx === categoryQuizzes[selectedCategory].correct;
                  const submitted = miniQuizSubmitted[selectedCategory];

                  let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                  if (submitted) {
                    if (isCorrect) style = 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold';
                    else if (isSelected) style = 'bg-rose-500/10 border-rose-500 text-rose-300 font-semibold';
                    else style = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveMiniQuizIndex({ ...activeMiniQuizIndex, [selectedCategory]: idx });
                        setMiniQuizSubmitted({ ...miniQuizSubmitted, [selectedCategory]: true });
                      }}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${style}`}
                    >
                      <span className="font-mono font-bold">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {miniQuizSubmitted[selectedCategory] && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300">
                  <p className="font-bold text-teal-400">Educational Explanation:</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {categoryQuizzes[selectedCategory].exp}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action to Case Practice */}
          <div className="flex justify-end pt-2">
            <Link
              to="/student/cases"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all"
            >
              <span>Practice Real Cases for this Category</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">
          <p>Loading brain tumor curriculum...</p>
        </div>
      )}
    </div>
  );
};

export default BrainTumorLearningPage;
