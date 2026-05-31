import { useState, useEffect } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { taskAPI } from '../../api/client';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { formatDate } from '../../utils/helpers';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskAPI.getAll();
      setTasks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await taskAPI.update(id, { ...task, status });
      }
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      // alert(`Failed to update task: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    { key: 'title', label: 'Task', render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'assignedTo', label: 'Assignee', render: (row) => row.assignedTo || 'Unassigned' },
    { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
    { key: 'priority', label: 'Priority', render: (row) => <Badge>{row.priority || 'MEDIUM'}</Badge> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <select 
           className="bg-brand-gray border border-white/10 rounded px-2 py-1 text-xs text-white"
           value={row.status || 'PENDING'}
           onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <p className="text-sm text-white/40 mt-1">Manage ward tasks and shifts</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => {}}>
          New Task
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <Table
        columns={columns}
        data={tasks}
        loading={loading}
        emptyTitle="No tasks"
        emptyDescription="All caught up!"
      />
    </div>
  );
}
