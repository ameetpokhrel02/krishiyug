import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  Info,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ClaimStep = 'POLICY' | 'EVIDENCE' | 'DETAILS' | 'REVIEW';

export const FarmerSubmitClaim = () => {
  const [step, setStep] = useState<ClaimStep>('POLICY');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [files, setFiles] = useState<{ id: string; type: 'IMAGE' | 'VIDEO'; url: string }[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock upload
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'IMAGE' as const,
      url: URL.createObjectURL(e.target.files![0])
    };
    setFiles([...files, newFile]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Submit Insurance Claim</h1>
        <p className="text-sm text-slate-500">Provide details and evidence for your insurance claim.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {(['POLICY', 'EVIDENCE', 'DETAILS', 'REVIEW'] as const).map((s, idx) => {
          const isActive = step === s;
          const isDone = ['POLICY', 'EVIDENCE', 'DETAILS', 'REVIEW'].indexOf(step) > idx;
          
          return (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3 shrink-0">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                  isActive ? "bg-indigo-900 text-white ring-4 ring-indigo-100" : 
                  isDone ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isActive ? "text-indigo-900" : "text-slate-400"
                )}>
                  {s}
                </span>
              </div>
              {idx < 3 && <div className="h-px w-full max-w-[40px] bg-slate-100 mx-2 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 'POLICY' && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-6"
            >
              <h3 className="text-xl font-bold text-slate-900">Select Active Policy</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'POL-101', title: 'Monsoon Crop Guard', validUntil: '2024-12-31', company: 'Shikhar Insurance' },
                  { id: 'POL-205', title: 'Livestock Wellness Plus', validUntil: '2024-09-15', company: 'Sagarmatha Insurance' }
                ].map((pol) => (
                  <label key={pol.id} className={cn(
                    "relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                    selectedPolicy === pol.id ? "border-indigo-500 bg-indigo-50/30" : "border-slate-100 hover:border-slate-200"
                  )}>
                    <input 
                      type="radio" 
                      name="policy" 
                      className="w-5 h-5 accent-indigo-600" 
                      checked={selectedPolicy === pol.id}
                      onChange={() => setSelectedPolicy(pol.id)}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{pol.title}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-slate-500">ID: {pol.id}</span>
                        <span className="text-xs text-slate-500">Expires: {pol.validUntil}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{pol.company}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'EVIDENCE' && (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Upload Evidence</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold">Clear images/videos required</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="aspect-square rounded-2xl bg-slate-100 relative overflow-hidden group border border-slate-200">
                    <img src={file.url} alt="Evidence" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add Media</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                 <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                 <p className="text-xs text-slate-600 leading-relaxed">
                   Please include at least 2 photos of the damage/incident and 1 video walkthrough. For livestock claims, ensure the <b>official ear tag</b> is clearly visible.
                 </p>
              </div>
            </motion.div>
          )}

          {step === 'DETAILS' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-6"
            >
              <h3 className="text-xl font-bold text-slate-900">Claim Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-500" />
                      Tag Number (for Livestock)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. NEP-8273-01" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Estimated Loss Amount (Rs.)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50000" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Description of Incident</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide details about what happened..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={step === 'POLICY'}
          onClick={() => {
            if (step === 'EVIDENCE') setStep('POLICY');
            if (step === 'DETAILS') setStep('EVIDENCE');
          }}
          className="rounded-xl px-8 h-12 border-slate-200"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => {
            if (step === 'POLICY') setStep('EVIDENCE');
            else if (step === 'EVIDENCE') setStep('DETAILS');
            else if (step === 'DETAILS') setStep('REVIEW');
          }}
          disabled={step === 'POLICY' && !selectedPolicy}
          className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl px-8 h-12 shadow-xl shadow-indigo-200"
        >
          {step === 'DETAILS' ? 'Review Claim' : 'Next Step'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
