import React from 'react';
import { Target, Activity, CheckCircle, BarChart3, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MetricsSummaryProps {
  accuracy: number;
  perClassMetrics: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
  }>;
  totalTestImages: number;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  accuracy,
  perClassMetrics,
  totalTestImages,
}) => {
  const { t } = useLanguage();

  const classNames = Object.keys(perClassMetrics);
  const avgPrecision =
    classNames.length > 0
      ? classNames.reduce((acc, c) => acc + perClassMetrics[c].precision, 0) / classNames.length
      : 0;
  const avgRecall =
    classNames.length > 0
      ? classNames.reduce((acc, c) => acc + perClassMetrics[c].recall, 0) / classNames.length
      : 0;
  const avgF1 =
    classNames.length > 0
      ? classNames.reduce((acc, c) => acc + perClassMetrics[c].f1_score, 0) / classNames.length
      : 0;

  const topCards = [
    {
      title: t('eval.accuracy'),
      value: `${(accuracy * 100).toFixed(1)}%`,
      desc: 'Tested across held-out test splits',
      icon: Target,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    },
    {
      title: t('eval.precision'),
      value: `${(avgPrecision * 100).toFixed(1)}%`,
      desc: 'Macro average precision',
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: t('eval.recall'),
      value: `${(avgRecall * 100).toFixed(1)}%`,
      desc: 'Macro average recall (sensitivity)',
      icon: Activity,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: t('eval.f1'),
      value: `${(avgF1 * 100).toFixed(1)}%`,
      desc: 'Harmonic mean of precision & recall',
      icon: BarChart3,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-Class Metrics Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Per-Class Performance Breakdown (Held-out Test Set • {totalTestImages} Scans)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="py-3 px-4 font-bold">Dataset Category</th>
                <th className="py-3 px-4 font-bold text-right">Precision</th>
                <th className="py-3 px-4 font-bold text-right">Recall</th>
                <th className="py-3 px-4 font-bold text-right">F1-Score</th>
                <th className="py-3 px-4 font-bold text-right">Test Samples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {classNames.map((className) => {
                const metric = perClassMetrics[className];
                return (
                  <tr key={className} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-bold text-white">
                      {className}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 font-semibold">
                      {(metric.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 font-semibold">
                      {(metric.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-teal-400 font-bold">
                      {(metric.f1_score * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {metric.support}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsSummary;
