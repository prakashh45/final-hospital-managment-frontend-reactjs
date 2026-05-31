/* ============================================
   PatientNotifications.jsx — AarogyKendra
   ============================================
   List of notifications for the patient.
   ============================================ */

import { useState } from 'react';
import { motion } from 'motion/react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Bell, CalendarDays, TestTube, Pill, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const MOCK_NOTIFS = [
  { id: 1, type: 'appointment', title: 'Upcoming Appointment', message: 'You have an appointment with Dr. Sarah Smith tomorrow at 10:00 AM.', time: '2 hours ago', read: false, icon: CalendarDays, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 2, type: 'lab', title: 'Lab Results Ready', message: 'Your recent Complete Blood Count (CBC) test results are now available.', time: '1 day ago', read: false, icon: TestTube, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 3, type: 'prescription', title: 'Prescription Expiring', message: 'Your prescription for Amoxicillin is expiring in 3 days. Please consult for a refill.', time: '2 days ago', read: true, icon: Pill, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 4, type: 'system', title: 'Profile Updated', message: 'Your account settings were successfully updated.', time: '1 week ago', read: true, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

export default function PatientNotifications() {
  const toast = useToast();
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            Notifications
          </h2>
          <p className="text-sm text-slate-400 mt-1">Stay updated on your health activities.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>Mark all as read</Button>
        )}
      </div>

      <Card className="p-2 sm:p-4">
        <div className="space-y-2">
          {notifications.map(notif => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                  notif.read 
                    ? 'bg-slate-900/30 border-transparent hover:bg-slate-800/50' 
                    : 'bg-slate-800/80 border-slate-700 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold truncate ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{notif.time}</span>
                  </div>
                  <p className={`text-sm ${notif.read ? 'text-slate-500' : 'text-slate-300'}`}>
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

    </motion.div>
  );
}
