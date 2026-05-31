import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ListOrdered } from 'lucide-react';
import { queueAPI } from '../../api/client';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ErrorMessage from '../../components/ui/ErrorMessage';

export default function QueueManagement() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await queueAPI.getAll();
      setQueue(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const queueItem = queue.find(item => item.id === id);
      if (queueItem) {
        await queueAPI.update(id, { 
          ...queueItem, 
          status 
        });
      }
      fetchQueue();
    } catch (err) {
      console.error('Failed to update status:', err);
      // alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    { key: 'tokenNumber', label: 'Token', render: (row) => <span className="font-bold text-white text-lg">#{row.tokenNumber}</span> },
    { key: 'patientName', label: 'Patient', render: (row) => row.patientName || `Patient ${row.patientId}` },
    { key: 'department', label: 'Department' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <select 
           className="bg-brand-gray border border-white/10 rounded px-2 py-1 text-xs text-white"
           value={row.status || 'WAITING'}
           onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          <option value="WAITING">WAITING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Queue Management</h2>
          <p className="text-sm text-white/40 mt-1">Manage patient waiting lists</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => {}}>
          Add to Queue
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Table
        columns={columns}
        data={queue}
        loading={loading}
        emptyTitle="Queue is empty"
        emptyDescription="No patients are currently waiting."
      />
    </div>
  );
}
