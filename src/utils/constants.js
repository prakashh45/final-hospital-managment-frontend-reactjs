/* ============================================
   constants.js — AarogyKendra Constants
   ============================================
   Centralized constants: roles, statuses,
   navigation items for Doctor & Nurse only.
   ============================================ */

// ── User Roles ────────────────────────────────
export const ROLES = {
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT',
};

// ── API Endpoints ─────────────────────────────
export const API = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  NURSE_DASHBOARD: '/nurse/dashboard',
  NURSE_WARD_PATIENTS: '/nurse/ward-patients',
  NURSE_NOTES: '/nurse/notes',
  PATIENTS: '/patients',
  PATIENT_SEARCH: '/patients/search',
  DIAGNOSES: '/diagnoses',
  PRESCRIPTIONS: '/prescriptions',
  VITALS: '/vitals',
  QUEUE: '/queue',
  TASKS: '/tasks',
};

// ── Patient Statuses ──────────────────────────
export const PATIENT_STATUS = {
  ACTIVE: 'ACTIVE',
  DISCHARGED: 'DISCHARGED',
  CRITICAL: 'CRITICAL',
  STABLE: 'STABLE',
};

// ── Diagnosis Priority ────────────────────────
export const DIAGNOSIS_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

// ── Diagnosis Status ──────────────────────────
export const DIAGNOSIS_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  RESOLVED: 'RESOLVED',
};

// ── Prescription Status ───────────────────────
export const PRESCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// ── AI Risk Levels ────────────────────────────
export const RISK_LEVELS = {
  HIGH: { label: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', glow: 'glow-red' },
  MEDIUM: { label: 'Medium Risk', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', glow: '' },
  LOW: { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', glow: 'glow-emerald' },
};

// ── Sidebar Navigation Items by Role ──────────
export const NAV_ITEMS = {
  [ROLES.DOCTOR]: [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: 'LayoutDashboard' },
    { label: 'AI Insights', path: '/doctor/ai-insights', icon: 'Brain' },
    { label: 'Appointments', path: '/appointments', icon: 'CalendarDays' },
    { label: 'Patients', path: '/patients', icon: 'Users' },
    { label: 'Diagnoses', path: '/diagnoses', icon: 'Stethoscope' },
    { label: 'Prescriptions', path: '/prescriptions', icon: 'Pill' },
    { label: 'Queue', path: '/queue', icon: 'ListOrdered' },
  ],
  [ROLES.NURSE]: [
    { label: 'Dashboard', path: '/nurse/dashboard', icon: 'LayoutDashboard' },
    { label: 'Appointments', path: '/appointments', icon: 'CalendarDays' },
    { label: 'Patients', path: '/patients', icon: 'Users' },
    { label: 'Vitals', path: '/vitals', icon: 'HeartPulse' },
    { label: 'Tasks', path: '/tasks', icon: 'ClipboardList' },
    { label: 'Queue', path: '/queue', icon: 'ListOrdered' },
  ],
  [ROLES.PATIENT]: [
    { label: 'Dashboard', path: '/my/dashboard', icon: 'LayoutDashboard' },
    { label: 'Appointments', path: '/my/appointments', icon: 'CalendarDays' },
    { label: 'Prescriptions', path: '/my/prescriptions', icon: 'Pill' },
    { label: 'Health Records', path: '/my/records', icon: 'FileHeart' },
    { label: 'Lab Reports', path: '/my/lab-reports', icon: 'TestTube' },
    { label: 'My Doctors', path: '/my/doctors', icon: 'UserCheck' },
    { label: 'AI Insights', path: '/my/ai-insights', icon: 'Brain' },
    { label: 'Settings', path: '/my/settings', icon: 'Settings' },
    { label: 'Notifications', path: '/my/notifications', icon: 'BellRing' },
  ],
};
