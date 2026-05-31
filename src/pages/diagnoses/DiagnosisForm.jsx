import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { diagnosisAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';

export default function DiagnosisForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [searchParams] = useSearchParams();
  const patientIdQuery = searchParams.get('patientId') || '';

  const [formData, setFormData] = useState({
    patientId: patientIdQuery,
    condition: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    description: ''
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchDiag = async () => {
        try {
          const res = await diagnosisAPI.getById(id);
          setFormData({
            patientId: res.data.patientId || '',
            condition: res.data.condition || res.data.title || '',
            priority: res.data.priority || 'MEDIUM',
            status: res.data.status || 'PENDING',
            description: res.data.description || res.data.notes || ''
          });
        } catch (err) {
          setError('Failed to fetch diagnosis.');
        } finally {
          setLoading(false);
        }
      };
      fetchDiag();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await diagnosisAPI.update(id, formData);
        navigate(`/diagnoses/${id}`);
      } else {
        const res = await diagnosisAPI.create(formData);
        navigate(`/diagnoses/${res.data.id || ''}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save diagnosis.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{isEdit ? 'Edit Diagnosis' : 'Add Diagnosis'}</h2>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Patient ID" name="patientId" value={formData.patientId} onChange={handleChange} required disabled={isEdit} />
          <Input label="Condition / Title" name="condition" value={formData.condition} onChange={handleChange} required />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl h-11 px-4 focus:ring-2 focus:ring-cyan-400/40 outline-none text-sm">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl h-11 px-4 focus:ring-2 focus:ring-cyan-400/40 outline-none text-sm">
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">Description / Notes</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-cyan-400/40 outline-none text-sm resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create Diagnosis'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
