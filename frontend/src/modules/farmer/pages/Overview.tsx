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
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export const FarmerOverview = () => {
  const { t } = useLanguage();
  
  const stats = [
    { label: t('activePolicies'), value: '03', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('totalCoverage'), value: 'Rs. 2.4M', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('pendingClaims'), value: '01', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t('riskAlert'), value: 'Low', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Card */}
      <div className="bg-emerald-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10">
                 <CloudSun className="w-4 h-4 text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Birtamod: 24°C Sunny</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
                {t('welcome')}, <br /> Ram Bahadur!
              </h1>
              <p className="text-emerald-100/60 text-lg leading-relaxed max-w-md font-medium">
                Your paddy fields in Jhapa are currently under active satellite monitoring. No immediate risks detected.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Soil Moisture</p>
                 <p className="text-3xl font-black">68%</p>
                 <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="w-[68%] h-full bg-emerald-500 rounded-full" />
                 </div>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Health Index</p>
                 <p className="text-3xl font-black text-emerald-400">0.82</p>
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

      {/* Main Grid: My Land & Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                 <MapPin className="w-6 h-6 text-emerald-600" />
                 {t('monitoredLand')}
              </h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'East Field (Rice)', area: '4.2 Bigha', status: 'Optimal' },
                { name: 'North Orchard', area: '1.5 Bigha', status: 'Needs Water' }
              ].map((plot, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-8 rounded-[40px] group hover:bg-emerald-50 transition-colors">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <Leaf className="w-6 h-6 text-emerald-600" />
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                        plot.status === 'Optimal' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"
                      )}>{plot.status}</span>
                   </div>
                   <h4 className="text-xl font-bold mb-1">{plot.name}</h4>
                   <p className="text-sm font-bold text-slate-400 mb-8">{plot.area}</p>
                   <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-2xl font-black tracking-tighter text-slate-900">{t('recentClaims')}</h3>
           <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
              <div className="space-y-8">
                 {[
                   { id: 'CLM-902', status: 'In Review', amount: 'Rs. 45,000' },
                   { id: 'CLM-881', status: 'Paid', amount: 'Rs. 120,000' }
                 ].map((claim, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                            <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">{claim.id}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-slate-900">{claim.amount}</p>
                         <p className={cn("text-[8px] font-black uppercase tracking-widest", claim.status === 'Paid' ? "text-emerald-600" : "text-amber-600")}>{claim.status}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
