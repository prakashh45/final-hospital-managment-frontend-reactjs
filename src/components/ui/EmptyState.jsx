/* ============================================
   EmptyState.jsx — Empty State Component
   ============================================
   Displayed when a list/table has no data.
   Shows an icon, title, description, and
   optional action button.
   ============================================ */

import { Inbox } from 'lucide-react';

/**
 * EmptyState — placeholder for empty data views.
 *
 * @param {string} title - Main heading
 * @param {string} description - Supporting text
 * @param {React.ReactNode} icon - Custom icon (defaults to Inbox)
 * @param {React.ReactNode} action - Optional action button/link
 */
export default function EmptyState({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-white/20" />}
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-white/70 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-sm text-white/30 text-center max-w-sm mb-6">{description}</p>

      {/* Optional Action */}
      {action && action}
    </div>
  );
}
