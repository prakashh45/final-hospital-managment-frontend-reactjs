/* ============================================
   Card.jsx — AarogyKendra Card Components
   ============================================
   Premium glassmorphism cards with glow effects
   and cyan/blue medical accent colors.
   ============================================ */

/**
 * Card — container with glassmorphism and glow.
 */
export default function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  glass = false,
  glow = '',
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${glass
          ? 'glass-card'
          : 'bg-slate-900/80 border border-slate-700/50'
        }
        ${glow}
        ${className}
      `}
      {...props}
    >
      {/* Card Header */}
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-semibold text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && action}
        </div>
      )}

      {/* Card Body */}
      {children}
    </div>
  );
}

/**
 * StatCard — glowing stat card for dashboards.
 */
export function StatCard({ label, value, icon, trend, trendUp, color = 'text-cyan-400', glow = '' }) {
  return (
    <div className={`
      rounded-2xl bg-slate-900/80 border border-slate-700/50 p-5
      hover:border-slate-600/60 transition-all duration-300
      ${glow}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
            trendUp
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/15 text-red-400 border border-red-500/20'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      <p className="text-xs text-slate-400 mt-1.5">{label}</p>
    </div>
  );
}

/**
 * GlowStatCard — stat card with animated glow border for AI metrics.
 */
export function GlowStatCard({ label, value, icon, color = 'text-cyan-400', glowColor = 'cyan' }) {
  const glowClasses = {
    cyan: 'glow-cyan',
    blue: 'glow-blue',
    emerald: 'glow-emerald',
    red: 'glow-red',
    purple: 'glow-purple',
  };

  return (
    <div className={`
      rounded-2xl bg-slate-900/60 p-5 transition-all duration-500
      hover:scale-[1.02] cursor-default
      ${glowClasses[glowColor] || 'glow-cyan'}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl gradient-cyan flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white tracking-tight">{value ?? '—'}</p>
      <p className="text-xs text-slate-400 mt-1.5 font-medium">{label}</p>
    </div>
  );
}
