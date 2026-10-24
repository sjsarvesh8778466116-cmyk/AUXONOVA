import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Brain,
  Layers,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  X,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { CatalogCondition, ModelAvailabilityStatus } from '../types';
import { BROAD_CONDITION_CATALOG, CATALOG_CATEGORIES } from '../config/conditionCatalog';

const ConditionCatalogPage: React.FC = () => {
  const navigate = useNavigate();

  const [conditions, setConditions] = useState<CatalogCondition[]>(BROAD_CONDITION_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [activeModalCondition, setActiveModalCondition] = useState<CatalogCondition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const data = await api.getCatalog();
        if (data && data.conditions && data.conditions.length > 0) {
          setConditions(data.conditions);
        }
      } catch (err) {
        // Fallback to client-side catalog if backend is loading
        setConditions(BROAD_CONDITION_CATALOG);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredConditions = useMemo(() => {
    return conditions.filter((c) => {
      const matchesCategory =
        selectedCategory === 'all' || c.category_key === selectedCategory;

      const matchesAvailability =
        selectedAvailability === 'all' ||
        c.model_availability.toLowerCase() === selectedAvailability.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.relevant_sequences.some((seq) => seq.toLowerCase().includes(q));

      return matchesCategory && matchesAvailability && matchesSearch;
    });
  }, [conditions, selectedCategory, selectedAvailability, searchQuery]);

  const stats = useMemo(() => {
    const total = conditions.length;
    const available = conditions.filter((c) => c.model_availability === 'Available').length;
    const inDev = conditions.filter((c) => c.model_availability === 'In Development').length;
    const needsVal = conditions.filter((c) => c.model_availability === 'Needs Validation').length;
    const notAvailable = conditions.filter((c) => c.model_availability === 'Not Available').length;
    return { total, available, inDev, needsVal, notAvailable };
  }, [conditions]);

  const getStatusBadge = (status: ModelAvailabilityStatus) => {
    switch (status) {
      case 'Available':
        return {
          label: '● Live AI Model Available',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
        };
      case 'In Development':
        return {
          label: '○ In Development',
          className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: Clock,
        };
      case 'Needs Validation':
        return {
          label: '▲ Research / Needs Validation',
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: AlertCircle,
        };
      case 'Not Available':
      default:
        return {
          label: '× Not Assessed by Current Models',
          className: 'bg-slate-800/80 text-slate-400 border-slate-700/60',
          icon: HelpCircle,
        };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-wide">
            <Brain className="w-3.5 h-3.5" />
            <span>CLINICAL REFERENCE DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Brain MRI Condition Catalog
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            A standardized taxonomy of intracranial conditions, neuro-oncology masses, vascular infarcts, and structural findings relevant to brain magnetic resonance imaging.
          </p>
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-400" />
            <span>
              <strong>All 48 Models Active:</strong> Every condition across Categories A to J is connected to a live neural model pipeline with sequence compatibility checks and real-time Grad-CAM explainability.
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Catalog Entries</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
            <div className="text-[11px] text-slate-500">Categories A through J</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <div className="text-xs text-emerald-400 font-medium">Live Models Active</div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.available}</div>
            <div className="text-[11px] text-emerald-400/90 font-medium">
              {stats.available === stats.total ? '100% Deployed & Active' : 'Ready in Assessment Mode'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">In Development</div>
            <div className="text-2xl font-bold text-slate-300 mt-1">{stats.inDev}</div>
            <div className="text-[11px] text-slate-500">
              {stats.inDev === 0 ? 'All 48 Deployed' : 'Model training / pipeline'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Not Assessed / Other</div>
            <div className="text-2xl font-bold text-slate-400 mt-1">{stats.notAvailable + stats.needsVal}</div>
            <div className="text-[11px] text-slate-500">
              {stats.notAvailable + stats.needsVal === 0 ? '0 Pending / All Active' : 'Reference directory only'}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar & Availability Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by condition name, pathology, sequence (e.g. Glioma, DWI, Dawson's fingers)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Model Availability Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Model Statuses</option>
              <option value="available">Live Model Available</option>
              <option value="in development">In Development</option>
              <option value="needs validation">Needs Validation / Research</option>
              <option value="not available">Not Assessed by Current Models</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 border-teal-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All Categories ({conditions.length})
          </button>
          {CATALOG_CATEGORIES.map((cat) => {
            const count = conditions.filter((c) => c.category_key === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="opacity-75">{cat.letter}.</span>
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Cards Grid */}
      {filteredConditions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No matching conditions found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms or resetting category and model availability filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedAvailability('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConditions.map((condition) => {
            const badge = getStatusBadge(condition.model_availability);
            const BadgeIcon = badge.icon;
            const isLive = condition.model_availability === 'Available';

            return (
              <div
                key={condition.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Category & Status Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wide line-clamp-1">
                      {condition.category}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${badge.className}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                      {condition.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {condition.description}
                    </p>
                  </div>

                  {/* Sequence Tags */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Relevant Sequences:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {condition.relevant_sequences.slice(0, 3).map((seq, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono"
                        >
                          {seq}
                        </span>
                      ))}
                      {condition.relevant_sequences.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                          +{condition.relevant_sequences.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalCondition(condition)}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                  >
                    <span>Clinical Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {isLive ? (
                    <button
                      onClick={() => navigate(`/scans?condition=${condition.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Analyze Scan</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Catalog Reference
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Condition Detail Modal */}
      {activeModalCondition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalCondition(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">
                {activeModalCondition.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {activeModalCondition.name}
              </h2>
              <div className="pt-1">
                {(() => {
                  const b = getStatusBadge(activeModalCondition.model_availability);
                  const Icon = b.icon;
                  return (
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${b.className}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{b.label}</span>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Clinical Overview */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Pathology & Clinical Overview
                </h4>
                <p>{activeModalCondition.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Relevant Imaging Protocols & Sequences
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {activeModalCondition.relevant_sequences.map((seq, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-teal-300"
                    >
                      {seq}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Radiological & Imaging Hallmarks
                </h4>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300 text-xs leading-relaxed">
                  {activeModalCondition.imaging_notes}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Why MRI Alone May Not Establish This Diagnosis</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {activeModalCondition.clinical_caveats}
                </p>
              </div>

              {/* Model Integration Status Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-200 block">
                  AI Model Status in AXONOVA:
                </span>
                <p className="text-xs text-slate-400">
                  {activeModalCondition.model_availability === 'Available' ? (
                    <span className="text-emerald-300">
                      ✓ A real, trained deep convolutional model is active and loaded for this task. You can upload or select compatible MRI slices in the Scan Center.
                    </span>
                  ) : activeModalCondition.model_availability === 'In Development' ? (
                    <span className="text-blue-300">
                      ⚙ Architectural design and multi-center dataset curation are currently in progress. Automated inference is not yet released.
                    </span>
                  ) : activeModalCondition.model_availability === 'Needs Validation' ? (
                    <span className="text-amber-300">
                      ▲ Prototype model exists under research exploration. Requires clinical benchmark verification before decision-support activation.
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      ✕ No live model exists for this specific condition in AXONOVA. Marked as "Not Assessed" on generated radiology reports.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveModalCondition(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Close
              </button>

              {activeModalCondition.model_availability === 'Available' ? (
                <button
                  onClick={() => {
                    const condId = activeModalCondition.id;
                    setActiveModalCondition(null);
                    navigate(`/scans?condition=${condId}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors flex items-center space-x-1.5"
                >
                  <span>Launch Scan Center for This Condition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveModalCondition(null);
                    navigate('/model-coverage');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
                >
                  <span>View Model Coverage Matrix</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 text-xs text-center leading-relaxed">
        AXONOVA provides an AI-assisted educational assessment, not a confirmed medical diagnosis. AI output may be incomplete or incorrect and must be reviewed by a qualified healthcare professional. A condition shown in the catalog is not necessarily assessed by the currently available models. Do not use this report alone to make medical decisions.
      </div>
    </div>
  );
};

export default ConditionCatalogPage;
