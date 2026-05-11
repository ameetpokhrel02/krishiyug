import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronRight,
  ShieldCheck,
  Leaf,
  CloudRain,
  Info,
  CheckCircle2,
  Loader2,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { policyAPI } from '@/services/api';
import { toast } from 'sonner';

type PolicyType = 'all' | 'livestock' | 'crop' | 'weather';

export const FarmerBrowsePolicies = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<PolicyType>('all');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await policyAPI.getRecommended();
        const data = (res as any).data?.data;
        setPolicies(data?.policies || []);
        setFarmerProfile(data?.farmerProfile);
      } catch {
        toast.error('Could not load policies. Showing all available policies.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleBuy = async (policyId: string) => {
    setBuying(policyId);
    try {
      await policyAPI.buy(policyId);
      toast.success('Policy purchased! You can now file claims under this policy.');
    } catch (err: any) {
      toast.error(err?.message || 'Purchase failed. Please try again.');
    } finally {
      setBuying(null);
    }
  };

  const filtered = policies.filter(p => {
    const matchesType = activeType === 'all' || p.policyType === activeType;
    const matchesSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.insuranceCompanyId?.companyName?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const policyTypeIcon = (type: string) => {
    if (type === 'livestock') return <Tag className="w-6 h-6" />;
    if (type === 'weather') return <CloudRain className="w-6 h-6" />;
    return <Leaf className="w-6 h-6" />;
  };

  const policyTypeColor = (type: string) => {
    if (type === 'livestock') return 'bg-amber-50 text-amber-600';
    if (type === 'weather') return 'bg-blue-50 text-blue-600';
    return 'bg-emerald-50 text-emerald-600';
  };

  const policyBarColor = (type: string) => {
    if (type === 'livestock') return 'bg-amber-500';
    if (type === 'weather') return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">Insurance Marketplace</h1>
        <p className="text-sm text-slate-500">
          {farmerProfile
            ? `Showing policies recommended for your ${farmerProfile.farmType} farm in ${farmerProfile.region || 'Nepal'}.`
            : 'Browse available insurance policies for your farm.'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto gap-1">
          {(['all', 'crop', 'livestock', 'weather'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveType(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex-1 md:flex-none",
                activeType === tab
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search policies or providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
      </div>

      {/* Policies Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <ShieldCheck className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm font-bold">No policies match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((policy: any) => (
            <motion.div
              key={policy._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] border border-slate-100 overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all"
            >
              <div className={cn("h-2", policyBarColor(policy.policyType))} />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-xl", policyTypeColor(policy.policyType))}>
                    {policyTypeIcon(policy.policyType)}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Premium</p>
                    <p className="text-xl font-black text-emerald-900">
                      Rs. {policy.premium?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{policy.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">{policy.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Coverage: <b>Rs. {policy.coverageAmount?.toLocaleString()}</b></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>By: <b>{policy.insuranceCompanyId?.companyName || 'Partner Company'}</b></span>
                  </div>
                  {policy.applicableRegions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {policy.applicableRegions.map((r: string) => (
                        <span key={r} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-full uppercase">{r}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className={cn(
                    "px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-full",
                    policyTypeColor(policy.policyType)
                  )}>
                    {policy.policyType}
                  </span>
                  <Button
                    onClick={() => handleBuy(policy._id)}
                    disabled={buying === policy._id}
                    className="bg-emerald-950 hover:bg-black text-white rounded-2xl shadow-lg shadow-emerald-200 text-[10px] font-black uppercase tracking-widest"
                  >
                    {buying === policy._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Get Policy <ChevronRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Recommendation Banner */}
      {farmerProfile && (
        <div className="bg-emerald-950 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full mb-4 border border-emerald-500/30">
                <Info className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">AI Recommendation</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4">
                {farmerProfile.farmType === 'livestock' ? 'Protect Your Livestock' : 'Protect Your Harvest'}
              </h2>
              <p className="text-emerald-100/70 text-sm leading-relaxed">
                Based on your {farmerProfile.farmType} farm profile in {farmerProfile.region || 'Nepal'},
                we have curated the most suitable policies above for maximum coverage at best value.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Farm Type', value: farmerProfile.farmType },
                { label: 'Region', value: farmerProfile.region || 'Nepal' },
                { label: 'Recommended', value: `${filtered.length} Plans` },
                { label: 'AI Score', value: 'Optimized' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-black capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
