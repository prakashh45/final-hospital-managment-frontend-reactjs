import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { prescriptionAPI } from '../../api/client';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';

export default function PrescriptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isEdit = !!id;
  const patientIdQuery = searchParams.get('patientId') || '';

  const [formData, setFormData] = useState({
    patientId: patientIdQuery,
    prescribedDate: new Date().toISOString().split('T')[0],
    instructions: '',
    doctorName: '',
    status: 'ACTIVE',
    medicines: [
      {
        medicineName: '',
        dosage: '',
        frequency: '',
        durationDays: '',
      },
    ],
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // FETCH PRESCRIPTION
  // =========================

  useEffect(() => {
    if (!isEdit) return;

    const fetchPrescription = async () => {
      try {
        const res = await prescriptionAPI.getById(id);

        setFormData({
          patientId: res.data.patientId || '',
          prescribedDate: res.data.prescribedDate || '',
          instructions: res.data.instructions || '',
          doctorName: res.data.doctorName || '',
          status: res.data.status || 'ACTIVE',

          medicines:
            res.data.medicines?.length > 0
              ? res.data.medicines.map((med) => ({
                  medicineName: med.medicineName || '',
                  dosage: med.dosage || '',
                  frequency: med.frequency || '',
                  durationDays: med.durationDays || '',
                }))
              : [
                  {
                    medicineName: '',
                    dosage: '',
                    frequency: '',
                    durationDays: '',
                  },
                ],
        });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            'Failed to fetch prescription.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, isEdit]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD MEDICINE
  // =========================

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        {
          medicineName: '',
          dosage: '',
          frequency: '',
          durationDays: '',
        },
      ],
    });
  };

  // =========================
  // REMOVE MEDICINE
  // =========================

  const handleRemoveMedicine = (index) => {
    const updated = [...formData.medicines];

    updated.splice(index, 1);

    setFormData({
      ...formData,
      medicines: updated,
    });
  };

  // =========================
  // MEDICINE CHANGE
  // =========================

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];

    updated[index][field] = value;

    setFormData({
      ...formData,
      medicines: updated,
    });
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    if (!formData.patientId) {
      setError('Patient ID is required');
      return false;
    }

    if (!formData.prescribedDate) {
      setError('Prescribed date is required');
      return false;
    }

    if (!formData.instructions.trim()) {
      setError('Instructions are required');
      return false;
    }

    if (!formData.doctorName.trim()) {
      setError('Doctor name is required');
      return false;
    }

    if (!formData.medicines.length) {
      setError('At least one medicine is required');
      return false;
    }

    for (let i = 0; i < formData.medicines.length; i++) {
      const med = formData.medicines[i];

      if (!med.medicineName.trim()) {
        setError(`Medicine name required for medicine ${i + 1}`);
        return false;
      }

      if (!med.dosage.trim()) {
        setError(`Dosage required for medicine ${i + 1}`);
        return false;
      }

      if (!med.frequency.trim()) {
        setError(`Frequency required for medicine ${i + 1}`);
        return false;
      }

      if (!med.durationDays) {
        setError(`Duration required for medicine ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      patientId: Number(formData.patientId),

      prescribedDate: formData.prescribedDate,

      instructions: formData.instructions.trim(),

      doctorName: formData.doctorName.trim(),

      status: formData.status,

      medicines: formData.medicines.map((med) => ({
        medicineName: med.medicineName.trim(),

        dosage: med.dosage.trim(),

        frequency: med.frequency.trim(),

        durationDays: Number(med.durationDays),
      })),
    };

    console.log('FINAL PAYLOAD => ', payload);

    try {
      let res;

      if (isEdit) {
        res = await prescriptionAPI.update(id, payload);

        navigate(`/prescriptions/${id}`);
      } else {
        res = await prescriptionAPI.create(payload);

        navigate(`/prescriptions/${res.data.id}`);
      }
    } catch (err) {
      console.error('API ERROR => ', err);

      console.error('BACKEND RESPONSE => ', err.response?.data);

      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          'Failed to save prescription.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Prescription' : 'Create Prescription'}
          </h1>

          <p className="text-sm text-white/60">
            Manage patient prescription details
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* FORM */}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PRESCRIPTION DETAILS */}

        <Card title="Prescription Details">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              label="Patient ID"
              name="patientId"
              type="number"
              value={formData.patientId}
              onChange={handleChange}
              required
              disabled={isEdit}
            />

            <Input
              label="Prescribed Date"
              type="date"
              name="prescribedDate"
              value={formData.prescribedDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Doctor Name"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
            />

            {/* STATUS */}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-11 rounded-xl bg-brand-gray px-4 text-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* INSTRUCTIONS */}

            <div className="md:col-span-2 space-y-1.5">

              <label className="text-sm font-medium text-white">
                Instructions
              </label>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                required
                className="w-full rounded-xl bg-brand-gray p-4 text-white resize-none"
              />
            </div>
          </div>
        </Card>

        {/* MEDICINES */}

        <Card
          title="Medicines"
          action={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleAddMedicine}
            >
              Add Medicine
            </Button>
          }
        >

          <div className="space-y-4">

            {formData.medicines.map((med, index) => (

              <div
                key={index}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Input
                    placeholder="Medicine Name"
                    value={med.medicineName}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        'medicineName',
                        e.target.value
                      )
                    }
                    required
                  />

                  <Input
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        'dosage',
                        e.target.value
                      )
                    }
                    required
                  />

                  <Input
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        'frequency',
                        e.target.value
                      )
                    }
                    required
                  />

                  <Input
                    type="number"
                    placeholder="Duration Days"
                    value={med.durationDays}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        'durationDays',
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {/* REMOVE BUTTON */}

                {formData.medicines.length > 1 && (
                  <div className="flex justify-end mt-3">

                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ACTIONS */}

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button type="submit" loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Prescription'}
          </Button>
        </div>
      </form>
    </div>
  );
}