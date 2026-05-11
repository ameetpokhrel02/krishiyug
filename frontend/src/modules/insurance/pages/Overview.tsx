import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { insuranceAPI } from '@/services/api';
import { toast } from 'sonner';

export const InsuranceOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, claimsRes] = await Promise.all([
          insuranceAPI.getDashboard(),
          insuranceAPI.getAllClaims(),
        ]);
        // ApiResponse: response.data.data
        setStats((dashRes as any).data?.data);
        setRecentClaims(((claimsRes as any).data?.data || []).slice(0, 5));
      } catch (err: any) {
        toast.error('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Total Claims',
      value: stats?.claims?.total ?? 0,
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Pending Review',
      value: stats?.claims?.pendingReview ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Approved',
      value: stats?.claims?.approved ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Rejected',
      value: stats?.claims?.rejected ?? 0,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Active Policies',
      value: stats?.activePolicies ?? 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-emerald-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Insurance Partner Dashboard</p>
            <h1 className="text-4xl font-black tracking-tighter text-white">
              {stats?.companyName || 'Insurance Company'}
            </h1>
            <p className="text-emerald-100/60 font-medium mt-1">
              You have <span className="text-emerald-400 font-black">{stats?.claims?.pendingReview ?? 0}</span> claim{stats?.claims?.pendingReview !== 1 ? 's' : ''} awaiting your review.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", card.bg, card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-3xl font-black text-slate-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Claims Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tighter">Recent Claims</h3>
          <a href="/insurance/claims" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Farmer</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">District</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Coverage</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm">
                    No claims found for your policies.
                  </td>
                </tr>
              ) : (
                recentClaims.map((claim: any) => (
                  <tr key={claim._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-700 text-xs">
                          {claim.farmerId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{claim.farmerId?.name || '—'}</p>
                          <p className="text-[10px] text-slate-400">{claim.farmerId?.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">
                      {claim.farmerId?.farmerDetails?.location?.district || '—'}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full uppercase tracking-widest capitalize">
                        {claim.policyId?.policyType || '—'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900">
                      Rs. {claim.policyId?.coverageAmount?.toLocaleString() || '—'}
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                        claim.status === 'refund_approved' ? "bg-emerald-100 text-emerald-700" :
                        claim.status === 'admin_verified' ? "bg-blue-100 text-blue-700" :
                        claim.status === 'rejected' ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {claim.status === 'admin_verified' ? 'Needs Decision' :
                         claim.status === 'refund_approved' ? 'Approved' :
                         claim.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
