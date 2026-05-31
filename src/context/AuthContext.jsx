/* ============================================
   AuthContext.jsx — AarogyKendra Auth Context
   ============================================
   Provides authentication entirely through localStorage
   for a seamless, serverless demo experience.
   All API calls have been removed.
   ============================================ */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider — provides auth state + methods.
 * Uses localStorage for all user data for demos.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('hms_token') || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Restore Session on Mount ──────────────
  useEffect(() => {
    const restoreSession = () => {
      const storedUser = localStorage.getItem('hms_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // If we have a user but no token in state (e.g. refresh), check localStorage
          if (!token) {
            setToken(localStorage.getItem('hms_token') || 'demo-token');
          }
        } catch {
          // Invalid stored user
          localStorage.removeItem('hms_user');
          localStorage.removeItem('hms_token');
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, [token]);

  // ── Login ─────────────────────────────────
  const login = useCallback(async (credentials) => {
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedUsersStr = localStorage.getItem('hms_registered_users');
          let registeredUsers = {};
          if (storedUsersStr) {
            registeredUsers = JSON.parse(storedUsersStr);
          }

          let userData;

          // Check if user exists in our local "DB"
          if (registeredUsers[credentials.username]) {
            userData = registeredUsers[credentials.username];
            if (userData.password !== credentials.password) {
              throw new Error('Invalid username or password.');
            }
          } else {
            // Fallback: create a mock session if they haven't registered
            // This ensures the demo never blocks the user from entering
            userData = {
              id: Date.now(),
              username: credentials.username,
              email: credentials.email || `${credentials.username}@aarogykendra.in`,
              role: credentials.username.toLowerCase().includes('nurse') ? 'NURSE' : 'DOCTOR',
            };
          }

          // Strip password from session data
          const { password, ...sessionData } = userData;
          const newToken = `demo-jwt-token-${Date.now()}`;

          localStorage.setItem('hms_token', newToken);
          localStorage.setItem('hms_user', JSON.stringify(sessionData));
          
          setToken(newToken);
          setUser(sessionData);

          resolve(sessionData);
        } catch (err) {
          setError(err.message || 'Login failed. Please try again.');
          reject(err);
        }
      }, 600); // Simulate network delay
    });
  }, []);

  // ── Login as Patient (No Auth) ────────────
  const loginAsPatient = useCallback(async () => {
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedUsersStr = localStorage.getItem('hms_registered_users');
        let registeredUsers = {};
        if (storedUsersStr) {
          registeredUsers = JSON.parse(storedUsersStr);
        }

        // Just use patient1 from seed data or create a dummy one
        const sessionData = registeredUsers['patient1'] || {
          id: 1,
          username: 'Priya Patel',
          email: 'priya.patel@mail.com',
          role: 'PATIENT',
          firstName: 'Priya',
          lastName: 'Patel',
          patientId: 1
        };

        const newToken = `demo-jwt-token-patient-${Date.now()}`;

        localStorage.setItem('hms_token', newToken);
        localStorage.setItem('hms_user', JSON.stringify(sessionData));
        
        setToken(newToken);
        setUser(sessionData);

        resolve(sessionData);
      }, 400);
    });
  }, []);

  // ── Register ──────────────────────────────
  const register = useCallback(async (data) => {
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedUsersStr = localStorage.getItem('hms_registered_users');
          let registeredUsers = {};
          if (storedUsersStr) {
            registeredUsers = JSON.parse(storedUsersStr);
          }

          if (registeredUsers[data.username]) {
            throw new Error('Username is already taken.');
          }

          const newUser = {
            id: Date.now(),
            username: data.username,
            email: data.email,
            password: data.password, // Stored just for local auth checking
            role: data.role || 'DOCTOR',
          };

          registeredUsers[data.username] = newUser;
          localStorage.setItem('hms_registered_users', JSON.stringify(registeredUsers));

          // Strip password before returning
          const { password, ...safeUser } = newUser;
          resolve(safeUser);
        } catch (err) {
          setError(err.message || 'Registration failed. Please try again.');
          reject(err);
        }
      }, 800);
    });
  }, []);

  // ── Forgot Password ──────────────────────
  const forgotPassword = useCallback(async (data) => {
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'If that email is registered, a reset link has been sent.' });
      }, 600);
    });
  }, []);

  // ── Reset Password ───────────────────────
  const resetPassword = useCallback(async (data) => {
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password has been successfully reset.' });
      }, 600);
    });
  }, []);

  // ── Logout ────────────────────────────────
  const logout = useCallback(async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('hms_token');
        localStorage.removeItem('hms_user');
        setToken(null);
        setUser(null);
        setError(null);
        resolve();
      }, 300);
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    loginAsPatient,
    register,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
