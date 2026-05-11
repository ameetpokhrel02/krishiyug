import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Zap,
  ArrowUpRight,
  Loader2,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const AdminOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response: any = await adminAPI.getDashboardStats();
      setStats(response?.data?.data);
    } catch (err) {
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Total Farmers',
      value: stats?.farmers ?? 0,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      trend: '+12% this month'
    },
    {
      label: 'Active Policies',
      value: stats?.activePolicies ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: 'Across 4 partners'
    },
    {
      label: 'Pending Verification',
      value: stats?.claims?.pending ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: 'High Priority'
    },
    {
      label: 'Approved Claims',
      value: stats?.claims?.approved ?? 0,
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: 'Rs. 2.4M Disbursed'
    },
    {
      label: 'Rejected Claims',
      value: stats?.claims?.rejected ?? 0,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      trend: 'Fraud Prevention'
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Hero Banner */}
      <div className="bg-indigo-950 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
              <Zap className="w-10 h-10 text-indigo-400 fill-indigo-400/20" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Operational Command Center</p>
              <h1 className="text-4xl font-black tracking-tighter text-white">
                Welcome, {user?.name?.split(' ')[0] || 'Admin'}
              </h1>
              <p className="text-indigo-100/60 font-medium mt-2 max-w-md leading-relaxed">
                Platform status is <span className="text-emerald-400 font-bold">Stable</span>. You have {stats?.claims?.pending ?? 0} claims awaiting administrative verification.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="px-6 py-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1 text-center">Active Farmers</p>
                <p className="text-2xl font-black text-white text-center">{stats?.farmers ?? 0}</p>
             </div>
             <div className="px-6 py-4 bg-indigo-500/20 rounded-3xl border border-indigo-400/20 backdrop-blur-md">
                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1 text-center">System Health</p>
                <p className="text-2xl font-black text-emerald-400 text-center">99.9%</p>
             </div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 bg-white border border-slate-100 rounded-[36px] shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group cursor-default"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner", card.bg, card.color)}>
              <card.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{card.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{card.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fraud Monitoring Card */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">AI Fraud Intelligence</h3>
                    <p className="text-xs text-slate-400 font-medium">Real-time risk assessment and anomaly detection.</p>
                 </div>
              </div>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                 Full Report <ArrowUpRight className="w-3 h-3" />
              </button>
           </div>
           
           <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                       <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">High Risk Claims Detected</p>
                       <p className="text-[10px] text-slate-400 font-medium">Location mismatch in 3 active claims</p>
                    </div>
                 </div>
                 <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[9px] font-black rounded-full uppercase tracking-widest">Action Required</span>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                       <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Identity Verification Status</p>
                       <p className="text-[10px] text-slate-400 font-medium">98% of users are KYC compliant</p>
                    </div>
                 </div>
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest">Healthy</span>
              </div>
           </div>
        </div>

        {/* Quick Actions / Partners */}
        <div className="bg-indigo-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full" />
           <h3 className="text-xl font-black tracking-tighter mb-6 relative z-10">Quick Provisions</h3>
           <div className="space-y-4 relative z-10">
              <button className="w-full p-5 bg-white/10 hover:bg-white/20 rounded-3xl border border-white/10 transition-all flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-bold">Register Insurance Co.</span>
                 </div>
                 <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="w-full p-5 bg-white/10 hover:bg-white/20 rounded-3xl border border-white/10 transition-all flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-bold">Onboard Ward Officer</span>
                 </div>
                 <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="w-full p-5 bg-indigo-500/30 hover:bg-indigo-500/40 rounded-3xl border border-indigo-400/30 transition-all flex items-center justify-between group mt-8">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold">Global System Audit</span>
                 </div>
                 <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
