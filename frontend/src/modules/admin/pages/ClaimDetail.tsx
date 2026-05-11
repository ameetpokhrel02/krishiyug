import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ArrowRight,
  FileText,
  User,
  MapPin,
  Calendar,
  Tag,
  ChevronLeft,
  Sparkles,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AdminClaimDetail = () => {
  const [activeTab, setActiveTab] = useState<'EVIDENCE' | 'REPORT'>('EVIDENCE');
  const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');

  const claimData = {
    id: 'CLM-8827',
    farmer: {
      name: 'Ram Bahadur',
      phone: '9841234567',
      location: 'Jhapa, Nepal',
      joined: '2023-05-12'
    },
    policy: {
      title: 'Monsoon Crop Guard',
      provider: 'Shikhar Insurance',
      coverage: 100000
    },
    incident: {
      date: '2024-03-10',
      description: 'Heavy flood in the Kankai river basin caused total damage to 4 hectares of paddy fields. The water remained for 3 days.',
      tagNumber: 'NEP-8827-JH',
      type: 'Flood / Water Logging'
    },
    aiInsight: {
      riskScore: 12,
      analysis: 'Weather data confirms flood level in Jhapa on 2024-03-10. Satellite imagery shows 85% crop loss in the specified coordinates.',
      status: 'SAFE'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-indigo-950 font-heading">Claim {claimData.id}</h1>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              verificationStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
              verificationStatus === 'REJECTED' ? "bg-red-50 text-red-600 border-red-100" :
              "bg-amber-50 text-amber-600 border-amber-100"
            )}>
              {verificationStatus}
            </span>
          </div>
          <p className="text-sm text-slate-500">Submitted on {claimData.incident.date} • Awaiting Admin Verification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <User className="w-4 h-4 text-indigo-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Farmer</span>
                </div>
                <p className="font-bold text-slate-900">{claimData.farmer.name}</p>
                <p className="text-xs text-slate-500">{claimData.farmer.phone}</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy</span>
                </div>
                <p className="font-bold text-slate-900 truncate">{claimData.policy.title}</p>
                <p className="text-xs text-slate-500">{claimData.policy.provider}</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <Tag className="w-4 h-4 text-amber-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tag ID</span>
                </div>
                <p className="font-bold text-slate-900">{claimData.incident.tagNumber}</p>
                <p className="text-xs text-slate-500">Official Registered ID</p>
             </div>
          </div>

          {/* Evidence Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setActiveTab('EVIDENCE')}
                  className={cn(
                    "px-6 py-4 text-sm font-bold transition-all border-b-2",
                    activeTab === 'EVIDENCE' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  Multimedia Evidence
                </button>
                <button 
                  onClick={() => setActiveTab('REPORT')}
                  className={cn(
                    "px-6 py-4 text-sm font-bold transition-all border-b-2",
                    activeTab === 'REPORT' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  Incident Description
                </button>
             </div>

             <div className="p-6">
                <AnimatePresence mode="wait">
                   {activeTab === 'EVIDENCE' ? (
                     <motion.div
                       key="evidence"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="grid grid-cols-2 md:grid-cols-3 gap-4"
                     >
                       {[1, 2, 3, 4].map((i) => (
                         <div key={i} className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative group border border-slate-200">
                           <img 
                            src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300&sig=${i}`} 
                            className="w-full h-full object-cover" 
                           />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                              <Eye className="w-6 h-6 text-white" />
                           </div>
                           {i === 1 && (
                             <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase rounded">Video</div>
                           )}
                         </div>
                       ))}
                     </motion.div>
                   ) : (
                     <motion.div
                       key="report"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="space-y-4"
                     >
                       <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                             <FileText className="w-4 h-4 text-indigo-500" />
                             Farmer's Statement
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {claimData.incident.description}
                          </p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                             <MapPin className="w-5 h-5 text-red-500" />
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coordinates</p>
                                <p className="text-sm font-bold text-slate-900">26.6500° N, 87.9000° E</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                             <Calendar className="w-5 h-5 text-emerald-500" />
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incident Time</p>
                                <p className="text-sm font-bold text-slate-900">~ 14:30 NST</p>
                             </div>
                          </div>
                       </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Actions */}
        <div className="space-y-6">
          {/* AI Risk Analysis Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
             <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-amber-400" />
                   <h3 className="font-bold font-heading">AI Risk Analysis</h3>
                </div>
                <div className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  claimData.aiInsight.status === 'SAFE' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-red-500/20 text-red-400"
                )}>
                   {claimData.aiInsight.status}
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="flex items-end justify-between">
                   <div>
                      <p className="text-xs text-indigo-300 font-bold mb-1 uppercase tracking-widest">Trust Score</p>
                      <h4 className="text-4xl font-black text-white">{100 - claimData.aiInsight.riskScore}%</h4>
                   </div>
                   <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-emerald-400 rounded-full" 
                        style={{ width: `${100 - claimData.aiInsight.riskScore}%` }} 
                      />
                   </div>
                </div>

                <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                   <p className="text-xs text-indigo-100 leading-relaxed">
                     {claimData.aiInsight.analysis}
                   </p>
                </div>
             </div>
          </div>

          {/* Admin Verification Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
             <h3 className="font-bold text-slate-900 mb-4">Verification Actions</h3>
             
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Status</label>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                    onClick={() => setVerificationStatus('VERIFIED')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                      verificationStatus === 'VERIFIED' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                   >
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="text-xs font-bold">Verified</span>
                   </button>
                   <button 
                    onClick={() => setVerificationStatus('REJECTED')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                      verificationStatus === 'REJECTED' ? "border-red-500 bg-red-50 text-red-700" : "border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                   >
                      <XCircle className="w-6 h-6" />
                      <span className="text-xs font-bold">Invalid</span>
                   </button>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Report (for Insurer)</label>
                <textarea 
                  rows={4}
                  placeholder="Provide detailed verification findings..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                />
             </div>

             <Button className="w-full h-12 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 mt-2">
                Submit Verification
                <ArrowRight className="w-4 h-4 ml-2" />
             </Button>

             <button className="w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Generate Verification PDF
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
