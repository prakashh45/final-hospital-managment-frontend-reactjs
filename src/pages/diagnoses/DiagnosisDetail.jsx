import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { diagnosisAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { formatDate } from '../../utils/helpers';

export default function DiagnosisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const res = await diagnosisAPI.getById(id);
        setDiagnosis(res.data);
      } catch (err) {
        setError('Failed to load diagnosis details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosis();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this diagnosis?')) return;
    try {
      await diagnosisAPI.delete(id);
      navigate('/diagnoses');
    } catch (err) {
      alert('Failed to delete diagnosis');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await diagnosisAPI.updateStatus(id, newStatus);
      setDiagnosis({ ...diagnosis, status: newStatus });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader size="lg" /></div>;
  if (error) return <ErrorMessage message={error} />;
  if (!diagnosis) return <ErrorMessage message="Diagnosis not found" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Edit className="w-4 h-4"/>} onClick={() => navigate(`/diagnoses/${id}/edit`)}>Edit</Button>
          <Button variant="danger" icon={<Trash2 className="w-4 h-4"/>} onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <Card title={`Diagnosis #${diagnosis.id}`}>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Patient ID</span>
            <span className="text-white font-medium cursor-pointer hover:underline" onClick={() => navigate(`/patients/${diagnosis.patientId}`)}>
              {diagnosis.patientId}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Condition</span>
            <span className="text-white font-medium">{diagnosis.condition || diagnosis.title}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Priority</span>
            <Badge>{diagnosis.priority || 'MEDIUM'}</Badge>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2 items-center">
            <span className="text-white/40">Status</span>
            <div className="flex gap-2 items-center">
               <Badge>{diagnosis.status}</Badge>
               <select 
                 className="bg-white/5 text-xs p-1 rounded border border-white/10 text-white outline-none"
                 value={diagnosis.status}
                 onChange={(e) => handleStatusChange(e.target.value)}
               >
                 <option value="PENDING">PENDING</option>
                 <option value="CONFIRMED">CONFIRMED</option>
                 <option value="RESOLVED">RESOLVED</option>
               </select>
            </div>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Date</span>
            <span className="text-white">{formatDate(diagnosis.createdAt || diagnosis.diagnosisDate)}</span>
          </div>
          <div>
            <span className="text-white/40 block mb-1 text-sm">Notes/Description</span>
            <p className="text-white/80 whitespace-pre-wrap">{diagnosis.description || diagnosis.notes || 'No description provided.'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
