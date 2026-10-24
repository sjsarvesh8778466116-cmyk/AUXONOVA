import React from 'react';
import { Scan, Lock, Cpu } from 'lucide-react';
import { ScanType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ScanTypeSelectorProps {
  selectedType: ScanType;
  onSelect: (type: ScanType) => void;
  /** Live model status from backend health check */
  modelLoaded?: boolean;
}

const ScanTypeSelector: React.FC<ScanTypeSelectorProps> = ({
  selectedType,
  onSelect,
  modelLoaded = true,
}) => {
  const { t } = useLanguage();

  const scanTypes: {
    type: ScanType;
    label: string;
    status: string;
    enabled: boolean;
    hint: string;
  }[] = [
    {
      type: 'MRI',
      label: 'Brain MRI',
      status: modelLoaded ? 'Model Active' : 'Model Offline',
      enabled: true,
      hint: modelLoaded
        ? 'Trained CNN model active — ready for inference'
        : 'Connect backend server at port 8000',
    },
    {
      type: 'CT',
      label: 'CT Scan',
      status: 'Future Scope',
      enabled: false,
      hint: 'Requires separate CT voxel series model',
    },
    {
      type: 'X-ray',
      label: 'X-ray',
      status: 'Future Scope',
      enabled: false,
      hint: 'Requires projection radiography model',
    },
  ];

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
        <Scan className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
        <span>Scan Modality</span>
      </label>

      <div className="grid grid-cols-3 gap-2">
        {scanTypes.map((item) => {
          const isSelected = selectedType === item.type;
          const isDisabled = !item.enabled;

          return (
            <button
              key={item.type}
              type="button"
              disabled={isDisabled}
              onClick={() => item.enabled && onSelect(item.type)}
              aria-pressed={isSelected}
              aria-label={`${item.label} — ${item.status}`}
              className={[
                'p-3 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                isSelected
                  ? 'bg-slate-800 border-teal-500 ring-1 ring-teal-500/30 shadow-teal-glow'
                  : isDisabled
                  ? 'bg-slate-950/60 border-slate-850 cursor-not-allowed opacity-50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 shadow-sm',
              ].join(' ')}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-teal-300' : isDisabled ? 'text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
                {isDisabled ? (
                  <Lock className="w-3 h-3 text-slate-600 shrink-0" aria-hidden="true" />
                ) : (
                  <Cpu
                    className={`w-3 h-3 shrink-0 ${
                      modelLoaded && item.type === 'MRI' ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Status badge */}
              <span
                className={`inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded mb-1 leading-none ${
                  item.type === 'MRI' && modelLoaded
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : item.type === 'MRI'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-950 text-slate-500 border border-slate-850'
                }`}
              >
                {item.status}
              </span>

              {/* Hint */}
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScanTypeSelector;
