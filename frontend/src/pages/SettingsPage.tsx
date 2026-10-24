import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Globe,
  History,
  Trash2,
  Lock,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHistory } from '../context/HistoryContext';
import { useUser } from '../context/UserContext';
import { api } from '../api/client';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { history, clearHistory } = useHistory();
  const { user, profile, logoutUser, isLoggedIn } = useUser();

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('nav.settings')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage localization, session history, and zero-retention privacy options.
        </p>
      </div>

      <DisclaimerBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preferences (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Session & Account Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Active Session</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                {profile.role === 'student' ? 'Medical Student' : 'Clinician'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <p className="text-xs font-bold text-white">{profile.name}</p>
              <p className="text-[11px] text-slate-400 font-mono truncate">{profile.email || 'institutional@axonova.edu'}</p>
              <p className="text-[10px] text-slate-500">{profile.title}</p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Workstation</span>
            </button>
          </div>
          {/* Language Preference Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                Interface Language
              </h3>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-teal-500/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">English</span>
                <span className="text-[11px] text-slate-400 block">Standardized Clinical & Medical Terminology</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold uppercase">
                Active
              </span>
            </div>
          </div>

          {/* Privacy & Retention Information */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs text-slate-300 shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Zero-Storage Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              AXONOVA operates strictly in volatile memory. Uploaded MRI scans are processed instantaneously and never persisted to server disks or transmitted to third-party endpoints.
            </p>
          </div>
        </div>

        {/* Right Column: Temporary Session History (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                Temporary Session History ({history.length})
              </h3>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <p className="font-semibold text-slate-300">No scans analyzed during this browser session yet.</p>
              <p className="text-[11px] text-slate-500">History will populate automatically as you run model classifications in the Scan Center.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors shadow-xs"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <img
                      src={item.previewUrl}
                      alt={item.filename}
                      className="w-10 h-10 rounded-lg object-cover bg-black border border-slate-800 shrink-0"
                    />
                    <div className="truncate space-y-0.5">
                      <p className="font-bold text-white truncate">{item.filename}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString()} • Model Classification: {item.prediction.predicted_category} ({(item.prediction.model_score * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono font-semibold shrink-0 ml-2">
                    {item.prediction.orientation_label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
