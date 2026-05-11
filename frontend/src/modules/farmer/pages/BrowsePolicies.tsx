import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Leaf, 
  Baby, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Policy } from '@/types/platform';

const mockPolicies: Policy[] = [
  {
    id: 'P1',
    title: 'Monsoon Crop Guard',
    category: 'CROP',
    description: 'Comprehensive coverage for paddy and maize against floods and droughts.',
    premiumRate: 2.5,
    coverageAmount: 100000,
    insuranceCompanyId: 'INS1',
    insuranceCompanyName: 'Shikhar Insurance',
    status: 'ACTIVE'
  },
  {
    id: 'P2',
    title: 'Livestock Wellness Plus',
    category: 'LIVESTOCK',
    description: 'Premium protection for cattle and buffalos against diseases and accidents.',
    premiumRate: 1.8,
    coverageAmount: 150000,
    insuranceCompanyId: 'INS2',
    insuranceCompanyName: 'Sagarmatha Insurance',
    status: 'ACTIVE'
  },
  {
    id: 'P3',
    title: 'Poultry Safety Net',
    category: 'LIVESTOCK',
    description: 'Protect your commercial poultry farm from common avian flu and disasters.',
    premiumRate: 3.0,
    coverageAmount: 80000,
    insuranceCompanyId: 'INS1',
    insuranceCompanyName: 'Shikhar Insurance',
    status: 'ACTIVE'
  },
];

export const FarmerBrowsePolicies = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CROP' | 'LIVESTOCK'>('ALL');

  const filteredPolicies = mockPolicies.filter(p => 
    activeTab === 'ALL' || p.category === activeTab
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Insurance Marketplace</h1>
        <p className="text-sm text-slate-500">Find the best protection for your agriculture assets.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {(['ALL', 'CROP', 'LIVESTOCK'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex-1 md:flex-none",
                activeTab === tab 
                  ? "bg-white text-indigo-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab === 'ALL' ? 'All Policies' : tab === 'CROP' ? 'Crop' : 'Livestock'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search policies or companies..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPolicies.map((policy) => (
          <motion.div
            key={policy.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all"
          >
            <div className={cn(
              "h-2",
              policy.category === 'CROP' ? "bg-emerald-500" : "bg-amber-500"
            )} />
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  policy.category === 'CROP' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  {policy.category === 'CROP' ? <Leaf className="w-6 h-6" /> : <Baby className="w-6 h-6" />}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Rate</p>
                  <p className="text-xl font-black text-indigo-900">{policy.premiumRate}%</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{policy.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                {policy.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Max Coverage: <b>Rs. {policy.coverageAmount.toLocaleString()}</b></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Provider: <b>{policy.insuranceCompanyName}</b></span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Premium</p>
                  <p className="text-sm font-bold text-slate-900">Rs. {(policy.coverageAmount * policy.premiumRate / 100).toLocaleString()}</p>
                </div>
                <Button className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl shadow-lg shadow-indigo-200">
                  Buy Policy
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured AI Recommendation */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 rounded-full mb-4">
              <Info className="w-3 h-3 text-indigo-900" />
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">AI Recommendation</span>
            </div>
            <h2 className="text-3xl font-bold font-heading mb-4">Protect your Rice Harvest</h2>
            <p className="text-indigo-100 mb-6 text-lg leading-relaxed">
              Based on your location (Jhapa) and current season, we recommend the <b>Monsoon Crop Guard</b>. Weather forecasts predict 20% higher rainfall this month.
            </p>
            <div className="flex gap-4">
              <Button className="bg-white text-indigo-900 hover:bg-amber-400 hover:text-indigo-900 font-bold px-8 py-6 rounded-2xl transition-all">
                View Match Details
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="space-y-4">
                   {[
                     { label: 'Weather Risk', value: 'High', color: 'bg-red-400' },
                     { label: 'Soil Health', value: 'Excellent', color: 'bg-emerald-400' },
                     { label: 'Market Demand', value: 'Stable', color: 'bg-indigo-400' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between">
                       <span className="text-sm text-indigo-100">{item.label}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{item.value}</span>
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", item.color)} />
                       </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
