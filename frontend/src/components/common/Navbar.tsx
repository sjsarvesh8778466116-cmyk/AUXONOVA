import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Layers,
  GraduationCap,
  UserCheck,
  LogOut,
  Info,
  ChevronDown,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { api } from '../../api/client';
import { AxonovaLogo } from './AxonovaLogo';

interface NavbarProps {
  modelLoaded: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ modelLoaded }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setRole, isStudent, user, isLoggedIn, logoutUser } = useUser();
  const [showStatusDetails, setShowStatusDetails] = useState(false);

  const handleRoleToggle = () => {
    if (isStudent) {
      setRole('patient');
      navigate('/tasks');
    } else {
      setRole('student');
      navigate('/student');
    }
  };

  const handleSignOut = async () => {
    try {
      await api.logoutUser();
    } catch {
      // Ignore network errors
    }
    logoutUser();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0a0f1d]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <AxonovaLogo size="sm" subtitle="CLINICAL AI WORKSTATION" />
        </Link>

        {/* Center / Right: Professional Model Status */}
        <div className="hidden lg:flex items-center relative">
          <button
            type="button"
            onClick={() => setShowStatusDetails(!showStatusDetails)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-teal-500/50 text-xs text-slate-200 transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">AI Model Status: Active</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showStatusDetails ? 'rotate-180' : ''}`} />
          </button>

          {/* Model Status Popover Details */}
          {showStatusDetails && (
            <div className="absolute top-11 right-0 w-80 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3 z-50 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider font-mono">
                  Clinical AI Specifications
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Model Type:</span>
                  <span className="text-white font-semibold">Deep Convolutional Neural Network</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Input:</span>
                  <span className="text-teal-300 font-semibold">Brain MRI (224×224 Standardized)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mode:</span>
                  <span className="text-cyan-300 font-semibold">Clinical Decision Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Output:</span>
                  <span className="text-emerald-300 font-semibold">Clinical AI Assessment</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 leading-tight">
                AXONOVA provides AI-assisted image assessment for educational and clinical decision-support demonstration. AI outputs should not be used as a standalone diagnosis. Final interpretation must be performed by a qualified healthcare professional.
              </div>
            </div>
          )}
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Mode Switcher: Assessment Mode vs Learning Mode */}
          <button
            type="button"
            onClick={handleRoleToggle}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              isStudent
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
          >
            {isStudent ? (
              <>
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">Learning Mode</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Assessment Mode</span>
              </>
            )}
          </button>

          {/* 3D Brain Anatomy Nav Link (Medical Student Learning Module) */}
          {isStudent && (
            <Link
              to="/student/anatomy"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-semibold transition-colors shadow-sm"
            >
              <Brain className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">3D Anatomy</span>
            </Link>
          )}

          {/* Sequence Compare Nav Link */}
          <Link
            to="/sequence-compare"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-semibold transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden lg:inline">Compare</span>
          </Link>

          {/* Viva Presentation Deck Nav Link */}
          <Link
            to="/viva"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-xs text-teal-300 font-bold transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Viva Deck</span>
          </Link>

          {/* Condition Catalog Nav Link */}
          <Link
            to="/catalog"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-semibold transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden xl:inline">Catalog</span>
          </Link>

          {/* Direct Student Profile Link when in Student Mode */}
          {isStudent && (
            <Link
              to="/student/profile"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-teal-300 font-medium transition-colors shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          )}

          {/* User badge if logged in */}
          {user && (
            <span className="hidden xl:inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              {user.name.split(' ')[0]}
            </span>
          )}

          {/* Sign Out Button */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-xs text-slate-300 hover:text-rose-300 transition-colors shadow-sm"
              title="Sign out of AXONOVA workspace"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
