import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Shield,
  FileCheck2,
  Lock,
  Cpu,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Activity,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const conditions = [
    {
      id: 'brain-tumor',
      name: 'Brain Tumor MRI Analysis',
      status: 'ready',
      category: 'Neuro-Oncology',
      badge: '● AI Assessment Available',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Multi-class classification across Glioma, Meningioma, Pituitary, and Normal tissue with real-time Grad-CAM visual attention mapping.',
      dataset: 'Held-out test split (40 validation/test slices, 224x224 RGB)',
      link: '/scans?task=brain-tumor',
    },
    {
      id: 'alzheimers',
      name: "Alzheimer's Disease Atrophy Analysis",
      status: 'ready',
      category: 'Neurodegenerative Disorder',
      badge: '● AI Assessment Available',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Volumetric T1-weighted MPRAGE structural assessment for hippocampal volume reduction and cortical thinning patterns.',
      dataset: 'Compatible with ADNI & OASIS-3 (Subject-level partitioning required)',
      link: '/scans?task=alzheimers',
    },
    {
      id: 'multiple-sclerosis',
      name: 'Multiple Sclerosis Lesion Quantification',
      status: 'ready',
      category: 'Demyelinating Disease',
      badge: '● AI Assessment Available',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Multi-sequence T2-FLAIR hyperintensity pattern recognition across periventricular, juxtacortical, and infratentorial regions.',
      dataset: 'Compatible with ISBI MS Challenge & MICCAI MSSEG cohorts',
      link: '/scans?task=multiple-sclerosis',
    },
    {
      id: 'stroke',
      name: 'Stroke Assessment Protocol',
      status: 'ready',
      category: 'Cerebrovascular Disease',
      badge: '● AI Assessment Available',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Diffusion-weighted imaging (DWI b=1000) and ADC map matching for acute ischemic infarct boundary localization.',
      dataset: 'Compatible with ISLES & ATLAS open challenge benchmarks',
      link: '/scans?task=stroke',
    },
    {
      id: 'future-research',
      name: 'Future Neuro-AI Emerging Assessment',
      status: 'research_module',
      category: 'Emerging Neurological Assessment',
      badge: '● Module Available',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      description: 'Fractional anisotropy tractography, connectome graph representations, and resting-state functional connectivity models.',
      dataset: 'Multi-center standardized consortium archives (PPMI / FITBIR / HCP)',
      link: '/tasks',
    },
  ];

  const citations = [
    {
      title: 'Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization',
      authors: 'Selvaraju, R. R., Cogswell, M., Das, A., Vedaldi, A., Parikh, D., & Batra, D.',
      journal: 'IEEE International Conference on Computer Vision (ICCV), 2017',
      link: 'https://arxiv.org/abs/1610.02391',
    },
    {
      title: 'The Multimodal Brain Tumor Image Segmentation Benchmark (BRATS)',
      authors: 'Menze, B. H., Jakab, A., Bauer, S., Kalpathy-Cramer, J., et al.',
      journal: 'IEEE Transactions on Medical Imaging, 34(10), 1993-2024',
      link: 'https://doi.org/10.1109/TMI.2014.2377694',
    },
    {
      title: 'Alzheimer’s Disease Neuroimaging Initiative (ADNI): Clinical Characterization & Neuroimaging',
      authors: 'Jack Jr, C. R., Bernstein, M. A., Fox, N. C., Thompson, P., et al.',
      journal: 'Journal of Magnetic Resonance Imaging, 27(4), 685-691',
      link: 'https://adni.loni.usc.edu/',
    },
    {
      title: 'ISLES 2022: A Multi-Center Ischemic Stroke Lesion Segmentation Dataset & Benchmark',
      authors: 'de la Rosa, E., Reyes, M., Liew, S. L., et al.',
      journal: 'Scientific Data, Nature Publishing Group',
      link: 'https://isles-challenge.org/',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Academic & Research Platform Overview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('about.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {t('about.desc')}
        </p>
      </div>

      <DisclaimerBanner />

      {/* Grid of Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Purpose */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Brain className="w-4 h-4" />
            <span>Educational Mission & Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AXONOVA was developed as a clinical-grade deep learning prototype to demonstrate how Convolutional Neural Networks (CNNs) process spatial patterns in brain MRI images. It exposes the complete machine learning lifecycle: data validation, preprocessing, model architecture, training curves, held-out evaluation, and Grad-CAM explainability.
          </p>
        </div>

        {/* Medical Ethics & Safety */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>Medical Safety & Research Protocol</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AXONOVA is strictly a scientific classifier prototype and never makes definitive diagnostic claims. It outputs model category likelihoods relative to its training dataset. A model score is an uncalibrated algorithmic output and must not be used to guide healthcare decisions or replace licensed radiologists.
          </p>
        </div>

        {/* Privacy & Zero-Retention Architecture */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>Privacy & Zero-Retention Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            User uploads are processed entirely in volatile memory and discarded immediately after prediction. The platform collects zero personal health information (PHI), patient identifiers, or permanent medical records. Session history exists strictly in volatile browser session storage.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Technology Stack</span>
          </div>
          <div className="text-xs text-slate-300 font-mono space-y-1">
            <p className="text-slate-200">• <span className="text-teal-400 font-semibold">Backend:</span> Python 3, FastAPI, Uvicorn, Pydantic v2</p>
            <p className="text-slate-200">• <span className="text-teal-400 font-semibold">ML Framework:</span> TensorFlow 2.17 / Keras, NumPy, Pillow, Scikit-learn</p>
            <p className="text-slate-200">• <span className="text-teal-400 font-semibold">Frontend:</span> React 18, Vite 5.4, TypeScript 5.5, Tailwind CSS</p>
            <p className="text-slate-200">• <span className="text-teal-400 font-semibold">Visualizations:</span> Recharts, Matplotlib, Grad-CAM Heatmaps</p>
          </div>
        </div>
      </div>

      {/* Modular Tasks Architecture Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Multi-Condition Framework</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Active Brain MRI Research Conditions
            </h2>
            <p className="text-xs text-slate-400">
              Each clinical condition operates as a dedicated research module with sequence requirements, split validation, and feature analysis.
            </p>
          </div>
          <Link
            to="/tasks"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all shadow-sm"
          >
            <span>Explore All Conditions Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conditions.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-3 shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                    {item.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-teal-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <p className="text-[11px] text-slate-500 font-mono">
                  {item.dataset}
                </p>
                <Link
                  to={item.link}
                  className="inline-flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-bold transition-colors"
                >
                  <span>Open Research Module</span>
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Integrity & Anti-Leakage Protocol */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <FileCheck2 className="w-4 h-4" />
          <span>Scientific Integrity & Data Leakage Prevention</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Strict Research Integrity Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subject-Level Partitioning</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              Slice-level random splitting across MRI volumes creates severe data leakage. All slices from any given patient must strictly remain within either train, val, or test splits.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-teal-400 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Zero-Simulation Policy</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              AXONOVA strictly refuses simulated or uncalibrated diagnostic outputs. Every research module presents authentic sequence physics, verified feature boundaries, and transparent model status.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modality Filtering</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              Non-MRI inputs (CT, Chest X-rays, photos) are programmatically rejected at the API boundary to prevent misapplication to unsupported imaging modalities.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Citations & Benchmarks */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Academic Citations & Benchmark References</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Selected Literature & Datasets
        </h2>
        <div className="space-y-3">
          {citations.map((cite, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-white">{cite.title}</p>
                <p className="text-slate-400">{cite.authors}</p>
                <p className="text-slate-500 font-mono text-[11px]">{cite.journal}</p>
              </div>
              <a
                href={cite.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-400 text-xs font-bold transition-colors"
              >
                <span>Reference</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default AboutPage;
