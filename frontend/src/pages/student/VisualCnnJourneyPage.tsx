import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Scan,
  Activity,
  BarChart3,
  Eye,
  Sliders,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

interface PipelineStep {
  id: string;
  stepNumber: number;
  title: string;
  tagline: string;
  category: 'Input' | 'Preprocessing' | 'Feature Extraction' | 'Latent Representation' | 'Decision';
  summary: string;
  radiologyAnalogy: string;
  mathFormula?: string;
  keyDetails: string[];
  visualSim: {
    label: string;
    description: string;
    badge: string;
    featureMapPattern: 'raw' | 'preproc' | 'conv' | 'edges' | 'textures' | 'shapes' | 'latent' | 'softmax';
  };
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'mri_image',
    stepNumber: 1,
    title: 'MRI IMAGE',
    tagline: 'High-resolution DICOM / JPEG anatomical matrix',
    category: 'Input',
    summary: 'The neural network receives a 2D brain MRI acquisition slice (axial, coronal, or sagittal) across standard pulse sequences (T1-CE, T2, FLAIR, DWI).',
    radiologyAnalogy: 'Analogous to a radiologist hanging the unadjusted native MRI slice on the PACS diagnostic display.',
    mathFormula: 'Image \\in \\mathbb{R}^{H \\times W \\times C} \\quad (e.g., 512 \\times 512 \\times 3)',
    keyDetails: [
      'Pixel intensities correspond to radiofrequency tissue relaxation times (T1, T2, T2-FLAIR, or diffusion restriction).',
      'Native resolution varies by scanner field strength (1.5T vs 3.0T MRI).',
      'No algorithmic feature extraction has occurred at this initial stage.',
    ],
    visualSim: {
      label: 'Native Acquisition Matrix',
      description: 'Raw grayscale radiofrequency intensity tensor.',
      badge: 'Step 1: Input',
      featureMapPattern: 'raw',
    },
  },
  {
    id: 'preprocessing',
    stepNumber: 2,
    title: 'PREPROCESSING',
    tagline: 'Rescaling, aspect ratio standardization & [0, 1] normalization',
    category: 'Preprocessing',
    summary: 'Slices are standardized to fixed dimensions (224 × 224 × 3) and floating-point intensity values rescaled strictly between 0.0 and 1.0.',
    radiologyAnalogy: 'Analogous to standardized window/level calibration across varying hospital scanner manufacturers.',
    mathFormula: 'x_{\\text{norm}} = \\frac{x - \\min(x)}{\\max(x) - \\min(x)} \\in [0.0, 1.0]',
    keyDetails: [
      'Bilinear interpolation handles matrix dimensions without distortion artifacts.',
      'Intensity normalization eliminates baseline illumination shifts between scanners.',
      'Eliminates numerical vanishing or exploding gradients during inference.',
    ],
    visualSim: {
      label: 'Standardized Tensor (224 × 224 × 3)',
      description: 'Zero-mean unit-variance normalized floating point tensor.',
      badge: 'Step 2: Preprocessing',
      featureMapPattern: 'preproc',
    },
  },
  {
    id: 'convolution',
    stepNumber: 3,
    title: 'CONVOLUTION',
    tagline: 'Sliding 3×3 parameter kernels computing spatial dot products',
    category: 'Feature Extraction',
    summary: 'Convolutional filter kernels systematically slide across the standardized tensor, computing element-wise dot products to extract local receptive field activations.',
    radiologyAnalogy: 'Analogous to a radiologist applying edge-enhancing sharpening filters on a PACS workstation.',
    mathFormula: '(I * K)(x, y) = \\sum_{m=-1}^{1} \\sum_{n=-1}^{1} I(x-m, y-n) \\cdot K(m, n)',
    keyDetails: [
      'Each 3×3 kernel contains 9 learnable spatial weights tuned during supervised training.',
      'Stride and padding preserve spatial alignment of pathological borders.',
      'Batch normalization accelerates internal feature convergence.',
    ],
    visualSim: {
      label: 'Kernel Convolution Field',
      description: 'Parameterized sliding spatial matrix operation.',
      badge: 'Step 3: Convolution',
      featureMapPattern: 'conv',
    },
  },
  {
    id: 'edge_features',
    stepNumber: 4,
    title: 'EDGE FEATURES',
    tagline: 'Early layer directional spatial gradients & boundary transitions',
    category: 'Feature Extraction',
    summary: 'Early convolutional blocks (Conv Block 1 & 2) compute first-order directional gradients, detecting sharp tissue transitions.',
    radiologyAnalogy: 'Analogous to inspecting anatomical skull borders, ventricular margins, and gray-white matter junctions.',
    mathFormula: 'G_x = \\frac{\\partial I}{\\partial x}, \\quad G_y = \\frac{\\partial I}{\\partial y}',
    keyDetails: [
      'Filters learn orthogonal orientation sensitivity (horizontal, vertical, and oblique).',
      'Separates intra-axial brain parenchyma from subdural and dural boundaries.',
      'Establishes the foundational structural skeleton of the brain anatomy.',
    ],
    visualSim: {
      label: '32 Edge Gradient Activation Maps',
      description: 'High-frequency anatomical contour and interface boundaries.',
      badge: 'Step 4: Edge Features',
      featureMapPattern: 'edges',
    },
  },
  {
    id: 'texture_features',
    stepNumber: 5,
    title: 'TEXTURE FEATURES',
    tagline: 'Intermediate grain patterns, necrotic cores & plaque heterogeneity',
    category: 'Feature Extraction',
    summary: 'Intermediate convolutional blocks combine adjacent edges into repeating local texture descriptors: mottled heterogeneity vs homogeneous tissue.',
    radiologyAnalogy: 'Analogous to differentiating solid cellular tumor from necrotic cystic degeneration and vasogenic edema.',
    mathFormula: 'a^{[l]} = \\text{ReLU}\\left( W^{[l]} a^{[l-1]} + b^{[l]} \\right)',
    keyDetails: [
      'Detects microstructural variations in cellular density and tissue water content.',
      'Differentiates FLAIR hyperintense demyelinating plaques from ischemic white matter.',
      'Max-pooling provides spatial translation invariance across scan slices.',
    ],
    visualSim: {
      label: '64 Texture Spatial Feature Maps',
      description: 'Mottled vs homogeneous parenchymal density representations.',
      badge: 'Step 5: Texture Features',
      featureMapPattern: 'textures',
    },
  },
  {
    id: 'shape_features',
    stepNumber: 6,
    title: 'SHAPE FEATURES',
    tagline: 'Macroscopic geometric contours, dural attachments & mass effect',
    category: 'Feature Extraction',
    summary: 'Deep convolutional blocks synthesize local textures into macroscopic structural shapes: broad-based dural tumors, sellar expansion, or infiltrative margins.',
    radiologyAnalogy: 'Analogous to identifying pathognomonic lesion morphology—e.g. hemispherical dural mass or Dawson fingers.',
    mathFormula: '\\text{Receptive Field} = R_{l-1} + (k - 1) \\cdot \\text{stride}',
    keyDetails: [
      'Receptive fields expand to encompass whole anatomical lobes and compartments.',
      'Captures mid-line shift, ventricular compression, and sulcal effacement.',
      'Filters become insensitive to local noise and isolate macroscopic lesions.',
    ],
    visualSim: {
      label: '128 Deep Morphological Maps',
      description: 'Global contour representations of pathological lesions.',
      badge: 'Step 6: Shape Features',
      featureMapPattern: 'shapes',
    },
  },
  {
    id: 'high_level_features',
    stepNumber: 7,
    title: 'HIGH-LEVEL FEATURES',
    tagline: 'Global Average Pooling (GAP) & dense semantic embedding',
    category: 'Latent Representation',
    summary: 'Global Average Pooling collapses each 2D spatial feature map into a single scalar value, forming a compact 128-dimensional semantic latent embedding.',
    radiologyAnalogy: 'Analogous to a neuroradiologist synthesizing multi-sequence findings into a prioritized differential impression.',
    mathFormula: '\\text{GAP}_k = \\frac{1}{H \\times W} \\sum_{i=1}^{H} \\sum_{j=1}^{W} A_k(i, j)',
    keyDetails: [
      'Replaces parameter-heavy dense layers, minimizing overfitting risk.',
      'Dropout (p = 0.4) ensures redundant, robust multi-feature representation.',
      'Encapsulates edges, textures, contours, and intensity in a dense mathematical vector.',
    ],
    visualSim: {
      label: '128-D Latent Semantic Vector',
      description: 'High-level composite latent representation.',
      badge: 'Step 7: High-Level Features',
      featureMapPattern: 'latent',
    },
  },
  {
    id: 'classification',
    stepNumber: 8,
    title: 'CLASSIFICATION',
    tagline: 'Softmax activation distribution & Grad-CAM backward localization',
    category: 'Decision',
    summary: 'The final dense layer projects the high-level latent vector into target class logits, normalized via Softmax into calibrated confidence percentages with Grad-CAM visualization.',
    radiologyAnalogy: 'Analogous to finalizing the structured clinical AI report with primary finding and supporting visual rationale.',
    mathFormula: 'P(y = c \\mid x) = \\frac{e^{z_c}}{\\sum_{j=1}^{C} e^{z_j}}',
    keyDetails: [
      'Generates calibrated multiclass probability vector over target clinical conditions.',
      'Grad-CAM flows gradients backward to highlight spatial saliency focus.',
      'All AI outputs require review and confirmation by a qualified specialist.',
    ],
    visualSim: {
      label: 'Calibrated Softmax Probability Vector',
      description: 'Target class likelihood vector with Grad-CAM spatial overlay.',
      badge: 'Step 8: Classification',
      featureMapPattern: 'softmax',
    },
  },
];

