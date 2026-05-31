/* ============================================
   main.jsx — AarogyKendra Entry Point
   ============================================
   Mounts the React app with Router, Auth,
   and Toast providers.
   ============================================ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { seedDemoData } from './utils/seedData';
import App from './App';
import './index.css';

// Initialize local storage demo data
seedDemoData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
