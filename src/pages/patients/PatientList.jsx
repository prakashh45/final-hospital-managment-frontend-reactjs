import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Plus, Filter, Users } from 'lucide-react';
import { patientAPI } from '../../api/client';
import useDebounce from '../../hooks/useDebounce';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import ErrorMessage from '../../components/ui/ErrorMessage';

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (debouncedSearch) {
          res = await patientAPI.search(debouncedSearch);
        } else {
          const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
          res = await patientAPI.getAll(params);
        }
        setPatients(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [debouncedSearch, statusFilter]);

  const columns = [
    {
      key: 'name',
      label: 'Patient Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/60">
            {(row.firstName || row.name || '?')[0]}
          </div>
          <div>
            <p className="font-medium text-white">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-white/40">{row.email || row.phone}</p>
          </div>
        </div>
      ),
    },
    { key: 'gender', label: 'Gender' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => <Badge>{row.status || 'ACTIVE'}</Badge> 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Patients</h2>
          <p className="text-sm text-white/40 mt-1">Manage patient records and histories</p>
        </div>
        <Button onClick={() => navigate('/patients/new')} icon={<Plus className="w-5 h-5" />}>
          Add Patient
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="w-full sm:w-48 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-brand-gray border border-transparent rounded-xl h-11 px-4 text-white focus:ring-2 focus:ring-white/20 appearance-none pl-10"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISCHARGED">Discharged</option>
            <option value="CRITICAL">Critical</option>
            <option value="STABLE">Stable</option>
          </select>
          <Filter className="w-5 h-5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Table
          columns={columns}
          data={patients}
          loading={loading}
          emptyTitle="No patients found"
          emptyDescription="Try adjusting your search or filters."
          onRowClick={(row) => {
            const patientId = row.id || row.patientId;
            if (!patientId) return;
            navigate(`/patients/${patientId}`);
          }}
        />
      </motion.div>
    </div>
  );
}
