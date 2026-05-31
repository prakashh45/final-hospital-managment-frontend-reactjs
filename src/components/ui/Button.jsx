/* ============================================
   Button.jsx — Reusable Button Component
   ============================================
   Styled button with variants, sizes, loading
   state, and icon support. Follows Aurora theme.
   ============================================ */

import { Loader2 } from 'lucide-react';

/**
 * Button — primary interactive element.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - Shows spinner and disables button
 * @param {React.ReactNode} icon - Optional leading icon
 * @param {boolean} fullWidth - Stretch to 100% width
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) {
  // ── Variant Styles ────────────────────────
  const variants = {
    primary: 'bg-white text-black hover:bg-white/90 active:scale-[0.98]',
    secondary: 'bg-brand-gray text-white border border-white/10 hover:bg-white/10',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  };

  // ── Size Styles ───────────────────────────
  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
    md: 'h-11 px-5 text-sm rounded-xl gap-2',
    lg: 'h-14 px-6 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
