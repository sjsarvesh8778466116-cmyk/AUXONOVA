import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Scan,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Cpu,
  GraduationCap,
  Radio,
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  pulseSpeed: number;
}

export const MedicalMotionHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodeCount = Math.min(42, Math.floor(width / 30));
    const nodes: Particle[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let scanlineY = 0;
    const scanSpeed = 0.8;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connective synaptic axons
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist) {
            const edgeAlpha = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${edgeAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Neural synaptic nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 10 || node.x > width - 10) node.vx *= -1;
        if (node.y < 10 || node.y > height - 10) node.vy *= -1;

        node.alpha += Math.sin(Date.now() * node.pulseSpeed) * 0.008;
        const clampedAlpha = Math.max(0.2, Math.min(0.85, node.alpha));

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${clampedAlpha * 0.35})`;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${clampedAlpha})`;
        ctx.fill();
      }

      // Sweeping precision laser scanline
      scanlineY = (scanlineY + scanSpeed) % height;
      const gradient = ctx.createLinearGradient(0, scanlineY - 25, 0, scanlineY + 25);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.22)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanlineY - 25, width, 50);

      ctx.beginPath();
      ctx.moveTo(0, scanlineY);
      ctx.lineTo(width, scanlineY);
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-[#0a1120] to-[#0c1626] border border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-12 transition-all">
      {/* Background Interactive Motion Canvas */}
      {!reducedMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none opacity-90 z-0"
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-radial-gradient from-teal-500/10 via-sky-500/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Cyber-medical Grid Watermark */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Status / Category Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>AXONOVA Clinical AI Research & Medical Learning Platform</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Explore Brain MRI Analysis, <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              AI Learning & Medical Research
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            A transparent neuroimaging decision-support environment combining pre-ingestion photometric validation,
            convolutional deep neural networks, Layer-Targeted Grad-CAM explainability, and an interactive reasoning laboratory
            for clinical trainees.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/scans"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
          >
            <Scan className="w-4 h-4" />
            <span>Open Scan Center</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/student"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm shadow-xs hover:border-slate-500 transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span>Start Learning Lab</span>
          </Link>

          <Link
            to="/quizzes"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold text-sm transition-all"
          >
            <Brain className="w-4 h-4 text-teal-400" />
            <span>Quiz Center</span>
          </Link>
        </div>

        {/* Key Operational Badges */}
        <div className="pt-4 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white">10 Domain Models</div>
              <div className="text-[11px] text-slate-400">48-Disease Taxonomy</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Grad-CAM Heatmaps</div>
              <div className="text-[11px] text-slate-400">Visual Receptive Field</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Photometric Check</div>
              <div className="text-[11px] text-slate-400">Pre-Ingestion Quality</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <Activity className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Anti-Cheating Lab</div>
              <div className="text-[11px] text-slate-400">Server-Scored Exams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalMotionHero;
