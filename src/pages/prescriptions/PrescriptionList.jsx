import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { prescriptionAPI } from '../../api/client';
import useDebounce from '../../hooks/useDebounce';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { formatDate } from '../../utils/helpers';

export default function PrescriptionList() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (debouncedSearch) params.patientId = debouncedSearch; // Search by patient ID as basic fallback
        if (statusFilter) params.status = statusFilter;
        const res = await prescriptionAPI.getAll(params);
        setPrescriptions(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load prescriptions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [debouncedSearch, statusFilter]);

  const columns = [
    { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
    { key: 'patientId', label: 'Patient ID' },
    { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
    { key: 'date', label: 'Date', render: (row) => formatDate(row.createdAt || row.prescribedDate) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Prescriptions</h2>
          <p className="text-sm text-white/40 mt-1">Manage patient medications</p>
        </div>
        <Button onClick={() => navigate('/prescriptions/new')} icon={<Plus className="w-5 h-5" />}>
          Add Prescription
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by Patient ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
          className="w-full max-w-sm"
        />
        <div className="relative w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-brand-gray border border-transparent rounded-xl h-11 px-4 pl-10 text-white focus:ring-2 focus:ring-white/20 appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Filter className="w-5 h-5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Table
        columns={columns}
        data={prescriptions}
        loading={loading}
        emptyTitle="No prescriptions found"
        onRowClick={(row) => navigate(`/prescriptions/${row.id}`)}
      />
    </div>
  );
}
