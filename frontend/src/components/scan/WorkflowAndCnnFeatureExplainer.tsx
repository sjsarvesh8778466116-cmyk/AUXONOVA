import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import ClinicalWorkflowBar from './ClinicalWorkflowBar';

export const WorkflowAndCnnFeatureExplainer: React.FC = () => {
  const [selectedFeatureTab, setSelectedFeatureTab] = useState<string>('edges');

  const cnnFeatures = [
    {
      id: 'edges',
      name: 'Edge Patterns',
      summary: 'Intensity boundaries and structural transitions.',
      details:
        'Small 3×3 convolutional kernels compute spatial gradient differences between adjacent pixel voxels. In brain MRI, edge filters delineate cortical gray-white matter junctions, ventricular boundaries, and circumscribed tumor capsule interfaces.',
      kernelNote: 'Early Layers (Conv2D Block 1 & 2)',
      activationVisual: 'matrix-edges',
    },
    {
      id: 'textures',
      name: 'Texture Patterns',
      summary: 'Regional micro-intensity variation and parenchymal heterogeneity.',
      details:
        'Intermediate convolutional channels assemble neighboring edge responses into regional micro-patterns: mottled heterogeneity in necrotic tumor cores, dense homogeneous tissue in benign meningiomas, or smooth CSF attenuation.',
      kernelNote: 'Intermediate Layers (Conv2D Block 3)',
      activationVisual: 'matrix-textures',
    },
    {
      id: 'shapes',
      name: 'Shape Characteristics',
      summary: 'Macroscopic geometric contours and morphological silhouettes.',
      details:
        'Synthesizes larger spatial boundaries: broad-based hemispherical masses (convexity meningiomas), sellar expansion with suprasellar cistern extension (pituitary adenomas), or diffuse infiltrative margins (gliomas).',
      kernelNote: 'Deep Convolutional Layers (Conv Block 4)',
      activationVisual: 'matrix-shapes',
    },
    {
      id: 'intensity',
      name: 'Intensity Distribution',
      summary: 'T1, T2, FLAIR, and DWI relative signal brightness profiles.',
      details:
        'Quantifies relative brightness ratios across sequences. Differentiates intense hyperenhancement (disrupted blood-brain barrier) from surrounding FLAIR hyperintense vasogenic edema fluid and dark necrotic cystic cavities.',
      kernelNote: 'Multichannel Activation Channels',
      activationVisual: 'matrix-intensity',
    },
    {
      id: 'spatial',
      name: 'Spatial Relationships',
      summary: 'Anatomical compartment coordinates and midline shift.',
      details:
        'Evaluates positioning relative to falx cerebri, lateral ventricles, and dural compartments (intra-axial parenchymal vs extra-axial dural distribution, ventricular effacement, and subfalcine herniation risk).',
      kernelNote: 'Global Spatial Pooling',
      activationVisual: 'matrix-spatial',
    },
    {
      id: 'highlevel',
      name: 'High-Level Synergy',
      summary: 'Combines multi-scale visual features into a unified diagnostic representation.',
      details:
        'Dense layers aggregate edges, textures, contours, and intensity values into a high-dimensional latent vector mapped via Softmax into calibrated class probabilities with Grad-CAM gradient backpropagation.',
      kernelNote: 'Dense Decision Head & Softmax',
      activationVisual: 'matrix-highlevel',
    },
  ];

  const currentFeature = cnnFeatures.find((f) => f.id === selectedFeatureTab) || cnnFeatures[0];

  return (
    <div className="space-y-6">
      {/* 1. Horizontal Clinical Workflow Bar */}
      <ClinicalWorkflowBar currentStepIndex={3} />

      {/* 2. Visual Feature Extraction Explainer */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              CNN FEATURE EXTRACTION & ACTIVATION REPRESENTATIONS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
            ● Clinical AI Feature Engine
          </span>
        </div>

        {/* Feature Tab Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {cnnFeatures.map((feat) => {
            const isSelected = feat.id === selectedFeatureTab;
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => setSelectedFeatureTab(feat.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500 shadow-teal-glow ring-1 ring-teal-400/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-teal-300' : 'text-slate-300'
                    }`}
                  >
                    {feat.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                  {feat.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Feature Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-300 font-bold">
                {currentFeature.name}
              </span>
              <span className="text-slate-400 font-medium">Receptive Field:</span>
              <span className="text-white font-semibold">{currentFeature.kernelNote}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentFeature.details}
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Standardized across all five active neurological condition assessment workflows.
              </span>
            </div>
          </div>

          {/* Interactive Feature Matrix Simulation */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Eye className="w-3 h-3 text-teal-400" />
                <span>Feature Map Activation</span>
              </span>
              <span className="text-teal-300 font-bold">Conv Filter #{selectedFeatureTab === 'edges' ? '04' : selectedFeatureTab === 'textures' ? '18' : '32'}</span>
            </div>

            {/* Visual activation grid */}
            <div className="grid grid-cols-6 gap-1 p-2 rounded-lg bg-black/60 border border-slate-800/80">
              {Array.from({ length: 24 }).map((_, i) => {
                const intensity =
                  selectedFeatureTab === 'edges'
                    ? (i % 6 === 2 || i % 6 === 3 ? 0.9 : 0.15)
                    : selectedFeatureTab === 'textures'
                    ? ((i * 37) % 100) / 100
                    : selectedFeatureTab === 'shapes'
                    ? (i > 5 && i < 18 ? 0.85 : 0.2)
                    : selectedFeatureTab === 'intensity'
                    ? (i % 2 === 0 ? 0.95 : 0.25)
                    : 0.7;

                return (
                  <div
                    key={i}
                    className="h-5 rounded-xs transition-colors duration-300"
                    style={{
                      backgroundColor:
                        intensity > 0.7
                          ? `rgba(20, 184, 166, ${intensity})`
                          : intensity > 0.4
                          ? `rgba(6, 182, 212, ${intensity})`
                          : `rgba(30, 41, 59, 0.8)`,
                    }}
                    title={`Kernel Weight: ${intensity.toFixed(2)}`}
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 font-mono text-center">
              Receptive Activation Tensor (Normalized [0.0 - 1.0])
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAndCnnFeatureExplainer;
