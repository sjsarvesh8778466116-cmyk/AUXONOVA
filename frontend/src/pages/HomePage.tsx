import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Scan,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Cpu,
  Database,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Mic,
  Award,
  BookOpen,
  Info,
  TrendingUp,
} from 'lucide-react';
import { api } from '../api/client';
import { DatasetInfoResponse, HealthResponse, ModelInfoResponse } from '../types';
import { StudentProgressData } from '../types/student';
import { useLanguage } from '../context/LanguageContext';
import { useHistory } from '../context/HistoryContext';
import { useCondition } from '../context/ConditionContext';
import { ConditionId } from '../config/conditions';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import MedicalMotionHero from '../components/dashboard/MedicalMotionHero';

interface RecentAssessment {
  id: string;
  caseId: string;
  condition: string;
  sequence: string;
  finding: string;
  confidence: string;
  status: string;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { history } = useHistory();
  const { setSelectedConditionId } = useCondition();

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfoResponse | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [healthRes, modelRes, datasetRes, progressRes] = await Promise.allSettled([
          api.getHealth(),
          api.getModelInfo(),
          api.getDatasetInfo(),
          api.getStudentProgress(),
        ]);

        if (healthRes.status === 'fulfilled') setHealth(healthRes.value);
        if (modelRes.status === 'fulfilled') setModelInfo(modelRes.value);
        if (datasetRes.status === 'fulfilled') setDatasetInfo(datasetRes.value);
        if (progressRes.status === 'fulfilled') setStudentProgress(progressRes.value);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalCompletedAssessments = history?.length || 0;
  const totalMriCases = datasetInfo?.total_images || 3064;

  const handleLaunchCondition = (condId: ConditionId) => {
    setSelectedConditionId(condId);
    navigate(`/scans?task=${condId}`);
  };

