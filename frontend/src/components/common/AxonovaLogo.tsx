import React from 'react';

interface AxonovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  animate?: boolean;
}

export const AxonovaLogo: React.FC<AxonovaLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = 'NEURO-IMAGING AI',
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 56, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 76, text: 'text-4xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3.5 select-none ${className}`}>
      {/* Dynamic Animated Medical Neuro-Tech Emblem */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: current.icon, height: current.icon }}
      >
        {/* Ambient Pulsing Glow Layer */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-teal-400/20 to-blue-600/30 blur-md ${
            animate ? 'animate-pulse' : ''
          }`}
        />

        <img
          src="/logo-icon.png"
          alt="AXONOVA Logo"
          className="relative w-full h-full object-cover rounded-xl shadow-lg border border-cyan-500/30 ring-1 ring-cyan-400/20"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span
              className={`font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-teal-200 ${current.text}`}
            >
              AXONOVA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
          </div>
          {subtitle && (
            <span
              className={`font-bold tracking-widest text-cyan-400/90 uppercase font-mono ${current.sub}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AxonovaLogo;
