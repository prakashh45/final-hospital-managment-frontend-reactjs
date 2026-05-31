/* ============================================
   ErrorMessage.jsx — Error Display Component
   ============================================
   Shows error messages from the backend in a
   styled alert box. Supports the backend's
   error format: { message, details, status }.
   ============================================ */

import { AlertCircle, X } from 'lucide-react';

/**
 * ErrorMessage — displays an error alert.
 *
 * @param {string} message - The error message to display
 * @param {Function} onDismiss - Optional callback to dismiss the error
 * @param {string} className - Additional classes
 */
export default function ErrorMessage({ message, onDismiss, className = '' }) {
  if (!message) return null;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 ${className}`}>
      {/* Error Icon */}
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />

      {/* Message */}
      <p className="text-sm text-red-300 flex-1">{message}</p>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400/60 hover:text-red-400 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
