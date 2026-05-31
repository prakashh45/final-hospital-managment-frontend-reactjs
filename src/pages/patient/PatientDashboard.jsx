/* ============================================
   PatientDashboard.jsx — AarogyKendra Patient Hub
   ============================================
   Main entry point for patients. Shows upcoming
   appointments, quick stats, and recent activity.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { patientAPI, appointmentAPI } from '../../api/client';
import Card, { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { CalendarDays, Pill, Activity, ArrowRight, Clock, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apts = await appointmentAPI.getAll({ patientId: user.patientId });
        setAppointments(apts.data || []);
        const currentVitals = await patientAPI.getCurrentVitals(user.patientId);
        setVitals(currentVitals.data || null);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.patientId]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader text="Loading your dashboard..." size="lg" /></div>;
  }

  const upcomingApts = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'Cancelled');
  const nextApt = upcomingApts.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      
      {/* ── Welcome Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Health Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Here's a summary of your recent medical activities.</p>
        </div>
        <Button onClick={() => navigate('/my/appointments')} icon={<CalendarDays className="w-5 h-5" />}>
          Book Appointment
        </Button>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Upcoming Appointments" value={upcomingApts.length} icon={<CalendarDays className="w-5 h-5" />} color="text-cyan-400" />
        <StatCard label="Active Prescriptions" value="2" icon={<Pill className="w-5 h-5" />} color="text-purple-400" />
        <StatCard label="Last BP Reading" value={vitals ? vitals.bp : '—'} icon={<Activity className="w-5 h-5" />} color="text-emerald-400" />
        <StatCard label="Health Score" value="85" icon={<Activity className="w-5 h-5" />} color="text-blue-400" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Next Appointment ── */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card title="Next Appointment" icon={<Clock className="w-5 h-5 text-cyan-400" />} className="h-full">
            {nextApt ? (
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                    {new Date(nextApt.date).getDate()}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">{nextApt.doctorName}</h4>
                    <p className="text-sm text-slate-400">{nextApt.specialty} • {nextApt.time}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      {nextApt.type === 'Video Call' ? <Video className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                      <span>{nextApt.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge>{nextApt.status}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/my/appointments')}>Manage</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No upcoming appointments scheduled.</p>
                <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/my/appointments')}>Book one now</Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card title="Quick Actions" icon={<Activity className="w-5 h-5 text-purple-400" />} className="h-full">
            <div className="space-y-3 mt-2">
              <button onClick={() => navigate('/my/prescriptions')} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Pill className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-white">View Prescriptions</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
              <button onClick={() => navigate('/my/lab-reports')} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Lab Reports</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
              <button onClick={() => navigate('/my/ai-insights')} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">AI Health Insights</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
