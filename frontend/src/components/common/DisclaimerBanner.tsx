import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

const DISCLAIMER =
  'This system is an academic research prototype. Model outputs are not medical diagnoses and must not be used for clinical decision-making. AI-generated results are intended for learning, research, and investigative clinical decision-support demonstration only. Medical images and patient care decisions must always be evaluated by qualified healthcare professionals.';

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-slate-200 shadow-sm"
      >
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs leading-relaxed min-w-0 text-slate-300 font-normal">{DISCLAIMER}</p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
        </div>
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Medical Safety & Research Notice
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">{DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
