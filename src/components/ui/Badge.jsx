/* ============================================
   Badge.jsx — Status Badge Component
   ============================================
   Small colored label for statuses, priorities,
   and categories. Auto-colors based on value.
   ============================================ */

import { getStatusColor } from '../../utils/helpers';

/**
 * Badge — inline status/priority indicator.
 *
 * @param {string} children - Badge text
 * @param {string} variant - Custom color variant (overrides auto-color)
 * @param {string} className - Additional classes
 */
export default function Badge({ children, variant, className = '' }) {
  // Auto-determine color from text if no variant given
  const colorClasses = variant || getStatusColor(children);

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium
        border ${colorClasses} ${className}
      `}
    >
      {children}
    </span>
  );
}
