/* ============================================
   AIInsights.jsx — AarogyKendra AI Module
   ============================================
   Deep dive into Random Forest model predictions
   with visual charts, risk severity, and suggestions.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Activity,
  HeartPulse,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  Users,
} from 'lucide-react';
import Card, { GlowStatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { RISK_LEVELS } from '../../utils/constants';

// ── Animation Variants ────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Mock Data (from Random Forest output) ─────
const PREDICTIONS = [
  { id: 101, patient: 'Rajesh Kumar', age: 54, risk: 'HIGH', prediction: 'Severe Hypertension', confidence: 91, features: { bp: 165, sugar: 180, pulse: 88, temp: 98.6 }, rules: ['BP > 160', 'Age > 50', 'Sugar > 140'], recommendation: 'Immediate medication adjustment, daily BP monitoring, ECG.' },
  { id: 102, patient: 'Vikram Singh', age: 62, risk: 'HIGH', prediction: 'Diabetes Type 2 Risk', confidence: 85, features: { bp: 145, sugar: 290, pulse: 76, temp: 98.2 }, rules: ['Sugar > 200', 'Age > 60'], recommendation: 'Fasting glucose test, HbA1c, dietary restriction immediately.' },
  { id: 103, patient: 'Amit Patel', age: 45, risk: 'MEDIUM', prediction: 'Pre-Diabetic Alert', confidence: 68, features: { bp: 135, sugar: 145, pulse: 82, temp: 98.4 }, rules: ['Sugar 140-199', 'BP > 130'], recommendation: 'Lifestyle modification, OGTT test in 1 week.' },
  { id: 104, patient: 'Priya Sharma', age: 38, risk: 'LOW', prediction: 'Normal Parameters', confidence: 94, features: { bp: 118, sugar: 95, pulse: 72, temp: 98.5 }, rules: ['BP < 120', 'Sugar < 100'], recommendation: 'Routine checkup next year.' },
];

export default function AIInsights() {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(PREDICTIONS[0]);

  useEffect(() => {
    // Simulate model inference delay
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Brain className="w-12 h-12 text-cyan-400 animate-brain" />
        <Loader size="lg" text="Running Random Forest Model Inference..." />
      </div>
    );
  }

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
            <Zap className="w-6 h-6 text-cyan-400" />
            AI Insights & Predictions
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Random Forest diagnostic predictions based on patient vitals
          </p>
        </div>
      </motion.div>

      {/* ── Overview Stats ────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowStatCard
          label="Model Accuracy"
          value="94.2%"
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-400"
          glowColor="emerald"
        />
        <GlowStatCard
          label="Inference Time"
          value="45ms"
          icon={<Clock className="w-5 h-5" />}
          color="text-cyan-400"
          glowColor="cyan"
        />
        <GlowStatCard
          label="Active Alerts"
          value="12"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-amber-400"
          glowColor="blue"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Patient List ─────── */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
          <Card title="Analyzed Patients" icon={<Users className="w-5 h-5 text-cyan-400" />}>
            <div className="space-y-3">
              {PREDICTIONS.map((pred) => {
                const isSelected = selectedPatient.id === pred.id;
                const riskInfo = RISK_LEVELS[pred.risk];
                return (
                  <div
                    key={pred.id}
                    onClick={() => setSelectedPatient(pred)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <p className={`font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {pred.patient}
                      </p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${riskInfo.bg} ${riskInfo.color}`}>
                        {pred.risk}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{pred.prediction}</p>
                    <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${riskInfo.color.replace('text', 'bg')}`}
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ── Right Column: Deep Dive ───────── */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {selectedPatient && (
            <Card
              glow={RISK_LEVELS[selectedPatient.risk].glow}
              className="h-full relative overflow-hidden"
            >
              {/* Background gradient hint */}
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 blur-[100px] rounded-full pointer-events-none ${
                selectedPatient.risk === 'HIGH' ? 'bg-red-500' :
                selectedPatient.risk === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {selectedPatient.patient}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Age: {selectedPatient.age} | ID: {selectedPatient.id}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border ${RISK_LEVELS[selectedPatient.risk].bg} ${RISK_LEVELS[selectedPatient.risk].border}`}>
                    <span className={`text-sm font-bold tracking-wider ${RISK_LEVELS[selectedPatient.risk].color}`}>
                      {selectedPatient.risk} RISK ALERT
                    </span>
                  </div>
                </div>

                {/* Main Prediction */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">AI Diagnosis Prediction</p>
                    <p className="text-xl font-bold text-cyan-400">{selectedPatient.prediction}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Confidence Score</p>
                    <p className="text-2xl font-black text-white">{selectedPatient.confidence}%</p>
                  </div>
                </div>

                {/* Feature Importance (Vitals) */}
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Key Vitals (Model Inputs)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'BP', value: `${selectedPatient.features.bp} mmHg`, high: selectedPatient.features.bp > 140 },
                    { label: 'Sugar', value: `${selectedPatient.features.sugar} mg/dL`, high: selectedPatient.features.sugar > 140 },
                    { label: 'Pulse', value: `${selectedPatient.features.pulse} bpm`, high: selectedPatient.features.pulse > 100 },
                    { label: 'Temp', value: `${selectedPatient.features.temp} °F`, high: selectedPatient.features.temp > 99 },
                  ].map((feat) => (
                    <div key={feat.label} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-500">{feat.label}</p>
                      <p className={`text-lg font-bold ${feat.high ? 'text-red-400' : 'text-slate-200'}`}>
                        {feat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Decision Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      Model Decision Rules
                    </h4>
                    <ul className="space-y-2">
                      {selectedPatient.rules.map((rule, idx) => (
                        <li key={idx} className="text-sm text-slate-400 flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <CheckCircle className="w-3 h-3 text-cyan-500" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      AI Recommended Action
                    </h4>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200 leading-relaxed">
                      {selectedPatient.recommendation}
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
