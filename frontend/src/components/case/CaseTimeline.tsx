import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  Cpu,
  Layers,
  Sparkles,
  FileText,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CaseTimelineEvent, RadiologyReportData } from '../../types';
import { api } from '../../api/client';

interface CaseTimelineProps {
  timeline?: CaseTimelineEvent[];
  caseId?: string;
  report?: RadiologyReportData;
  onReportReviewed?: (updatedReport: RadiologyReportData) => void;
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({
  timeline = [],
  caseId,
  report,
  onReportReviewed,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewerName, setReviewerName] = useState('Dr. Marcus Vance');
  const [reviewerTitle, setReviewerTitle] = useState('MD, Senior Neuroradiologist');
  const [reviewerLicense, setReviewerLicense] = useState('MED-BC-94821');
  const [decision, setDecision] = useState<'CONFIRMED' | 'DISAGREE' | 'MODIFIED'>('CONFIRMED');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Correlated with presented slice. Findings align with imaging protocol constraints. Recommend volumetric MRI with contrast for clinical confirmation.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // If no timeline passed, use report's timeline
  const activeTimeline: CaseTimelineEvent[] =
    timeline.length > 0
      ? timeline
      : report?.timeline || [];

  const formatTimestamp = (ts: string | null) => {
    if (!ts) return 'Pending Action';
    try {
      const date = new Date(ts);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return ts;
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'upload':
        return FileCheck2;
      case 'validation':
        return ShieldCheck;
      case 'model_routing':
        return Layers;
      case 'inference':
        return Cpu;
      case 'explainability':
        return Sparkles;
      case 'report_creation':
        return FileText;
      case 'professional_review':
        return UserCheck;
      default:
        return Clock;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;
    setIsSubmitting(true);
    try {
      const res = await api.reviewReport(caseId, {
        reviewer_name: reviewerName,
        reviewer_title: reviewerTitle,
        reviewer_license: reviewerLicense,
        decision,
        clinical_notes: clinicalNotes,
      });
      if (res.report && onReportReviewed) {
        onReportReviewed(res.report);
      }
      setShowReviewModal(false);
    } catch (err: any) {
      alert(`Review sign-off failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReviewed = report?.review?.status === 'REVIEWED';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Clock className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Case Audit Timeline</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
              Live Backend Timestamps
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real milestone timestamps captured during actual server preprocessing, forward pass, and review.
          </p>
        </div>

        {caseId && !isReviewed && (
          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-teal-glow"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign Off as Radiologist</span>
          </button>
        )}
      </div>

      {activeTimeline.length === 0 ? (
        <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl space-y-2">
          <Clock className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-medium">No timeline events recorded yet.</p>
          <p className="text-xs text-slate-400">
            Timeline events will populate automatically as the scan progresses through preprocessing and neural inference.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-slate-700 before:to-slate-800">
          {activeTimeline.map((event, idx) => {
            const Icon = getStageIcon(event.stage);
            const isCompleted = event.status === 'COMPLETED' || event.status === 'REVIEWED';
            const isPending = event.status === 'PENDING_REVIEW' || event.status === 'PENDING';
            const isExpanded = expandedIndex === idx;

            return (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.5)]'
                      : isPending
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Event Card */}
                <div className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white tracking-wide">{event.title}</h4>
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                          isCompleted
                            ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                            : isPending
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Expandable Details */}
                  {event.details && Object.keys(event.details).length > 0 && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="text-[11px] text-teal-400 hover:text-teal-300 font-medium inline-flex items-center space-x-1"
                      >
                        <span>{isExpanded ? 'Hide Technical Metadata' : 'View Technical Metadata'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1 overflow-x-auto">
                          {Object.entries(event.details).map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-4">
                              <span className="text-slate-400">{k}:</span>
                              <span className="text-slate-200 truncate max-w-xs">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clinician Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Professional Radiologist Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reviewing Clinician Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerTitle}
                    onChange={(e) => setReviewerTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Medical License / Reg
                  </label>
                  <input
                    type="text"
                    value={reviewerLicense}
                    onChange={(e) => setReviewerLicense(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Clinical Concordance Decision
                </label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="CONFIRMED">CONFIRMED — Findings consistent with clinical impression</option>
                  <option value="MODIFIED">MODIFIED — Clinical caveats or differential nuance added</option>
                  <option value="DISAGREE">DISAGREE — Neural assessment discordant with clinical review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Diagnostic Remarks & Correlation
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Digital sign-off permanently logs your credentials and a real UTC timestamp to the audit timeline.
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 transition-all shadow-teal-glow"
                >
                  {isSubmitting ? 'Signing...' : 'Sign & Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTimeline;
