/* ============================================
   ResetPasswordPage.jsx — Aurora Reset Password
   ============================================
   Two-column layout matching Login/Register:
   - Left  (52%)   : Hero video + brand
   - Right (flex-1): New password form

   API binding:
     POST /api/auth/reset-password
     Body: { token, newPassword }
     → 200 OK on success

   URL param:
     /reset-password?token=<JWT_RESET_TOKEN>

   States:
     no token  → error state (invalid link)
     default   → new + confirm password form
     success   → confirmation card → /login
   ============================================ */

import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Circle, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4';

/* ── Password strength helper ── */
function getStrength(pw) {
  if (!pw) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 8)                     score++;
  if (/[A-Z]/.test(pw))                   score++;
  if (/[0-9]/.test(pw))                   score++;
  if (/[^A-Za-z0-9]/.test(pw))            score++;
  const map = [
    { label: '',         color: '',                   width: '0%'   },
    { label: 'Weak',     color: 'bg-red-500',         width: '25%'  },
    { label: 'Fair',     color: 'bg-yellow-500',      width: '50%'  },
    { label: 'Good',     color: 'bg-blue-500',        width: '75%'  },
    { label: 'Strong',   color: 'bg-emerald-500',     width: '100%' },
  ];
  return map[score];
}

export default function ResetPasswordPage() {
  const { resetPassword }       = useAuth();
  const navigate                = useNavigate();
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');

  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const [success, setSuccess]                 = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to reset password. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const childVariants = {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="flex min-h-screen w-full bg-black p-2 transition-all duration-500 selection:bg-white/30 lg:h-screen lg:overflow-hidden lg:p-4">

      {/* ── Left Column — Hero Video ── */}
      <div className="relative hidden w-[52%] flex-col items-center justify-end overflow-hidden rounded-3xl pb-32 px-12 shadow-2xl lg:flex h-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <motion.div
          className="z-10 w-full max-w-xs space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex items-center gap-2" variants={childVariants}>
            <Circle className="h-5 w-5 fill-white text-white" />
            <span className="text-xl font-semibold text-white">Aurora</span>
          </motion.div>
          <motion.h1
            className="text-4xl font-medium tracking-tight text-white"
            variants={childVariants}
          >
            New Password
          </motion.h1>
          <motion.p className="text-sm text-white/60" variants={childVariants}>
            Choose a strong password to keep your account secure.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Right Column ── */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-12 lg:px-16 lg:py-6 xl:px-24">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >

          {/* ── Invalid token ── */}
          {!token && !success && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-white">Invalid Reset Link</h2>
                <p className="text-sm text-white/40">
                  This password reset link is missing or invalid. Please request a new one.
                </p>
              </div>
              <Link
                to="/forgot-password"
                className="flex h-14 items-center justify-center w-full rounded-xl bg-white font-semibold text-black hover:opacity-90 transition-opacity"
              >
                Request New Link
              </Link>
              <Link
                to="/login"
                className="block text-sm text-white/40 hover:text-white transition-colors"
              >
                Return to Login
              </Link>
            </div>
          )}

          {/* ── Form State ── */}
          {token && !success && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-medium text-white">Create New Password</h2>
                <p className="text-sm text-white/40">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start justify-between gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                  <p className="text-sm text-red-300">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-300/60 hover:text-red-300 text-xs mt-0.5 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="h-11 w-full rounded-xl border-none bg-brand-gray pl-10 pr-11 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <p className="text-xs text-white/30">
                        Strength:{' '}
                        <span className="text-white/60">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className={`h-11 w-full rounded-xl border-none bg-brand-gray pl-10 pr-11 text-white placeholder:text-white/20 outline-none focus:ring-2 ${
                        confirmPassword && confirmPassword !== password
                          ? 'ring-2 ring-red-500/50 focus:ring-red-500/50'
                          : 'focus:ring-white/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-400">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-xl bg-white font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Resetting…
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>
            </div>
          )}

          {/* ── Success State ── */}
          {success && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-medium text-white">Password Reset</h2>
                <p className="text-sm text-white/40">
                  Your password has been successfully updated. You can now log in with your new credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex h-14 items-center justify-center w-full rounded-xl bg-white font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer"
              >
                Continue to Login
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </main>
  );
}