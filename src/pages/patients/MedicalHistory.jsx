import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock } from 'lucide-react';
import { patientAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { formatDateTime } from '../../utils/helpers';

export default function MedicalHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await patientAPI.getHistory(id);
        setHistory(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch medical history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Full Medical History</h2>
          <p className="text-sm text-white/40">Complete timeline of patient records</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div className="flex justify-center p-12"><Loader size="lg" /></div>
      ) : history.length > 0 ? (
        <Card>
          <div className="space-y-6">
            {history.map((record, index) => (
              <div key={record.id || index} className="flex gap-6 relative">
                {/* Timeline Line */}
                {index < history.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-white/[0.06]" />
                )}
                
                {/* Timeline Icon */}
                <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 z-10">
                  <FileText className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <h4 className="text-lg font-semibold text-white">{record.title || record.type || 'Medical Record'}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDateTime(record.date || record.createdAt)}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm whitespace-pre-wrap">{record.description || record.notes}</p>
                    {(record.doctorName || record.createdBy) && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-white/40 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                          {(record.doctorName || record.createdBy)[0]}
                        </div>
                        Added by {record.doctorName || record.createdBy}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState title="No History Found" description="This patient has no recorded medical history." />
        </Card>
      )}
    </div>
  );
}
