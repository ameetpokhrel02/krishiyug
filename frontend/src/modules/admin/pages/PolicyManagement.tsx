import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  ShieldCheck,
  Leaf,
  Baby,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Policy } from '@/types/platform';

const mockPolicies: Policy[] = [
  { id: 'P1', title: 'Monsoon Crop Guard', category: 'CROP', description: 'Comprehensive coverage for paddy and maize against floods and droughts.', premiumRate: 2.5, coverageAmount: 100000, insuranceCompanyId: 'INS1', insuranceCompanyName: 'Shikhar Insurance', status: 'ACTIVE' },
  { id: 'P2', title: 'Livestock Wellness Plus', category: 'LIVESTOCK', description: 'Premium protection for cattle and buffalos against diseases and accidents.', premiumRate: 1.8, coverageAmount: 150000, insuranceCompanyId: 'INS2', insuranceCompanyName: 'Sagarmatha Insurance', status: 'ACTIVE' },
  { id: 'P3', title: 'Poultry Safety Net', category: 'LIVESTOCK', description: 'Protect your commercial poultry farm from common avian flu and disasters.', premiumRate: 3.0, coverageAmount: 80000, insuranceCompanyId: 'INS1', insuranceCompanyName: 'Shikhar Insurance', status: 'ACTIVE' },
];

export const AdminPolicyManagement = () => {
  const [policies] = useState<Policy[]>(mockPolicies);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Policy Frameworks</h1>
          <p className="text-sm text-slate-500">Define and manage standardized insurance products available on the platform.</p>
        </div>
        <Button className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl h-11 px-6 shadow-lg shadow-indigo-200">
          <Plus className="w-4 h-4 mr-2" />
          Create New Policy
        </Button>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Policies', value: '12', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Drafts', value: '3', icon: Activity, color: 'text-amber-600 bg-amber-50' },
          { label: 'Avg Premium', value: '2.4%', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Enrolled', value: '8.2k', icon: Activity, color: 'text-blue-600 bg-blue-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-lg font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search policies or categories..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
           </div>
           <div className="flex items-center gap-2">
              <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none">
                <option>All Categories</option>
                <option>Crop Insurance</option>
                <option>Livestock Insurance</option>
              </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Name & Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        policy.category === 'CROP' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {policy.category === 'CROP' ? <Leaf className="w-4 h-4" /> : <Baby className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{policy.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{policy.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{policy.insuranceCompanyName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-indigo-600">{policy.premiumRate}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    Rs. {policy.coverageAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
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
