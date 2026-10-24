import React from 'react';

interface StatusBadgeProps {
  status: 'ready' | 'loading' | 'error' | 'disabled' | 'neutral';
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const styles = {
    ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    loading: 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    disabled: 'bg-slate-100 text-slate-500 border-slate-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dots = {
    ready: 'bg-emerald-500',
    loading: 'bg-sky-500',
    error: 'bg-rose-500',
    disabled: 'bg-slate-400',
    neutral: 'bg-slate-500',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
