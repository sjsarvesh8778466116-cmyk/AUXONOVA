import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  LineChart,
  Database,
  HelpCircle,
  Info,
  Sliders,
  Layers,
  GraduationCap,
  Brain,
  FolderKanban,
  TrendingUp,
  Cpu,
  ArrowRight,
  Columns2,
  Presentation,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { isStudent, setRole } = useUser();
  const navigate = useNavigate();

  const patientNavItems = [
    { to: '/', label: t('nav.home'), icon: LayoutDashboard, end: true },
    { to: '/scans', label: 'Scan Assessment', icon: Scan },
    { to: '/sequence-compare', label: 'Sequence Comparison', icon: Columns2 },
    { to: '/catalog', label: 'Condition Catalog', icon: Layers },
    { to: '/model-coverage', label: 'Model Coverage Matrix', icon: Cpu },
    { to: '/evaluation', label: t('nav.evaluation'), icon: LineChart },
    { to: '/dataset', label: t('nav.dataset'), icon: Database },
    { to: '/how-it-works', label: t('nav.how_it_works'), icon: HelpCircle },
    { to: '/about', label: t('nav.about'), icon: Info },
    { to: '/settings', label: t('nav.settings'), icon: Sliders },
  ];

  const studentNavItems = [
    { to: '/', label: 'Research Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student', label: 'Student Dashboard', icon: GraduationCap },
    { to: '/student/anatomy', label: '3D Brain Anatomy', icon: Brain },
    { to: '/quizzes', label: 'Quiz & Exam Center', icon: HelpCircle },
    { to: '/viva', label: 'AI Viva Coach & Defense', icon: Presentation },
    { to: '/student/cases', label: 'Case Library & Practice', icon: FolderKanban },
    { to: '/student/features', label: 'Learn MRI Features', icon: Layers },
    { to: '/student/journey', label: 'CNN Visual Journey', icon: Cpu },
    { to: '/student/tumors', label: 'Brain Tumor Classes', icon: Brain },
    { to: '/student/profile', label: 'Progress & Revision', icon: TrendingUp },
    { to: '/scans', label: 'AI Scan Center', icon: Scan },
    { to: '/catalog', label: 'Condition Catalog', icon: Layers },
  ];

  const navItems = isStudent ? studentNavItems : patientNavItems;

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-slate-800 bg-[#0a0f1d] min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shadow-sm">
      <div className="space-y-4">
        {/* Role Header Banner */}
        <div className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isStudent ? 'bg-teal-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-bold text-white">
              {isStudent ? 'Medical Student Lab' : 'Clinical Workstation'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isStudent) {
                setRole('patient');
                navigate('/tasks');
              } else {
                setRole('student');
                navigate('/student');
              }
            }}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold underline font-mono"
          >
            Switch
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-teal-300 border border-teal-500/50 font-bold shadow-teal-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Role Switch Callout Widget */}
      <div className="mt-8 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2.5">
        <div className="flex items-center space-x-2 text-white font-semibold">
          {isStudent ? (
            <>
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>Medical Student Lab</span>
            </>
          ) : (
            <>
              <Scan className="w-4 h-4 text-teal-400" />
              <span>Clinical MRI Workstation</span>
            </>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isStudent
            ? 'Interactive curriculum, Grad-CAM attention visualizers, and clinical cases.'
            : 'Multi-condition neuroimaging analysis, preprocessing pipelines, and evaluation metrics.'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (isStudent) {
              setRole('patient');
              navigate('/tasks');
            } else {
              setRole('student');
              navigate('/student');
            }
          }}
          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-glow"
        >
          <span>{isStudent ? 'Open Clinical Workstation' : 'Open Student Lab'}</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
