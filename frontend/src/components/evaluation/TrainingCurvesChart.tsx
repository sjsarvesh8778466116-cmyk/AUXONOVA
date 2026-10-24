import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TrainingCurvesChartProps {
  history?: Record<string, number[]>;
}

const TrainingCurvesChart: React.FC<TrainingCurvesChartProps> = ({ history }) => {
  const { t } = useLanguage();

  // If backend provided history array, format for Recharts
  const chartData = React.useMemo(() => {
    if (!history || !history.loss) return null;
    const epochs = history.loss.length;
    const data = [];
    for (let i = 0; i < epochs; i++) {
      data.push({
        epoch: `Epoch ${i + 1}`,
        trainAcc: history.accuracy ? +(history.accuracy[i] * 100).toFixed(1) : undefined,
        valAcc: history.val_accuracy ? +(history.val_accuracy[i] * 100).toFixed(1) : undefined,
        trainLoss: history.loss ? +history.loss[i].toFixed(3) : undefined,
        valLoss: history.val_loss ? +history.val_loss[i].toFixed(3) : undefined,
      });
    }
    return data;
  }, [history]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Curve */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Training & Validation Accuracy (%)
            </h4>
          </div>
          {chartData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="epoch" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#ffffff' }}
                    labelStyle={{ color: '#5eead4', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="trainAcc" name="Train Accuracy" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="valAcc" name="Validation Accuracy" stroke="#38bdf8" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <img
                src="/api/evaluation/learning-curves-image"
                alt="Learning Curves"
                className="max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Loss Curve */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Training & Validation Loss
            </h4>
          </div>
          {chartData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="epoch" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#ffffff' }}
                    labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="trainLoss" name="Train Loss" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <img
                src="/api/evaluation/learning-curves-image"
                alt="Learning Curves"
                className="max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingCurvesChart;
