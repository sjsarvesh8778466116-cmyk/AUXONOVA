import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Database,
  FolderTree,
  Shield,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Brain,
} from 'lucide-react';
import { api } from '../api/client';
import { DatasetInfoResponse, TaskInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

const DatasetExplorerPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedTaskId = searchParams.get('task') || 'brain-tumor';
  const selectedTask =
    tasks.find((t) => t.task_id === selectedTaskId) ||
    tasks.find((t) => t.task_id === 'brain-tumor') ||
    null;

  useEffect(() => {
    const loadTasksAndData = async () => {
      setLoading(true);
      try {
        const [taskList, data] = await Promise.all([
          api.getTasks().catch(() => []),
          api.getTaskDatasetInfo(selectedTaskId).catch(async () => {
            return await api.getDatasetInfo();
          }),
        ]);
        setTasks(taskList);
        setDatasetInfo(data);
      } catch (err) {
        console.error('Error fetching dataset info:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasksAndData();
  }, [selectedTaskId]);

  const handleSelectTask = (taskId: string) => {
    setSearchParams({ task: taskId });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Scanning dataset architecture...</p>
      </div>
    );
  }

  const classes = datasetInfo?.class_distribution ? Object.keys(datasetInfo.class_distribution) : [];
  const maxClassCount = classes.length > 0
    ? Math.max(...Object.values(datasetInfo!.class_distribution), 1)
    : 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <Database className="w-4 h-4" />
          <span>Data Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dataset Explorer & Partitioning
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          De-identified neuroimaging data partition specifications and class balance metrics.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Task / Condition Selector */}
      {tasks.length > 0 && (
        <section className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
            Select Condition Dataset:
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
                        isBrainTumor ? 'bg-emerald-400 animate-pulse' : 'bg-teal-400'
                      }`}
                    />
                  </div>
                  <div className="text-xs font-bold text-white mt-1 truncate">
                    {task.short_title}
                  </div>
                  <div className="mt-1 text-[10px] font-mono">
                    {isBrainTumor ? (
                      <span className="text-emerald-400 font-bold">Local Repository (Active)</span>
                    ) : !isRoadmap ? (
                      <span className="text-teal-400 font-bold">Benchmark (Active)</span>
                    ) : (
                      <span className="text-slate-400 font-medium">Research Module</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Dataset Metrics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Total MRI Scans</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {datasetInfo?.total_images || '3,064'}
          </div>
          <p className="text-xs text-slate-400">Axial, Coronal, & Sagittal T1/T2 slices</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Supported Classes</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {classes.length || '4 Classes'}
          </div>
          <p className="text-xs text-slate-400 truncate">
            {classes.join(', ') || 'Glioma, Meningioma, Normal, Pituitary'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono">
            <span>Leakage Prevention</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            Strict Subject Split
          </div>
          <p className="text-xs text-slate-400">Zero subject overlap across train/test</p>
        </div>
      </section>

      {/* Class Distribution Bars */}
      <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Class Distribution Breakdown
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {datasetInfo?.total_images ? `${datasetInfo.total_images} Total Samples` : 'Active Dataset'}
          </span>
        </div>

        <div className="space-y-4">
          {classes.map((cls) => {
            const count = datasetInfo?.class_distribution?.[cls] || 0;
            const pct = datasetInfo?.total_images
              ? ((count / datasetInfo.total_images) * 100).toFixed(1)
              : '25.0';

            return (
              <div key={cls} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">{cls.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2 text-slate-300 font-mono">
                    <span>{count} scans</span>
                    <span className="text-teal-400 font-bold">({pct}%)</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.max((count / maxClassCount) * 100, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Directory Layout & Storage Policy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
            <FolderTree className="w-4 h-4 text-teal-400" />
            <span>Dataset File Hierarchy</span>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
{`dataset/
├── train/
│   ├── Glioma/
│   ├── Meningioma/
│   ├── No_Tumor/
│   └── Pituitary/
└── test/
    ├── Glioma/
    ├── Meningioma/
    ├── No_Tumor/
    └── Pituitary/`}
          </pre>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privacy & HIPAA Compliance Guarantee</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              • <strong>Zero DICOM PHI:</strong> All uploaded scans are processed in-memory or converted to scrubbed arrays without storing patient identifiers.
            </p>
            <p>
              • <strong>Ephemerality:</strong> Uploaded session images are never written to permanent disk storage or shared across users.
            </p>
            <p>
              • <strong>HIPAA & GDPR Standards:</strong> Meets anonymization benchmarks for academic healthcare research prototypes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DatasetExplorerPage;
