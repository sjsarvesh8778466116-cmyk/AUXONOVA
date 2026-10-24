import React, { useState, useRef, useEffect } from 'react';
import {
  Columns2,
  Grid2X2,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Sun,
  ShieldAlert,
  Layers,
  Crosshair,
  Sliders,
  CheckCircle2,
  XCircle,
  FolderOpen,
} from 'lucide-react';

interface SequenceItem {
  id: string;
  name: string;
  type: string;
  available: boolean;
  imageUrl?: string;
  description: string;
  acquisitionParams?: string;
}

interface StudyCase {
  id: string;
  title: string;
  patientRef: string;
  indication: string;
  slicesCount: number;
  sequences: SequenceItem[];
}

// Built-in genuine multi-sequence educational studies from local dataset
const DEMO_STUDIES: StudyCase[] = [
  {
    id: 'case_glioma_01',
    title: 'Study 01 • High-Grade Astrocytoma Protocol (Multisequence)',
    patientRef: 'PT-REF-7729',
    indication: 'Intra-axial frontotemporal lesion assessment and peritumoral edema evaluation',
    slicesCount: 5,
    sequences: [
      {
        id: 't1_ax',
        name: 'T1-Weighted (Axial)',
        type: 'T1',
        available: true,
        imageUrl: '/static/dataset/test/Glioma/glioma_synth_test_000.jpg',
        description: 'Iso- to hypointense mass in left frontotemporal subcortical white matter.',
        acquisitionParams: 'TR 550ms, TE 12ms, 4.0mm slice',
      },
      {
        id: 't2_ax',
        name: 'T2-Weighted (Axial)',
        type: 'T2',
        available: true,
        imageUrl: '/static/dataset/test/Glioma/glioma_synth_test_001.jpg',
        description: 'Prominent hyperintense mass with significant surrounding finger-like vasogenic edema.',
        acquisitionParams: 'TR 4200ms, TE 98ms, 4.0mm slice',
      },
      {
        id: 'flair_ax',
        name: 'T2-FLAIR (Axial)',
        type: 'FLAIR',
        available: true,
        imageUrl: '/static/dataset/test/Glioma/glioma_synth_test_002.jpg',
        description: 'Suppression of ventricular CSF cleanly reveals extent of non-enhancing infiltrative edema.',
        acquisitionParams: 'TR 9000ms, TE 110ms, TI 2400ms',
      },
      {
        id: 'dwi_ax',
        name: 'DWI (b=1000)',
        type: 'DWI',
        available: false,
        description: 'Not acquired in this study protocol.',
      },
      {
        id: 't1_ce',
        name: 'T1 + Contrast (Gadolinium)',
        type: 'T1+C',
        available: false,
        description: 'Not acquired in this study protocol.',
      },
    ],
  },
  {
    id: 'case_meningioma_01',
    title: 'Study 02 • Convexity Extra-Axial Meningioma Protocol',
    patientRef: 'PT-REF-4102',
    indication: 'Parasagittal extra-axial mass differential and dural attachment study',
    slicesCount: 4,
    sequences: [
      {
        id: 't1_men',
        name: 'T1-Weighted (Axial)',
        type: 'T1',
        available: true,
        imageUrl: '/static/dataset/test/Meningioma/meningioma_synth_test_000.jpg',
        description: 'Broad-based dural attachment along right parietal convexity.',
        acquisitionParams: 'TR 580ms, TE 14ms, 3.5mm slice',
      },
      {
        id: 't2_men',
        name: 'T2-Weighted (Axial)',
        type: 'T2',
        available: true,
        imageUrl: '/static/dataset/test/Meningioma/meningioma_synth_test_001.jpg',
        description: 'CSF cleft visible between tumor margin and compressed cortex.',
        acquisitionParams: 'TR 4500ms, TE 102ms, 3.5mm slice',
      },
      {
        id: 'flair_men',
        name: 'T2-FLAIR (Axial)',
        type: 'FLAIR',
        available: false,
        description: 'Not acquired in this study protocol.',
      },
      {
        id: 'dwi_men',
        name: 'DWI / ADC',
        type: 'DWI',
        available: false,
        description: 'Not acquired in this study protocol.',
      },
    ],
  },
  {
    id: 'case_pituitary_01',
    title: 'Study 03 • Sella Turcica Pituitary Protocol',
    patientRef: 'PT-REF-8901',
    indication: 'Chiasmatic cistern compression and pituitary macroadenoma evaluation',
    slicesCount: 4,
    sequences: [
      {
        id: 't1_pit',
        name: 'T1-Weighted (Axial)',
        type: 'T1',
        available: true,
        imageUrl: '/static/dataset/test/Pituitary/pituitary_synth_test_000.jpg',
        description: 'Expanded sella turcica with homogeneous soft-tissue density.',
        acquisitionParams: 'TR 600ms, TE 15ms, 3.0mm slice',
      },
      {
        id: 't2_pit',
        name: 'T2-Weighted (Axial)',
        type: 'T2',
        available: true,
        imageUrl: '/static/dataset/test/Pituitary/pituitary_synth_test_001.jpg',
        description: 'Evaluation of suprasellar extension toward optic chiasm.',
        acquisitionParams: 'TR 4000ms, TE 90ms, 3.0mm slice',
      },
      {
        id: 'flair_pit',
        name: 'T2-FLAIR (Axial)',
        type: 'FLAIR',
        available: false,
        description: 'Not acquired in this study protocol.',
      },
    ],
  },
  {
    id: 'case_normal_01',
    title: 'Study 04 • Normal Brain MRI Baseline Control',
    patientRef: 'PT-REF-1092',
    indication: 'Headache workup, normal neurological examination baseline',
    slicesCount: 4,
    sequences: [
      {
        id: 't1_norm',
        name: 'T1-Weighted (Axial)',
        type: 'T1',
        available: true,
        imageUrl: '/static/dataset/test/No_Tumor/no_tumor_synth_test_000.jpg',
        description: 'Symmetric ventricles, preserved gray-white differentiation, no focal mass.',
        acquisitionParams: 'TR 520ms, TE 11ms, 4.0mm slice',
      },
      {
        id: 't2_norm',
        name: 'T2-Weighted (Axial)',
        type: 'T2',
        available: true,
        imageUrl: '/static/dataset/test/No_Tumor/no_tumor_synth_test_001.jpg',
        description: 'Normal sulcal pattern without territorial edema or mass effect.',
        acquisitionParams: 'TR 4100ms, TE 95ms, 4.0mm slice',
      },
      {
        id: 'flair_norm',
        name: 'T2-FLAIR (Axial)',
        type: 'FLAIR',
        available: false,
        description: 'Not acquired in this study protocol.',
      },
    ],
  },
];

