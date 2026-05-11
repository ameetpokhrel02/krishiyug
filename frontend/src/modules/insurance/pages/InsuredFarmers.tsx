import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Loader2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { insuranceAPI } from '@/services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const InsuredFarmers = () => {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response: any = await insuranceAPI.getInsuredFarmers();
      setFarmers(response?.data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch insured farmers');
    } finally {
      setLoading(false);
    }
  };

  const filtered = farmers.filter(f => 
    !search || 
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.phoneNumber?.includes(search) ||
    f.farmerDetails?.location?.district?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Insured Farmers</h1>
          <p className="text-sm text-slate-500 font-medium">Farmers associated with your company's insurance policies.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
           <Users className="w-4 h-4" />
           <span className="text-xs font-black uppercase tracking-widest">{farmers.length} Total</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name, phone, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-[32px] border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Farmers Found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {search ? 'Adjust your search to find farmers.' : 'Farmers will appear here once they are associated with your policies.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((farmer, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={farmer._id}
              className="bg-white rounded-[32px] border border-slate-100 p-6 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-lg border border-emerald-100 group-hover:scale-110 transition-transform shadow-inner">
                    {farmer.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{farmer.name}</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                      {farmer.farmerDetails?.farmType || 'General'} Farmer
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-300" />
                  <span className="font-medium">{farmer.phoneNumber}</span>
                </div>
                {farmer.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-300" />
                    <span className="truncate">{farmer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <span>
                    {farmer.farmerDetails?.location?.district || 'Nepal'}
                    {farmer.farmerDetails?.location?.palika ? `, ${farmer.farmerDetails.location.palika}` : ''}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-slate-300" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Joined {new Date(farmer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:gap-2 transition-all">
                  View Detail <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
