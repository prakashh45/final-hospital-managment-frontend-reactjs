import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Activity,
  Pill,
  Stethoscope,
  FileText,
  User,
  Download,
  Plus,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { patientAPI, diagnosisAPI, prescriptionAPI, vitalsAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import { formatDate, timeAgo } from '../../utils/helpers';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const [patRes, histRes, vitRes, diagRes, rxRes] = await Promise.allSettled([
          patientAPI.getById(id),
          patientAPI.getHistory(id),
          vitalsAPI.getByPatient(id),
          diagnosisAPI.getByPatient(id),
          prescriptionAPI.getByPatient(id),
        ]);

        if (patRes.status === 'fulfilled') setPatient(patRes.value.data);
        if (histRes.status === 'fulfilled') setHistory(histRes.value.data || []);
        if (vitRes.status === 'fulfilled') {
          const vitalsData = vitRes.value.data;
          if (Array.isArray(vitalsData)) {
            const latestVitals = [...vitalsData].sort((a, b) => {
              const aDate = new Date(a?.createdAt || a?.recordedAt || 0).getTime();
              const bDate = new Date(b?.createdAt || b?.recordedAt || 0).getTime();
              return bDate - aDate;
            })[0] || null;
            setVitals(latestVitals);
          } else {
            setVitals(vitalsData || null);
          }
        }
        if (diagRes.status === 'fulfilled') setDiagnoses(diagRes.value.data || []);
        if (rxRes.status === 'fulfilled') setPrescriptions(rxRes.value.data || []);
      } catch (err) {
        setError('Error fetching patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await patientAPI.delete(id);
      navigate('/patients');
    } catch (err) {
      alert('Failed to delete patient');
    }
  };

  const safeText = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const str = String(value).trim();
    return str || 'N/A';
  };

  const patientId = patient?.id || patient?.patientId || id;
  const canManageClinical = user?.role === 'DOCTOR';
  const canRecordVitals = user?.role === 'DOCTOR' || user?.role === 'NURSE';

  const handleDownloadSummary = () => {
    try {
      const doc = new jsPDF();
      const fullName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Unknown Patient';

      doc.setFontSize(18);
      doc.setTextColor(33, 33, 33);
      doc.text('Aurora HMS - Patient Summary', 14, 18);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
      doc.text(`Patient: ${fullName} (${safeText(patientId)})`, 14, 30);

      autoTable(doc, {
        startY: 36,
        head: [['Patient Field', 'Value']],
        body: [
          ['Status', safeText(patient?.status)],
          ['Email', safeText(patient?.email)],
          ['Phone', safeText(patient?.phone)],
          ['Gender', safeText(patient?.gender)],
          ['Blood Group', safeText(patient?.bloodGroup)],
          ['DOB', safeText(formatDate(patient?.dateOfBirth))],
          ['Address', safeText(patient?.address)],
          ['Emergency Contact', safeText(patient?.emergencyContact)],
        ],
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 },
      });

      let cursorY = (doc.lastAutoTable?.finalY || 40) + 8;

      autoTable(doc, {
        startY: cursorY,
        head: [['Current Vitals', 'Value']],
        body: [
          ['Heart Rate', safeText(vitals?.heartRate)],
          ['Blood Pressure', safeText(vitals?.bloodPressure)],
          ['Temperature', safeText(vitals?.temperature)],
          ['Oxygen Level', safeText(vitals?.oxygenLevel || vitals?.spO2)],
          ['Respiratory Rate', safeText(vitals?.respiratoryRate)],
          ['Weight', safeText(vitals?.weight)],
          ['Height', safeText(vitals?.height)],
        ],
        headStyles: { fillColor: [231, 76, 60] },
        styles: { fontSize: 9 },
      });

      cursorY = (doc.lastAutoTable?.finalY || cursorY) + 8;

      autoTable(doc, {
        startY: cursorY,
        head: [['Diagnoses', 'Priority', 'Status', 'Date']],
        body: diagnoses.length
          ? diagnoses.map((d) => [
              safeText(d.condition || d.title),
              safeText(d.priority),
              safeText(d.status),
              safeText(formatDate(d.createdAt || d.diagnosisDate)),
            ])
          : [['No diagnoses found', '-', '-', '-']],
        headStyles: { fillColor: [243, 156, 18] },
        styles: { fontSize: 9 },
      });

      cursorY = (doc.lastAutoTable?.finalY || cursorY) + 8;

      autoTable(doc, {
        startY: cursorY,
        head: [['Prescriptions', 'Status', 'Date', 'Medicine Count']],
        body: prescriptions.length
          ? prescriptions.map((p) => [
              `#${safeText(p.id || p.prescriptionId)}`,
              safeText(p.status),
              safeText(formatDate(p.createdAt || p.prescribedDate)),
              String((p.medicines || []).length),
            ])
          : [['No prescriptions found', '-', '-', '0']],
        headStyles: { fillColor: [39, 174, 96] },
        styles: { fontSize: 9 },
      });

      cursorY = (doc.lastAutoTable?.finalY || cursorY) + 8;

      autoTable(doc, {
        startY: cursorY,
        head: [['Recent History', 'When']],
        body: history.length
          ? history.slice(0, 10).map((h) => [
              safeText(h.description || h.notes),
              safeText(timeAgo(h.date || h.createdAt)),
            ])
          : [['No history records', '-']],
        headStyles: { fillColor: [142, 68, 173] },
        styles: { fontSize: 9 },
      });

      doc.save(`Patient_${safeText(patientId)}_Summary.pdf`);
    } catch (err) {
      console.error('Failed to generate patient summary PDF', err);
      alert('Failed to generate patient summary PDF');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader size="lg" /></div>;
  if (error) return <ErrorMessage message={error} />;
  if (!patient) return <ErrorMessage message="Patient not found" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/patients')} className="text-white/50 hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Patients
        </button>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={handleDownloadSummary}>Summary PDF</Button>
          <Button variant="secondary" icon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/patients/${id}/edit`)}>Edit</Button>
          <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => setShowDeleteModal(true)}>Delete</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {canManageClinical && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate(`/diagnoses/new?patientId=${patientId}`)}
          >
            Add Diagnosis
          </Button>
        )}
        {canManageClinical && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate(`/prescriptions/new?patientId=${patientId}`)}
          >
            Add Prescription
          </Button>
        )}
        {canRecordVitals && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Activity className="w-4 h-4" />}
            onClick={() =>
              vitals?.id
                ? navigate(`/vitals/${vitals.id}/edit?patientId=${patientId}`)
                : navigate(`/vitals/new?patientId=${patientId}`)
            }
          >
            {vitals?.id ? 'Edit Vitals' : 'Record Vitals'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Patient Overview" icon={<User className="text-blue-400 w-5 h-5" />}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold text-white">
                {(patient.firstName || '?')[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{patient.firstName} {patient.lastName}</h3>
                <Badge className="mt-1">{patient.status || 'ACTIVE'}</Badge>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span className="text-white/40">Email</span><span className="text-white">{patient.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span className="text-white/40">Phone</span><span className="text-white">{patient.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span className="text-white/40">Gender</span><span className="text-white">{patient.gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span className="text-white/40">Blood Group</span><span className="text-white">{patient.bloodGroup || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-2">
                <span className="text-white/40">DOB</span><span className="text-white">{formatDate(patient.dateOfBirth)}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-2">
                <span className="text-white/40">Address</span><span className="text-white">{patient.address || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-2">
                <span className="text-white/40">Emergency Contact</span><span className="text-white">{patient.emergencyContact || 'N/A'}</span>
              </div>
            </div>
          </Card>

          <Card
            title="Current Vitals"
            icon={<Activity className="text-red-400 w-5 h-5" />}
            action={
              canRecordVitals ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    vitals?.id
                      ? navigate(`/vitals/${vitals.id}/edit?patientId=${patientId}`)
                      : navigate(`/vitals/new?patientId=${patientId}`)
                  }
                >
                  {vitals?.id ? 'Edit' : 'Record'}
                </Button>
              ) : null
            }
          >
            {vitals ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-center">
                  <p className="text-[10px] text-white/40">Heart Rate</p>
                  <p className="text-lg font-bold text-red-400">{vitals.heartRate}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-center">
                  <p className="text-[10px] text-white/40">BP</p>
                  <p className="text-lg font-bold text-blue-400">{vitals.bloodPressure}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-center">
                  <p className="text-[10px] text-white/40">Temp</p>
                  <p className="text-lg font-bold text-amber-400">{vitals.temperature}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-center">
                  <p className="text-[10px] text-white/40">SpO2</p>
                  <p className="text-lg font-bold text-emerald-400">{vitals.oxygenLevel || vitals.spO2}%</p>
                </div>
              </div>
            ) : <p className="text-xs text-white/30 text-center py-4">No vitals recorded.</p>}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Diagnoses"
            icon={<Stethoscope className="text-amber-400 w-5 h-5" />}
            action={
              canManageClinical ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/diagnoses/new?patientId=${patientId}`)}
                >
                  Add
                </Button>
              ) : null
            }
          >
            {diagnoses.length > 0 ? (
              <div className="space-y-2">
                {diagnoses.map((d, index) => {
                  const diagnosisId = d.id || d.diagnosisId;
                  return (
                    <div key={diagnosisId || index} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex justify-between items-center gap-3">
                      <div>
                        <p className="font-medium text-white">{d.condition || d.title}</p>
                        <p className="text-xs text-white/40">{formatDate(d.createdAt || d.diagnosisDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{d.status}</Badge>
                        {diagnosisId && (
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/diagnoses/${diagnosisId}`)}>
                            View
                          </Button>
                        )}
                        {canManageClinical && diagnosisId && (
                          <Button size="sm" variant="secondary" onClick={() => navigate(`/diagnoses/${diagnosisId}/edit`)}>
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-xs text-white/30 py-4">No diagnoses found.</p>}
          </Card>

          <Card
            title="Prescriptions"
            icon={<Pill className="text-emerald-400 w-5 h-5" />}
            action={
              canManageClinical ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/prescriptions/new?patientId=${patientId}`)}
                >
                  Add
                </Button>
              ) : null
            }
          >
            {prescriptions.length > 0 ? (
              <div className="space-y-2">
                {prescriptions.map((p, index) => {
                  const prescriptionId = p.id || p.prescriptionId;
                  return (
                    <div key={prescriptionId || index} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex justify-between items-center gap-3">
                      <div>
                        <p className="font-medium text-white">Prescription #{prescriptionId || 'N/A'}</p>
                        <p className="text-xs text-white/40">{formatDate(p.createdAt || p.prescribedDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{p.status}</Badge>
                        {prescriptionId && (
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/prescriptions/${prescriptionId}`)}>
                            View
                          </Button>
                        )}
                        {canManageClinical && prescriptionId && (
                          <Button size="sm" variant="secondary" onClick={() => navigate(`/prescriptions/${prescriptionId}/edit`)}>
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-xs text-white/30 py-4">No prescriptions found.</p>}
          </Card>

          <Card
            title="Recent Medical History"
            icon={<FileText className="text-purple-400 w-5 h-5" />}
            action={<Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${id}/history`)}>View Full History</Button>}
          >
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.slice(0, 5).map((h, i) => (
                  <div key={h.id || i} className="flex gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-400" />
                    <div>
                      <p className="text-sm text-white/80">{h.description || h.notes}</p>
                      <p className="text-xs text-white/40 mt-1">{timeAgo(h.date || h.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-white/30 py-4">No history records.</p>}
          </Card>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <p className="text-white/70 mb-6">Are you sure you want to delete patient {patient.firstName}? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Patient</Button>
        </div>
      </Modal>
    </div>
  );
}
