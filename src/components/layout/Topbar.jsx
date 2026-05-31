/* ============================================
   Topbar.jsx — AarogyKendra Top Bar
   ============================================
   Shows welcome message with username,
   notification bell, and profile dropdown.
   ============================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Activity,
} from 'lucide-react';

/**
 * Topbar — dashboard header bar.
 */
export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.role === 'DOCTOR'
    ? `Dr. ${user?.username || user?.firstName || user?.name || 'User'}`
    : user?.role === 'NURSE' 
      ? `Nurse ${user?.firstName || user?.username || 'User'}`
      : `${user?.firstName || user?.username || 'User'}`;

  return (
    <header className="h-16 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* ── Left: Menu + Title ──────────── */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
            text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Welcome text */}
        <div>
          <h1 className="text-sm font-semibold text-white">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            AarogyKendra AI-Powered Healthcare Dashboard
          </p>
        </div>
      </div>

      {/* ── Right: Notifications + Profile ── */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl
          text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 relative transition-all cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-dot" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl
              hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
              {getInitials(user?.username || user?.firstName || user?.name || 'U')}
            </div>

            {/* Name + Role */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {user?.role || 'Staff'}
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-xl
                border border-slate-700/50 shadow-2xl z-50 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800/60">
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'staff@aarogykendra.in'}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400/80
                      hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
