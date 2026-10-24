import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  LineChart,
  Calendar,
  Layers,
  HelpCircle,
  ShieldAlert,
  BookOpen,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api/client';
import { EvaluationResponse, TaskInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import MetricsSummary from '../components/evaluation/MetricsSummary';
import ConfusionMatrixTable from '../components/evaluation/ConfusionMatrixTable';
import TrainingCurvesChart from '../components/evaluation/TrainingCurvesChart';

const EvaluationPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedTaskId = searchParams.get('task') || 'brain-tumor';
  const selectedTask =
    tasks.find((t) => t.task_id === selectedTaskId) ||
    tasks.find((t) => t.task_id === 'brain-tumor') ||
    null;

  useEffect(() => {
    const loadTasksAndEval = async () => {
      setLoading(true);
      try {
        const [taskList, evalData] = await Promise.all([
          api.getTasks().catch(() => []),
          api.getTaskEvaluation(selectedTaskId).catch(() => null),
        ]);
        setTasks(taskList);
        setEvaluation(evalData);
      } catch (err) {
        console.error('Error fetching evaluation data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasksAndEval();
  }, [selectedTaskId]);

  const handleSelectTask = (taskId: string) => {
    setSearchParams({ task: taskId });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Loading model evaluation metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <LineChart className="w-4 h-4" />
            <span>Held-out Test Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Model Evaluation & Validation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Rigorous statistical evaluation on held-out subject cohorts with zero data leakage.
          </p>
        </div>

        {evaluation?.evaluated_at && (
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 border border-slate-700 px-3.5 py-1.5 rounded-xl text-slate-300 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>{new Date(evaluation.evaluated_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <DisclaimerBanner />

      {/* Condition / Task Selector Bar */}
      <section className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
          Select Condition Evaluation:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {tasks.map((task) => {
            const isSelected = selectedTaskId === task.task_id;
            const isBrainTumor = task.task_id === 'brain-tumor';
            const isRoadmap = task.task_id === 'future-research';

            return (
              <button
                key={task.task_id}
                type="button"
                onClick={() => handleSelectTask(task.task_id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500 shadow-teal-glow ring-1 ring-teal-400/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    {task.category}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBrainTumor ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">
                  {task.short_title}
                </div>
                <div className="mt-1 text-[10px] font-mono">
                  {isBrainTumor ? (
                    <span className="text-emerald-400 font-bold">
                      {evaluation?.overall_accuracy !== undefined
                        ? `${(evaluation.overall_accuracy * 100).toFixed(1)}% Acc (Held-out)`
                        : 'Held-out Benchmark'}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">In Development</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* If current task is in research mode: show honest research status */}
      {!evaluation || !evaluation.evaluated ? (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-sm">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 w-fit mx-auto text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 font-mono">
              <span>In Development — Evaluation Pending</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Evaluation Protocol for {selectedTask?.name || selectedTaskId}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Research Integrity:</strong> AXONOVA does not fabricate accuracy scores,
              per-class metrics, confusion matrices, or loss curves. To evaluate this condition, a held-out test split
              with subject-level separation and genuine model weights are required.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/tasks"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-teal-glow"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Research Protocol Specifications</span>
            </Link>
            <button
              type="button"
              onClick={() => handleSelectTask('brain-tumor')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>View Verified Brain Tumor Benchmark</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Metrics Summary Cards & Table */}
          {evaluation.overall_accuracy !== undefined && evaluation.per_class_metrics && (
            <MetricsSummary
              accuracy={evaluation.overall_accuracy}
              perClassMetrics={evaluation.per_class_metrics}
              totalTestImages={evaluation.test_images_count || 0}
            />
          )}

          {/* Confusion Matrix and Curves */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Confusion Matrix (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {evaluation.confusion_matrix && (
                <ConfusionMatrixTable
                  matrix={evaluation.confusion_matrix.matrix}
                  classes={evaluation.confusion_matrix.classes}
                />
              )}
            </div>

            {/* Training Curves (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <TrainingCurvesChart history={evaluation.training_history} />
            </div>
          </div>

          {/* Metric Interpretations Guide */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>Understanding Deep Learning Evaluation Metrics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300 font-mono">Accuracy & F1-Score:</span>
                <p className="text-slate-400 leading-relaxed">
                  Accuracy measures total correct matches across all classes. F1-score balances precision and recall, especially important when class distributions vary.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-300 font-mono">Precision vs Recall:</span>
                <p className="text-slate-400 leading-relaxed">
                  Precision reflects how many scans predicted as a class were truly that class. Recall measures how many actual scans of a class were successfully captured.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EvaluationPage;
