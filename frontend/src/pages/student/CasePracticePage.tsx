import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Brain,
  Layers,
  Sparkles,
  MessageSquare,
  Send,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  FileText,
  AlertTriangle,
  Lightbulb,
  Cpu,
} from 'lucide-react';
import { api } from '../../api/client';
import {
  CaseDetail,
  StudentCaseResult,
  StudentChatResponse,
} from '../../types/student';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const AVAILABLE_CONCEPTS = [
  'Edges & Margins',
  'Texture & Heterogeneity',
  'Shapes & Contours',
  'Intensity (T1/T2 Signal)',
  'Contrast Enhancement',
  'Spatial Compartment (Intra vs Extra-axial)',
  'Mass Effect & Edema',
  'Other / Sellar Location',
];

const CasePracticePage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();

  // Case & UI State
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Student Input State
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [reasoningText, setReasoningText] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<StudentCaseResult | null>(null);

  // Image Viewer State (Zoom/Rotate)
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Grad-CAM View Mode in comparison
  const [gradcamViewMode, setGradcamViewMode] = useState<'overlay' | 'side-by-side'>('side-by-side');

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; time: string }>
  >([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    'Give me a hint.',
    'What concepts should I consider?',
    'What does texture mean in MRI?',
    'What does an edge represent?',
    'What are possible differential diagnoses?',
    'Why should I not rely on one feature alone?',
  ]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caseId) return;
    const fetchCase = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getStudentCase(caseId);
        setCaseData(data);
        // Initial assistant greeting
        setChatMessages([
          {
            sender: 'assistant',
            text: `Hello! I am your **AXONOVA Learning Assistant** for **${data.title}**.\n\nTake your time inspecting the MRI slice and clinical presentation. When you're ready, ask for progressive hints (I won't spoil the answer!), or ask about MRI features like edges, textures, and differentials!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to load case data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleConcept = (concept: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  };

  const handleSubmitPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !selectedCategory) return;
    setSubmitting(true);
    try {
      const res = await api.submitStudentCase(caseId, {
        selected_category: selectedCategory,
        selected_concepts: selectedConcepts,
        reasoning: reasoningText,
      });
      setResult(res);
      // Append review message to chat
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `🎓 **Case Submission Evaluated!**\n\nYour Prediction: **${selectedCategory}**\nVerified Educational Outcome: **${res.verified_outcome}**\n\nReview the comparison card and live CNN attention map below!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to submit prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || chatInput;
    if (!textToSend.trim() || !caseId) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.chatStudentAssistant(textToSend, caseId, hintLevel);
      setHintLevel(res.current_hint_level);
      if (res.suggested_actions && res.suggested_actions.length > 0) {
        setSuggestedActions(res.suggested_actions);
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am momentarily unable to respond. Please check your backend connection.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Loading educational case...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-4 max-w-xl mx-auto text-center shadow-lg">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Case Not Available</h2>
        <p className="text-xs text-rose-300 leading-relaxed">{error || 'Unknown error'}</p>
        <Link
          to="/student/cases"
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          <span>Return to Case Library</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Case Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
              {caseData.id} • {caseData.difficulty}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Sequence: <strong className="text-white">{caseData.sequence}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {caseData.title}
          </h1>
        </div>

        <Link
          to="/student/cases"
          className="text-xs text-slate-400 hover:text-teal-300 flex items-center space-x-1 shrink-0 font-medium transition-colors"
        >
          <span>← Back to Case Library</span>
        </Link>
      </div>

      <DisclaimerBanner />

      {/* Main Two-Column Layout: MRI Viewer & Clinical Info (Left) vs Reasoning / Prediction (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: MRI Viewer & Available Clinical Information (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Interactive MRI Viewer Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-3 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <Eye className="w-4 h-4 text-teal-400" />
                <span>De-Identified MRI Slice Viewer</span>
              </span>
              {/* Zoom & Rotate Controls */}
              <div className="flex items-center space-x-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Reset View"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-80 bg-black rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden p-3 relative">
              <img
                src={caseData.image_url}
                alt={caseData.title}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-h-full object-contain rounded-lg select-none"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs border border-white/20 text-[10px] font-mono text-white px-2 py-0.5 rounded">
                Orientation: {caseData.orientation} • Zoom: {(zoom * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Clinical Case Information */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Available Case Information</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-400">Clinical Presentation / History:</span>
                <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {caseData.clinical_presentation}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-400">Radiological Observations:</span>
                <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {caseData.imaging_observations}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-400">Learning Objectives:</span>
                <ul className="space-y-1.5">
                  {caseData.learning_objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning-First Prediction Workflow & AI Chatbot (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Prediction & Reasoning Form */}
          {!result ? (
            <form
              onSubmit={handleSubmitPrediction}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <span>Reasoning-First AI-Supported Assessment</span>
                </div>
                <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30 font-semibold">
                  Clinical Assessment
                </span>
              </div>

              {/* Step 1: Category Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Step 1: What is your primary category prediction?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {caseData.supported_classes.map((cls) => {
                    const isSelected = selectedCategory === cls;
                    const label = cls === 'No_Tumor' ? 'No Tumor (Normal)' : cls;
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => setSelectedCategory(cls)}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-sm ring-1 ring-teal-500/40 font-bold'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>{label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Concept Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Step 2: Which MRI visual concepts influenced your decision?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_CONCEPTS.map((concept) => {
                    const isChecked = selectedConcepts.includes(concept);
                    return (
                      <button
                        type="button"
                        key={concept}
                        onClick={() => toggleConcept(concept)}
                        className={`p-2 rounded-lg border text-[11px] text-left transition-all flex items-center space-x-2 ${
                          isChecked
                            ? 'bg-teal-500/15 text-teal-200 border-teal-500/40 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-teal-500 border-teal-500 text-slate-950'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{concept}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Text Reasoning */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Step 3: Why did you choose this? Explain your clinical reasoning:
                </label>
                <textarea
                  rows={3}
                  value={reasoningText}
                  onChange={(e) => setReasoningText(e.target.value)}
                  placeholder="e.g., The intra-axial infiltrating margins blending with white matter and surrounding vasogenic edema suggest a glial neoplasm..."
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-800 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedCategory || submitting}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                  !selectedCategory || submitting
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm'
                }`}
              >
                {submitting ? (
                  <span>Evaluating Reasoning & Running CNN...</span>
                ) : (
                  <>
                    <span>Submit Prediction & Compare with Ground Truth</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Reveal & Compare Results Section */
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 font-bold text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Reveal & Compare: Educational Synthesis</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    result.is_match
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {result.is_match ? 'Outcome Matched' : 'Educational Learning Opportunity'}
                </span>
              </div>

              {/* Outcome Comparison Box */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    Your Prediction
                  </span>
                  <p className="text-base font-bold text-white">{result.student_prediction}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                    Verified Outcome
                  </span>
                  <p className="text-base font-bold text-teal-300">{result.verified_outcome}</p>
                </div>
              </div>

              {/* Educational Constructive Feedback */}
              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs space-y-1">
                <span className="font-semibold text-teal-300">Educational Review Note:</span>
                <p className="text-slate-200 leading-relaxed">{result.educational_feedback}</p>
              </div>

              {/* Student's Reason & Selected Concepts */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                <span className="font-semibold text-slate-400">Your Clinical Rationale:</span>
                <p className="text-slate-300 italic font-mono text-[11px]">
                  "{result.student_reasoning}"
                </p>
                {result.student_concepts.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {result.student_concepts.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-teal-300 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Teaching Points */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-teal-300">What the Case Teaches:</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {result.teaching_points}
                </p>
              </div>

              {/* Differential Considerations */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-400">Important Differentials to Review:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.differential_considerations.map((diff, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium"
                    >
                      • {diff}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real CNN Prediction & Grad-CAM Explainability */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <Cpu className="w-4 h-4 text-teal-400" />
                    <span>Real CNN Inference & Grad-CAM Attention</span>
                  </div>
                  {result.cnn_prediction && (
                    <span className="text-[11px] font-mono text-slate-400">
                      CNN Class: <strong className="text-teal-300">{result.cnn_prediction}</strong> (
                      {((result.cnn_confidence || 0) * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {result.what_cnn_learns}
                </p>

                {/* Grad-CAM Saliency Display if available */}
                {result.gradcam_available && result.gradcam_image_base64 && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        <span>Grad-CAM Model Attention Saliency</span>
                      </span>
                      <div className="flex items-center space-x-1 text-[11px] bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setGradcamViewMode('side-by-side')}
                          className={`px-2 py-0.5 rounded transition-all ${
                            gradcamViewMode === 'side-by-side'
                              ? 'bg-teal-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Side-by-Side
                        </button>
                        <button
                          type="button"
                          onClick={() => setGradcamViewMode('overlay')}
                          className={`px-2 py-0.5 rounded transition-all ${
                            gradcamViewMode === 'overlay'
                              ? 'bg-teal-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Overlay
                        </button>
                      </div>
                    </div>

                    <div className="h-56 bg-black rounded-xl border border-slate-800 flex items-center justify-center p-2">
                      <img
                        src={result.gradcam_image_base64}
                        alt="Grad-CAM Saliency"
                        className="max-h-full object-contain rounded-lg shadow-md"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <span className="font-bold text-white">Model Attention Limitation:</span>
                      <p className="leading-relaxed">{result.model_limitations}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Try Another Case */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setSelectedCategory('');
                    setSelectedConcepts([]);
                    setReasoningText('');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Reset Case
                </button>
                <Link
                  to="/student/cases"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-sm"
                >
                  <span>Practice Next Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Embedded AI Medical Learning Chatbot */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col h-[480px] shadow-xl">
            <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white">AXONOVA Learning Assistant</span>
              </div>
              <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30 font-semibold">
                Socratic Hints
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-950/50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-teal-500/20 text-teal-100 border border-teal-500/30 font-normal rounded-br-none'
                        : 'bg-slate-850 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center space-x-1 text-xs text-slate-500 p-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggested Action Chips */}
            <div className="p-2 border-t border-slate-800 bg-slate-950 flex items-center space-x-1.5 overflow-x-auto">
              {suggestedActions.slice(0, 3).map((act, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSendMessage(act)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 shrink-0 transition-colors shadow-xs"
                >
                  💡 {act}
                </button>
              ))}
            </div>

            {/* Chat Input Field */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask for hints or question about edges/textures..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || chatLoading}
                className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePracticePage;
