import React from 'react';
import { Compass } from 'lucide-react';
import { ScanOrientation } from '../../types';

interface OrientationSelectorProps {
  selectedOrientation: ScanOrientation;
  onSelect: (orientation: ScanOrientation) => void;
}

const orientations: { label: ScanOrientation; desc: string }[] = [
  { label: 'Axial', desc: 'Horizontal cross-section' },
  { label: 'Coronal', desc: 'Frontal plane' },
  { label: 'Sagittal', desc: 'Side plane' },
  { label: 'Not specified', desc: 'Unknown / other' },
];

const OrientationSelector: React.FC<OrientationSelectorProps> = ({
  selectedOrientation,
  onSelect,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <Compass className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
          <span>MRI Orientation</span>
        </label>
        <span className="text-[10px] text-slate-400 font-mono">Metadata label only</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {orientations.map((item) => {
          const isSelected = selectedOrientation === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              aria-pressed={isSelected}
              aria-label={`Orientation: ${item.label}`}
              className={[
                'py-2 px-2 rounded-xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                isSelected
                  ? 'bg-slate-800 border-teal-500 text-teal-300 ring-1 ring-teal-500/30 shadow-teal-glow font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700 shadow-sm',
              ].join(' ')}
            >
              <div className="text-xs font-semibold leading-tight">{item.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrientationSelector;
