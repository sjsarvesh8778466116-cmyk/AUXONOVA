import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldAlert,
  Info,
  CheckCircle2,
  FileQuestion,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

interface PlainLanguageExplanationProps {
  prediction: string | null;
  confidence: number;
  confidencePercentage?: number;
  status: string;
  isIndeterminate?: boolean;
  limitations?: string[];
}

export const PlainLanguageExplanation: React.FC<PlainLanguageExplanationProps> = ({
  prediction,
  confidence,
  confidencePercentage,
  status,
  isIndeterminate = false,
  limitations = [],
}) => {
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);
  const [showJargonBuster, setShowJargonBuster] = useState(false);

  const pct = confidencePercentage ?? Math.round(confidence * 100);

  const getFriendlyFinding = () => {
    if (isIndeterminate || status === 'indeterminate') {
      return {
        title: 'Inconclusive / Indeterminate AI Result',
        summary:
          'The artificial intelligence model could not find a clear pattern that matched its trained categories with sufficient confidence.',
        details:
          'Because clinical safety is paramount, AXONOVA does not guess when uncertainty is high. This scan must be evaluated directly by a radiologist or physician.',
      };
    }

    switch (prediction) {
      case 'Glioma':
        return {
          title: 'Pattern Resembles Intra-Axial (Glioma-Like) Features',
          summary:
            'The AI identified statistical image patterns that are typically seen in tumors arising from brain tissue (glial cells).',
          details:
            'Gliomas originate inside the brain parenchyma. However, many benign conditions, infections, or inflammatory demyelinating lesions can look very similar on a single MRI slice.',
        };
      case 'Meningioma':
        return {
          title: 'Pattern Resembles Extra-Axial (Meningioma-Like) Features',
          summary:
            'The AI identified statistical image patterns typical of tumors arising from the protective membranes (meninges) wrapping the brain.',
          details:
            'Meningiomas are typically extra-axial (outside the brain tissue itself) and frequently benign. Only a radiologist reviewing contrast-enhanced scans and a surgeon/pathologist can confirm the actual tumor type.',
        };
      case 'Pituitary':
        return {
          title: 'Pattern Resembles Sellar / Pituitary Features',
          summary:
            'The AI identified statistical image features in the region of the pituitary gland (sella turcica) at the base of the skull.',
          details:
            'Pituitary lesions are usually adenomas (non-cancerous growths). Clinical symptoms often involve endocrine hormones or vision changes due to optic chiasm proximity.',
        };
      case 'No_Tumor':
        return {
          title: 'No Prominent Tumor Pattern Detected on This Slice',
          summary:
            'The AI did not find features matching the tumor patterns it was trained to recognize on this individual slice.',
          details:
            'This does NOT mean the entire brain is completely free of all medical conditions. Non-tumor abnormalities (such as microvascular ischemia, small strokes, or lesions on other slices) are outside this specific model’s scope.',
        };
      default:
        return {
          title: `Category: ${prediction || 'Unclassified'}`,
          summary: 'The model evaluated the uploaded slice against its reference training dataset.',
          details: 'Please discuss these technical findings directly with your physician.',
        };
    }
  };

  const finding = getFriendlyFinding();

  const suggestedQuestions = [
    `Does the complete 3D volumetric MRI series confirm or differ from this single slice's AI finding (${prediction || 'Inconclusive'})?`,
    'Would additional sequences (such as T1 with Gadolinium contrast, Diffusion-Weighted DWI, or MR Spectroscopy) provide more clinical clarity?',
    'Could non-cancerous conditions (such as inflammation, an old infection, or vascular changes) explain this imaging pattern?',
    'What are the next recommended steps or follow-up imaging timeline?',
  ];

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(idx);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  const jargonItems = [
    {
      term: 'Hyperintense / Hypointense',
      meaning:
        'Refers to how bright (hyper) or dark (hypo) an area looks on MRI. Brightness depends on tissue composition, water content, fat, or contrast dye.',
    },
    {
      term: 'Intra-axial vs Extra-axial',
      meaning:
        'Intra-axial means originating inside the brain matter itself. Extra-axial means originating outside the brain, such as from the skull lining or skull base.',
    },
    {
      term: 'Grad-CAM Attention Map',
      meaning:
        'A heat map showing where the computer vision model looked when calculating its output. Warm colors (red/yellow) indicate pixels that most heavily influenced the mathematical calculation.',
    },
    {
      term: 'Confidence Score (Percentage)',
      meaning:
        'A mathematical similarity score indicating how closely this 2D picture matches images in the training dataset. It is NOT the likelihood of disease in the patient.',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white tracking-wide">
            Plain-Language AI Result Explanation
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
          Patient & Family Friendly
        </span>
      </div>

      {/* Critical Non-Diagnostic Alert */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-1.5">
        <div className="flex items-center space-x-2 font-bold text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>IMPORTANT: This is an Educational Explanation, NOT a Medical Diagnosis</span>
        </div>
        <p className="text-slate-300 pl-6">
          This panel translates computational AI outputs into accessible language. It does{' '}
          <strong className="text-white">NOT</strong> constitute a diagnostic conclusion, treatment
          recommendation, or surgical plan. Only a licensed physician or neuroradiologist reviewing
          complete medical history and full volumetric series can provide a diagnosis.
        </p>
      </div>

      {/* Primary Finding Explanation */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-mono text-teal-400 font-bold">
              1. What the AI Model Observed
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">{finding.title}</h4>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-200">
            Model Output: {prediction || 'Indeterminate'}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{finding.summary}</p>
        <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
          {finding.details}
        </p>
      </div>

      {/* Confidence Score Interpretation */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-mono text-teal-400 font-bold">
            2. Understanding the {pct}% Confidence Score
          </span>
          <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded">
            {pct}% Statistical Pattern Match
          </span>
        </div>
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            The percentage <strong className="text-white">{pct}%</strong> measures how closely the
            mathematical feature vectors extracted from this single picture match the reference patterns in
            the model's training set.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>What It Means</span>
              </span>
              <p className="text-[11px] text-slate-400">
                The visual textures and shapes in this slice have high algorithmic correlation with
                curated {prediction} training examples.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>What It Does NOT Mean</span>
              </span>
              <p className="text-[11px] text-slate-400">
                It does NOT mean there is a {pct}% clinical probability of having this disease. It does
                not assess pathology, blood labs, or patient symptoms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitations of This Analysis */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-2.5">
        <span className="text-[11px] uppercase tracking-wider font-mono text-teal-400 font-bold">
          3. Specific Known Limitations
        </span>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-white">Single 2D Slice Only:</strong> Clinical MRI examinations
            contain hundreds of 3D slices across multiple planes (axial, sagittal, coronal). Analyzing
            only one slice misses findings located elsewhere.
          </li>
          <li>
            <strong className="text-white">Four-Class Model Scope:</strong> This neural network was
            strictly trained to recognize four classes (Glioma, Meningioma, Pituitary, and No Tumor). It
            cannot identify acute strokes, vascular aneurysms, or multiple sclerosis.
          </li>
          <li>
            <strong className="text-white">Requires Histopathology:</strong> Definitive brain tumor
            typing and genetic grading (WHO Grade I–IV) requires microscopic tissue biopsy and molecular
            markers (e.g. IDH mutation, 1p/19q codeletion).
          </li>
        </ul>
      </div>

      {/* Questions to Discuss With Your Doctor */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <FileQuestion className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            4. Suggested Questions for Your Neurologist or Radiologist
          </h4>
        </div>
        <p className="text-xs text-slate-400">
          You can print or copy these questions to guide your conversation during your clinical consultation:
        </p>
        <div className="space-y-2 pt-1">
          {suggestedQuestions.map((q, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs text-slate-200"
            >
              <div className="flex items-start space-x-2.5">
                <span className="font-mono text-teal-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{q}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyQuestion(q, idx)}
                className="shrink-0 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-teal-300 transition-all"
                title="Copy question"
              >
                {copiedQuestionIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Jargon Buster Accordion */}
      <div className="border border-slate-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowJargonBuster(!showJargonBuster)}
          className="w-full flex items-center justify-between p-4 bg-slate-950/60 hover:bg-slate-950 text-left transition-all"
        >
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white">
              Medical Terminology Guide (Jargon Buster)
            </span>
          </div>
          {showJargonBuster ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showJargonBuster && (
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3">
            {jargonItems.map((item, idx) => (
              <div key={idx} className="space-y-0.5 text-xs">
                <span className="font-bold text-teal-300">{item.term}:</span>
                <p className="text-slate-400 leading-relaxed">{item.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlainLanguageExplanation;
