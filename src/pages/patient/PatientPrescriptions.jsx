/* ============================================
   PatientPrescriptions.jsx — AarogyKendra
   ============================================
   List of patient's prescriptions with ability
   to view details and download PDF.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { prescriptionAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Pill, FileText, Download, User, CalendarDays } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { generateDiagnosisPDF } from '../../utils/pdfGenerators';
import { useToast } from '../../components/ui/Toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PatientPrescriptions() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);

  useEffect(() => {
    const fetchRx = async () => {
      setLoading(true);
      try {
        const res = await prescriptionAPI.getAll({ patientId: user.patientId });
        const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setPrescriptions(sorted);
        if (sorted.length > 0) setSelectedRx(sorted[0]);
      } catch (err) {
        toast.error('Failed to load prescriptions.');
      } finally {
        setLoading(false);
      }
    };
    fetchRx();
  }, [user.patientId, toast]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader text="Loading prescriptions..." size="lg" /></div>;
  }

  const handleDownload = (rx) => {
    generateDiagnosisPDF({
      patientName: user.firstName + ' ' + user.lastName,
      patientId: user.patientId,
      age: user.age,
      gender: user.gender,
      doctorName: rx.doctorName,
      date: formatDate(rx.date),
      diagnosis: 'Prescription Detail',
      severity: 'Normal',
      status: rx.status,
      medicines: rx.medicines,
      advice: rx.notes
    });
    toast.success('Prescription PDF downloaded.');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      
      {/* ── Page Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Prescriptions</h2>
          <p className="text-sm text-slate-400 mt-1">View and download your medication history.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Rx List ── */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
          <Card title="Prescription History" icon={<Pill className="w-5 h-5 text-purple-400" />}>
            <div className="space-y-3 mt-4">
              {prescriptions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No prescriptions found.</div>
              ) : (
                prescriptions.map(rx => (
                  <div 
                    key={rx.id} 
                    onClick={() => setSelectedRx(rx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedRx?.id === rx.id 
                        ? 'bg-slate-800 border-purple-500/50 shadow-lg shadow-purple-500/10' 
                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-medium ${selectedRx?.id === rx.id ? 'text-purple-400' : 'text-white'}`}>
                        {rx.doctorName}
                      </h4>
                      <Badge variant={rx.status === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-slate-500/30 text-slate-400 bg-slate-500/10'}>
                        {rx.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(rx.date)}</span>
                      <span className="flex items-center gap-1"><Pill className="w-3.5 h-3.5" /> {rx.medicines?.length || 0} Meds</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* ── Right Column: Rx Details ── */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {selectedRx ? (
            <Card className="h-full relative overflow-hidden" glow={selectedRx.status === 'ACTIVE' ? 'glow-purple' : ''}>
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5 blur-[100px] rounded-full pointer-events-none bg-purple-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Prescription Details</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-cyan-400" /> {selectedRx.doctorName}</span>
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-emerald-400" /> {formatDate(selectedRx.date)}</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => handleDownload(selectedRx)}>
                    Download PDF
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">Medicines ({selectedRx.medicines?.length || 0})</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRx.medicines?.map((med, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-cyan-400">{med.name}</p>
                          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">{med.dosage}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2"><span className="text-slate-500">Freq:</span> {med.frequency}</p>
                        <p className="text-xs text-slate-300 mt-1"><span className="text-slate-500">Dur:</span> {med.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRx.notes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2 mb-3">Doctor's Advice</h4>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200 leading-relaxed">
                      {selectedRx.notes}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              <FileText className="w-12 h-12 mb-3 text-slate-700" />
              <p>Select a prescription to view details</p>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