  // Structured Core Modules
  const coreModules = [
    {
      id: 'scan-center',
      title: 'AI Scan Center',
      category: 'Diagnostic Decision-Support',
      description: 'Upload supported MRI scans and receive validated CNN predictions with Layer-Targeted Grad-CAM explainability.',
      icon: Scan,
      color: 'cyan',
      badge: 'Active Workstation',
      link: '/scans',
      ctaText: 'Open Scan Center',
    },
    {
      id: 'student-learning',
      title: 'Medical Student Learning',
      category: 'Clinical Training Lab',
      description: 'Access de-identified educational cases, practice visual reasoning on edges & textures, and receive progressive hints.',
      icon: GraduationCap,
      color: 'teal',
      badge: 'Reasoning-First',
      link: '/student',
      ctaText: 'Start Learning Lab',
    },
    {
      id: 'quiz-center',
      title: 'Quiz Center',
      category: 'Assessment & Examination',
      description: 'Practice conceptual questions or take timed, anti-cheating examinations scored strictly on the server.',
      icon: HelpCircle,
      color: 'rose',
      badge: 'Exam Mode Ready',
      link: '/quizzes',
      ctaText: 'Enter Quiz Center',
    },
    {
      id: 'viva-coach',
      title: 'AI Viva Coach',
      category: 'Speech & Defense Training',
      description: 'Practice technical defense questions using SpeechSynthesis text-to-speech and microphone voice evaluation.',
      icon: Mic,
      color: 'amber',
      badge: 'Voice Interactive',
      link: '/viva',
      ctaText: 'Practice Viva',
    },
    {
      id: 'model-eval',
      title: 'Model Evaluation',
      category: 'Empirical Benchmarks',
      description: 'Review empirical validation metrics, categorical accuracy, F1-scores, ROC curves, and confusion matrices.',
      icon: LineChart,
      color: 'indigo',
      badge: 'Institutional Audit',
      link: '/evaluation',
      ctaText: 'Inspect Metrics',
    },
    {
      id: 'dataset-explorer',
      title: 'Dataset Explorer',
      category: 'Neuroimaging Archives',
      description: 'Explore the 3,064 de-identified brain MRI dataset across Glioma, Meningioma, Pituitary, and healthy baseline splits.',
      icon: Database,
      color: 'emerald',
      badge: 'Curated Splits',
      link: '/dataset',
      ctaText: 'Explore Dataset',
    },
    {
      id: 'how-it-works',
      title: 'How AXONOVA Works',
      category: 'Pipeline Architecture',
      description: 'Detailed technical walkthrough of the end-to-end processing pipeline from pre-ingestion validation to clinical sign-off.',
      icon: Info,
      color: 'slate',
      badge: 'Architecture Guide',
      link: '/how-it-works',
      ctaText: 'View Pipeline',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* 1. Motion Hero Section */}
      <MedicalMotionHero />

      {/* Medical Safety Banner */}
      <DisclaimerBanner />

      {/* 2. Primary Core Modules Grid */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              AXONOVA Clinical & Educational Suite
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Platform Modules
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            7 Integrated Research & Educational Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors">
                      {mod.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      {mod.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to={mod.link}
                    className="inline-flex w-full items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/80 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-teal-500 text-slate-300 group-hover:text-slate-950 border border-slate-800 group-hover:border-transparent text-xs font-bold transition-all"
                  >
                    <span>{mod.ctaText}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Learning Progress & Student Analytics Section */}
      <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Medical Student Learning Trackers</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Curriculum Mastery & Assessment Analytics
            </h3>
          </div>

          <Link
            to="/student"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Full Student Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Bars */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Core Concept Competency
            </h4>
            <div className="space-y-3.5">
              {[
                { name: 'MRI Basics & Pulse Sequences', pct: 80, color: 'bg-cyan-500' },
                { name: 'CNN Layers & Feature Hierarchy', pct: 70, color: 'bg-teal-400' },
                { name: 'Deep Learning & Generalization', pct: 90, color: 'bg-indigo-400' },
                { name: 'AXONOVA Safety & Grad-CAM', pct: 85, color: 'bg-emerald-400' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-slate-400 font-mono">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${item.color} shadow-sm transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Practice Session Summary
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Educational Cases Solved:</span>
                  <strong className="text-white">{studentProgress?.cases_completed || 2}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Quizzes Attempted:</span>
                  <strong className="text-white">{studentProgress?.quizzes_attempted || 8}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Active Study Streak:</span>
                  <strong className="text-teal-400 font-bold">
                    {studentProgress?.streak_days || 1} Day
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/quizzes"
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs shadow-xs transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Take Practice Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Clinical Demonstrations Feed */}
      <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white">
              Recent Session Radiology Studies
            </h3>
            <p className="text-xs text-slate-400">
              Scans analyzed and reviewed in the active research session.
            </p>
          </div>
          <Link
            to="/scans"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1"
          >
            <span>Scan Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Condition Domain</th>
                  <th className="py-2.5 px-3">Sequence</th>
                  <th className="py-2.5 px-3">Primary Finding</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Review Status</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {history.slice(0, 5).map((item) => {
                  const p = item.prediction;
                  const caseId = p.case_id || item.id;
                  const condition = p.task_name || 'Brain Tumor MRI';
                  const seq = p.orientation_label ? `MRI (${p.orientation_label})` : 'Brain MRI';
                  const finding = p.predicted_category;
                  const conf = p.score_label || `${(p.model_score * 100).toFixed(1)}%`;
                  const statusLabel = p.is_indeterminate ? 'Indeterminate' : 'Model Inferred';
                  const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Session';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{caseId}</td>
                      <td className="py-2.5 px-3 text-white">{condition}</td>
                      <td className="py-2.5 px-3 text-slate-400">{seq}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{finding}</td>
                      <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">{conf}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.is_indeterminate
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 font-mono">{timeStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <Scan className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">No MRI Scans Processed Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Upload and analyze a brain MRI scan in the Scan Center to view real-time CNN predictions, Grad-CAM overlays, and structured clinical findings.
              </p>
            </div>
            <Link
              to="/scans"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Open Scan Center</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
