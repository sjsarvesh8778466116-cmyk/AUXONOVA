import React from 'react';
import { ConditionConfig } from '../../config/conditions';
import {
  Brain,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  Eye,
  Cpu,
  BookOpen,
} from 'lucide-react';

interface ConditionOverviewDashboardProps {
  condition: ConditionConfig;
}

export const ConditionOverviewDashboard: React.FC<ConditionOverviewDashboardProps> = ({
  condition,
}) => {
  const isImplemented = condition.mode === 'implemented';
  const IconComponent = condition.icon;

  const learningFeatures = [
    { name: 'Edges', desc: 'Intensity boundaries & structural transitions' },
    { name: 'Textures', desc: 'Local intensity patterns & spatial heterogeneity' },
    { name: 'Shapes', desc: 'Geometric contours & compartmental silhouettes' },
    { name: 'Intensity', desc: 'T1/T2 brightness & contrast differentials' },
    { name: 'Spatial Patterns', desc: 'Regional anatomical relationships & edema spread' },
    { name: 'High-Level Features', desc: 'Multi-layer composite representation maps' },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-lg">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                {condition.category}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                {condition.statusBadge}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {condition.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
            AI Research Module: <span className="text-emerald-400 font-bold">Active</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
            Model Status: <span className="text-teal-400 font-bold">{isImplemented ? 'Available (Online)' : 'Ready (Educational)'}</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* MRI Relevance */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold uppercase tracking-wider text-[11px]">
            <Eye className="w-4 h-4" />
            <span>MRI Relevance</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {condition.educationalOverview?.summary || condition.description}
          </p>
          <div className="pt-2 border-t border-slate-800/60 font-mono text-[10px] text-slate-400">
            Sequences: <span className="text-slate-200">{condition.requiredSequences.join(', ')}</span>
          </div>
        </div>

        {/* Example Imaging Features */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 font-bold uppercase tracking-wider text-[11px]">
            <FileText className="w-4 h-4" />
            <span>Example Imaging Features</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            {condition.educationalOverview?.imagingSignatures?.slice(0, 3).map((sig, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <span className="line-clamp-2">{sig}</span>
              </li>
            )) || (
              <li className="text-slate-400">Multi-slice sequence patterns evaluated across standard planes.</li>
            )}
          </ul>
        </div>

        {/* Supported Learning Features */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            <Cpu className="w-4 h-4" />
            <span>Supported Learning Features</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {learningFeatures.map((feat) => (
              <div
                key={feat.name}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-200 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="font-semibold">{feat.name}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 pt-1 leading-tight">
            Integrated with progressive medical student curriculum.
          </p>
        </div>
      </div>

      {/* Research Notes & Safety Caveat */}
      <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center space-x-2 text-[11px]">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Research Notes:</strong>{' '}
            {condition.limitations?.[0] || 'Classification outputs must be correlated with histopathology and clinical judgment.'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-teal-400/80 shrink-0">
          RESEARCH PROTOCOL: AXONOVA-NC-2026
        </span>
      </div>
    </div>
  );
};

export default ConditionOverviewDashboard;
