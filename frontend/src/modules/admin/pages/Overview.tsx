import { motion } from 'framer-motion';
import { 
  Users, 
  UserRound, 
  Building2, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Re-using common components or creating local ones for now
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-xl", color)}>
        <Icon className="w-5 h-5" />
      </div>
      {change && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          change.type === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {change.type === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change.value}%
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 font-heading">{value}</h3>
    </div>
  </motion.div>
);

export const AdminOverview = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, Super Admin. Here's what's happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard 
          title="Total Users" 
          value="12,482" 
          change={{ type: 'up', value: 12 }} 
          icon={Users} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <StatCard 
          title="Active Farmers" 
          value="8,245" 
          change={{ type: 'up', value: 8 }} 
          icon={UserRound} 
          color="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="Ward Offices" 
          value="753" 
          icon={Building2} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Total Claims" 
          value="2,148" 
          change={{ type: 'up', value: 15 }} 
          icon={FileText} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Fraud Alerts" 
          value="24" 
          change={{ type: 'down', value: 4 }} 
          icon={AlertTriangle} 
          color="bg-red-50 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900 font-heading">Claim Trends</h3>
              <p className="text-xs text-slate-500">Monthly overview of claims filed vs approved</p>
            </div>
            <select className="text-sm border-slate-200 rounded-lg bg-slate-50 px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Chart visualization goes here</p>
            </div>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold font-heading">AI Fraud Intelligence</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">High Risk Alert</p>
              <p className="text-sm text-indigo-100">Suspicious spike in livestock claims detected in Morang district (24% above average).</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Insight</p>
              <p className="text-sm text-indigo-100">Weather patterns suggest a 15% increase in crop damage claims next week due to predicted hailstorms.</p>
            </div>
          </div>

          <button className="w-full mt-8 py-2.5 bg-white text-indigo-950 font-bold rounded-xl text-sm hover:bg-amber-400 transition-colors">
            View Deep Analysis
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 font-heading">Recent Claims</h3>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Ram Bahadur', district: 'Jhapa', type: 'Paddy Crop', amount: 'Rs. 45,000', status: 'Pending', risk: 'Low', riskColor: 'text-emerald-500 bg-emerald-50' },
                { name: 'Sita Devi', district: 'Morang', type: 'Buffalow', amount: 'Rs. 1,20,000', status: 'Under Review', risk: 'High', riskColor: 'text-red-500 bg-red-50' },
                { name: 'Krishna Subedi', district: 'Kaski', type: 'Poultry', amount: 'Rs. 85,000', status: 'Approved', risk: 'Low', riskColor: 'text-emerald-500 bg-emerald-50' },
                { name: 'Maya Thapa', district: 'Rupandehi', type: 'Wheat', amount: 'Rs. 32,000', status: 'Rejected', risk: 'Medium', riskColor: 'text-amber-500 bg-amber-50' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {row.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.district}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.amount}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      row.status === 'Pending' ? "bg-blue-50 text-blue-600 border-blue-100" :
                      row.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      row.status === 'Rejected' ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold", row.riskColor)}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", row.risk === 'Low' ? 'bg-emerald-500' : row.risk === 'High' ? 'bg-red-500' : 'bg-amber-500')} />
                      {row.risk}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
