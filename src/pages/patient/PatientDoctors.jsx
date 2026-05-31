/* ============================================
   PatientDoctors.jsx — AarogyKendra
   ============================================
   List of doctors, showing specialty, experience,
   and book appointment buttons.
   ============================================ */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doctorDataAPI } from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Search, MapPin, Award, CalendarDays, Star } from 'lucide-react';
import Input from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export default function PatientDoctors() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await doctorDataAPI.getAll();
        setDoctors(res.data || []);
      } catch (err) {
        toast.error('Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [toast]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader text="Finding doctors..." size="lg" /></div>;
  }

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Find a Doctor</h2>
          <p className="text-sm text-slate-400 mt-1">Browse and book appointments with our specialists.</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Input 
          placeholder="Search by name or specialty..." 
          icon={<Search className="w-5 h-5" />} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No doctors found matching "{search}".
          </div>
        ) : (
          filteredDoctors.map(doc => (
            <Card key={doc.id} className="flex flex-col hover:border-cyan-500/30 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900 shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${doc.color}80, ${doc.color})` }}
                >
                  {doc.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{doc.name}</h3>
                  <p className="text-sm font-medium text-cyan-400 mt-0.5">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-700'}`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">(4.8)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>{doc.experience} Years Exp.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="truncate">AarogyKendra Main Branch</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300 mt-2">
                  <span className="text-xs px-2 py-1 bg-slate-800 rounded-md text-slate-400">{doc.qualification.split(',')[0]}</span>
                  {doc.qualification.split(',')[1] && <span className="text-xs px-2 py-1 bg-slate-800 rounded-md text-slate-400">{doc.qualification.split(',')[1]}</span>}
                </div>
              </div>

              <Button fullWidth onClick={() => toast.info(`Booking interface for ${doc.name} would open here.`)}>
                Book Appointment
              </Button>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
