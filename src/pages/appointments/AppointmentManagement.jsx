import { useState, useEffect } from 'react';
import { CalendarDays, Check, X, CalendarCheck2 } from 'lucide-react';
import { appointmentAPI } from '../../api/client';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export default function AppointmentManagement() {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentAPI.getAll();
      // Sort by date (closest first)
      const sorted = (res.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(sorted);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Cancelled') {
        await appointmentAPI.cancel(id);
      } else {
        await appointmentAPI.update(id, { status: newStatus });
      }
      toast.success(`Appointment ${newStatus}`);
      await fetchAppointments();
    } catch (err) {
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Completed': return 'primary';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date & Time',
      render: (row) => {
        const d = new Date(row.date);
        return (
          <div className="flex flex-col">
            <span className="text-white font-medium">
              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs text-slate-400">{row.time} - {row.endTime}</span>
          </div>
        );
      },
    },
    {
      key: 'patient',
      label: 'Patient',
      render: (row) => (
        <span className="text-sm text-slate-200">
          Patient ID: {row.patientId}
        </span>
      ),
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      render: (row) => row.doctorName || 'Any Available',
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.reason}</span>
          <span className="text-xs text-slate-500">{row.type} • {row.location}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge color={getStatusBadgeColor(row.status)}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        if (row.status !== 'Pending') {
          return <span className="text-xs text-slate-500 italic">Processed</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateStatus(row.id, 'Confirmed')}
              className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-colors border border-emerald-500/20"
              title="Accept Appointment"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleUpdateStatus(row.id, 'Cancelled')}
              className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors border border-red-500/20"
              title="Reject/Cancel Appointment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <CalendarCheck2 className="w-7 h-7 text-cyan-400" />
            Appointments Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">Review and process patient appointment requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending</span>
            <span className="text-lg font-black text-amber-400">
              {appointments.filter(a => a.status === 'Pending').length}
            </span>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={appointments}
        loading={loading}
        emptyTitle="No Appointments"
        emptyDescription="There are currently no appointments in the system."
      />
    </div>
  );
}