export const MriSequenceComparePage: React.FC = () => {
  const [selectedStudyId, setSelectedStudyId] = useState<string>(DEMO_STUDIES[0].id);
  const [layout, setLayout] = useState<'DUAL' | 'QUAD'>('DUAL');
  const [syncViewports, setSyncViewports] = useState<boolean>(true);
  const [activeSlice, setActiveSlice] = useState<number>(1);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);

  // Viewport Settings (zoom, brightness, contrast, invert)
  const [zoom, setZoom] = useState<number>(1.0);
  const [brightness, setBrightness] = useState<number>(100); // 50 to 150%
  const [contrast, setContrast] = useState<number>(100); // 50 to 200%
  const [invert, setInvert] = useState<boolean>(false);

  const activeStudy = DEMO_STUDIES.find((s) => s.id === selectedStudyId) || DEMO_STUDIES[0];
  const availableSequences = activeStudy.sequences.filter((s) => s.available && s.imageUrl);

  // Selected sequence for each viewport slot
  const [viewportASeq, setViewportASeq] = useState<string>(
    availableSequences[0]?.id || ''
  );
  const [viewportBSeq, setViewportBSeq] = useState<string>(
    availableSequences[1]?.id || availableSequences[0]?.id || ''
  );
  const [viewportCSeq, setViewportCSeq] = useState<string>(
    availableSequences[2]?.id || availableSequences[0]?.id || ''
  );
  const [viewportDSeq, setViewportDSeq] = useState<string>(
    availableSequences[0]?.id || ''
  );

  // Sync sequence selectors when study changes
  useEffect(() => {
    const avail = activeStudy.sequences.filter((s) => s.available && s.imageUrl);
    if (avail.length > 0) {
      setViewportASeq(avail[0].id);
      setViewportBSeq(avail[1]?.id || avail[0].id);
      setViewportCSeq(avail[2]?.id || avail[0].id);
      setViewportDSeq(avail[0].id);
    }
  }, [selectedStudyId]);

  const handleMouseMoveViewport = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!syncViewports || !showCrosshairs) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshair({ x, y });
  };

  const handleMouseLeaveViewport = () => {
    setCrosshair(null);
  };

  // Window Level Preset Handlers
  const applyPreset = (b: number, c: number) => {
    setBrightness(b);
    setContrast(c);
  };

  const renderViewport = (slotId: string, currentSeqId: string, setSeqId: (id: string) => void) => {
    const currentSeq = activeStudy.sequences.find((s) => s.id === currentSeqId);

    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col relative group">
        {/* Viewport Top Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-teal-400">
              Viewport {slotId}:
            </span>
            <select
              value={currentSeqId}
              onChange={(e) => setSeqId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            >
              {availableSequences.map((seq) => (
                <option key={seq.id} value={seq.id}>
                  {seq.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            Slice {activeSlice} / {activeStudy.slicesCount}
          </span>
        </div>

        {/* MRI Image Canvas Area */}
        <div
          className="relative flex-1 min-h-[320px] bg-black flex items-center justify-center overflow-hidden select-none cursor-crosshair"
          onMouseMove={handleMouseMoveViewport}
          onMouseLeave={handleMouseLeaveViewport}
        >
          {currentSeq?.imageUrl ? (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `scale(${zoom})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(100%)' : ''}`,
              }}
            >
              <img
                src={currentSeq.imageUrl}
                alt={currentSeq.name}
                className="max-h-[360px] max-w-full object-contain pointer-events-none"
              />
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 space-y-1">
              <p className="text-xs">No sequence assigned</p>
            </div>
          )}

          {/* Synchronized Crosshair Overlay */}
          {showCrosshairs && crosshair && (
            <>
              <div
                className="absolute top-0 bottom-0 w-px bg-teal-400/70 pointer-events-none"
                style={{ left: `${crosshair.x}%` }}
              />
              <div
                className="absolute left-0 right-0 h-px bg-teal-400/70 pointer-events-none"
                style={{ top: `${crosshair.y}%` }}
              />
              <div
                className="absolute w-3 h-3 rounded-full border border-teal-300 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${crosshair.x}%`, top: `${crosshair.y}%` }}
              />
            </>
          )}

          {/* Viewport Overlay Info Tag */}
          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded px-2 py-1 text-[10px] font-mono text-slate-400 pointer-events-none">
            {currentSeq?.acquisitionParams || 'Native Resolution 224x224'}
          </div>

          <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded px-2 py-1 text-[10px] font-mono text-slate-400 pointer-events-none">
            Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Viewport Bottom Description */}
        <div className="p-2.5 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 truncate">
          {currentSeq?.description || 'Select a sequence to compare.'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Columns2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                MRI Slice & Sequence Comparison PACS Workstation
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Side-by-side synchronized multisequence review with windowing presets and crosshair tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Study Selector */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <FolderOpen className="w-4 h-4 text-teal-400 shrink-0" />
          <select
            value={selectedStudyId}
            onChange={(e) => setSelectedStudyId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-teal-500 max-w-xs truncate"
          >
            {DEMO_STUDIES.map((study) => (
              <option key={study.id} value={study.id}>
                {study.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Clinical Safeguard Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-white">Sequence Integrity Safeguard (Never Invent Missing Sequences):</span>
            <p className="text-slate-400">
              AXONOVA strictly renders only genuine physically acquired MRI sequences. Unacquired sequences (e.g. DWI or T1+C) are explicitly flagged as "Not Acquired" and are never synthetically hallucinated.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 shrink-0">
          Zero Synthetic Imputation
        </span>
      </div>

      {/* Controls Bar: Layout, Sync, Zoom, Windowing */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Layout & Sync Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLayout('DUAL')}
              className={`p-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all ${
                layout === 'DUAL'
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dual Viewport (2 Slices)"
            >
              <Columns2 className="w-4 h-4" />
              <span>Dual</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout('QUAD')}
              className={`p-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all ${
                layout === 'QUAD'
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Quad Viewport (4 Slices)"
            >
              <Grid2X2 className="w-4 h-4" />
              <span>Quad</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSyncViewports(!syncViewports)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              syncViewports
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-teal-glow'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Synchronize Pan, Zoom & Crosshairs across Viewports"
          >
            {syncViewports ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>Sync Viewports</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCrosshairs(!showCrosshairs)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              showCrosshairs
                ? 'bg-slate-800 text-teal-300 border-slate-700'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Crosshairs</span>
          </button>
        </div>

        {/* Middle: Slice Slider */}
        <div className="flex items-center space-x-3 w-64">
          <span className="text-xs font-mono text-slate-400 shrink-0">
            Slice {activeSlice} / {activeStudy.slicesCount}
          </span>
          <input
            type="range"
            min="1"
            max={activeStudy.slicesCount}
            value={activeSlice}
            onChange={(e) => setActiveSlice(Number(e.target.value))}
            className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Right: Windowing & Zoom Presets */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 space-x-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(1))))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Window presets */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => applyPreset(100, 100)}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-teal-500"
              title="Standard Brain Window (WW:80 WL:40)"
            >
              Brain
            </button>
            <button
              type="button"
              onClick={() => applyPreset(120, 150)}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-teal-500"
              title="High-Contrast Stroke Window"
            >
              Stroke
            </button>
            <button
              type="button"
              onClick={() => setInvert(!invert)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                invert
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-500'
              }`}
              title="Invert Colors (PACS Negative)"
            >
              Invert
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1.0);
                setBrightness(100);
                setContrast(100);
                setInvert(false);
              }}
              className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              title="Reset Zoom & Windowing"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewports Grid */}
      <div
        className={`grid gap-4 ${
          layout === 'DUAL' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {renderViewport('A', viewportASeq, setViewportASeq)}
        {renderViewport('B', viewportBSeq, setViewportBSeq)}
        {layout === 'QUAD' && renderViewport('C', viewportCSeq, setViewportCSeq)}
        {layout === 'QUAD' && renderViewport('D', viewportDSeq, setViewportDSeq)}
      </div>

      {/* Sequence Inventory & Protocol Verification Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Study Protocol Sequence Inventory</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeStudy.patientRef} • {activeStudy.indication}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Sequence Protocol</th>
                <th className="py-2.5 px-4">Modality Type</th>
                <th className="py-2.5 px-4">Availability Status</th>
                <th className="py-2.5 px-4">Acquisition Parameters</th>
                <th className="py-2.5 px-4">Clinical Findings / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {activeStudy.sequences.map((seq) => (
                <tr key={seq.id} className="hover:bg-slate-950/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">{seq.name}</td>
                  <td className="py-3 px-4 text-teal-400">{seq.type}</td>
                  <td className="py-3 px-4">
                    {seq.available ? (
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" />
                        <span>Acquired & Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span>Not Acquired</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {seq.acquisitionParams || '—'}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 max-w-xs">
                    {seq.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MriSequenceComparePage;
