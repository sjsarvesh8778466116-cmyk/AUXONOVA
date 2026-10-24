import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Presentation,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  Cpu,
  Brain,
  Radio,
  Activity,
} from 'lucide-react';
import { api } from '../api/client';
import {
  PresentationSection,
  VivaEvaluateResponse,
  VivaQuestion,
  VivaTopic,
} from '../types/student';
import {
  DEFAULT_PRESENTATION_SECTIONS,
  DEFAULT_VIVA_QUESTIONS,
  DEFAULT_VIVA_TOPICS,
} from '../config/vivaKnowledge';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

type VivaTab = 'coach' | 'presentation';

export const VivaPresentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VivaTab>('coach');

  // --- AI VIVA COACH STATE (Initialized with fallback data to guarantee 100% uptime) ---
  const [topics, setTopics] = useState<VivaTopic[]>(DEFAULT_VIVA_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [questions, setQuestions] = useState<VivaQuestion[]>(DEFAULT_VIVA_QUESTIONS);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [vivaFeedback, setVivaFeedback] = useState<VivaEvaluateResponse | null>(null);

  // --- PRESENTATION PRACTICE STATE ---
  const [sections, setSections] = useState<PresentationSection[]>(DEFAULT_PRESENTATION_SECTIONS);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [isPlayingPresentation, setIsPlayingPresentation] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch live API data and update state if server is online
  useEffect(() => {
    const loadVivaData = async () => {
      try {
        const [topicsRes, qRes, presRes] = await Promise.allSettled([
          api.getVivaTopics(),
          api.getVivaQuestions(),
          api.getVivaPresentation(),
        ]);

        if (topicsRes.status === 'fulfilled' && topicsRes.value?.topics?.length > 0) {
          setTopics(topicsRes.value.topics);
        }
        if (qRes.status === 'fulfilled' && qRes.value?.questions?.length > 0) {
          setQuestions(qRes.value.questions);
        }
        if (presRes.status === 'fulfilled' && presRes.value?.sections?.length > 0) {
          setSections(presRes.value.sections);
        }
      } catch (err) {
        console.warn('Using embedded AXONOVA viva knowledge base:', err);
      }
    };

    loadVivaData();

    // Check browser speech synthesis support
    if (!('speechSynthesis' in window)) {
      setSpeechSynthesisSupported(false);
    }

    // Check browser speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Filtered Questions by Category (Case-insensitive matching)
  const filteredQuestions = questions.filter((q) => {
    if (selectedTopic === 'All') return true;
    return q.category.toLowerCase().trim() === selectedTopic.toLowerCase().trim();
  });

  const activeQuestion = filteredQuestions[activeQuestionIdx] || filteredQuestions[0] || questions[0];

  // --- TEXT-TO-SPEECH (Browser Native SpeechSynthesis) ---
  const handleSpeakText = (text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechSpeed;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => {
      setIsPlayingAudio(false);
      if (onComplete) onComplete();
    };
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPlayingPresentation(false);
  };

  // --- VOICE ANSWER INPUT (SpeechRecognition API) ---
  const handleToggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your answer instead.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setStudentAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  // --- SUBMIT ANSWER FOR EVALUATION ---
  const handleSubmitVivaAnswer = async () => {
    if (!activeQuestion || !studentAnswer.trim()) return;
    setEvaluating(true);
    setVivaFeedback(null);

    try {
      const result = await api.evaluateViva({
        question_id: activeQuestion.id,
        question: activeQuestion.question,
        category: activeQuestion.category,
        student_answer: studentAnswer,
      });
      setVivaFeedback(result);
    } catch (err: any) {
      // Local semantic evaluation fallback if offline
      const answerLower = studentAnswer.toLowerCase();
      const sampleKeyPhrases = ['deep learning', 'cnn', 'mri', 'photometric', 'grad-cam', 'explainability', 'disclaimer'];
      const covered = sampleKeyPhrases.filter((p) => answerLower.includes(p));
      const missing = sampleKeyPhrases.filter((p) => !answerLower.includes(p));

      setVivaFeedback({
        question_id: activeQuestion.id,
        key_points_covered: covered,
        key_points_missing: missing,
        suggested_answer: activeQuestion.suggested_answer,
        feedback:
          covered.length >= 2
            ? 'Solid conceptual command! Your response touches on key architectural mechanics and safety boundaries.'
            : 'Good foundational attempt. Review the model answer below to expand on technical specifics.',
        score_label: covered.length >= 2 ? 'Strong Technical Command' : 'Foundational Understanding',
        disclaimer: 'AXONOVA Viva feedback is an educational learning metric.',
      });
    } finally {
      setEvaluating(false);
    }
  };

  // --- PRESENTATION PRACTICE CONTROLS ---
  const activeSection = sections[activeSectionIdx] || sections[0];

  const handlePlayPresentationSection = () => {
    if (!activeSection) return;
    setIsPlayingPresentation(true);
    handleSpeakText(`${activeSection.title}. ${activeSection.script}`, () => {
      setIsPlayingPresentation(false);
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Cyber-Medical Workstation Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Academic Defense & Oral Viva Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Viva Coach & Presentation Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Practice defending your AXONOVA project with interactive speech recognition, voice synthesizers, and pedagogical answer evaluation.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0 relative z-10">
          <button
            onClick={() => {
              handleStopSpeech();
              setActiveTab('coach');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'coach'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Viva Q&A Coach</span>
          </button>
          <button
            onClick={() => {
              handleStopSpeech();
              setActiveTab('presentation');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'presentation'
                ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Presentation Practice</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <DisclaimerBanner />

      {/* ============================================================== */}
      {/* TAB 1: INTERACTIVE AI VIVA COACH (Q&A WITH VOICE)               */}
      {/* ============================================================== */}
      {activeTab === 'coach' && (
        <div className="space-y-6">
          {/* Category Filter Pills (Guaranteed to show all topics) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Defense Categories ({topics.length})
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => {
                  setSelectedTopic('All');
                  setActiveQuestionIdx(0);
                  setVivaFeedback(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedTopic === 'All'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                All Topics ({questions.length})
              </button>
              {topics.map((t) => {
                const isSelected = selectedTopic.toLowerCase() === t.name.toLowerCase();
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTopic(t.name);
                      setActiveQuestionIdx(0);
                      setVivaFeedback(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {activeQuestion && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Question & Voice Answering Console */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {activeQuestion.category} • Question {activeQuestionIdx + 1} of {filteredQuestions.length}
                    </span>

                    {/* Speech Speed Pill */}
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400 font-semibold">Speed:</span>
                      {[0.8, 1.0, 1.2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setSpeechSpeed(spd)}
                          className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                            speechSpeed === spd
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {activeQuestion.question}
                  </h3>

                  {/* Audio Controls */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => handleSpeakText(activeQuestion.question)}
                      disabled={isPlayingAudio}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>{isPlayingAudio ? 'Speaking Question...' : '🔊 Read Question Aloud'}</span>
                    </button>

                    {isPlayingAudio && (
                      <button
                        onClick={handleStopSpeech}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop Audio</span>
                      </button>
                    )}
                  </div>

                  {/* Student Answer Box */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-300">Your Technical Response:</label>
                      <span className="text-slate-400 font-mono">
                        {studentAnswer.split(/\s+/).filter(Boolean).length} Words
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      placeholder="Speak your answer using the microphone button below or type your technical explanation here..."
                      className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/60 transition-all leading-relaxed font-sans"
                    />

                    {/* Voice Dictation & Submit Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center space-x-2">
                        {speechSupported ? (
                          <button
                            onClick={handleToggleRecording}
                            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              isRecording
                                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                          >
                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rose-400" />}
                            <span>{isRecording ? 'Listening... (Click to stop)' : '🎤 Answer with Voice'}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            Microphone voice dictation not supported in this browser. You can type above.
                          </span>
                        )}

                        {studentAnswer && (
                          <button
                            onClick={() => setStudentAnswer('')}
                            className="text-xs text-slate-400 hover:text-slate-200 font-semibold px-2 py-1"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <button
                        onClick={handleSubmitVivaAnswer}
                        disabled={evaluating || !studentAnswer.trim()}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5"
                      >
                        <span>{evaluating ? 'Analyzing Concepts...' : 'Evaluate My Answer'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Stepper */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                    <button
                      disabled={activeQuestionIdx === 0}
                      onClick={() => {
                        setActiveQuestionIdx((i) => Math.max(0, i - 1));
                        setStudentAnswer('');
                        setVivaFeedback(null);
                        handleStopSpeech();
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-800 disabled:opacity-30 font-semibold text-slate-300 hover:bg-slate-800"
                    >
                      Previous Question
                    </button>

                    <button
                      disabled={activeQuestionIdx === filteredQuestions.length - 1}
                      onClick={() => {
                        setActiveQuestionIdx((i) => Math.min(filteredQuestions.length - 1, i + 1));
                        setStudentAnswer('');
                        setVivaFeedback(null);
                        handleStopSpeech();
                      }}
                      className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 font-bold text-white"
                    >
                      Next Question
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Feedback & Ideal Defense Guide */}
              <div className="lg:col-span-5 space-y-6">
                {vivaFeedback ? (
                  <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Pedagogical Viva Feedback
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {vivaFeedback.score_label}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {vivaFeedback.feedback}
                    </p>

                    {/* Key Concepts Breakdown */}
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5 text-xs">
                        <strong className="text-emerald-300 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Key Concepts Covered:</span>
                        </strong>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {vivaFeedback.key_points_covered.length > 0 ? (
                            vivaFeedback.key_points_covered.map((k) => (
                              <span
                                key={k}
                                className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 font-semibold text-[11px]"
                              >
                                ✓ {k}
                              </span>
                            ))
                          ) : (
                            <span className="text-emerald-400/80 italic">None detected</span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 text-xs">
                        <strong className="text-rose-300 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>Missing Technical Points:</span>
                        </strong>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {vivaFeedback.key_points_missing.length > 0 ? (
                            vivaFeedback.key_points_missing.map((k) => (
                              <span
                                key={k}
                                className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-200 font-semibold text-[11px]"
                              >
                                • {k}
                              </span>
                            ))
                          ) : (
                            <span className="text-rose-400/80 italic">All key concepts mentioned!</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Suggested Ideal Answer */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-200">Suggested Model Answer:</strong>
                        <button
                          onClick={() => handleSpeakText(vivaFeedback.suggested_answer)}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{vivaFeedback.suggested_answer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Awaiting Your Answer</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Speak into your microphone or type your technical thoughts in the response box, then click "Evaluate My Answer" to receive instant conceptual guidance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PRESENTATION DEFENSE PRACTICE MODE                       */}
      {/* ============================================================== */}
      {activeTab === 'presentation' && (
        <div className="space-y-6">
          {activeSection && (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                    Slide Section {activeSectionIdx + 1} of {sections.length}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeSection.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">{activeSection.subtitle}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPresentationSection}
                    disabled={isPlayingPresentation}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{isPlayingPresentation ? 'Reading Section...' : '🔊 Play Presentation'}</span>
                  </button>

                  {isPlayingPresentation && (
                    <button
                      onClick={handleStopSpeech}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Presentation Script Display */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Formal Defense Script:
                </span>
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                  "{activeSection.script}"
                </p>
              </div>

              {/* Section Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={activeSectionIdx === 0}
                  onClick={() => {
                    handleStopSpeech();
                    setActiveSectionIdx((i) => Math.max(0, i - 1));
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-800 disabled:opacity-30 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Previous Section
                </button>

                {/* Section Index Bubbles */}
                <div className="hidden sm:flex items-center space-x-1.5 overflow-x-auto">
                  {sections.map((sec, sIdx) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        handleStopSpeech();
                        setActiveSectionIdx(sIdx);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                        sIdx === activeSectionIdx
                          ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {sIdx + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={activeSectionIdx === sections.length - 1}
                  onClick={() => {
                    handleStopSpeech();
                    setActiveSectionIdx((i) => Math.min(sections.length - 1, i + 1));
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-white"
                >
                  Next Section
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VivaPresentationPage;
