import React from 'react';
import {
  FileText,
  Scan,
  Layers,
  Cpu,
  Activity,
  BarChart3,
  Stethoscope,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export interface WorkflowStep {
  step: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CLINICAL_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    name: 'PATIENT / CASE',
    desc: 'Case ID & metadata intake',
    icon: FileText,
  },
  {
    step: '02',
    name: 'MRI IMAGE',
    desc: 'T1, T2, FLAIR, DWI series',
    icon: Scan,
  },
  {
    step: '03',
    name: 'IMAGE PREPROCESSING',
    desc: '224×224 tensor normalization',
    icon: Layers,
  },
  {
    step: '04',
    name: 'CNN FEATURE EXTRACTION',
    desc: 'Conv2D edges & textures',
    icon: Cpu,
  },
  {
    step: '05',
    name: 'ABNORMALITY PATTERN ANALYSIS',
    desc: 'Morphology & mass effect',
    icon: Activity,
  },
  {
    step: '06',
    name: 'AI CLASSIFICATION',
    desc: 'Softmax probability scoring',
    icon: BarChart3,
  },
  {
    step: '07',
    name: 'CLINICAL AI ASSESSMENT',
    desc: 'Grad-CAM & feature summary',
    icon: Stethoscope,
  },
  {
    step: '08',
    name: 'PHYSICIAN REVIEW',
    desc: 'Qualified specialist sign-off',
    icon: UserCheck,
  },
];

interface ClinicalWorkflowBarProps {
  currentStepIndex?: number;
  className?: string;
}

export const ClinicalWorkflowBar: React.FC<ClinicalWorkflowBarProps> = ({
  currentStepIndex = 1,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl bg-slate-900/95 border border-slate-800 p-4 sm:p-5 shadow-lg relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            CLINICAL ASSESSMENT WORKFLOW
          </h3>
        </div>
        <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 font-semibold">
          Step {Math.min(currentStepIndex + 1, 8)} of 8: {CLINICAL_WORKFLOW_STEPS[currentStepIndex]?.name || 'Assessment Pipeline'}
        </span>
      </div>

      {/* Horizontal Scrollable / Responsive Workflow Track */}
      <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
        <div className="flex items-center min-w-[940px] justify-between gap-1">
          {CLINICAL_WORKFLOW_STEPS.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isLast = idx === CLINICAL_WORKFLOW_STEPS.length - 1;

            return (
              <React.Fragment key={stepItem.name}>
                <div
                  className={`flex-1 p-3 rounded-xl border transition-all relative flex flex-col justify-between min-h-[92px] ${
                    isCurrent
                      ? 'bg-slate-850 border-teal-500 shadow-teal-glow ring-1 ring-teal-400/40'
                      : isCompleted
                      ? 'bg-slate-950/90 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCurrent
                          ? 'text-teal-300'
                          : isCompleted
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {stepItem.step}
                    </span>
                    <div
                      className={`p-1 rounded-md ${
                        isCurrent
                          ? 'bg-teal-500/20 text-teal-300'
                          : isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`text-[11px] font-bold leading-tight font-mono tracking-tight ${
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {stepItem.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {stepItem.desc}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex items-center justify-center px-0.5 text-slate-600 shrink-0">
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        idx < currentStepIndex ? 'text-emerald-500' : 'text-slate-700'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClinicalWorkflowBar;
