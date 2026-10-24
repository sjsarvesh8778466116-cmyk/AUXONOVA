import React from 'react';
import { useCondition } from '../../context/ConditionContext';
import { ConditionId } from '../../config/conditions';
import { CheckCircle2 } from 'lucide-react';

interface ConditionSelectorProps {
  selectedId?: string;
  onSelect?: (id: ConditionId) => void;
  className?: string;
}

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedId: propSelectedId,
  onSelect,
  className = '',
}) => {
  const { selectedConditionId, setSelectedConditionId, allConditions } = useCondition();

  const currentId = propSelectedId || selectedConditionId;

  const handleSelect = (id: ConditionId) => {
    setSelectedConditionId(id);
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>SELECT BRAIN MRI CONDITION</span>
        </h2>
        <span className="text-[11px] text-emerald-400 font-semibold font-mono">
          5 / 5 Modules Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {allConditions.map((condition) => {
          const isSelected = currentId === condition.id;
          const IconComponent = condition.icon;
          const isFuture = condition.id === 'future-research';

          return (
            <button
              key={condition.id}
              type="button"
              onClick={() => handleSelect(condition.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer flex flex-col justify-between min-h-[140px] ${
                isSelected
                  ? 'bg-slate-900 border-teal-500 shadow-teal-glow ring-2 ring-teal-400/50 scale-[1.01]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 shadow-sm'
              }`}
            >
              {/* Top row: Category & Selected Badge */}
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider truncate">
                  {condition.category}
                </span>
                {isSelected && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 shrink-0 flex items-center space-x-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>SELECTED</span>
                  </span>
                )}
              </div>

              {/* Middle row: Condition Icon & Short Title */}
              <div className="flex items-center space-x-3 my-2">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 transition-transform duration-200 ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 scale-105'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-teal-200 transition-colors">
                    {condition.shortTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {condition.classLabels.length} Clinical Classes
                  </p>
                </div>
              </div>

              {/* Bottom row: Exact required status badge */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] w-full">
                <span
                  className={`font-semibold flex items-center space-x-1.5 ${
                    isFuture ? 'text-teal-300' : 'text-emerald-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFuture ? 'bg-teal-400' : 'bg-emerald-400'
                    } ${isSelected ? 'animate-pulse' : ''}`}
                  />
                  <span className="text-[11px]">{condition.statusBadge.replace('● ', '')}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConditionSelector;
