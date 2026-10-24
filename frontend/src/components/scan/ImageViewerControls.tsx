import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Eye,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Contrast,
  Crosshair,
  Sliders,
} from 'lucide-react';

export interface SampleHint {
  title: string;
  category: string;
  orientation: string;
  desc: string;
}

interface ImageViewerControlsProps {
  previewUrl: string | null;
  filename: string | null;
  scanType?: string | null;
  orientation?: string | null;
  onQuickLoadSample?: (index: number) => void;
  samples?: SampleHint[];
  // Navigation props
  currentIndex?: number;
  totalImages?: number;
  onNextImage?: () => void;
  onPrevImage?: () => void;
}

export const ImageViewerControls: React.FC<ImageViewerControlsProps> = ({
  previewUrl,
  filename,
  scanType,
  orientation,
  onQuickLoadSample,
  samples = [],
  currentIndex = 0,
  totalImages = 0,
  onNextImage,
  onPrevImage,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [fitMode, setFitMode] = useState(true);
  const [showCrosshairs, setShowCrosshairs] = useState(false);
  const [showSliders, setShowSliders] = useState(false);

  // Reset when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setFitMode(true);
    setBrightness(100);
    setContrast(100);
  }, [previewUrl]);

  const handleZoomIn = useCallback(() => {
    setFitMode(false);
    setZoom((z) => Math.min(parseFloat((z + 0.2).toFixed(2)), 4.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setFitMode(false);
    setZoom((z) => Math.max(parseFloat((z - 0.2).toFixed(2)), 0.4));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((r) => (r + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setFitMode(true);
    setBrightness(100);
    setContrast(100);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!previewUrl) return;
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === 'r' || e.key === 'R') handleRotate();
      if (e.key === 'Escape') handleReset();
      if (e.key === 'ArrowLeft' && onPrevImage) onPrevImage();
      if (e.key === 'ArrowRight' && onNextImage) onNextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewUrl, handleZoomIn, handleZoomOut, handleRotate, handleReset, onPrevImage, onNextImage]);

  /* ─── Empty state ─── */
  if (!previewUrl) {
    return (
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg p-8">
        <div className="flex flex-col items-center text-center gap-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
            <Eye className="w-8 h-8 text-teal-400 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Clinical MRI Viewer Ready</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Select an MRI scan from your case library or choose one of the clinical benchmark samples below to begin AI assessment.
            </p>
          </div>

          {samples.length > 0 && onQuickLoadSample && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mt-2">
              {samples.map((s, idx) => (
                <button
                  key={s.category + idx}
                  type="button"
                  onClick={() => onQuickLoadSample(idx)}
                  className="group p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 transition-all text-left shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition-colors truncate">
                      {s.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-750 shrink-0 ml-1">
                      {s.orientation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{s.desc}</p>
                  <span className="text-[10px] text-teal-400 font-semibold mt-1 inline-flex items-center space-x-1">
                    <span>⚡ Load Scan</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Active viewer ─── */
  const transformStyle: React.CSSProperties = {
    transform: `scale(${fitMode ? 1 : zoom}) rotate(${rotation}deg)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    transition: 'transform 0.2s ease-out, filter 0.15s ease-out',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
      {/* PACS Header Toolbar */}
      <div className="p-3 sm:px-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Scan details & Slice navigation */}
        <div className="flex items-center space-x-3 min-w-0">
          {totalImages > 1 && (
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={onPrevImage}
                disabled={currentIndex <= 0}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
                title="Previous Slice / Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-300 px-2 font-semibold">
                {currentIndex + 1} / {totalImages}
              </span>
              <button
                type="button"
                onClick={onNextImage}
                disabled={currentIndex >= totalImages - 1}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
                title="Next Slice / Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="min-w-0">
            <span className="text-xs font-mono font-bold text-white truncate block">
              {filename || 'Brain_MRI_Scan.jpg'}
            </span>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
              <span className="text-teal-400 font-semibold">{orientation || 'Axial'}</span>
              <span>•</span>
              <span>{scanType || 'MRI'}</span>
              <span>•</span>
              <span>Zoom: {Math.round((fitMode ? 1 : zoom) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Right: Radiology Controls (Zoom, Reset, Brightness, Contrast, Crosshair) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Rotate 90° (R)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCrosshairs(!showCrosshairs)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showCrosshairs
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
            title="Toggle Radiologic Crosshair Overlay"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowSliders(!showSliders)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showSliders
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
            title="Adjust Window / Level (Brightness & Contrast)"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors"
            title="Reset All Adjustments (Esc)"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional Window/Level Sliders Bar */}
      {showSliders && (
        <div className="px-4 py-2.5 bg-slate-950/95 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-slate-400 shrink-0">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Brightness: {brightness}%</span>
            </span>
            <input
              type="range"
              min="50"
              max="180"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-slate-400 shrink-0">
              <Contrast className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contrast: {contrast}%</span>
            </span>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Main Large PACS MRI Viewer Container */}
      <div className="relative h-[480px] sm:h-[540px] bg-black flex items-center justify-center overflow-hidden select-none">
        {/* Radiologic orientation labels on margins */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-slate-800/60 pointer-events-none z-10">
          ANTERIOR (A)
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-slate-800/60 pointer-events-none z-10">
          POSTERIOR (P)
        </div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-slate-800/60 pointer-events-none z-10">
          RIGHT (R)
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-slate-800/60 pointer-events-none z-10">
          LEFT (L)
        </div>

        {/* Optional Crosshair Overlay */}
        {showCrosshairs && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-teal-400/40 border-r border-dotted border-teal-400/60" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-teal-400/40 border-b border-dotted border-teal-400/60" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-teal-400/50" />
          </div>
        )}

        {/* Rendered Scan Image */}
        <img
          src={previewUrl}
          alt={filename || 'Brain MRI Scan'}
          style={transformStyle}
          className="object-contain cursor-grab active:cursor-grabbing rounded shadow-2xl"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ImageViewerControls;
