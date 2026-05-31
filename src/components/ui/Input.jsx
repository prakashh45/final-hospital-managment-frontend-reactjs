/* ============================================
   Input.jsx — Reusable Input Component
   ============================================
   Updated for AarogyKendra: White background,
   slate text, visible placeholders, cyan ring.
   ============================================ */

import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      {/* Input Field */}
      <input
        ref={ref}
        className={`
          w-full rounded-xl bg-white px-4 py-2.5 text-sm
          text-slate-800 placeholder:text-slate-400
          border border-slate-200 outline-none
          transition-all duration-200
          focus:ring-2 focus:border-cyan-400 focus:ring-cyan-400/30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-400 font-medium ml-1">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
