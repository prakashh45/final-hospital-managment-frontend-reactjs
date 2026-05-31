/* ============================================
   helpers.js — Utility Helper Functions
   ============================================
   Shared utility functions used across the app:
   date formatting, string helpers, file downloads.
   ============================================ */

/**
 * Format an ISO date string into a human-readable format.
 * @param {string} dateStr - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '—';
  const defaults = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Date(dateStr).toLocaleDateString('en-US', defaults);
}

/**
 * Format a date with time included.
 * @param {string} dateStr - ISO date string
 * @returns {string} e.g. "Jan 15, 2025, 2:30 PM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago").
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const now = new Date();
  const past = new Date(dateStr);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get initials from a full name (e.g., "John Doe" → "JD").
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Download a blob as a file (used for PDF downloads).
 * @param {Blob} blob - The file blob
 * @param {string} filename - Desired filename
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Extract a user-friendly error message from backend error responses.
 * Backend format: { timestamp, status, error, message, details }
 * @param {Error|object} error - Axios error or raw error object
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Build query string from an object of params (skips null/undefined/empty).
 * @param {object} params
 * @returns {string} e.g. "?search=john&status=ACTIVE"
 */
export function buildQueryString(params) {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  );
  if (filtered.length === 0) return '';
  return '?' + new URLSearchParams(Object.fromEntries(filtered)).toString();
}

/**
 * Get a color class for a status badge.
 * @param {string} status
 * @returns {string} Tailwind class string
 */
export function getStatusColor(status) {
  const colors = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    STABLE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    CONFIRMED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
    HIGH: 'bg-red-500/20 text-red-400 border-red-500/30',
    OVERDUE: 'bg-red-500/20 text-red-400 border-red-500/30',
    PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DRAFT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DISCHARGED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    RESOLVED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    LOW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    CANCELLED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };
  return colors[status] || 'bg-white/10 text-white/60 border-white/10';
}
