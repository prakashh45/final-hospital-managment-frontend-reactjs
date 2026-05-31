/* ============================================
   PatientAppointments.jsx — AarogyKendra Patient
   ============================================
   Matches provided UI exactly: Stat cards, 
   appointment list, and right-side calendar widget.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, doctorDataAPI } from '../../api/client';
import Card, { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { CalendarDays, Clock, Video, MoreVertical, Plus, ArrowRight, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../components/ui/Toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PatientAppointments() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('Upcoming'); // Upcoming, Completed, Cancelled

  useEffect(() => {
    fetchApts();
  }, [user.patientId]);

  const fetchApts = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getAll({ patientId: user.patientId });
      // Sort by date descending
      const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(sorted);
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.cancel(id);
        toast.success('Appointment cancelled successfully.');
        fetchApts();
      } catch (err) {
        toast.error('Failed to cancel appointment.');
      }
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader text="Loading your appointments..." size="lg" /></div>;
  }

  const upcomingApts = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'Cancelled');
  const completedApts = appointments.filter(a => a.status === 'Completed' || (new Date(a.date) < new Date() && a.status !== 'Cancelled'));
  const cancelledApts = appointments.filter(a => a.status === 'Cancelled');

  const filteredApts = filter === 'Upcoming' ? upcomingApts 
                     : filter === 'Completed' ? completedApts 
                     : cancelledApts;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      
      {/* ── Page Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Appointments</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your upcoming and past doctor visits.</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => toast.info('Booking flow would open here')}>
          Book New Appointment
        </Button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Appointments" value={appointments.length} icon={<CalendarDays className="w-5 h-5" />} color="text-cyan-400" />
        <StatCard label="Upcoming" value={upcomingApts.length} icon={<Clock className="w-5 h-5" />} color="text-emerald-400" />
        <StatCard label="Completed" value={completedApts.length} icon={<UserCheck className="w-5 h-5" />} color="text-blue-400" />
        <StatCard label="Cancelled" value={cancelledApts.length} icon={<Clock className="w-5 h-5" />} color="text-red-400" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Appointment List ── */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <Card className="h-full flex flex-col">
            
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-800/60 pb-3 mb-4">
              {['Upcoming', 'Completed', 'Cancelled'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`text-sm font-medium pb-3 border-b-2 transition-colors ${filter === t ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                  style={{ marginBottom: '-13px' }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4 flex-1">
              {filteredApts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No {filter.toLowerCase()} appointments.</div>
              ) : (
                filteredApts.map(apt => (
                  <div key={apt.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center text-lg font-bold text-cyan-400">
                        {apt.doctorName?.replace('Dr. ', '')[0] || 'D'}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{apt.doctorName}</h4>
                        <p className="text-xs text-slate-400">{apt.specialty}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-cyan-400" /> {formatDate(apt.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {apt.time} - {apt.endTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={apt.type === 'Video Call' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}>
                          {apt.type === 'Video Call' ? <Video className="w-3 h-3 inline mr-1" /> : <UserCheck className="w-3 h-3 inline mr-1" />}
                          {apt.type}
                        </Badge>
                        <Badge>{apt.status}</Badge>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-1">
                        {filter === 'Upcoming' && (
                          <>
                            <Button variant="secondary" size="sm">Reschedule</Button>
                            <Button variant="danger" size="sm" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                          </>
                        )}
                        {filter === 'Completed' && <Button variant="secondary" size="sm">View Notes</Button>}
                        {filter === 'Cancelled' && <Button variant="secondary" size="sm">Rebook</Button>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* ── Right Column: Calendar Widget ── */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card title="Calendar" icon={<CalendarDays className="w-5 h-5 text-purple-400" />}>
            {/* Simple mock calendar view */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <div className="flex gap-2 text-slate-400">
                  <span className="cursor-pointer hover:text-white">&lt;</span>
                  <span className="cursor-pointer hover:text-white">&gt;</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-xs text-slate-500 font-medium">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Generate 35 mock days */}
                {Array.from({length: 35}).map((_, i) => {
                  const day = i - 2; // Offset to start at 1
                  const isCurrentMonth = day > 0 && day <= 31;
                  const isToday = day === new Date().getDate();
                  const hasApt = upcomingApts.some(a => new Date(a.date).getDate() === day);
                  
                  return (
                    <div 
                      key={i} 
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                        ${!isCurrentMonth ? 'text-slate-600' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'}
                        ${isToday ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : ''}
                      `}
                    >
                      <span>{isCurrentMonth ? day : ''}</span>
                      {hasApt && isCurrentMonth && <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Apt Quick View */}
            {upcomingApts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Up Next</p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <div>
                    <p className="text-sm font-medium text-white">{upcomingApts[0].doctorName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(upcomingApts[0].date)} at {upcomingApts[0].time}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
