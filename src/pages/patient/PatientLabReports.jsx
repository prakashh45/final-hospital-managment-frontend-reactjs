/* ============================================
   PatientLabReports.jsx — AarogyKendra
   ============================================
   List of Lab Reports with PDF download capability.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { labReportAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { TestTube, CalendarDays, User, ArrowRight, Download, Activity } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../components/ui/Toast';

export default function PatientLabReports() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await labReportAPI.getAll({ patientId: user.patientId });
        const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setReports(sorted);
        if (sorted.length > 0) setSelectedReport(sorted[0]);
      } catch (err) {
        toast.error('Failed to load lab reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user.patientId, toast]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader text="Loading lab reports..." size="lg" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Lab Reports</h2>
          <p className="text-sm text-slate-400 mt-1">View your test results and download reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List */}
        <div className="lg:col-span-1 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No lab reports available.</div>
          ) : (
            reports.map(report => (
              <div 
                key={report.id} 
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedReport?.id === report.id 
                    ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium ${selectedReport?.id === report.id ? 'text-cyan-400' : 'text-white'}`}>
                    {report.testName}
                  </h4>
                  <Badge variant={report.status === 'Normal' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}>
                    {report.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(report.date)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <Card className="h-full relative overflow-hidden" glow={selectedReport.status === 'Normal' ? 'glow-emerald' : 'glow-red'}>
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 blur-[100px] rounded-full pointer-events-none ${selectedReport.status === 'Normal' ? 'bg-emerald-500' : 'bg-red-500'}`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedReport.testName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-purple-400" /> Referred by {selectedReport.doctorName}</span>
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-emerald-400" /> {formatDate(selectedReport.date)}</span>
                    </div>
                  </div>
                  <button onClick={() => toast.success('Report downloaded.')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-medium rounded-xl transition-colors border border-slate-700">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-800 bg-slate-800/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-2">Parameter</div>
                    <div>Value</div>
                    <div>Reference</div>
                  </div>
                  
                  <div className="divide-y divide-slate-800/50">
                    {selectedReport.results.map((res, idx) => (
                      <div key={idx} className="grid grid-cols-4 gap-4 p-4 items-center">
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-slate-200">{res.parameter}</p>
                        </div>
                        <div>
                          <p className={`text-sm font-bold flex items-center gap-2 ${res.status === 'Normal' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {res.value} <span className="text-xs font-normal text-slate-500">{res.unit}</span>
                            {res.status !== 'Normal' && <Activity className="w-3.5 h-3.5" />}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{res.range} {res.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReport.status !== 'Normal' && (
                  <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-400 mb-1">Attention Needed</p>
                      <p className="text-sm text-amber-200/70">Some of your test results fall outside the normal reference range. Please consult your doctor to discuss these findings.</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
              <TestTube className="w-12 h-12 mb-3 text-slate-700" />
              <p>Select a report to view details</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
