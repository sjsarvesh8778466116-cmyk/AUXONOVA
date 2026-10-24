import React from 'react';
import { Grid, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ConfusionMatrixTableProps {
  matrix: number[][];
  classes: string[];
}

const ConfusionMatrixTable: React.FC<ConfusionMatrixTableProps> = ({ matrix, classes }) => {
  const { t } = useLanguage();

  if (!matrix || matrix.length === 0 || !classes || classes.length === 0) {
    return null;
  }

  // Calculate max value for relative intensity shading
  const flatVals = matrix.flat();
  const maxVal = Math.max(...flatVals, 1);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {t('eval.cm_title')}
          </h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Rows = Actual • Cols = Predicted</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 font-mono">
              <th className="p-2.5 text-left text-slate-400 font-bold">True \ Pred</th>
              {classes.map((c) => (
                <th key={c} className="p-2.5 text-slate-200 font-bold truncate max-w-[90px]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {matrix.map((row, rowIdx) => {
              const rowClass = classes[rowIdx];
              return (
                <tr key={rowClass} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-2.5 text-left font-bold text-white truncate max-w-[100px]">
                    {rowClass}
                  </td>
                  {row.map((count, colIdx) => {
                    const isDiagonal = rowIdx === colIdx;
                    const intensity = count / maxVal;
                    return (
                      <td
                        key={colIdx}
                        className="p-2.5 font-mono text-sm transition-colors"
                        style={{
                          backgroundColor:
                            count > 0
                              ? isDiagonal
                                ? `rgba(20, 184, 166, ${0.15 + intensity * 0.45})`
                                : `rgba(244, 63, 94, ${0.12 + intensity * 0.3})`
                              : 'transparent',
                          color: count > 0 ? (isDiagonal ? '#5eead4' : '#fda4af') : '#64748b',
                          fontWeight: count > 0 ? '700' : '400',
                        }}
                      >
                        {count}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
        <Info className="w-3.5 h-3.5 shrink-0 text-teal-400" />
        <span>Diagonal cells indicate correct classification matches; off-diagonal numbers denote false predictions.</span>
      </div>
    </div>
  );
};

export default ConfusionMatrixTable;
