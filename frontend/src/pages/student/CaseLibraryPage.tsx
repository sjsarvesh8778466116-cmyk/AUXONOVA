import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { api } from '../../api/client';
import { CaseSummary } from '../../types/student';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const CaseLibraryPage: React.FC = () => {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.getStudentCases();
        setCases(data);
      } catch (err) {
        console.error('Failed to load student cases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filterDifficulty === 'All') return true;
    return c.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <FolderKanban className="w-4 h-4" />
            <span>Authorized Educational Case Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Medical Case Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Practice real case reasoning on held-out de-identified brain MRI slices. Outcomes are concealed until you submit your own prediction and clinical rationale.
          </p>
        </div>

        {/* Data Privacy Badge */}
        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl shrink-0 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% De-Identified • HIPAA-Safe</span>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Difficulty Filters */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Difficulty Level:</span>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterDifficulty(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterDifficulty === lvl
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredCases.length} Cases
        </span>
      </div>

      {/* Case Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <p>Loading authorized educational cases...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c) => {
            const diffColor =
              c.difficulty === 'Beginner'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : c.difficulty === 'Intermediate'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

            return (
              <div
                key={c.id}
                className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl"
              >
                {/* Image Preview & Badges - PACS viewport */}
                <div className="relative h-52 bg-black overflow-hidden flex items-center justify-center p-3 border-b border-slate-800">
                  <img
                    src={c.image_url}
                    alt={c.title}
                    className="max-h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${diffColor}`}>
                      {c.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900/80 backdrop-blur-xs border border-white/20 text-white">
                      {c.orientation}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-300 bg-slate-900/80 backdrop-blur-xs border border-white/20 px-2 py-0.5 rounded-full">
                    {c.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Sequence: <span className="text-slate-200 font-medium">{c.sequence}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Cohort Age: <span className="text-slate-200 font-medium">{c.age_range}</span>
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      {c.key_concepts.map((concept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/student/cases/${c.id}`}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-teal-500/15 hover:bg-teal-500 border border-teal-500/30 hover:border-teal-500 text-teal-300 hover:text-slate-950 font-bold text-xs transition-all shadow-sm"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Start Case Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CaseLibraryPage;
