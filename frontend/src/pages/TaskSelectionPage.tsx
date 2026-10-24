import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Clock,
  ExternalLink,
  BookOpen,
  X,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api/client';
import { TaskInfo } from '../types';
import { useCondition } from '../context/ConditionContext';
import { ConditionId } from '../config/conditions';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

const TaskSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedConditionId, setSelectedConditionId } = useCondition();

  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'roadmap'>('all');
  const [selectedGuideTask, setSelectedGuideTask] = useState<TaskInfo | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks from API:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.task_id !== 'future-research';
    if (filter === 'roadmap') return task.task_id === 'future-research';
    return true;
  });

  const activeCount = tasks.filter((t) => t.task_id !== 'future-research').length;
  const roadmapCount = tasks.filter((t) => t.task_id === 'future-research').length;

  const handleSelectCondition = (taskId: string) => {
    setSelectedConditionId(taskId as ConditionId);
  };

  const handleLaunchScanner = (taskId: string) => {
    setSelectedConditionId(taskId as ConditionId);
    navigate(`/scans?task=${taskId}`);
  };

  const getTaskIcon = (taskId: string) => {
    switch (taskId) {
      case 'brain-tumor':
        return <Brain className="w-5 h-5 text-teal-400" />;
      case 'alzheimers':
        return <Layers className="w-5 h-5 text-teal-400" />;
      case 'multiple-sclerosis':
        return <Activity className="w-5 h-5 text-teal-400" />;
      case 'stroke':
        return <AlertTriangle className="w-5 h-5 text-teal-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-teal-400" />;
    }
  };

  const getStatusBadge = (taskId: string) => {
    if (taskId === 'brain-tumor') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>● SUPPORTED (Trained & Evaluated)</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span>○ IN DEVELOPMENT (Weights Pending)</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-xs font-semibold text-teal-300 font-mono">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Multi-Condition Modular Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Select Brain MRI Condition
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            AXONOVA provides a condition-specific deep learning architecture. Brain Tumor MRI Classification is fully supported with verified CNN weights and Grad-CAM explainability, while additional research tasks are staged in development.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Available Conditions:</span>
              <span className="text-emerald-300 font-bold">1 Supported + 4 In Development</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-slate-400">Active Model:</span>
              <span className="text-teal-300 font-bold">Brain Tumor 4-Class CNN</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-400">System Status:</span>
              <span className="text-cyan-300 font-bold">Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <DisclaimerBanner />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Filter Conditions:
          </span>
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Conditions ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'active'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'roadmap'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Research Roadmap ({roadmapCount})
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          Click any condition card to update workstation context and launch scanner workflows.
        </p>
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono">Loading brain MRI condition modules...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const isBrainTumor = task.task_id === 'brain-tumor';
            const isRoadmap = task.task_id === 'future-research';
            const isSelected = selectedConditionId === task.task_id;

            return (
              <div
                key={task.task_id}
                onClick={() => handleSelectCondition(task.task_id)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-teal-500 shadow-teal-glow ring-1 ring-teal-400/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-sm'
                }`}
              >
                <div className="space-y-5">
                  {/* Top Bar: Icon, Category & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-teal-400">
                        {getTaskIcon(task.task_id)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider font-mono">
                            {task.category}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                              ACTIVE SELECTION
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {task.name}
                        </h2>
                      </div>
                    </div>
                    <div>{getStatusBadge(task.task_id)}</div>
                  </div>

                  {/* Tagline & Description */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-200">
                      {task.tagline}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Required Sequences & Technical Specs */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                        Required MRI Sequences:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.required_sequences.map((seq) => (
                          <span
                            key={seq}
                            className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-750 font-mono shadow-xs"
                          >
                            {seq}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase font-mono">
                          Orientations
                        </span>
                        <span className="text-slate-300 font-medium text-[11px]">
                          {task.supported_orientations.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase font-mono">
                          Status
                        </span>
                        <span className={`font-semibold text-[11px] ${isBrainTumor ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isBrainTumor ? 'SUPPORTED' : 'IN DEVELOPMENT'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase font-mono">
                          Research Benchmark
                        </span>
                        <span
                          className={`font-semibold text-[11px] ${
                            isBrainTumor ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {isBrainTumor
                            ? '97.5% Acc (Held-out Set)'
                            : 'Weights & Dataset Required'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Limitations & Caveats */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1 font-mono">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>Condition Specifications:</span>
                    </span>
                    <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                      {task.limitations.slice(0, 2).map((lim, i) => (
                        <li key={i} className="leading-relaxed">
                          {lim}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div
                  className="pt-5 mt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-xs text-slate-400 font-mono flex items-center space-x-1.5">
                    {isBrainTumor ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Status: <strong className="text-emerald-400">Supported (Trained CNN)</strong></span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Status: <strong className="text-amber-400">In Development</strong></span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedGuideTask(task)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Protocol</span>
                    </button>
                    <button
                      onClick={() => handleLaunchScanner(task.task_id)}
                      className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-teal-glow transition-all hover:scale-[1.01]"
                    >
                      <span>Launch Scanner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Research Protocol & Specifications Modal */}
      {selectedGuideTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-teal-400 font-semibold">
                  Condition Specification & Research Protocol
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedGuideTask.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGuideTask(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Callout */}
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 space-y-2">
              <div className="flex items-center space-x-2 font-semibold text-teal-300">
                <ShieldAlert className="w-4 h-4 text-teal-400" />
                <span>Active Research Module</span>
              </div>
              <p className="leading-relaxed text-slate-300">
                AXONOVA strictly avoids simulated or uncalibrated diagnostic outputs. This condition module is active for learning and research benchmarking. Verified imaging sequences and data leakage standards are documented below.
              </p>
            </div>

            {selectedGuideTask.setup_guide && (
              <div className="space-y-5 text-xs">
                {/* 1. Subject-level split & Data Leakage Prevention */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-teal-400 uppercase tracking-wider text-[11px] block font-mono">
                    Data Leakage Prevention Policy:
                  </span>
                  <p className="text-slate-300 leading-relaxed font-mono">
                    {selectedGuideTask.setup_guide.split_policy}
                  </p>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 font-medium">Critical Leakage Risks to Avoid:</span>
                    <ul className="list-disc list-inside text-slate-400 space-y-1 mt-1">
                      {selectedGuideTask.setup_guide.data_leakage_risks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Recommended Public Datasets */}
                <div className="space-y-2">
                  <span className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
                    Recommended Open Research Datasets:
                  </span>
                  <div className="space-y-1.5">
                    {selectedGuideTask.setup_guide.recommended_datasets.map((ds, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between"
                      >
                        <span className="font-mono text-white">{ds}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedGuideTask(null);
                  handleLaunchScanner(selectedGuideTask.task_id);
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-teal-glow transition-colors"
              >
                <span>Launch Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedGuideTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSelectionPage;
