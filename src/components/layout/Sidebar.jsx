/* ============================================
   Sidebar.jsx — AarogyKendra Navigation
   ============================================
   Dark slate sidebar with cyan accents,
   medical branding, and role-based nav.
   ============================================ */

import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../utils/constants';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  ListOrdered,
  HeartPulse,
  ClipboardList,
  Brain,
  LogOut,
  X,
  Activity,
  CalendarDays,
  FileHeart,
  TestTube,
  UserCheck,
  Settings,
  BellRing,
} from 'lucide-react';

// ── Icon Map ──────────────────────────────────
const iconMap = {
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  ListOrdered,
  HeartPulse,
  ClipboardList,
  Brain,
  Activity,
  CalendarDays,
  FileHeart,
  TestTube,
  UserCheck,
  Settings,
  BellRing,
};

/**
 * Sidebar — AarogyKendra navigation panel.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = NAV_ITEMS[user?.role] || [];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* ── Mobile Overlay ──────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar Container ───────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-950 border-r border-slate-800/60
          flex flex-col transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Brand Header ────────────────── */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight gradient-text">AarogyKendra</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Role Badge ──────────────────── */}
        <div className="px-5 py-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-dot" />
            {user?.role || 'User'} Panel
          </span>
        </div>

        {/* ── Navigation Links ────────────── */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = iconMap[item.icon] || LayoutDashboard;
            const isActive = location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/');
            const isAI = item.icon === 'Brain';

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isAI && !isActive ? 'animate-brain' : ''}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ── User Info ────────────────────── */}
        <div className="px-4 py-3 border-t border-slate-800/60">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
              {(user?.username || user?.firstName || 'U')[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.username || user?.firstName || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {user?.role || 'Staff'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
              text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
