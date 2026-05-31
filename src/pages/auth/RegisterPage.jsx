/* ============================================
   RegisterPage.jsx — Aurora Sign Up Page
   ============================================
   Two-column layout:
   - Left  (52%)   : Hero video + 3-step guide
   - Right (flex-1): Registration form

   API binding:
     POST /api/auth/register
     Body: { firstName, lastName, username,
             email, password, role }
     → redirects to /login on success
   ============================================ */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Circle, Chrome, Github, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { authAPI } from '../../api/client';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4';

/* ── Sub-components ── */
function StepItem({ number, text, active }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
        active
          ? 'border-white bg-white text-black'
          : 'border-transparent bg-brand-gray text-white'
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          active ? 'bg-black text-white' : 'bg-white/10 text-white/40'
        }`}
      >
        {number}
      </span>
      <span>{text}</span>
    </div>
  );
}

function SocialButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black text-sm font-medium text-white transition-colors hover:bg-white/5 cursor-pointer"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    username:  '',
    email:     '',
    password:  '',
    role:      '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    /* Basic client-side validation */
    if (!form.role) {
      setError('Please select a role to continue.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        firstName: form.firstName,
        lastName:  form.lastName,
        username:  form.username,
        email:     form.email,
        password:  form.password,
        role:      form.role,
      });
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
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
            Join Aurora
          </motion.h1>
          <motion.p className="text-sm text-white/60" variants={childVariants}>
            Follow these 3 quick phases to activate your space.
          </motion.p>
          <motion.div className="space-y-3" variants={childVariants}>
            <StepItem number={1} text="Register your identity" active />
            <StepItem number={2} text="Configure your studio"  active={false} />
            <StepItem number={3} text="Finalize your profile"  active={false} />
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
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-medium text-white">Create New Profile</h2>
            <p className="text-sm text-white/40">
              Input your basic details to begin the journey.
            </p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <SocialButton icon={Chrome} label="Google" />
            <SocialButton icon={Github} label="Github" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30">Or</span>
            <div className="h-px flex-1 bg-white/10" />
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <input
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
                />
              </Field>
              <Field label="Last Name">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
                />
              </Field>
            </div>

            {/* Username */}
            <Field label="Username">
              <input
                name="username"
                type="text"
                placeholder="johndoe123"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
              />
            </Field>

            {/* Email */}
            <Field label="Email">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
              />
            </Field>

            {/* Password */}
            <Field label="Password">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 pr-11 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Role */}
            <Field label="Role">
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="h-11 w-full appearance-none rounded-xl border-none bg-brand-gray px-4 text-white focus:ring-2 focus:ring-white/20 outline-none"
                >
                  <option value="" disabled>Select a role</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PATIENT">Patient</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              </div>
            </Field>

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
                  Creating Account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-white/40">
            Member of the team?{' '}
            <Link to="/login" className="text-white underline underline-offset-2 hover:text-white/80">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}