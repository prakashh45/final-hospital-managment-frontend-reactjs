/* ============================================
   PatientSettings.jsx — AarogyKendra
   ============================================
   Profile settings and preferences.
   ============================================ */

import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Bell, Lock, Shield } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function PatientSettings() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('Profile');

  const handleSave = () => {
    toast.success('Settings saved successfully.');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {['Profile', 'Notifications', 'Security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
            >
              {tab === 'Profile' && <User className="w-4 h-4" />}
              {tab === 'Notifications' && <Bell className="w-4 h-4" />}
              {tab === 'Security' && <Lock className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card>
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Personal Information</h3>
                
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-bold text-cyan-400">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <Button variant="secondary" size="sm">Change Photo</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue={user.firstName} />
                  <Input label="Last Name" defaultValue={user.lastName} />
                  <Input label="Email Address" defaultValue={user.email} />
                  <Input label="Phone Number" defaultValue="+91 98765 43210" />
                  <Input label="Date of Birth" type="date" defaultValue="1990-01-01" />
                  <Input label="Blood Group" defaultValue="O+" />
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { title: 'Appointment Reminders', desc: 'Get SMS and email reminders for upcoming appointments.' },
                    { title: 'Lab Results', desc: 'Be notified when new lab reports are ready.' },
                    { title: 'Prescription Refills', desc: 'Reminders when it is time to refill your medication.' },
                    { title: 'Health Insights', desc: 'Weekly AI-generated health tips and summaries.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      </div>
                      {/* Fake toggle switch */}
                      <div className="w-10 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Account Security</h3>
                
                <div className="space-y-4">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mt-6 flex gap-3 items-start">
                  <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-200/80 leading-relaxed">
                    Your health data is encrypted and securely stored following strict HIPAA-compliant guidelines. We never share your data with third parties without your explicit consent.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
