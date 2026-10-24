import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Activity,
  User,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Stethoscope,
  Zap,
  Check,
} from 'lucide-react';
import { api } from '../api/client';
import { useUser } from '../context/UserContext';
import { AxonovaLogo } from '../components/common/AxonovaLogo';

type AuthView = 'login' | 'register' | 'forgot';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, isLoggedIn, user } = useUser();

  const [view, setView] = useState<AuthView>('login');

  // Form Fields - Login
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('axonova_remember_email') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return !!localStorage.getItem('axonova_remember_email');
    } catch {
      return true;
    }
  });

  // Form Fields - Register
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Form Fields - Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResponse, setForgotResponse] = useState<{ configured: boolean; message: string; detail?: string } | null>(null);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Interactive User Words & Features
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<number>(0);
  const [demoSelected, setDemoSelected] = useState<'student' | 'clinician' | null>(null);

  const interactiveFeatures = [
    {
      id: 'learning',
      icon: GraduationCap,
      label: 'Student Hub',
      title: 'Interactive Medical Training',
      summary: 'Sharpen your diagnostic acumen with real patient cases, visual MRI anatomy modules, and dynamic quiz challenges.',
      badge: 'Interactive Learning',
    },
    {
      id: 'gradcam',
      icon: Zap,
      label: 'AI Interpretability',
      title: 'Real-Time Grad-CAM Saliency',
      summary: 'Watch the neural network reveal exactly which tissue textures and morphological borders trigger each classification.',
      badge: 'Explainable AI',
    },
    {
      id: 'privacy',
      icon: ShieldCheck,
      label: 'Safe & Secure',
      title: 'Privacy-First Architecture',
      summary: 'Client-side image sanitization, strict format validation, and isolated academic research guardrails built-in.',
      badge: '100% Educational',
    },
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoggedIn && user) {
      const fromPath = (location.state as any)?.from?.pathname;
      if (fromPath && fromPath !== '/login') {
        navigate(fromPath, { replace: true });
      } else {
        const dest = user.role === 'student' ? '/student' : '/tasks';
        navigate(dest, { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate, location]);

  // Clear feedback when changing views
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setForgotResponse(null);
  }, [view]);

  // Quick Demo Auto-Fill
  const handleQuickDemo = (role: 'student' | 'clinician') => {
    setDemoSelected(role);
    if (role === 'student') {
      setEmail('student@gmail.com');
      setPassword('student123');
      setSuccessMsg('Loaded Medical Student credentials! Click "Sign In" below.');
    } else {
      setEmail('doctor@gmail.com');
      setPassword('doctor123');
      setSuccessMsg('Loaded Clinician credentials! Click "Sign In" below.');
    }
    setView('login');
  };

  // Form Submissions - Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const isClinician =
        email.toLowerCase().includes('patient') ||
        email.toLowerCase().includes('doctor') ||
        email.toLowerCase().includes('clinician') ||
        email.toLowerCase().includes('vance') ||
        email.toLowerCase().includes('admin');

      const res = await api.login({
        identifier: email.trim(),
        password,
        role: isClinician ? 'patient' : 'student',
      });

      if (rememberMe) {
        localStorage.setItem('axonova_remember_email', email.trim());
      } else {
        localStorage.removeItem('axonova_remember_email');
      }

      loginUser(res.user, res.token);
      setSuccessMsg('Sign in successful. Welcome aboard!');

      setTimeout(() => {
        const fromPath = (location.state as any)?.from?.pathname;
        if (fromPath && fromPath !== '/login') {
          navigate(fromPath, { replace: true });
        } else {
          const dest = res.user.role === 'student' ? '/student' : '/tasks';
          navigate(dest, { replace: true });
        }
      }, 300);
    } catch (err: any) {
      const detail =
        err.response?.data?.detail || err.message || 'Unable to sign in. Please verify your credentials.';
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  // Form Submissions - Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.register({
        name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: 'student',
        institution: 'Medical Center',
      });

      loginUser(res.user, res.token);
      setSuccessMsg('Account created successfully. Redirecting...');
      setTimeout(() => {
        const dest = res.user.role === 'student' ? '/student' : '/tasks';
        navigate(dest, { replace: true });
      }, 350);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Registration failed. Please try again.';
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  // Form Submissions - Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setForgotResponse(null);

    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setForgotResponse(res);
      if (res.configured) {
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Password recovery request failed.';
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050c0a] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans overflow-hidden px-4 py-8">
      {/* ========================================================================= */}
      {/* 3D NEON GREEN FLOATING GEOMETRY & AMBIENT ATMOSPHERE                     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Deep ambient background green mesh */}
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-emerald-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-teal-600/20 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/15 rounded-full blur-[130px]" />

        {/* Top-Center Glowing Radiant Emerald Orb */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-gradient-to-b from-emerald-400 via-teal-500 to-green-600 blur-[3px] opacity-75 shadow-[0_0_100px_rgba(16,185,129,0.55)]" />

        {/* Bottom-Left 3D Torus Ring with Metallic Emerald-Teal-Lime Neon Gradient */}
        <svg
          className="absolute -bottom-14 -left-14 w-84 h-84 sm:w-96 sm:h-96 opacity-90 transition-transform duration-1000"
          viewBox="0 0 240 240"
          fill="none"
        >
          <defs>
            <linearGradient id="torusGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <filter id="torusGlowGreen" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#10b981" floodOpacity="0.45" />
            </filter>
          </defs>
          <circle
            cx="120"
            cy="120"
            r="72"
            stroke="url(#torusGradGreen)"
            strokeWidth="38"
            filter="url(#torusGlowGreen)"
            transform="rotate(-28 120 120)"
          />
        </svg>

        {/* Right 3D Curved Tubular Neon Ribbon (Mint to Electric Emerald/Teal) */}
        <svg
          className="absolute -top-8 -right-16 w-[420px] h-[720px] opacity-85 select-none"
          viewBox="0 0 400 700"
          fill="none"
        >
          <defs>
            <linearGradient id="ribbonGradGreen" x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#059669" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <filter id="ribbonGlowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-8" dy="16" stdDeviation="22" floodColor="#10b981" floodOpacity="0.4" />
            </filter>
          </defs>
          <path
            d="M 330,20 C 430,160 360,320 280,410 C 200,500 250,610 370,680"
            stroke="url(#ribbonGradGreen)"
            strokeWidth="48"
            strokeLinecap="round"
            fill="none"
            filter="url(#ribbonGlowGreen)"
          />
        </svg>

        {/* Subtle high-tech emerald micro dot overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* ========================================================================= */}
      {/* CENTERED GLASSMORPHISM CONTAINER                                          */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-4xl w-full mx-auto">
        {/* Soft glass rim light glow in emerald & teal */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-green-500/20 rounded-[36px] blur-2xl opacity-75 pointer-events-none" />

        {/* The Translucent Frosted Glass Card */}
        <div className="relative rounded-[32px] bg-slate-950/60 backdrop-blur-3xl border border-emerald-500/20 p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(52,211,153,0.2)] overflow-hidden">
          
          {/* TOP RIGHT CAPSULE BADGE ("Welcome back 🔒") */}
          <div className="flex items-center justify-between mb-8">
            {/* Top Left Project Name & Emblem */}
            <div className="flex items-center space-x-2.5">
              <AxonovaLogo size="sm" showText={false} />
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-emerald-400 uppercase">
                AXONOVA
              </span>
            </div>

            {/* Top Right Capsule Pill in Green Theme */}
            <div className="flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs text-white backdrop-blur-md shadow-md select-none">
              <span className="font-medium text-[11px] sm:text-xs tracking-wide text-emerald-200">
                {view === 'login' ? 'Welcome Back' : view === 'register' ? 'New Account' : 'Account Recovery'}
              </span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
                <Lock className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Error Feedback Alert */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start space-x-2.5 text-rose-300 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-400" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* Success Feedback Alert */}
          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-start space-x-2.5 text-emerald-200 text-xs animate-in fade-in duration-150 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
              <span className="leading-snug">{successMsg}</span>
            </div>
          )}

          {/* TWO-COLUMN INTERIOR SPLIT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* --------------------------------------------------------------------- */}
            {/* LEFT COLUMN: TITLE, EMERALD ACCENT BAR, AND FORM                     */}
            {/* --------------------------------------------------------------------- */}
            <div className="md:col-span-7 space-y-6">
              {/* Title & Accent Underline Bar */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {view === 'login' && 'Sign in to Axonova'}
                  {view === 'register' && 'Join the Platform'}
                  {view === 'forgot' && 'Reset Password'}
                </h1>
                {/* Two-tone accent bar: Emerald to Teal & Mint */}
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 rounded-full mt-2.5 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>

              {/* Quick Interactive Demo Credentials Loader */}
              {view === 'login' && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>One-Click Interactive Demo</span>
                    </span>
                    <span className="text-[10px] text-emerald-300/70">Instant Login</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('student')}
                      className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer border ${
                        demoSelected === 'student'
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-white/[0.04] text-emerald-200 border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Demo Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('clinician')}
                      className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer border ${
                        demoSelected === 'clinician'
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-white/[0.04] text-emerald-200 border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10'
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Demo Clinician</span>
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 1: SIGN IN FORM */}
              {view === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setDemoSelected(null);
                        }}
                        placeholder="student@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-emerald-500/30 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                      />
                      <span className="text-slate-300">Remember my session</span>
                    </label>
                  </div>

                  {/* Sign In Button with emerald green gradient */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-4"
                  >
                    {loading ? (
                      <Activity className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* VIEW 2: REGISTRATION FORM */}
              {view === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Alex Chen"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-4"
                  >
                    {loading ? (
                      <Activity className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* VIEW 3: FORGOT PASSWORD */}
              {view === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-500/[0.04] focus:ring-2 focus:ring-emerald-500/25 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  {forgotResponse && (
                    <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                      <p className="font-semibold">{forgotResponse.message}</p>
                      {forgotResponse.detail && (
                        <p className="text-slate-400 text-[11px]">{forgotResponse.detail}</p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-4"
                  >
                    {loading ? (
                      <Activity className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="w-full py-2 text-xs text-slate-400 hover:text-emerald-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                </form>
              )}

              {/* Bottom Toggle Between Sign In and Register */}
              {view !== 'forgot' && (
                <div className="pt-2 text-left">
                  {view === 'login' ? (
                    <p className="text-xs text-slate-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setView('register')}
                        className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 hover:underline cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setView('login')}
                        className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: INTERACTIVE USER WORDS & WORKSTATION INSIGHTS           */}
            {/* --------------------------------------------------------------------- */}
            <div className="hidden md:flex md:col-span-5 flex-col justify-between h-full space-y-6 pl-4 border-l border-emerald-500/20">
              
              {/* Header Status & Interactive Prompt */}
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Workstation Active</span>
                </div>
                
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Explore Brain MRI Intelligence
                </h2>
                
                <p className="text-xs text-slate-300/80 leading-relaxed">
                  Select an interactive feature below to preview how AXONOVA assists your clinical learning and research workflow.
                </p>
              </div>

              {/* Interactive Feature Cards (Clickable tabs) */}
              <div className="space-y-2.5">
                {interactiveFeatures.map((feat, index) => {
                  const Icon = feat.icon;
                  const isActive = activeInteractiveTab === index;
                  return (
                    <div
                      key={feat.id}
                      onClick={() => setActiveInteractiveTab(index)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                          : 'bg-white/[0.02] border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {feat.title}
                          </span>
                        </div>
                        {isActive && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300/80 leading-relaxed pl-8">
                        {feat.summary}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Quick Tip Callout */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-sm flex items-start space-x-2.5 text-xs text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-emerald-300">Interactive Tip:</span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    Click the <strong className="text-emerald-400 font-semibold">Demo Student</strong> or <strong className="text-emerald-400 font-semibold">Demo Clinician</strong> buttons on the left to instantly test live scan analysis or study modules.
                  </p>
                </div>
              </div>

              {/* Bottom Right "Secure & Encrypted" Capsule Badge */}
              <div className="flex justify-end pt-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 shadow-md backdrop-blur-md select-none">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-medium text-[11px] tracking-wide">Encrypted & Protected</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
