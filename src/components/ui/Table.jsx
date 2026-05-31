/* ============================================
   Table.jsx — Reusable Data Table Component
   ============================================
   Responsive data table with hover effects,
   loading skeleton, and empty state.
   ============================================ */

import Loader from './Loader';
import EmptyState from './EmptyState';

/**
 * Table — data table with column definitions.
 *
 * @param {Array<{key, label, render?}>} columns - Column definitions
 * @param {Array<object>} data - Row data array
 * @param {boolean} loading - Show skeleton loader
 * @param {string} emptyTitle - Title for empty state
 * @param {string} emptyDescription - Description for empty state
 * @param {Function} onRowClick - Optional row click handler
 */
export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  onRowClick,
}) {
  // ── Loading State ─────────────────────────
  if (loading) {
    return (
      <div className="py-12">
        <Loader text="Loading data..." />
      </div>
    );
  }

  // ── Empty State ───────────────────────────
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
      <table className="w-full text-sm">
        {/* Table Head */}
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-white/[0.04]">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-white/80">
                  {/* Use custom render function or fall back to raw value */}
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