export const VisualCnnJourneyPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<PipelineStep>(PIPELINE_STEPS[0]);

  const handleNext = () => {
    const currentIndex = PIPELINE_STEPS.findIndex((s) => s.id === activeStep.id);
    const nextIndex = (currentIndex + 1) % PIPELINE_STEPS.length;
    setActiveStep(PIPELINE_STEPS[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = PIPELINE_STEPS.findIndex((s) => s.id === activeStep.id);
    const prevIndex = (currentIndex - 1 + PIPELINE_STEPS.length) % PIPELINE_STEPS.length;
    setActiveStep(PIPELINE_STEPS[prevIndex]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <Cpu className="w-4 h-4" />
          <span>CNN VISUAL JOURNEY</span>
          <span className="text-slate-600">•</span>
          <span className="text-white font-bold">Deep Neural Feature Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Visual CNN Learning Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Follow an MRI image through the exact 8-stage deep learning pipeline: from raw voxel matrix through preprocessing, convolution, edge detection, texture extraction, shape synthesis, high-level embedding, to final classification.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Sequential 8-Stage Progress Track */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Sequential CNN Pipeline (8 Stages)</span>
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-teal-glow"
            >
              Next Stage
            </button>
          </div>
        </div>

        {/* 8-Step Interactive Stage Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = step.id === activeStep.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[92px] ${
                  isActive
                    ? 'bg-slate-800 border-teal-500 shadow-teal-glow ring-2 ring-teal-400/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                      isActive ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    0{step.stepNumber}
                  </span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                </div>

                <div className="mt-2">
                  <div
                    className={`text-[11px] font-bold leading-tight font-mono truncate ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">
                    {step.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage Detail & Visual Activation Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stage Theoretical & Clinical Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-bold flex items-center justify-center text-xs border border-teal-500/30">
                  {activeStep.stepNumber}
                </span>
                <div>
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                    STAGE {activeStep.stepNumber} OF 8: {activeStep.category}
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {activeStep.title}
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeStep.tagline}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {activeStep.summary}
            </p>

            {/* Radiology Analogy */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-teal-500/20 space-y-1 text-xs">
              <span className="text-teal-400 font-bold uppercase tracking-wider text-[10px] font-mono flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Clinical Neuroradiology Analogy:</span>
              </span>
              <p className="text-slate-300 leading-relaxed italic">
                "{activeStep.radiologyAnalogy}"
              </p>
            </div>

            {/* Key Technical Details */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block">
                Algorithmic Operations:
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeStep.keyDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mathematical Formulation */}
            {activeStep.mathFormula && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                <span className="text-[10px] text-slate-400 block mb-0.5">Formal Tensor Operation:</span>
                <code>{activeStep.mathFormula}</code>
              </div>
            )}
          </div>
        </div>

        {/* Right: Visual Feature Map & Activation Representation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ACTIVATION REPRESENTATION
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                {activeStep.visualSim.badge}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-white">{activeStep.visualSim.label}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {activeStep.visualSim.description}
              </p>
            </div>

            {/* Simulated Feature Map Visualizer */}
            <div className="h-64 rounded-xl bg-black border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
              {/* Feature map canvas visualization depending on step */}
              {activeStep.visualSim.featureMapPattern === 'raw' && (
                <div className="w-44 h-44 rounded-full border-2 border-slate-600 bg-slate-900/80 flex items-center justify-center relative">
                  <div className="w-32 h-36 rounded-full border border-slate-700 bg-slate-800/80 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-slate-400">Native Voxel Slice</span>
                  </div>
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'preproc' && (
                <div className="w-44 h-44 border-2 border-teal-500/60 bg-slate-900 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-xs font-mono text-teal-300 font-bold">224 × 224 × 3</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">Normalized [0.0, 1.0]</span>
                  <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full mt-3" />
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'conv' && (
                <div className="grid grid-cols-3 gap-1.5 p-3 rounded-lg bg-slate-950 border border-teal-500/40 font-mono text-xs text-center">
                  {[-1, 0, 1, -2, 0, 2, -1, 0, 1].map((w, idx) => (
                    <div key={idx} className="w-10 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-teal-300">
                      {w}
                    </div>
                  ))}
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'edges' && (
                <div className="w-44 h-44 rounded-xl border border-teal-500/50 bg-black flex items-center justify-center relative p-2">
                  <div className="w-36 h-36 rounded-full border-2 border-dashed border-teal-400 flex items-center justify-center">
                    <div className="w-20 h-24 border-2 border-teal-300 rounded-lg flex items-center justify-center">
                      <span className="text-[9px] font-mono text-teal-300">Boundary Gradient</span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'textures' && (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded border border-slate-800"
                      style={{
                        background: `radial-gradient(circle, rgba(13,148,136,${0.3 + (i % 4) * 0.2}) 0%, rgba(15,23,42,1) 100%)`,
                      }}
                    />
                  ))}
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'shapes' && (
                <div className="w-44 h-44 rounded-xl bg-slate-950 border border-teal-500/40 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center shadow-teal-glow">
                    <span className="text-[10px] font-mono text-teal-300 font-bold text-center">
                      Deep Receptive Contour
                    </span>
                  </div>
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'latent' && (
                <div className="space-y-2 w-full max-w-xs px-4">
                  <div className="text-[10px] font-mono text-teal-400 text-center">
                    128-D Global Average Pooled Vector
                  </div>
                  <div className="flex gap-1 justify-center">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 rounded-full"
                        style={{
                          height: `${20 + (i * 7) % 50}px`,
                          backgroundColor: i % 2 === 0 ? '#14b8a6' : '#06b6d4',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeStep.visualSim.featureMapPattern === 'softmax' && (
                <div className="space-y-2 w-full max-w-xs px-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-teal-500/40 flex justify-between">
                    <span className="text-white font-bold">Glioma:</span>
                    <span className="text-teal-300 font-bold">94.8%</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between text-slate-400">
                    <span>Meningioma:</span>
                    <span>3.2%</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between text-slate-400">
                    <span>Pituitary:</span>
                    <span>1.4%</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between text-slate-400">
                    <span>No Tumor:</span>
                    <span>0.6%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full mathematical transparency for clinical interpretability.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualCnnJourneyPage;
