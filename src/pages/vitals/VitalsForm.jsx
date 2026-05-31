import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { vitalsAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';

export default function VitalsForm() {
  const { id } = useParams(); // If editing an existing vital record, though mostly we append new ones
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdQuery = searchParams.get('patientId') || '';
  const isEdit = !!id && id !== 'new';

  const [formData, setFormData] = useState({
    patientId: patientIdQuery,
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    respiratoryRate: '',
    oxygenLevel: '',
    weight: '',
    height: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // If editing an existing vitals record (assuming id is passed)
  useEffect(() => {
    if (isEdit) {
       // Mock fetch if editing - typically we just append vitals
    }
  }, [isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await vitalsAPI.update(id, formData);
      } else {
        await vitalsAPI.create(formData);
      }
      navigate(`/patients/${formData.patientId}`); // go back to patient detail
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record vitals.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{isEdit ? 'Edit Vitals' : 'Record Vitals'}</h2>
          <p className="text-sm text-white/40">{isEdit ? 'Update patient vitals' : 'Log current patient vitals'}</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Card icon={<Activity className="w-5 h-5 text-red-400" />} title="Vitals Data">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Patient ID" name="patientId" value={formData.patientId} onChange={handleChange} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Heart Rate (bpm)" type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} />
            <Input label="Blood Pressure (e.g. 120/80)" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
            <Input label="Temperature (°F/°C)" type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} />
            <Input label="Oxygen Level (%)" type="number" name="oxygenLevel" value={formData.oxygenLevel} onChange={handleChange} />
            <Input label="Respiratory Rate (/min)" type="number" name="respiratoryRate" value={formData.respiratoryRate} onChange={handleChange} />
            <Input label="Weight (kg)" type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Vitals</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
