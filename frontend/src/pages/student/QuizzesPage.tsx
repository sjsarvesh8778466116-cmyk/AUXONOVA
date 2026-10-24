import React, { useEffect, useRef, useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  ShieldAlert,
  Clock,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Flame,
  BookOpen,
  BarChart3,
  Check,
  X,
  FileCheck,
  Compass,
} from 'lucide-react';
import { api } from '../../api/client';
import {
  ExamClientQuestion,
  ExamStartResponse,
  ExamSubmitResult,
  QuizCategory,
  QuizQuestion,
  QuizSubmitResult,
} from '../../types/student';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import { FALLBACK_QUIZ_CATEGORIES, FALLBACK_QUIZ_QUESTIONS } from '../../config/quizKnowledge';

type QuizMode = 'practice' | 'exam' | 'exam_results';

export const QuizzesPage: React.FC = () => {
  // Mode selection: 'practice' vs 'exam' vs 'exam_results'
  const [activeMode, setActiveMode] = useState<QuizMode>('practice');

  // --- PRACTICE MODE STATE (Initialized with rich resilient question bank) ---
  const [practiceQuestions, setPracticeQuestions] = useState<QuizQuestion[]>(FALLBACK_QUIZ_QUESTIONS);
  const [categories, setCategories] = useState<QuizCategory[]>(FALLBACK_QUIZ_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceResults, setPracticeResults] = useState<Record<string, QuizSubmitResult>>({});
  const [loadingPractice, setLoadingPractice] = useState<boolean>(false);

  // --- EXAM MODE STATE ---
  const [examSession, setExamSession] = useState<ExamStartResponse | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(0);
  const [examViolations, setExamViolations] = useState<number>(0);
  const [examViolationWarning, setExamViolationWarning] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [examSubmitting, setExamSubmitting] = useState<boolean>(false);
  const [examResults, setExamResults] = useState<ExamSubmitResult | null>(null);

  // Exam configuration before start
  const [examNumQuestions, setExamNumQuestions] = useState<number>(10);
  const [examDurationMin, setExamDurationMin] = useState<number>(15);
  const [examCategoryFilter, setExamCategoryFilter] = useState<string>('All');
  const [examDifficultyFilter, setExamDifficultyFilter] = useState<string>('All');
  const [startingExam, setStartingExam] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Load practice questions and categories from backend
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [qData, catData] = await Promise.allSettled([
          api.getQuizzes(),
          api.getQuizCategories(),
        ]);
        if (qData.status === 'fulfilled' && qData.value && qData.value.length > 0) {
          setPracticeQuestions(qData.value);
        }
        if (catData.status === 'fulfilled' && catData.value && catData.value.categories) {
          setCategories(catData.value.categories);
        }
      } catch (err) {
        console.error('Error loading quiz bank, using resilient fallbacks:', err);
      } finally {
        setLoadingPractice(false);
      }
    };
    loadInitialData();
  }, []);

  // --- EXAM MODE: TIMER & FOCUS TELEMETRY ---
  useEffect(() => {
    if (activeMode !== 'exam' || !examSession) return;

    // Synchronize initial seconds
    const expTime = new Date(examSession.expires_at).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expTime - now) / 1000));
      setExamTimeRemaining(remaining);

      if (remaining <= 0) {
        handleAutoSubmit('Time Expired');
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    timerRef.current = interval;

    // Anti-Cheating Event: Tab switch / Window blur detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('TAB_SWITCH', 'User navigated away from examination tab.');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('WINDOW_BLUR', 'Browser window lost focus.');
    };

    const handleFullscreenChange = () => {
      const inFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(inFullscreen);
      if (!inFullscreen && activeMode === 'exam') {
        triggerViolation('FULLSCREEN_EXIT', 'Fullscreen mode was exited.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [activeMode, examSession]);

  const triggerViolation = async (eventType: string, reason: string) => {
    if (!examSession) return;

    try {
      const resp = await api.logExamEvent({
        attempt_id: examSession.attempt_id,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        details: { reason },
      });

      setExamViolations(resp.violations_count);
      if (resp.auto_submitted) {
        setExamViolationWarning('Critical Security Alert: Maximum violation limit exceeded. Auto-submitting attempt.');
        handleAutoSubmit('Violation Limit Exceeded');
      } else {
        setExamViolationWarning(`Security Warning (${resp.violations_count}/3): ${reason} Please remain focused on the exam.`);
      }
    } catch (err) {
      console.error('Error logging exam telemetry:', err);
    }
  };

  const handleStartExam = async () => {
    setStartingExam(true);
    setExamViolationWarning(null);
    setExamViolations(0);

    try {
      const session = await api.startExam({
        student_id: 'med-student-01',
        category: examCategoryFilter,
        difficulty: examDifficultyFilter,
        num_questions: examNumQuestions,
        duration_minutes: examDurationMin,
      });

      setExamSession(session);
      setExamAnswers({});
      setCurrentQuestionIdx(0);
      setActiveMode('exam');

      // Request fullscreen for examination
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        } catch {
          // Fullscreen request might be blocked by browser policy; continue gracefully
        }
      }
    } catch (err: any) {
      alert(`Could not start exam attempt: ${err.message || 'Server error'}`);
    } finally {
      setStartingExam(false);
    }
  };

  const handleSelectExamAnswer = (questionId: string, optIndex: number) => {
    setExamAnswers((prev) => ({ ...prev, [questionId]: optIndex }));
  };

  const handleSubmitExam = async () => {
    if (!examSession) return;
    setExamSubmitting(true);

    try {
      const result = await api.submitExam({
        attempt_id: examSession.attempt_id,
        answers: examAnswers,
      });

      setExamResults(result);
      setActiveMode('exam_results');

      // Exit fullscreen safely
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    } catch (err: any) {
      alert(`Error submitting exam: ${err.message || 'Network error'}`);
    } finally {
      setExamSubmitting(false);
    }
  };

  const handleAutoSubmit = (reason: string) => {
    if (examSubmitting) return;
    console.warn(`Auto-submitting exam due to: ${reason}`);
    handleSubmitExam();
  };

  // --- PRACTICE MODE HANDLERS ---
  const handleSelectPracticeOption = async (questionId: string, optIndex: number) => {
    if (practiceResults[questionId]) return; // Already answered
    setPracticeAnswers((prev) => ({ ...prev, [questionId]: optIndex }));

    try {
      const res = await api.submitQuizAnswer(questionId, optIndex);
      setPracticeResults((prev) => ({ ...prev, [questionId]: res }));
    } catch (err) {
      // Local fallback evaluation
      const localQ = practiceQuestions.find((q) => q.id === questionId);
      if (localQ) {
        const correctIdx = (localQ as any).correct_index ?? 0;
        setPracticeResults((prev) => ({
          ...prev,
          [questionId]: {
            question_id: questionId,
            selected_index: optIndex,
            correct_index: correctIdx,
            is_correct: optIndex === correctIdx,
            explanation: localQ.explanation,
            topic: localQ.topic,
          },
        }));
      }
    }
  };

  const handleRetryPracticeQuestion = (questionId: string) => {
    setPracticeAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setPracticeResults((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  // Practice Filters
  const filteredPractice = practiceQuestions.filter((q) => {
    if (selectedCategory !== 'All' && q.topic !== selectedCategory) return false;
    return true;
  });

  const practiceAnsweredCount = Object.keys(practiceResults).length;
  const practiceCorrectCount = Object.values(practiceResults).filter((r) => r.is_correct).length;
  const practiceScorePct = practiceAnsweredCount > 0
    ? ((practiceCorrectCount / practiceAnsweredCount) * 100).toFixed(0)
    : '0';

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Cyber-Medical Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Assessment & Exam Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Neuroimaging & AI Quiz Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Practice conceptual neuroimaging questions with instant feedback across all 8 domains, or take timed, anti-cheating examinations scored strictly on the server.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 relative z-10">
          <button
            onClick={() => setActiveMode('practice')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'practice'
                ? 'bg-teal-500 text-slate-950 shadow-teal-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Mode
          </button>
          <button
            onClick={() => setActiveMode(examResults ? 'exam_results' : 'exam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'exam' || activeMode === 'exam_results'
                ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Examination Mode
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      {/* ============================================================== */}
      {/* 2. PRACTICE MODE VIEW                                          */}
      {/* ============================================================== */}
      {activeMode === 'practice' && (
        <div className="space-y-6">
          {/* Practice Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-white">
                  Practice Mastery: {practiceCorrectCount} / {practiceAnsweredCount} ({practiceScorePct}%)
                </div>
                <div className="text-[11px] text-slate-400">
                  Untimed practice questions with detailed pedagogical explanations across all 8 domains.
                </div>
              </div>
            </div>

            {/* Topic Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Filter Topic:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="All">All Topics ({practiceQuestions.length})</option>
                {Array.from(new Set(practiceQuestions.map((q) => q.topic))).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {filteredPractice.map((q, idx) => {
              const res = practiceResults[q.id];
              const selectedIdx = practiceAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-6 shadow-xl space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                        <span>Q{idx + 1}</span>
                        <span>•</span>
                        <span>{q.topic}</span>
                        <span>•</span>
                        <span className="text-slate-400 font-normal">{q.difficulty}</span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    {res && (
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                          res.is_correct
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {res.is_correct ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      const isAnswered = Boolean(res);
                      const isCorrectAnswer = isAnswered && optIdx === res.correct_index;
                      const isWrongSelection = isAnswered && isSelected && !res.is_correct;

                      let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700';
                      if (isSelected && !isAnswered) {
                        btnStyle = 'bg-teal-500/10 border-teal-500 text-teal-300 font-semibold shadow-teal-glow';
                      } else if (isCorrectAnswer) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]';
                      } else if (isWrongSelection) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectPracticeOption(q.id, optIdx)}
                          className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start space-x-2.5 ${btnStyle}`}
                        >
                          <span className="font-mono font-bold shrink-0 text-slate-400">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Retry Banner */}
                  {res && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-400 font-mono">Pedagogical Explanation:</span>
                        <button
                          onClick={() => handleRetryPracticeQuestion(q.id)}
                          className="inline-flex items-center space-x-1 text-[11px] font-bold text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry Question</span>
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{res.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. EXAM MODE SETUP VIEW (Before starting)                     */}
      {/* ============================================================== */}
      {activeMode === 'exam' && !examSession && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Anti-Cheating Examination Hall</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              AXONOVA Timed Examination
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
              Simulates a formal medical neuroimaging examination. Questions and options are randomized on the server.
              Answer keys are strictly withheld until final scoring.
            </p>
          </div>

          {/* Security Protocols Notice */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="font-bold flex items-center space-x-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Examination Integrity Guidelines:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Fullscreen mode will be requested upon starting.</li>
              <li>Leaving the tab or browser window logs a violation event (Max 3 violations allowed).</li>
              <li>Exceeding 3 violations will trigger automatic server submission.</li>
              <li>Copy, paste, and text selection are disabled during the session.</li>
              <li>Zero camera surveillance or biometric recording is used (privacy-friendly browser events only).</li>
            </ul>
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Category Focus:</label>
              <select
                value={examCategoryFilter}
                onChange={(e) => setExamCategoryFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white focus:outline-none focus:border-teal-500"
              >
                <option value="All">All 8 Core Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Difficulty Level:</label>
              <select
                value={examDifficultyFilter}
                onChange={(e) => setExamDifficultyFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white focus:outline-none focus:border-teal-500"
              >
                <option value="All">All Difficulties (Balanced)</option>
                <option value="Easy">Easy (Foundational)</option>
                <option value="Medium">Medium (Clinical Case Reasoning)</option>
                <option value="Hard">Hard (Advanced Biophysics & Deep CNN)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Number of Questions:</label>
              <select
                value={examNumQuestions}
                onChange={(e) => setExamNumQuestions(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white focus:outline-none focus:border-teal-500"
              >
                <option value={5}>5 Questions (Rapid Check)</option>
                <option value={10}>10 Questions (Standard Quiz)</option>
                <option value={15}>15 Questions (Comprehensive)</option>
                <option value={20}>20 Questions (Full Assessment)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Time Limit:</label>
              <select
                value={examDurationMin}
                onChange={(e) => setExamDurationMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white focus:outline-none focus:border-teal-500"
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartExam}
              disabled={startingExam}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>{startingExam ? 'Initializing Secure Session...' : 'Begin Timed Examination'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. ACTIVE EXAM HALL VIEW                                       */}
      {/* ============================================================== */}
      {activeMode === 'exam' && examSession && (
        <div
          className="space-y-6 select-none"
          onCopy={(e) => {
            e.preventDefault();
            triggerViolation('COPY_ATTEMPT', 'Copying text is restricted during exams.');
          }}
          onPaste={(e) => {
            e.preventDefault();
            triggerViolation('PASTE_ATTEMPT', 'Pasting is restricted during exams.');
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            triggerViolation('RIGHT_CLICK', 'Context menu is disabled during exams.');
          }}
        >
          {/* Top Exam Navigation Bar */}
          <div className="sticky top-4 z-40 flex items-center justify-between p-4 rounded-2xl bg-slate-950/95 backdrop-blur-md text-white shadow-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 font-bold">
                {examSession.attempt_id}
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                Question {currentQuestionIdx + 1} of {examSession.total_questions}
              </span>
            </div>

            {/* Timer & Violation Warning */}
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                  examTimeRemaining < 120
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-slate-900 text-amber-300 border border-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(examTimeRemaining)}</span>
              </div>

              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Violations:</span>
                <span
                  className={`font-mono font-bold ${
                    examViolations > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {examViolations}/3
                </span>
              </div>

              <button
                onClick={handleSubmitExam}
                disabled={examSubmitting}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                {examSubmitting ? 'Scoring...' : 'Submit Attempt'}
              </button>
            </div>
          </div>

          {/* Warning Banner if violations logged */}
          {examViolationWarning && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{examViolationWarning}</span>
            </div>
          )}

          {/* Active Question Card */}
          {(() => {
            const currentQ = examSession.questions[currentQuestionIdx];
            if (!currentQ) return null;
            const selectedOpt = examAnswers[currentQ.id];

            return (
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-mono">
                    <span>
                      {currentQ.category} • {currentQ.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950 text-teal-400 border border-slate-800">
                      {currentQ.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectExamAnswer(currentQ.id, optIdx)}
                        className={`text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        <span className="font-mono font-bold shrink-0 text-slate-400">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((i) => Math.max(0, i - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 disabled:opacity-40 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    Previous Question
                  </button>

                  {/* Question Grid Bubbles */}
                  <div className="hidden md:flex items-center space-x-1.5 overflow-x-auto">
                    {examSession.questions.map((q, qIdx) => {
                      const isAnswered = examAnswers[q.id] !== undefined;
                      const isCurrent = qIdx === currentQuestionIdx;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIdx(qIdx)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                            isCurrent
                              ? 'bg-rose-600 text-white shadow-sm'
                              : isAnswered
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {qIdx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentQuestionIdx === examSession.questions.length - 1}
                    onClick={() =>
                      setCurrentQuestionIdx((i) =>
                        Math.min(examSession.questions.length - 1, i + 1)
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 text-xs font-bold transition-colors border border-slate-700"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. EXAM RESULTS & PEDAGOGICAL REVIEW VIEW                      */}
      {/* ============================================================== */}
      {activeMode === 'exam_results' && examResults && (
        <div className="space-y-8">
          {/* Result Scorecard Header */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
                  Attempt ID: {examResults.attempt_id}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Examination Assessment Report
                </h2>
                <p className="text-xs text-slate-400">
                  Objectively validated and scored by AXONOVA automated assessment algorithms.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-black text-white font-mono">
                    {examResults.score_percentage}%
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {examResults.correct_count} of {examResults.total_questions} Correct
                  </div>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    examResults.score_percentage >= 70
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {examResults.score_percentage >= 70 ? 'PASS' : 'REV'}
                </div>
              </div>
            </div>

            {/* Topic-Wise Performance Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Topic-Wise Mastery Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {examResults.topic_scores.map((t) => (
                  <div
                    key={t.topic}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300 truncate">{t.topic}</span>
                      <span className="text-teal-400 font-mono">{t.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          t.percentage >= 70 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${t.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Feedback Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Demonstrated Competencies:</span>
                </span>
                <p className="text-emerald-200 leading-relaxed">
                  {examResults.understood_topics.length > 0
                    ? examResults.understood_topics.join(', ')
                    : 'Review the foundational chapters to reinforce core concepts.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Recommended Revision Areas:</span>
                </span>
                <p className="text-amber-200 leading-relaxed">
                  {examResults.topics_to_revise.length > 0
                    ? examResults.topics_to_revise.join(', ')
                    : 'Excellent! No major concept deficiencies detected.'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Detailed Question-by-Question Review
            </h3>

            {examResults.review.map((item, idx) => (
              <div
                key={item.question_id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-teal-400 uppercase font-mono">
                      Q{idx + 1} • {item.category} ({item.difficulty})
                    </span>
                    <h4 className="text-base font-bold text-white">{item.question}</h4>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                      item.is_correct
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {item.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Option Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.options.map((opt, oIdx) => {
                    const isSelected = item.selected_index === oIdx;
                    const isCorrect = item.correct_index === oIdx;

                    let badge = 'bg-slate-950 border-slate-800 text-slate-400';
                    if (isCorrect) {
                      badge = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !item.is_correct) {
                      badge = 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold';
                    }

                    return (
                      <div key={oIdx} className={`p-3 rounded-xl border flex items-start space-x-2 ${badge}`}>
                        <span className="font-mono font-bold shrink-0 text-slate-400">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Learning Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <strong className="text-teal-400 font-mono">Why this answer is correct:</strong>
                  <p className="text-slate-300 leading-relaxed">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              onClick={() => {
                setExamSession(null);
                setExamResults(null);
                setActiveMode('practice');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 font-bold text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              Return to Practice Mode
            </button>

            <button
              onClick={() => {
                setExamSession(null);
                setExamResults(null);
                setActiveMode('exam');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all"
            >
              Take Another Examination
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
