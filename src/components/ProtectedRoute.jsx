/* ============================================
   ProtectedRoute.jsx — Route Guard
   ============================================
   Redirects unauthenticated users to /login.
   Restricts by role (DOCTOR/NURSE only).
   ============================================ */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader';

/**
 * ProtectedRoute — guards a route behind authentication.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Loader size="lg" text="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const roleRedirects = {
      DOCTOR: '/doctor/dashboard',
      NURSE: '/nurse/dashboard',
      PATIENT: '/my/dashboard',
    };
    const redirectPath = roleRedirects[user?.role] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
