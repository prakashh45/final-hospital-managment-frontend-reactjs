/* ============================================
   Loader.jsx — Loading Spinner Component
   ============================================
   Animated loading indicator with optional text.
   Used for page loads, button states, etc.
   ============================================ */

import { Loader2 } from 'lucide-react';

/**
 * Loader — animated spinning indicator.
 *
 * @param {'sm'|'md'|'lg'} size - Spinner size
 * @param {string} text - Optional loading text
 * @param {string} className - Additional classes
 */
export default function Loader({ size = 'md', text, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} text-white/60 animate-spin`} />
      {text && (
        <p className="text-sm text-white/40 animate-pulse">{text}</p>
      )}
    </div>
  );
}
