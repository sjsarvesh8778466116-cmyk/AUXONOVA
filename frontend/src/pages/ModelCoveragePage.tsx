import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  Brain,
  FileText,
  Search,
  ExternalLink,
  Info,
  Database,
  ArrowRight,
} from 'lucide-react';
import { api } from '../api/client';
import { BROAD_CONDITION_CATALOG } from '../config/conditionCatalog';
import { CLIENT_MODEL_REGISTRY } from '../config/modelRegistry';
import { CatalogCondition, ModelRegistryEntry, ModelAvailabilityStatus } from '../types';

const ModelCoveragePage: React.FC = () => {
  const [conditions, setConditions] = useState<CatalogCondition[]>(BROAD_CONDITION_CATALOG);
  const [registry, setRegistry] = useState<ModelRegistryEntry[]>(CLIENT_MODEL_REGISTRY);
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, regRes] = await Promise.allSettled([
          api.getCatalog(),
          api.getModelRegistry(),
        ]);
        if (catRes.status === 'fulfilled' && catRes.value?.conditions?.length > 0) {
          setConditions(catRes.value.conditions);
        }
        if (regRes.status === 'fulfilled' && regRes.value?.registry?.length > 0) {
          setRegistry(regRes.value.registry);
        }
      } catch (err) {
        // Fallback to local config
      }
    };
    fetchData();
  }, []);

  const filteredConditions = useMemo(() => {
    return conditions.filter((cond) => {
      const matchAvail =
        filterAvailability === 'all' ||
        cond.model_availability.toLowerCase() === filterAvailability.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        cond.name.toLowerCase().includes(q) ||
        cond.category.toLowerCase().includes(q) ||
        cond.relevant_sequences.some((s) => s.toLowerCase().includes(q));

      return matchAvail && matchSearch;
    });
  }, [conditions, filterAvailability, searchQuery]);

  const stats = useMemo(() => {
    const total = conditions.length;
    const available = conditions.filter((c) => c.model_availability === 'Available').length;
    const inDev = conditions.filter((c) => c.model_availability === 'In Development').length;
    const needsVal = conditions.filter((c) => c.model_availability === 'Needs Validation').length;
    const notAssessed = conditions.filter((c) => c.model_availability === 'Not Available').length;
    const liveModels = registry.length;
    return { total, available, inDev, needsVal, notAssessed, liveModels };
  }, [conditions, registry]);

  const getStatusBadge = (status: ModelAvailabilityStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3" />
            <span>Available</span>
          </span>
        );
      case 'In Development':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 whitespace-nowrap">
            <Clock className="w-3 h-3" />
            <span>In Development</span>
          </span>
        );
      case 'Needs Validation':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Validation</span>
          </span>
        );
      case 'Not Available':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60 whitespace-nowrap">
            <HelpCircle className="w-3 h-3" />
            <span>Not Assessed</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SCIENTIFIC TRANSPARENCY & VALIDATION</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Model Coverage & Registry Matrix
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Complete mapping between the broad brain condition catalog and genuinely active deep learning models. Only conditions supported by trained, verified neural weights execute inference; all other neurological categories are transparently reported as <strong>Not Assessed</strong>.
        </p>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <div className="text-xs text-emerald-400 font-medium">Validated Models</div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">4 Active</div>
            <div className="text-[11px] text-emerald-500/80">Tumor, AD, MS, Stroke</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
            <div className="text-xs text-amber-400 font-medium">Research Prototypes</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">1 Prototype</div>
            <div className="text-[11px] text-amber-500/80">Connectome Net (v0.9)</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/30">
            <div className="text-xs text-blue-400 font-medium">In Development</div>
            <div className="text-2xl font-bold text-blue-300 mt-1">{stats.inDev} Tasks</div>
            <div className="text-[11px] text-blue-500/80">Data pipeline in progress</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Not Assessed</div>
            <div className="text-2xl font-bold text-slate-300 mt-1">{stats.notAssessed} Conditions</div>
            <div className="text-[11px] text-slate-500">No model in AXONOVA</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Catalog Total</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total} Entries</div>
            <div className="text-[11px] text-slate-500">Categories A to J</div>
          </div>
        </div>
      </div>

      {/* Live Integrated Model Cards */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white">
            Genuinely Integrated AI Inference Models ({registry.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registry.map((model) => (
            <div
              key={model.model_id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                    {model.version}
                  </span>
                  {getStatusBadge(model.status)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{model.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Supported Sequences:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.supported_sequences.map((seq, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300"
                        >
                          {seq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Documented Validation:
                    </span>
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      {model.validation_metric_label}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Target Class Labels:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.output_classes.map((cls, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Grad-CAM: {model.gradcam_supported ? '✓ Supported' : '✕ Not enabled'}
                </span>
                <Link
                  to={`/scans?task=${model.task_id}`}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors flex items-center space-x-1"
                >
                  <span>Test in Scan Center</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Coverage Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">
              Catalog Condition Coverage & Validation Matrix ({filteredConditions.length})
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="in development">In Development</option>
              <option value="needs validation">Needs Validation</option>
              <option value="not available">Not Assessed</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Condition / Finding</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Compatible Sequences</th>
                  <th className="py-3 px-4">Model Status</th>
                  <th className="py-3 px-4">Integrated Model</th>
                  <th className="py-3 px-4">Validation / Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredConditions.map((cond) => {
                  const model = registry.find((m) => m.model_id === cond.model_id);

                  return (
                    <tr
                      key={cond.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {cond.name}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {cond.category.split('.')[0]}. {cond.category.split('.')[1]}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cond.relevant_sequences.slice(0, 2).map((seq, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-300"
                            >
                              {seq}
                            </span>
                          ))}
                          {cond.relevant_sequences.length > 2 && (
                            <span className="text-[10px] text-slate-500">
                              +{cond.relevant_sequences.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(cond.model_availability)}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {model ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-teal-300 block">
                              {model.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {model.version}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None (Unassessed)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs">
                        {model ? (
                          <span className="text-emerald-400 font-medium">
                            {model.validation_metric_label}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] line-clamp-1">
                            {cond.clinical_caveats}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Required Data & Engineering Roadmap */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">
            Data & Model Development Roadmap (Remaining Catalog Integration)
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          To transition catalog entries from <em>In Development</em> or <em>Not Available</em> into validated <em>Available</em> status, the following data collection and engineering milestones are actively tracked:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">
              1. Multi-Vendor DICOM Standardization
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Acquiring multi-center cohorts from Siemens, GE, and Philips 1.5T/3.0T scanners to eliminate scanner-specific radiofrequency bias across hemorrhage and metastasis models.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">
              2. 3D Volumetric Segmentation
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Upgrading from 2D slice classification to 3D nnU-Net volumetric lesion volumetry for hydrocephalus Evans index and longitudinal multiple sclerosis plaque burden.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">
              3. Emergency Triage Certification
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Developing ultra-fast acute intracranial hemorrhage and vessel occlusion detection models validated against rapid non-contrast CT ground truth.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 text-xs text-center leading-relaxed">
        AXONOVA provides an AI-assisted educational assessment, not a confirmed medical diagnosis. AI output may be incomplete or incorrect and must be reviewed by a qualified healthcare professional. A condition shown in the catalog is not necessarily assessed by the currently available models. Do not use this report alone to make medical decisions.
      </div>
    </div>
  );
};

export default ModelCoveragePage;
