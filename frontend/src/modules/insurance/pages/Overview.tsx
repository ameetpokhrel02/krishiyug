import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const InsuranceOverview = () => {
  const stats = [
    { label: 'Active Policies', value: '4,281', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Claims', value: '124', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Verified Today', value: '18', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Fraud Risk', value: 'Low', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Market Overview</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Shikhar Insurance Co. | Real-time Data</p>
         </div>
         <div className="flex gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Secure</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-emerald-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter">Claim Velocity</h3>
                    <p className="text-emerald-100/40 text-[10px] font-bold uppercase tracking-widest mt-1">Last 30 Days Activity</p>
                 </div>
                 <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="h-48 flex items-end gap-2 px-4">
                 {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     className="flex-1 bg-emerald-500/20 rounded-t-lg relative group"
                   >
                      <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                   </motion.div>
                 ))}
              </div>
              <div className="flex justify-between mt-6 px-4 text-[8px] font-black text-emerald-100/20 uppercase tracking-widest">
                 <span>May 01</span>
                 <span>May 15</span>
                 <span>Today</span>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-2xl font-black tracking-tighter text-slate-900">High Risk Alerts</h3>
           <div className="space-y-4">
              {[
                { id: 'CLM-902', farmer: 'Ram Bahadur', risk: 'Satellite Mismatch', level: 'High' },
                { id: 'CLM-885', farmer: 'Sita Devi', risk: 'Duplicate Photo', level: 'Med' }
              ].map((alert, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-all group cursor-pointer">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                         <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{alert.id}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{alert.farmer}</p>
                      </div>
                   </div>
                   <p className="text-xs font-medium text-slate-500 mb-4">{alert.risk}</p>
                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", alert.level === 'High' ? 'bg-rose-500 w-full' : 'bg-amber-500 w-2/3')} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
