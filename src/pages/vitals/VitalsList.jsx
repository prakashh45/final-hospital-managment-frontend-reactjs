import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { vitalsAPI, patientAPI, nurseAPI } from '../../api/client';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';

export default function VitalsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [vitals, setVitals] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [wardPatients, setWardPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch vitals for the patient or ward
  const fetchVitals = async () => {
    setLoading(true);
    setError(null);
    try {
      if (patientId) {
        // Fetch patient name
        const patientRes = await patientAPI.getById(patientId);
        setPatientName(patientRes.data?.name || `Patient ${patientId}`);

        // Fetch vitals for this patient
        const vitalsRes = await vitalsAPI.getByPatient(patientId);
        setVitals(vitalsRes.data || []);
      } else {
        // Fetch ward patients to show recent vitals
        const wardRes = await nurseAPI.getWardPatients({ limit: 50 });
        const patients = wardRes.data || [];
        setWardPatients(patients);

        // Collect all vitals from all patients
        const allVitals = [];
        for (const patient of patients) {
          try {
            const vitalsRes = await vitalsAPI.getByPatient(patient.id);
            if (vitalsRes.data && vitalsRes.data.length > 0) {
              allVitals.push(...vitalsRes.data.map(v => ({ ...v, patientName: patient.name || `Patient ${patient.id}` })));
            }
          } catch (err) {
            // Skip patients with no vitals
          }
        }
        // Sort by date descending (most recent first)
        allVitals.sort((a, b) => new Date(b.date || b.recordedAt) - new Date(a.date || a.recordedAt));
        setVitals(allVitals);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vitals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [patientId]);

  const columns = patientId ? [
    {
      key: 'date',
      label: 'Date',
      render: (row) => {
        const date = new Date(row.date || row.recordedAt);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'heartRate',
      label: 'Heart Rate',
      render: (row) => `${row.heartRate || '-'} bpm`,
    },
    {
      key: 'bloodPressure',
      label: 'Blood Pressure',
      render: (row) => row.bloodPressure || '-',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      render: (row) => `${row.temperature || '-'}°F`,
    },
    {
      key: 'respiratoryRate',
      label: 'Respiratory Rate',
      render: (row) => `${row.respiratoryRate || '-'} breaths/min`,
    },
    {
      key: 'oxygenSaturation',
      label: 'O2 Saturation',
      render: (row) => `${row.oxygenSaturation || '-'}%`,
    },
    {
      key: 'weight',
      label: 'Weight',
      render: (row) => `${row.weight || '-'} kg`,
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (row) => (
        <span className="text-xs text-white/60 max-w-xs truncate">
          {row.notes || '-'}
        </span>
      ),
    },
  ] : [
    {
      key: 'patientName',
      label: 'Patient',
      render: (row) => (
        <button
          onClick={() => navigate(`/vitals?patientId=${row.patientId}`)}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {row.patientName}
        </button>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => {
        const date = new Date(row.date || row.recordedAt);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'heartRate',
      label: 'Heart Rate',
      render: (row) => `${row.heartRate || '-'} bpm`,
    },
    {
      key: 'bloodPressure',
      label: 'Blood Pressure',
      render: (row) => row.bloodPressure || '-',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      render: (row) => `${row.temperature || '-'}°F`,
    },
    {
      key: 'respiratoryRate',
      label: 'Respiratory Rate',
      render: (row) => `${row.respiratoryRate || '-'} breaths/min`,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading vitals..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Vitals Records</h2>
          <p className="text-sm text-white/40 mt-1">
            {patientId ? (
              <>
                {patientName} {vitals.length > 0 && `• ${vitals.length} record${vitals.length !== 1 ? 's' : ''}`}
              </>
            ) : (
              <>
                Ward Overview • {vitals.length} recent record{vitals.length !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => patientId ? navigate(`/vitals/new?patientId=${patientId}`) : alert('Please select a patient first')}
        >
          Record Vitals
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Table
        columns={columns}
        data={vitals}
        loading={loading}
        emptyTitle="No Vitals Records"
        emptyDescription={patientId ? "No vitals have been recorded for this patient yet." : "No vitals have been recorded yet."}
      />
    </div>
  );
}
