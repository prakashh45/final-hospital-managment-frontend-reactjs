/* ============================================
   DashboardLayout.jsx — AarogyKendra Layout
   ============================================
   Combines Sidebar + Topbar + content area
   with slate-950 dark theme.
   ============================================ */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * DashboardLayout — main authenticated layout.
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* ── Sidebar ────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main Content Area ──────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
