import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { patientAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: '',
    address: '',
    emergencyContact: ''
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchPatient = async () => {
        try {
          const res = await patientAPI.getById(id);
          const data = res.data;
          setFormData({
            ...data,
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''
          });
        } catch (err) {
          setError('Failed to fetch patient details.');
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        const patientId = id || formData.id || formData.patientId;
        if (!patientId) {
          throw new Error('Patient ID is missing. Please reopen the patient record and try again.');
        }
        await patientAPI.update(patientId, formData);
        navigate(`/patients/${patientId}`);
      } else {
        const res = await patientAPI.create(formData);
        const createdPatientId = res.data?.id || res.data?.patientId;
        navigate(createdPatientId ? `/patients/${createdPatientId}` : '/patients');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError('Patient update endpoint was not found (404). Please check API route for patient update on the backend.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to save patient record.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{isEdit ? 'Edit Patient' : 'Add New Patient'}</h2>
          <p className="text-sm text-white/40">{isEdit ? 'Update patient information' : 'Create a new patient record'}</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl h-11 px-4 focus:ring-2 focus:ring-cyan-400/40 outline-none text-sm">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+, A-" />
            <Input label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Name & Phone" />
            
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-cyan-400/40 outline-none text-sm resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Create Patient'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
