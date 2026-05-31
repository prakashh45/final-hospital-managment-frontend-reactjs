/* ============================================
   ForgotPasswordPage.jsx — Aurora Forgot Password
   ============================================
   Two-column layout matching Login/Register:
   - Left  (52%)   : Hero video + brand
   - Right (flex-1): Email form

   API binding:
     POST /api/auth/forgot-password
     Body: { email }
     → 200 OK (email sent)

   States:
     default → email input form
     success → confirmation card showing email
   ============================================ */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Circle, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send reset link. Please try again.'
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
            Reset Access
          </motion.h1>
          <motion.p className="text-sm text-white/60" variants={childVariants}>
            We'll send a secure link straight to your inbox.
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

          {/* ── Form State ── */}
          {!success ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-medium text-white">Reset Password</h2>
                <p className="text-sm text-white/40">
                  Enter your email and we'll send you a link to reset your password.
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="doctor@aurora.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-11 w-full rounded-xl border-none bg-brand-gray pl-10 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
                    />
                  </div>
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
                      Sending…
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </form>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to log in
                </Link>
              </div>
            </div>

          ) : (

            /* ── Success State ── */
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
                <h2 className="text-3xl font-medium text-white">Check your email</h2>
                <p className="text-sm text-white/40">
                  We have sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-white">{email}</p>
              </div>
              <p className="text-xs text-white/30">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-white/50 hover:text-white underline transition-colors"
                >
                  try again
                </button>
                .
              </p>
              <Link
                to="/login"
                className="flex h-14 items-center justify-center w-full rounded-xl border border-white/15 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Return to Login
              </Link>
            </motion.div>
          )}

        </motion.div>
      </div>
    </main>
  );
}