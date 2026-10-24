import React, { useState } from 'react';
import { Eye, Layers, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface GradCamViewerProps {
  originalImageSrc: string;
  gradcamBase64: string | null;
  predictedCategory: string;
  explanation: string | null;
}

const GradCamViewer: React.FC<GradCamViewerProps> = ({
  originalImageSrc,
  gradcamBase64,
  predictedCategory,
  explanation,
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side'>('side-by-side');

  if (!gradcamBase64) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-2 shadow-sm">
        <Layers className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-sm font-bold text-white">
          Grad-CAM Explainability Saliency Unavailable
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The convolutional activation map could not be computed for this image or layer configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-sm">
      {/* Header with toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            {t('results.gradcam_title')}
          </h4>
        </div>

        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('overlay')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              viewMode === 'overlay'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Heatmap Overlay
          </button>
        </div>
      </div>

      {/* Visual Displays */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-center">
            <span className="text-xs font-semibold text-slate-300 font-mono">Original MRI Input</span>
            <div className="h-64 sm:h-72 rounded-xl bg-black border border-slate-800 flex items-center justify-center p-2 shadow-inner">
              <img
                src={originalImageSrc}
                alt="Original Scan"
                className="max-h-full object-contain rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-center">
            <span className="text-xs font-bold text-teal-400 font-mono">
              Grad-CAM Gradient Activation
            </span>
            <div className="h-64 sm:h-72 rounded-xl bg-black border border-slate-800 flex items-center justify-center p-2 shadow-inner">
              <img
                src={gradcamBase64}
                alt="Grad-CAM Activation"
                className="max-h-full object-contain rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-80 rounded-xl bg-black border border-slate-800 flex items-center justify-center p-3 shadow-inner">
          <img
            src={gradcamBase64}
            alt="Grad-CAM Overlay"
            className="max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Explanation Box */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-start space-x-2 text-slate-200">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
          <p className="leading-relaxed text-slate-300">
            {explanation || t('results.gradcam_desc')}
          </p>
        </div>
        <div className="flex items-start space-x-2 text-[11px] text-amber-300/90 pt-2 border-t border-slate-800">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <p>
            Important: Grad-CAM represents algorithmic neural gradients, not biological tissue margins or clinical disease confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradCamViewer;
