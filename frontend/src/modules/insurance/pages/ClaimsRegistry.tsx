import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  FileCheck, 
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockClaims = [
  {
    id: 'CLM-8827',
    farmer: 'Ram Bahadur',
    policy: 'Monsoon Crop Guard',
    amount: 45000,
    adminStatus: 'VERIFIED',
    adminTrustScore: 92,
    date: '2024-03-15',
    district: 'Jhapa'
  },
  {
    id: 'CLM-8832',
    farmer: 'Sita Devi',
    policy: 'Livestock Wellness Plus',
    amount: 120000,
    adminStatus: 'VERIFIED',
    adminTrustScore: 88,
    date: '2024-03-16',
    district: 'Morang'
  },
  {
    id: 'CLM-8840',
    farmer: 'Krishna Subedi',
    policy: 'Poultry Safety Net',
    amount: 85000,
    adminStatus: 'PENDING',
    adminTrustScore: 45,
    date: '2024-03-18',
    district: 'Kaski'
  }
];

export const InsuranceClaimsRegistry = () => {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading mb-1">Claims Processing</h1>
          <p className="text-sm text-slate-500">Review Admin-verified claims and issue final settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-11 border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11">
            Batch Approve
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Review', value: '14', icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Settled Today', value: '28', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'High Risk Flagged', value: '3', icon: ShieldAlert, color: 'text-red-600 bg-red-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
            </div>
            <div className={cn("p-3 rounded-xl", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Claim Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Verification</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trust Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{claim.farmer}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{claim.id} • {claim.policy}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      claim.adminStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {claim.adminStatus === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {claim.adminStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    Rs. {claim.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", claim.adminTrustScore > 80 ? "bg-emerald-500" : "bg-amber-500")} 
                            style={{ width: `${claim.adminTrustScore}%` }} 
                          />
                       </div>
                       <span className={cn("text-xs font-bold", claim.adminTrustScore > 80 ? "text-emerald-600" : "text-amber-600")}>
                         {claim.adminTrustScore}%
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      onClick={() => setSelectedClaim(claim)}
                      size="sm" 
                      variant="outline" 
                      className="rounded-lg border-slate-200 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                    >
                      Process
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Review Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClaim(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <FileCheck className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">Reviewing Claim {selectedClaim.id}</h3>
                      <p className="text-xs text-slate-500 font-medium">Verification provided by Krishiyug Admin</p>
                   </div>
                </div>
                <button onClick={() => setSelectedClaim(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <ChevronDown className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Verification Report */}
                <div className="space-y-6">
                   <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                         <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                         <span className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Admin Verification Report</span>
                      </div>
                      <p className="text-sm text-emerald-800 leading-relaxed italic">
                        "The multimedia evidence provided by the farmer clearly shows damage to 4 hectares of paddy due to flood. Ear tag numbers verified against registry. No previous claims recorded for this season. Recommended for full refund."
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tag Number</p>
                         <p className="text-sm font-bold text-slate-900">NEP-8827-JH</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Incident Date</p>
                         <p className="text-sm font-bold text-slate-900">2024-03-10</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Evidence Gallery</p>
                      <div className="grid grid-cols-2 gap-2">
                         <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Eye className="w-6 h-6 text-white" />
                            </div>
                         </div>
                         <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1495107333217-61242730b201?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Eye className="w-6 h-6 text-white" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right: Decision Panel */}
                <div className="flex flex-col">
                   <div className="flex-1 bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-6">
                      <h4 className="font-bold text-slate-900 mb-4">Officer Action</h4>
                      <div className="space-y-4">
                         <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Settlement Amount (Rs.)</label>
                            <input 
                              type="number" 
                              defaultValue={selectedClaim.amount}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-lg font-black text-indigo-900" 
                            />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Internal Remarks</label>
                            <textarea 
                              rows={4}
                              placeholder="Notes for the insurance company records..."
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                            />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <Button className="h-14 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-2xl font-bold flex gap-2">
                         <XCircle className="w-5 h-5" />
                         Reject Claim
                      </Button>
                      <Button className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 flex gap-2">
                         <CheckCircle2 className="w-5 h-5" />
                         Refund & Close
                      </Button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
