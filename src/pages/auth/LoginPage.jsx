/* ============================================
   LoginPage.jsx — AarogyKendra Sign In
   ============================================
   Premium login page with medical branding,
   cyan/blue theme, visible input fields.
   ============================================ */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Activity, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4';

function getDashboardPath(role) {
  switch (role) {
    case 'DOCTOR':  return '/doctor/dashboard';
    case 'NURSE':   return '/nurse/dashboard';
    case 'PATIENT': return '/my/dashboard';
    default:        return '/doctor/dashboard';
  }
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsPatient, error: authError, clearError } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [localError, setLocalError]     = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError?.();
    setLoading(true);
    try {
      const userData = await login({
        username: form.username,
        email:    form.email,
        password: form.password,
      });
      navigate(getDashboardPath(userData.role), { replace: true });
    } catch (err) {
      setLocalError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const childVariants = {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="flex min-h-screen w-full bg-slate-950 p-2 transition-all duration-500 selection:bg-cyan-500/30 lg:h-screen lg:overflow-hidden lg:p-4">

      {/* ── Left Column — Hero Video ── */}
      <div className="relative hidden w-[52%] flex-col items-center justify-end overflow-hidden rounded-3xl pb-32 px-12 shadow-2xl lg:flex h-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />

        <motion.div
          className="z-10 w-full max-w-xs space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex items-center gap-2.5" variants={childVariants}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AarogyKendra</span>
          </motion.div>
          <motion.h1
            className="text-4xl font-medium tracking-tight text-white"
            variants={childVariants}
          >
            AI-Powered Healthcare
          </motion.h1>
          <motion.p className="text-sm text-white/60" variants={childVariants}>
            Smart diagnostics, vitals monitoring, and intelligent medical insights for modern healthcare professionals.
          </motion.p>

          {/* Trust badges */}
          <motion.div className="flex items-center gap-4 pt-2" variants={childVariants}>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Diagnostics</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right Column — Form ── */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-12 lg:px-16 lg:py-6 xl:px-24">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Mobile Brand */}
          <div className="flex items-center gap-2.5 lg:hidden mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AarogyKendra</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-medium text-white">Welcome Back</h2>
            <p className="text-sm text-slate-400">
              Sign in to access the AarogyKendra healthcare dashboard.
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <div className="flex items-start justify-between gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-300">{displayError}</p>
              <button
                type="button"
                onClick={() => { setLocalError(null); clearError?.(); }}
                className="text-red-300/60 hover:text-red-300 text-xs mt-0.5 shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Username">
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="h-11 w-full rounded-xl bg-white px-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40 outline-none border border-slate-200 text-sm"
              />
            </Field>

            <Field label="Email">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="h-11 w-full rounded-xl bg-white px-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40 outline-none border border-slate-200 text-sm"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl bg-white px-4 pr-11 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40 outline-none border border-slate-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400/80 transition-colors hover:text-cyan-400"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing In…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="border-t border-slate-800/60 pt-6">
            <p className="text-center text-xs text-slate-500 mb-4 uppercase tracking-wider font-semibold">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  const demoCredentials = { 
                    username: 'doctor1', 
                    email: 'doctor1@hospital.com', 
                    password: 'Doctor@123',
                    role: 'DOCTOR' 
                  };
                  setForm(demoCredentials);
                  // Fire login directly to bypass needing to press submit
                  setLoading(true);
                  login(demoCredentials).then(userData => {
                    navigate(getDashboardPath(userData.role), { replace: true });
                  }).catch(err => {
                    setLocalError(err.message);
                    setLoading(false);
                  });
                }}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700/50 hover:bg-slate-800 hover:border-cyan-500/50 transition-all text-xs font-medium text-slate-300 hover:text-cyan-400 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" /> Doctor
              </button>
              <button
                type="button"
                onClick={() => {
                  const demoCredentials = { 
                    username: 'nurse2', 
                    email: 'nurse1@hospital.com', 
                    password: 'Nurse@123',
                    role: 'NURSE' 
                  };
                  setForm(demoCredentials);
                  setLoading(true);
                  login(demoCredentials).then(userData => {
                    navigate(getDashboardPath(userData.role), { replace: true });
                  }).catch(err => {
                    setLocalError(err.message);
                    setLoading(false);
                  });
                }}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/50 transition-all text-xs font-medium text-slate-300 hover:text-emerald-400 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" /> Nurse
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  loginAsPatient().then(userData => {
                    navigate(getDashboardPath(userData.role), { replace: true });
                  }).catch(err => {
                    setLocalError(err.message);
                    setLoading(false);
                  });
                }}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700/50 hover:bg-slate-800 hover:border-purple-500/50 transition-all text-xs font-medium text-slate-300 hover:text-purple-400 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Patient
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            New here?{' '}
            <Link to="/register" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}