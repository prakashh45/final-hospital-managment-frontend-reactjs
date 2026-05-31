/* ============================================
   PatientRecords.jsx — AarogyKendra
   ============================================
   Health Records timeline (Diagnoses & Vitals).
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { patientAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { FileHeart, Activity, Stethoscope, CalendarDays, Download } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { generateCheckupPDF } from '../../utils/pdfGenerators';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PatientRecords() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, DIAGNOSIS, VITALS

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await patientAPI.getHistory(user.patientId);
        
        const diagnoses = (res.data?.diagnoses || []).map(d => ({
          ...d,
          recordType: 'DIAGNOSIS',
          date: d.createdAt,
        }));
        
        const vitals = (res.data?.vitals || []).map(v => ({
          ...v,
          recordType: 'VITALS',
          date: v.recordedAt,
        }));
        
        // Merge and sort
        const merged = [...diagnoses, ...vitals].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecords(merged);
      } catch (err) {
        console.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user.patientId]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader text="Loading health records..." size="lg" /></div>;
  }

  const filteredRecords = records.filter(r => filter === 'ALL' || r.recordType === filter);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      
      {/* ── Page Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Health Records</h2>
          <p className="text-sm text-slate-400 mt-1">Comprehensive timeline of your diagnoses and vitals.</p>
        </div>
      </motion.div>

      {/* ── Filter Tabs ── */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {['ALL', 'DIAGNOSIS', 'VITALS'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f 
                ? 'bg-cyan-500 text-slate-900' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f === 'ALL' ? 'All Records' : f === 'DIAGNOSIS' ? 'Diagnoses' : 'Vitals'}
          </button>
        ))}
      </motion.div>

      {/* ── Timeline ── */}
      <motion.div variants={itemVariants} className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No records found.</div>
        ) : (
          filteredRecords.map(record => {
            const isDiag = record.recordType === 'DIAGNOSIS';
            return (
              <div key={`${record.recordType}-${record.id}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Icon Marker */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isDiag ? 'text-blue-400 border-blue-500/20' : 'text-emerald-400 border-emerald-500/20'}`}>
                  {isDiag ? <Stethoscope className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                </div>

                {/* Card */}
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> {formatDate(record.date)}
                      </p>
                      <h4 className={`text-lg font-bold ${isDiag ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {isDiag ? record.condition : 'Vitals Check'}
                      </h4>
                    </div>
                    {isDiag && <Badge>{record.status}</Badge>}
                  </div>

                  {isDiag ? (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300 leading-relaxed">{record.description}</p>
                      <p className="text-xs text-slate-500 mt-2">Diagnosed by {record.doctorName}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">BP</p>
                        <p className="text-sm font-semibold text-slate-200">{record.bp}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sugar</p>
                        <p className="text-sm font-semibold text-slate-200">{record.sugar}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pulse</p>
                        <p className="text-sm font-semibold text-slate-200">{record.pulse}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Temp</p>
                        <p className="text-sm font-semibold text-slate-200">{record.temperature}°F</p>
                      </div>
                    </div>
                  )}
                  
                  {!isDiag && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => {
                          generateCheckupPDF({
                            patientName: user.firstName + ' ' + user.lastName,
                            patientId: user.patientId,
                            age: user.age,
                            bp: record.bp,
                            sugar: record.sugar,
                            pulse: record.pulse,
                            temperature: record.temperature,
                            dateTime: formatDate(record.date)
                          });
                        }}
                        className="text-xs flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Report
                      </button>
                    </div>
                  )}
                </Card>

              </div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
