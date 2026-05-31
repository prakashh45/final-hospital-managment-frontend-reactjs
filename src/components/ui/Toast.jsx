/* ============================================
   Toast.jsx — Toast Notification System
   ============================================
   Modern toast notifications replacing alert().
   Supports success, error, info, warning.
   Auto-dismiss with smooth animations.
   ============================================ */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ── Toast Context ─────────────────────────────
const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-cyan-400" />,
};

const STYLES = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-cyan-500/30 bg-cyan-500/10',
};

let toastIdCounter = 0;

/**
 * ToastProvider — wraps the app to provide toast functionality.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, duration, exiting: false }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback(
    {
      success: (msg, dur) => addToast(msg, 'success', dur),
      error: (msg, dur) => addToast(msg, 'error', dur),
      warning: (msg, dur) => addToast(msg, 'warning', dur),
      info: (msg, dur) => addToast(msg, 'info', dur),
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Individual toast item with auto-dismiss.
 */
function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border
        backdrop-blur-md shadow-2xl max-w-sm min-w-[300px]
        ${STYLES[toast.type] || STYLES.info}
        ${toast.exiting ? 'toast-exit' : 'toast-enter'}
      `}
    >
      <div className="shrink-0 mt-0.5">{ICONS[toast.type]}</div>
      <p className="text-sm text-white/90 flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 text-white/30 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Hook to access toast methods.
 * Returns { success, error, warning, info }
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
