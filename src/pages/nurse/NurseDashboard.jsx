/* ============================================
   NurseDashboard.jsx — AarogyKendra Nurse Hub
   ============================================
   Vitals entry, patient queue monitoring,
   observation cards, and PDF report generation.
   ============================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  Activity,
  HeartPulse,
  Mail,
  FileText,
  Clock,
  AlertCircle,
  Thermometer,
  ListOrdered
} from 'lucide-react';
import { nurseAPI, queueAPI, vitalsAPI } from '../../api/client';
import Card, { GlowStatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { useToast } from '../../components/ui/Toast';
import { generateCheckupPDF } from '../../utils/pdfGenerators';
import { useApiOnMount } from '../../hooks/useApi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function NurseDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({ todayQueue: 0, pending: 0, vitalsRecorded: 0, observations: 0 });
  const [loading, setLoading] = useState(true);

  // Vitals Entry Form State
  const [activePatient, setActivePatient] = useState(null);
  const [vitalsForm, setVitalsForm] = useState({ bp: '', sugar: '', pulse: '', temp: '', weight: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch queue
      const qRes = await queueAPI.getAll();
      const allQueue = qRes.data || [];
      
      // Filter for today's queue roughly or just show all for demo
      const sortedQueue = allQueue.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQueue(sortedQueue);
      
      if (sortedQueue.length > 0 && !activePatient) {
        setActivePatient(sortedQueue[0]);
      }

      // Calculate stats
      const pending = sortedQueue.filter(q => q.status === 'WAITING' || q.status === 'IN_PROGRESS').length;
      setStats({
        todayQueue: sortedQueue.length,
        pending: pending,
        vitalsRecorded: sortedQueue.length - pending, // mock approximation
        observations: 3 // mock
      });
      
    } catch (err) {
      console.error('Failed to load nurse dashboard', err);
      toast.error('Failed to load queue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVitalsChange = (e) => {
    setVitalsForm({ ...vitalsForm, [e.target.name]: e.target.value });
  };

  const handleSaveVitals = async (e) => {
    e.preventDefault();
    if (!vitalsForm.bp || !vitalsForm.sugar) {
      toast.error('Please fill at least BP and Sugar readings.');
      return;
    }
    
    setSaving(true);
    try {
      // 1. Create Vitals Record
      await vitalsAPI.create({
        patientId: activePatient.patientId,
        bp: vitalsForm.bp,
        sugar: vitalsForm.sugar,
        pulse: vitalsForm.pulse,
        temperature: vitalsForm.temp,
        weight: vitalsForm.weight,
        notes: vitalsForm.notes,
        recordedBy: 'Nurse',
      });
      
      // 2. Update Queue Status to COMPLETED
      await queueAPI.update(activePatient.id, { status: 'COMPLETED' });
      
      toast.success(`Vitals recorded for ${activePatient.patientName}`);
      
      setVitalsForm({ bp: '', sugar: '', pulse: '', temp: '', weight: '', notes: '' });
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to save vitals');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReport = (patient) => {
    // Generate an empty/mock report based on current form
    generateCheckupPDF({
      patientName: patient.patientName,
      patientId: patient.patientId,
      age: 30, // mock age
      bp: vitalsForm.bp || '120/80',
      sugar: vitalsForm.sugar || '95',
      pulse: vitalsForm.pulse || '72',
      temperature: vitalsForm.temp || '98.6',
      weight: vitalsForm.weight || '—',
      notes: vitalsForm.notes || 'Routine observation normal.',
      nurseName: JSON.parse(localStorage.getItem('hms_user') || '{}')?.username || 'Duty Nurse',
    });
  };

  if (loading && queue.length === 0) {
    return <div className="flex h-full items-center justify-center"><Loader text="Loading Nurse Station..." size="lg" /></div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* ── Header ──────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Activity className="w-7 h-7 text-emerald-400" />
          Nurse Station
        </h2>
        <p className="text-sm text-slate-400 mt-1">Patient queue and vitals monitoring</p>
      </motion.div>

      {/* ── Stats ───────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowStatCard label="Today's Queue" value={stats.todayQueue} icon={<Users className="w-5 h-5" />} color="text-blue-400" glowColor="blue" />
        <GlowStatCard label="Pending Checkups" value={stats.pending} icon={<Clock className="w-5 h-5" />} color="text-amber-400" glowColor="cyan" />
        <GlowStatCard label="Vitals Recorded" value={stats.vitalsRecorded} icon={<HeartPulse className="w-5 h-5" />} color="text-emerald-400" glowColor="emerald" />
        <GlowStatCard label="Critical Notes" value={stats.observations} icon={<AlertCircle className="w-5 h-5" />} color="text-red-400" glowColor="red" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Queue ───────────────────── */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <Card title="Today's Queue" icon={<ListOrdered className="w-5 h-5 text-cyan-400" />}>
            <div className="space-y-3">
              {queue.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActivePatient(p)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    activePatient?.id === p.id 
                      ? 'bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-white">{p.patientName}</p>
                    <Badge color={p.status === 'COMPLETED' ? 'success' : p.status === 'IN_PROGRESS' ? 'warning' : 'default'}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">Token: {p.tokenNumber} | Dept: {p.department}</p>
                </div>
              ))}
              {queue.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No patients in queue.</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* ── Right: Vitals Entry ───────────── */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {activePatient ? (
            <Card title={`Vitals Record: ${activePatient.patientName}`} icon={<Thermometer className="w-5 h-5 text-emerald-400" />} glow="glow-emerald">
              
              {/* Action Bar */}
              <div className="flex flex-wrap gap-2 mb-6 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDownloadReport(activePatient)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" /> Download PDF Report
                </button>
                <a
                  href={`mailto:doctor@aarogykendra.in?subject=Medical Report for ${activePatient.patientName}&body=Please find the latest vitals recorded for Token ${activePatient.tokenNumber}.`}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Doctor
                </a>
              </div>

              <form onSubmit={handleSaveVitals} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">BP (mmHg)</label>
                    <input name="bp" value={vitalsForm.bp} onChange={handleVitalsChange} placeholder="120/80" className="w-full bg-white text-slate-900 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-emerald-400/50 outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Sugar (mg/dL)</label>
                    <input name="sugar" value={vitalsForm.sugar} onChange={handleVitalsChange} placeholder="95" className="w-full bg-white text-slate-900 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-emerald-400/50 outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Pulse (bpm)</label>
                    <input name="pulse" value={vitalsForm.pulse} onChange={handleVitalsChange} placeholder="72" className="w-full bg-white text-slate-900 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-emerald-400/50 outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Temp (°F)</label>
                    <input name="temp" value={vitalsForm.temp} onChange={handleVitalsChange} placeholder="98.6" className="w-full bg-white text-slate-900 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-emerald-400/50 outline-none text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Nurse Notes / Observations</label>
                  <textarea name="notes" value={vitalsForm.notes} onChange={handleVitalsChange} rows="3" placeholder="Patient complains of slight dizziness..." className="w-full bg-white text-slate-900 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-emerald-400/50 outline-none text-sm resize-none"></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={saving || activePatient.status === 'COMPLETED'} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? 'Saving...' : activePatient.status === 'COMPLETED' ? 'Vitals Saved' : 'Save Vitals'}
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <div className="flex h-full items-center justify-center p-6 border border-slate-800 rounded-xl bg-slate-900/50">
              <p className="text-slate-400 text-sm">Select a patient from the queue to record vitals.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
