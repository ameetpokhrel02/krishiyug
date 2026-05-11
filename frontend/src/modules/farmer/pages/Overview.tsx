import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  CloudSun,
  MapPin,
  Leaf,
  FileText,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { farmerAPI, claimAPI } from '@/services/api';
import { toast } from 'sonner';

export const FarmerOverview = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, claimsRes] = await Promise.all([
          farmerAPI.getProfile(),
          claimAPI.getMyClaims(),
        ]);
        // ApiResponse structure: response.data.data
        setProfile((profileRes as any).data?.data);
        setClaims((claimsRes as any).data?.data || []);
      } catch (err: any) {
        // Fallback to localStorage user if API fails
        const stored = localStorage.getItem('user');
        if (stored) setProfile(JSON.parse(stored));
        toast.error('Could not load live data. Showing cached profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeClaims = claims.filter(c => !['refund_approved', 'rejected'].includes(c.status));
  const farmerDetails = profile?.farmerDetails;

  const stats = [
    {
      label: t('activePolicies'),
      value: farmerDetails ? '—' : '—',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: t('totalCoverage'),
      value: 'See Policies',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: t('pendingClaims'),
      value: activeClaims.length.toString(),
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: t('riskAlert'),
      value: 'Low',
      icon: AlertCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Card */}
      <div className="bg-emerald-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10">
              <CloudSun className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">
                {farmerDetails?.location?.district || 'Nepal'} · {farmerDetails?.farmType === 'livestock' ? '🐄 Livestock' : '🌾 Crop'} Farm
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
              {t('welcome')}, <br />
              <span className="text-emerald-400">{profile?.name?.split(' ')[0] || 'Farmer'}!</span>
            </h1>
            <p className="text-emerald-100/60 text-lg leading-relaxed max-w-md font-medium">
              {farmerDetails?.location?.district
                ? `Your farm in ${farmerDetails.location.district} is under active monitoring.`
                : 'Your farm is registered and under active monitoring.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Farm Size</p>
              <p className="text-3xl font-black">{farmerDetails?.farmSize ?? '—'} <span className="text-lg">Bigha</span></p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Claims</p>
              <p className="text-3xl font-black text-emerald-400">{claims.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Farm Details & Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-emerald-600" />
            {t('monitoredLand')}
          </h3>

          {farmerDetails ? (
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[40px] group hover:bg-emerald-50 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border bg-emerald-100 text-emerald-700 border-emerald-200">
                  Active
                </span>
              </div>
              <h4 className="text-xl font-bold mb-1 capitalize">{farmerDetails.farmType} Farm</h4>
              <p className="text-sm font-bold text-slate-400 mb-2">{farmerDetails.farmSize} Bigha</p>
              <p className="text-sm text-slate-500">
                📍 {farmerDetails.location?.district}, {farmerDetails.location?.village || farmerDetails.location?.palika}
              </p>
              {farmerDetails.cropTypes?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {farmerDetails.cropTypes.map((c: string) => (
                    <span key={c} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full capitalize">{c}</span>
                  ))}
                </div>
              )}
              {farmerDetails.livestockDetails?.earTags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {farmerDetails.livestockDetails.earTags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">🏷 {tag}</span>
                  ))}
                </div>
              )}
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors mt-6" />
            </div>
          ) : (
            <div className="p-8 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 text-center text-slate-400">
              No farm details found.
            </div>
          )}
        </div>

        {/* Recent Claims from API */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black tracking-tighter text-slate-900">{t('recentClaims')}</h3>
          <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
            {claims.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No claims submitted yet.</p>
            ) : (
              <div className="space-y-6">
                {claims.slice(0, 5).map((claim: any) => (
                  <div key={claim._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          #{claim._id?.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-slate-400 capitalize">{claim.policyId?.policyType || 'Claim'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        Rs. {claim.policyId?.coverageAmount?.toLocaleString() || '—'}
                      </p>
                      <p className={cn(
                        "text-[8px] font-black uppercase tracking-widest",
                        claim.status === 'refund_approved' ? "text-emerald-600" :
                          claim.status === 'rejected' ? "text-red-500" :
                            claim.status === 'admin_verified' ? "text-blue-600" :
                              "text-amber-600"
                      )}>
                        {claim.status === 'refund_approved' ? 'Approved' :
                          claim.status === 'admin_verified' ? 'Under Review' :
                            claim.status === 'pending' ? 'Pending' : claim.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
