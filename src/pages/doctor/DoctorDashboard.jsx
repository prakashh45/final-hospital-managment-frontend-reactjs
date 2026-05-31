/* ============================================
   DoctorDashboard.jsx — AarogyKendra Doctor Hub
   ============================================
   AI-powered doctor dashboard with:
   - Glowing stat cards
   - AI suggestion panel
   - Risk alerts
   - Patient list
   - Quick actions
   - Demo mock data fallback
   ============================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  AlertTriangle,
  Brain,
  Stethoscope,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Pill,
  Clock,
  Zap,
  HeartPulse,
  FileText,
} from 'lucide-react';
import { doctorAPI } from '../../api/client';
import Card, { GlowStatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';
import { generateDiagnosisPDF } from '../../utils/pdfGenerators';

// ── Animation Variants ────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Demo Mock Data ────────────────────────────
const MOCK_DATA = {
  totalPatients: 142,
  criticalCount: 7,
  aiRiskAlerts: 12,
  todayDiagnoses: 8,
  recentPatients: [
    { id: 1, firstName: 'Rajesh', lastName: 'Kumar', status: 'CRITICAL', createdAt: new Date().toISOString(), email: 'rajesh@mail.com' },
    { id: 2, firstName: 'Priya', lastName: 'Sharma', status: 'ACTIVE', createdAt: new Date().toISOString(), email: 'priya@mail.com' },
    { id: 3, firstName: 'Amit', lastName: 'Patel', status: 'STABLE', createdAt: new Date().toISOString(), email: 'amit@mail.com' },
    { id: 4, firstName: 'Sunita', lastName: 'Verma', status: 'ACTIVE', createdAt: new Date().toISOString(), email: 'sunita@mail.com' },
    { id: 5, firstName: 'Vikram', lastName: 'Singh', status: 'CRITICAL', createdAt: new Date().toISOString(), email: 'vikram@mail.com' },
  ],
  aiPredictions: [
    { id: 1, patient: 'Rajesh Kumar', risk: 'HIGH', prediction: 'Hypertension Risk', confidence: 89, bp: 155, sugar: 210, tests: ['HbA1c', 'Lipid Profile', 'ECG'], followUp: '3 days' },
    { id: 2, patient: 'Vikram Singh', risk: 'HIGH', prediction: 'Diabetes Type 2', confidence: 82, bp: 140, sugar: 280, tests: ['Fasting Glucose', 'C-Peptide'], followUp: '1 week' },
    { id: 3, patient: 'Amit Patel', risk: 'MEDIUM', prediction: 'Pre-Diabetic', confidence: 65, bp: 130, sugar: 145, tests: ['OGTT', 'Lipid Panel'], followUp: '2 weeks' },
    { id: 4, patient: 'Priya Sharma', risk: 'LOW', prediction: 'Normal Range', confidence: 92, bp: 118, sugar: 95, tests: ['Routine CBC'], followUp: '1 month' },
  ],
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await doctorAPI.getDashboard();
        setDashboard({ ...MOCK_DATA, ...response.data });
      } catch {
        // Use mock data for demo
        setDashboard(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size="lg" text="Loading AI Dashboard..." />
      </div>
    );
  }

  const data = dashboard || MOCK_DATA;
  const predictions = data.aiPredictions || MOCK_DATA.aiPredictions;
  const patients = data.recentPatients || MOCK_DATA.recentPatients;

  const riskColor = (risk) => {
    if (risk === 'HIGH') return 'text-red-400 bg-red-500/15 border-red-500/30';
    if (risk === 'MEDIUM') return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
  };

  const handleDownloadDiagnosis = (patient) => {
    generateDiagnosisPDF({
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientId: patient.id,
      diagnosis: 'Hypertension Grade II',
      severity: 'Moderate',
      symptoms: 'Headache, dizziness, elevated BP',
      medicines: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Losartan', dosage: '50mg', frequency: 'Once daily', duration: '30 days' },
      ],
      advice: 'Reduce salt intake. Regular exercise 30 min daily. Monitor BP twice daily.',
      followUp: 'Review after 2 weeks with BP log',
      doctorName: 'Dr. ' + (JSON.parse(localStorage.getItem('hms_user') || '{}')?.username || 'Doctor'),
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Page Header ───────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-cyan-400 animate-brain" />
            Doctor Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">AI-powered clinical insights and patient overview</p>
        </div>
        <button
          onClick={() => navigate('/doctor/ai-insights')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          AI Insights
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* ── Glowing Stats Grid ─────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowStatCard
          label="Total Patients"
          value={data.totalPatients}
          icon={<Users className="w-5 h-5" />}
          color="text-cyan-400"
          glowColor="cyan"
        />
        <GlowStatCard
          label="Critical Cases"
          value={data.criticalCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          glowColor="red"
        />
        <GlowStatCard
          label="AI Risk Alerts"
          value={data.aiRiskAlerts}
          icon={<ShieldAlert className="w-5 h-5" />}
          color="text-amber-400"
          glowColor="blue"
        />
        <GlowStatCard
          label="Today's Diagnoses"
          value={data.todayDiagnoses}
          icon={<Stethoscope className="w-5 h-5" />}
          color="text-emerald-400"
          glowColor="emerald"
        />
      </motion.div>

      {/* ── AI Prediction Panel ────────────── */}
      <motion.div variants={itemVariants}>
        <Card
          title="AI Risk Predictions"
          subtitle="Smart predictions from Random Forest model"
          icon={<Brain className="w-5 h-5 text-cyan-400" />}
          glow="glow-cyan"
          action={
            <button
              onClick={() => navigate('/doctor/ai-insights')}
              className="text-xs text-cyan-400/70 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.slice(0, 4).map((pred) => (
              <div
                key={pred.id}
                className={`p-4 rounded-xl bg-slate-800/50 border transition-all duration-300 hover:scale-[1.01] ${
                  pred.risk === 'HIGH' ? 'border-red-500/20 animate-risk-pulse' : 'border-slate-700/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HeartPulse className={`w-4 h-4 ${pred.risk === 'HIGH' ? 'text-red-400' : pred.risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <span className="text-sm font-semibold text-white">{pred.patient}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${riskColor(pred.risk)}`}>
                    {pred.risk}
                  </span>
                </div>

                <p className="text-sm text-cyan-400 font-medium mb-2">{pred.prediction}</p>

                {/* Confidence Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Confidence</span>
                    <span className="text-white font-medium">{pred.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        pred.risk === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        pred.risk === 'MEDIUM' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.confidence}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">BP:</span>
                    <span className={`font-medium ${pred.bp > 140 ? 'text-red-400' : 'text-slate-300'}`}>{pred.bp} mmHg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Sugar:</span>
                    <span className={`font-medium ${pred.sugar > 140 ? 'text-red-400' : 'text-slate-300'}`}>{pred.sugar} mg/dL</span>
                  </div>
                </div>

                {/* Suggested Tests */}
                <div className="flex flex-wrap gap-1.5">
                  {pred.tests?.map((test, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                      {test}
                    </span>
                  ))}
                </div>

                {/* Follow-up */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  Follow-up: {pred.followUp}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Content Grid ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card
            title="Recent Patients"
            subtitle="Latest patient records"
            icon={<Users className="w-5 h-5 text-blue-400" />}
            action={
              <button
                onClick={() => navigate('/patients')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-2">
              {patients.slice(0, 6).map((patient, index) => {
                const patientId = patient.id || patient.patientId;
                return (
                  <div
                    key={patientId || index}
                    onClick={() => patientId && navigate(`/patients/${patientId}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50
                      transition-all cursor-pointer group border border-transparent hover:border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/10 flex items-center justify-center
                        text-xs font-bold text-cyan-400">
                        {(patient.firstName || patient.name || '?')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                          {patient.firstName} {patient.lastName || ''}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(patient.createdAt || patient.admissionDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadDiagnosis(patient); }}
                        className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Download Diagnosis PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <Badge>{patient.status || 'ACTIVE'}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* AI Risk Distribution */}
        <motion.div variants={itemVariants}>
          <Card
            title="Risk Distribution"
            subtitle="AI-assessed patient risk"
            icon={<Activity className="w-5 h-5 text-purple-400" />}
            glow="glow-purple"
          >
            <div className="space-y-5">
              {[
                { label: 'High Risk', count: predictions.filter(p => p.risk === 'HIGH').length, total: predictions.length, color: 'from-red-500 to-red-400', text: 'text-red-400' },
                { label: 'Medium Risk', count: predictions.filter(p => p.risk === 'MEDIUM').length, total: predictions.length, color: 'from-amber-500 to-amber-400', text: 'text-amber-400' },
                { label: 'Low Risk', count: predictions.filter(p => p.risk === 'LOW').length, total: predictions.length, color: 'from-emerald-500 to-emerald-400', text: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className={`font-bold ${item.text}`}>{item.count} patients</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-700/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total analyzed</span>
                  <span className="text-white font-bold">{predictions.length} patients</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Quick Actions ─────────────────── */}
      <motion.div variants={itemVariants}>
        <Card title="Quick Actions" icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'New Diagnosis', path: '/diagnoses/new', icon: <Stethoscope className="w-5 h-5" />, color: 'group-hover:text-cyan-400' },
              { label: 'New Prescription', path: '/prescriptions/new', icon: <Pill className="w-5 h-5" />, color: 'group-hover:text-blue-400' },
              { label: 'View Queue', path: '/queue', icon: <Clock className="w-5 h-5" />, color: 'group-hover:text-emerald-400' },
              { label: 'AI Insights', path: '/doctor/ai-insights', icon: <Brain className="w-5 h-5" />, color: 'group-hover:text-purple-400' },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-slate-800/40
                  border border-slate-700/30 hover:bg-slate-800/80 hover:border-slate-600/50 transition-all cursor-pointer group"
              >
                <div className={`text-slate-400 transition-colors ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-200 font-medium">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
