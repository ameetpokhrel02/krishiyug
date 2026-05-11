import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Loader2, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Package,
  Layers
} from 'lucide-react';
import { insuranceAPI } from '@/services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const ActivePolicies = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response: any = await insuranceAPI.getMyPolicies();
      setPolicies(response?.data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const filtered = policies.filter(p => 
    !search || 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.policyType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Active Policies</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor insurance products offered by your company.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Portfolio</span>
            <span className="text-lg font-black text-emerald-600">Rs. {policies.reduce((acc, p) => acc + (p.coverageAmount || 0), 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by policy name or type..."
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
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Policies Found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {search ? 'No policies match your search.' : 'You haven\'t published any policies yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((policy, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={policy._id}
              className="bg-white rounded-[40px] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all group relative overflow-hidden flex flex-col sm:flex-row gap-8"
            >
              {/* Type Badge & Icon */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className={cn(
                  "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500",
                  policy.policyType === 'livestock' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                )}>
                  {policy.policyType === 'livestock' ? <Activity className="w-10 h-10" /> : <Layers className="w-10 h-10" />}
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  policy.isActive ? "bg-emerald-500 text-white border-emerald-400" : "bg-slate-100 text-slate-400 border-slate-200"
                )}>
                  {policy.isActive ? 'Active' : 'Draft'}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-1">{policy.name}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {policy.description || 'Comprehensive coverage for high-value agricultural assets with AI-assisted verification.'}
                    </p>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-auto">
                  <div className="p-4 bg-slate-50 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Max Coverage</p>
                    <p className="text-sm font-black text-slate-900">Rs. {policy.coverageAmount?.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-3xl">
                    <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mb-1">Premium Rate</p>
                    <p className="text-sm font-black text-emerald-700">{policy.premium}% Annually</p>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
