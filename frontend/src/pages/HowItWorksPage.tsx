import React, { useState } from 'react';
import {
  Brain,
  Layers,
  Sparkles,
  Zap,
  Minimize2,
  Cpu,
  BarChart2,
  RefreshCw,
  Target,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<number>(0);

  const modules = [
    {
      id: 'conv',
      title: '1. Convolution & Filters',
      icon: Layers,
      summary: 'Extracting spatial edge, texture, and morphological features.',
      details:
        'A Convolutional layer slides small learnable weight matrices (kernels, such as 3×3) across the 2D image. In early layers, filters learn to respond to edges and contrasts. In deeper layers, filters combine low-level cues into anatomical structures.',
      formula: 'FeatureMap(i, j) = (Image * Filter)(i, j) = Σ Σ Image(i+m, j+n) · Filter(m, n)',
    },
    {
      id: 'relu',
      title: '2. Non-Linear Activation (ReLU)',
      icon: Zap,
      summary: 'Introducing non-linearity to learn complex visual boundaries.',
      details:
        'Rectified Linear Unit (ReLU) sets all negative activation values to zero while passing positive values directly. This non-linear mapping allows the neural network to approximate intricate decision boundaries between dataset classes.',
      formula: 'f(x) = max(0, x)',
    },
    {
      id: 'pooling',
      title: '3. Pooling & Downsampling',
      icon: Minimize2,
      summary: 'Spatial invariance and dimensional parameter reduction.',
      details:
        'MaxPooling takes the maximum activation in 2×2 windows, providing translation tolerance and halving spatial dimensions. At the end of the conv blocks, Global Average Pooling computes the average of each feature map, reducing parameters significantly compared to Flatten.',
      formula: 'Max(2x2 window) -> 1/4 spatial area',
    },
    {
      id: 'dense',
      title: '4. Dense Layers & Dropout',
      icon: Cpu,
      summary: 'Feature integration and regularization against overfitting.',
      details:
        'Dense fully-connected layers combine all learned visual representations into class scores. Dropout randomly sets a percentage (e.g. 40%) of neuron activations to zero during training steps, forcing redundant feature learning and preventing co-adaptation.',
      formula: 'Output = ReLU(W · x + b) with Dropout(p = 0.4)',
    },
    {
      id: 'loss',
      title: '5. Loss & Adam Optimization',
      icon: RefreshCw,
      summary: 'Backpropagation of gradients and adaptive weight updates.',
      details:
        'Sparse Categorical Cross-Entropy measures the discrepancy between predicted probability distribution and true one-hot labels. The Adam optimizer computes adaptive learning rates using first and second moments of gradient vectors to update network weights iteratively.',
      formula: 'Loss = - Σ y_true · log(p_pred)',
    },
    {
      id: 'eval',
      title: '6. Held-out Evaluation',
      icon: Target,
      summary: 'Unbiased performance measurement on unseen test scans.',
      details:
        'To prevent data leakage and overfitting bias, final accuracy, precision, recall, and confusion matrix are computed strictly on held-out test scans that the model never saw during training or hyperparameter tuning.',
      formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
    },
    {
      id: 'gradcam',
      title: '7. Grad-CAM Explainable AI',
      icon: Sparkles,
      summary: 'Gradient-weighted class activation mapping for visual transparency.',
      details:
        'Grad-CAM computes the gradients of the target class score with respect to the final convolutional feature maps. Global average pooling of these gradients yields importance weights (α) which weight each feature map slice, highlighting the anatomical regions driving the decision.',
      formula: 'L_{Grad-CAM}^c = ReLU( Σ_k α_k^c · A^k )  where  α_k^c = (1/Z) Σ_i Σ_j (∂y^c / ∂A_{i,j}^k)',
    },
    {
      id: 'leakage',
      title: '8. Subject-Level Data Integrity',
      icon: HelpCircle,
      summary: 'Preventing slice-level patient correlation leakage.',
      details:
        'In medical neuroimaging, adjacent 2D MRI slices from the same 3D volume share nearly identical anatomy. Random slice-level train/test splits cause severe leakage and unrealistically high metrics. AXONOVA mandates strict subject-level or patient-level partitioning across splits.',
      formula: 'PatientID(TestSet) ∩ PatientID(TrainSet) = ∅',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <Brain className="w-4 h-4" />
          <span>Technical Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How the Neural Network Analyzes Brain MRI
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Core mathematical concepts, convolutional transformations, and radiological verification principles.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Interactive Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tab List (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500 shadow-teal-glow text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg border ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{m.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{m.summary}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Card (8 cols) */}
        <div className="md:col-span-8">
          {modules[activeTab] && (
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-lg">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  {React.createElement(modules[activeTab].icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {modules[activeTab].title}
                  </h3>
                  <p className="text-xs text-teal-300 font-medium">
                    {modules[activeTab].summary}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <p>{modules[activeTab].details}</p>

                {/* Mathematical Formula Box */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Mathematical Expression / Pipeline Rule:
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 overflow-x-auto shadow-inner">
                    {modules[activeTab].formula}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                  💡 <strong>Clinical Research Note:</strong> In medical AI, transparency of mathematical operations prevents black-box failures and enables clinical interpretability.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
