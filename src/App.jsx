/* ============================================
   App.jsx — AarogyKendra Routing
   ============================================
   Removes Patient & Billing routes.
   Adds AI Insights route for Doctor.
   ============================================ */

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboards & Core Modules
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AIInsights from './pages/doctor/AIInsights';
import NurseDashboard from './pages/nurse/NurseDashboard';

// Diagnoses
import DiagnosisList from './pages/diagnoses/DiagnosisList';
import DiagnosisDetail from './pages/diagnoses/DiagnosisDetail';
import DiagnosisForm from './pages/diagnoses/DiagnosisForm';

// Prescriptions
import PrescriptionList from './pages/prescriptions/PrescriptionList';
import PrescriptionDetail from './pages/prescriptions/PrescriptionDetail';
import PrescriptionForm from './pages/prescriptions/PrescriptionForm';

// Vitals
import VitalsList from './pages/vitals/VitalsList';
import VitalsForm from './pages/vitals/VitalsForm';

// Queue & Tasks & Appointments
import QueueManagement from './pages/queue/QueueManagement';
import TaskManagement from './pages/tasks/TaskManagement';
import AppointmentManagement from './pages/appointments/AppointmentManagement';

// Patients
import PatientList from './pages/patients/PatientList';
import PatientDetail from './pages/patients/PatientDetail';
import PatientForm from './pages/patients/PatientForm';
import MedicalHistory from './pages/patients/MedicalHistory';

// Patient Portal Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientRecords from './pages/patient/PatientRecords';
import PatientLabReports from './pages/patient/PatientLabReports';
import PatientDoctors from './pages/patient/PatientDoctors';
import PatientAIInsights from './pages/patient/PatientAIInsights';
import PatientSettings from './pages/patient/PatientSettings';
import PatientNotifications from './pages/patient/PatientNotifications';

export default function App() {
  return (
    <Routes>
      {/* ── Public Auth Routes ──────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Protected Routes ────────────────── */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        
        {/* Dashboards */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/ai-insights" element={<ProtectedRoute allowedRoles={['DOCTOR']}><AIInsights /></ProtectedRoute>} />
        <Route path="/nurse/dashboard" element={<ProtectedRoute allowedRoles={['NURSE']}><NurseDashboard /></ProtectedRoute>} />

        {/* Diagnoses */}
        <Route path="/diagnoses" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DiagnosisList /></ProtectedRoute>} />
        <Route path="/diagnoses/new" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DiagnosisForm /></ProtectedRoute>} />
        <Route path="/diagnoses/:id" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DiagnosisDetail /></ProtectedRoute>} />
        <Route path="/diagnoses/:id/edit" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DiagnosisForm /></ProtectedRoute>} />

        {/* Prescriptions */}
        <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PrescriptionList /></ProtectedRoute>} />
        <Route path="/prescriptions/new" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PrescriptionForm /></ProtectedRoute>} />
        <Route path="/prescriptions/:id" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PrescriptionDetail /></ProtectedRoute>} />
        <Route path="/prescriptions/:id/edit" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PrescriptionForm /></ProtectedRoute>} />

        {/* Vitals */}
        <Route path="/vitals" element={<ProtectedRoute allowedRoles={['NURSE']}><VitalsList /></ProtectedRoute>} />
        <Route path="/vitals/new" element={<ProtectedRoute allowedRoles={['NURSE', 'DOCTOR']}><VitalsForm /></ProtectedRoute>} />
        <Route path="/vitals/:id/edit" element={<ProtectedRoute allowedRoles={['NURSE', 'DOCTOR']}><VitalsForm /></ProtectedRoute>} />

        {/* Patients */}
        <Route path="/patients" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><PatientList /></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><PatientForm /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><PatientDetail /></ProtectedRoute>} />
        <Route path="/patients/:id/edit" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><PatientForm /></ProtectedRoute>} />
        <Route path="/patients/:id/history" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><MedicalHistory /></ProtectedRoute>} />

        {/* Queue, Tasks, Appointments */}
        <Route path="/queue" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><QueueManagement /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute allowedRoles={['NURSE']}><TaskManagement /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE']}><AppointmentManagement /></ProtectedRoute>} />

        {/* Patient Portal */}
        <Route path="/my/dashboard" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/my/appointments" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientAppointments /></ProtectedRoute>} />
        <Route path="/my/prescriptions" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientPrescriptions /></ProtectedRoute>} />
        <Route path="/my/records" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientRecords /></ProtectedRoute>} />
        <Route path="/my/lab-reports" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientLabReports /></ProtectedRoute>} />
        <Route path="/my/doctors" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientDoctors /></ProtectedRoute>} />
        <Route path="/my/ai-insights" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientAIInsights /></ProtectedRoute>} />
        <Route path="/my/settings" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientSettings /></ProtectedRoute>} />
        <Route path="/my/notifications" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientNotifications /></ProtectedRoute>} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
