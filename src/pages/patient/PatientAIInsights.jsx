/* ============================================
   PatientAIInsights.jsx — AarogyKendra
   ============================================
   AI Health insights and tips for the patient.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Brain, Activity, HeartPulse, Droplets, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { patientAPI } from '../../api/client';

export default function PatientAIInsights() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState(null);
  
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await patientAPI.getCurrentVitals(user.patientId);
        setVitals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [user.patientId]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-400" />
            AI Health Insights
          </h2>
          <p className="text-sm text-slate-400 mt-1">Personalized health recommendations based on your records.</p>
        </div>
        <Button variant="secondary" onClick={() => toast.info('Generating new insights...')}>Refresh Analysis</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Insight */}
        <div className="md:col-span-2 space-y-6">
          <Card className="relative overflow-hidden border-emerald-500/30">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 blur-[100px] rounded-full pointer-events-none bg-emerald-500" />
            
            <div className="relative z-10 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Overall Health Status</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed mb-4">
                  Based on your recent vitals and lab reports, your overall health is stable. Your blood pressure has improved since your last visit. We recommend continuing your current medication and maintaining a low-sodium diet.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">BP Stable</span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">Good Progress</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Personalized Recommendations" icon={<Activity className="w-5 h-5 text-cyan-400" />}>
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <HeartPulse className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Cardio Exercise</h4>
                  <p className="text-xs text-slate-400 mt-1">Engage in 30 minutes of light cardio (like brisk walking) 4 times a week to maintain your heart health.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Droplets className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Hydration</h4>
                  <p className="text-xs text-slate-400 mt-1">Your recent reports suggest slight dehydration. Aim for 2.5 - 3 liters of water daily.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <Card title="Latest Vitals Snapshot">
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-sm text-slate-400">Blood Pressure</span>
                <span className="text-sm font-medium text-white">{vitals?.bp || '120/80'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-sm text-slate-400">Heart Rate</span>
                <span className="text-sm font-medium text-white">{vitals?.pulse || '72'} bpm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Blood Sugar</span>
                <span className="text-sm font-medium text-white">{vitals?.sugar || '95'} mg/dL</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/20">
            <h3 className="text-sm font-bold text-white mb-2">Want deeper insights?</h3>
            <p className="text-xs text-indigo-200/70 mb-4">Upload your wearable fitness data to get real-time AI health tracking.</p>
            <Button variant="secondary" size="sm" fullWidth className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20">
              Connect Device
            </Button>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
