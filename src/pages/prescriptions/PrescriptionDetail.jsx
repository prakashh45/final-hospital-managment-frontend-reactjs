import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { prescriptionAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { formatDate, downloadBlob } from '../../utils/helpers';

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await prescriptionAPI.getById(id);
        setPrescription(res.data);
      } catch (err) {
        setError('Failed to load prescription details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      await prescriptionAPI.delete(id);
      navigate('/prescriptions');
    } catch (err) {
      alert('Failed to delete prescription');
    }
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      
      // Hospital Header
      doc.setFontSize(22);
      doc.setTextColor(41, 128, 185); // Brand Blue
      doc.text('AURORA HOSPITAL', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('123 Wellness Avenue, Health City, HC 12345', 105, 28, { align: 'center' });
      doc.text('Phone: +1 (555) 123-4567 | Email: contact@aurorahospital.com', 105, 33, { align: 'center' });
      
      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 40, 195, 40);

      // Prescription Info
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Prescription #${prescription.id}`, 15, 52);
      
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`Date: ${formatDate(prescription.createdAt || prescription.prescribedDate)}`, 15, 60);
      
      // Patient Details
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('Patient Details', 15, 75);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Patient ID: ${prescription.patientId || 'N/A'}`, 15, 82);
      
      // Doctor Details
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('Doctor Details', 120, 75);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Doctor ID: ${prescription.doctorId || 'Assigned Doctor'}`, 120, 82);
      
      // Medicines Table
      if (prescription.medicines && prescription.medicines.length > 0) {
        const tableColumn = ["Medicine", "Dosage", "Frequency", "Duration"];
        const tableRows = [];

        prescription.medicines.forEach(med => {
          const rowData = [
            med.name || med.medicineName || '-',
            med.dosage || '-',
            med.frequency || '-',
            med.duration || '-'
          ];
          tableRows.push(rowData);
        });

        autoTable(doc, {
          startY: 95,
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
          styles: { fontSize: 10 }
        });
      } else {
        doc.text('No medicines listed for this prescription.', 15, 100);
      }

      // Footer (Signature & Stamp)
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 110;
      doc.setFontSize(10);
      doc.text('Doctor Signature:', 140, finalY + 40);
      doc.line(140, finalY + 55, 190, finalY + 55); // Signature line
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('This is a computer-generated document. No physical signature is required.', 105, 280, { align: 'center' });

      // Save PDF
      doc.save(`Prescription_${prescription.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader size="lg" /></div>;
  if (error) return <ErrorMessage message={error} />;
  if (!prescription) return <ErrorMessage message="Prescription not found" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Download className="w-4 h-4"/>} onClick={handleDownload}>PDF</Button>
          <Button variant="secondary" icon={<Edit className="w-4 h-4"/>} onClick={() => navigate(`/prescriptions/${id}/edit`)}>Edit</Button>
          <Button variant="danger" icon={<Trash2 className="w-4 h-4"/>} onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <Card title={`Prescription #${prescription.id}`}>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Patient ID</span>
            <span className="text-white font-medium cursor-pointer hover:underline" onClick={() => navigate(`/patients/${prescription.patientId}`)}>
              {prescription.patientId}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Status</span>
            <Badge>{prescription.status || 'ACTIVE'}</Badge>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-white/40">Date Prescribed</span>
            <span className="text-white">{formatDate(prescription.createdAt || prescription.prescribedDate)}</span>
          </div>
          
          <div className="pt-4">
            <h4 className="text-sm font-medium text-white mb-3">Medicines</h4>
            {prescription.medicines && prescription.medicines.length > 0 ? (
              <div className="space-y-2">
                {prescription.medicines.map((med, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex justify-between">
                     <div>
                       <p className="font-medium text-white">{med.name || med.medicineName}</p>
                       <p className="text-xs text-white/40">{med.dosage} • {med.frequency}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-sm text-white/80">{med.duration}</p>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm">No medicines listed.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
