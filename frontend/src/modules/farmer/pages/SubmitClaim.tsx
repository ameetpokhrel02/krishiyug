import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  Tag,
  Loader2,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { policyAPI, claimAPI } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

type ClaimStep = 'POLICY' | 'EVIDENCE' | 'DETAILS' | 'REVIEW';

export const FarmerSubmitClaim = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ClaimStep>('POLICY');
  const [policies, setPolicies] = useState<any[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [files, setFiles] = useState<{ id: string; file: File; url: string; type: 'image' | 'video' }[]>([]);
  const [tagNumber, setTagNumber] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const res = await policyAPI.getRecommended();
        const data = (res as any).data?.data;
        setPolicies(data?.policies || []);
      } catch {
        toast.error('Could not load your policies. Please try again.');
      } finally {
        setLoadingPolicies(false);
      }
    };
    loadPolicies();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const f = e.target.files[0];
    const isVideo = f.type.startsWith('video/') || f.name.toLowerCase().endsWith('.mp4');
    
    // Size Validation
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
    
    if (isVideo) {
      if (f.size > MAX_VIDEO_SIZE) {
        toast.error('Video size exceeds 50MB limit.');
        return;
      }
    } else {
      if (f.size > MAX_IMAGE_SIZE) {
        toast.error('Image size exceeds 5MB limit.');
        return;
      }
    }

    setFiles(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      url: URL.createObjectURL(f),
      type: isVideo ? 'video' : 'image',
    }]);
    e.target.value = '';
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleSubmit = async () => {
    if (!selectedPolicy) { toast.error('Please select a policy.'); return; }
    if (files.length === 0) { toast.error('Please upload at least one image or video.'); return; }
    if (description.length < 10) { toast.error('Please provide a description (min 10 characters).'); return; }
    if (selectedPolicy.policyType === 'livestock' && !tagNumber) {
      toast.error('Tag number is required for livestock claims.'); return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('policyId', selectedPolicy._id);
      formData.append('description', description);
      if (tagNumber) formData.append('tagNumber', tagNumber);

      const images = files.filter(f => f.type === 'image');
      const video = files.find(f => f.type === 'video');
      images.forEach(f => formData.append('images', f.file));
      if (video) formData.append('video', video.file);

      await claimAPI.submit(formData);
      toast.success('Claim submitted successfully! Our team will verify it shortly.');
      navigate(PATHS.FARMER.OVERVIEW);
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps: ClaimStep[] = ['POLICY', 'EVIDENCE', 'DETAILS', 'REVIEW'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">Submit Insurance Claim</h1>
        <p className="text-sm text-slate-500">Provide details and multimedia evidence for your insurance claim.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto gap-2">
        {steps.map((s, idx) => {
          const isActive = step === s;
          const isDone = steps.indexOf(step) > idx;
          return (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3 shrink-0">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all",
                  isActive ? "bg-emerald-950 text-white ring-4 ring-emerald-100" :
                  isDone ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={cn(
                  "text-xs font-black uppercase tracking-wider hidden sm:block",
                  isActive ? "text-emerald-950" : "text-slate-400"
                )}>{s}</span>
              </div>
              {idx < 3 && <div className="h-px flex-1 min-w-[16px] bg-slate-100 mx-1" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">

          {/* STEP 1: SELECT POLICY */}
          {step === 'POLICY' && (
            <motion.div key="policy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Select a Policy</h3>
              {loadingPolicies ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm">No active policies found. Please purchase a policy first.</p>
                  <Button onClick={() => navigate(PATHS.FARMER.BROWSE)} variant="outline" className="mt-4 rounded-2xl">
                    Browse Policies
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {policies.map((pol: any) => (
                    <label key={pol._id} className={cn(
                      "relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer",
                      selectedPolicy?._id === pol._id
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-slate-100 hover:border-slate-200"
                    )}>
                      <input
                        type="radio"
                        name="policy"
                        className="w-5 h-5 accent-emerald-600"
                        checked={selectedPolicy?._id === pol._id}
                        onChange={() => setSelectedPolicy(pol)}
                      />
                      <div className="flex-1">
                        <p className="font-black text-slate-900">{pol.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500 capitalize">{pol.policyType} • Coverage: Rs. {pol.coverageAmount?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{pol.insuranceCompanyId?.companyName}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: UPLOAD EVIDENCE */}
          {step === 'EVIDENCE' && (
            <motion.div key="evidence" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Upload Evidence</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold">{files.length} file{files.length !== 1 ? 's' : ''} added</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((f) => (
                  <div key={f.id} className="aspect-square rounded-2xl bg-slate-100 relative overflow-hidden group border border-slate-200">
                    {f.type === 'image' ? (
                      <img src={f.url} alt="Evidence" className="w-full h-full object-cover" />
                    ) : (
                      <video src={f.url} className="w-full h-full object-cover" />
                    )}
                    <button onClick={() => removeFile(f.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-black rounded uppercase">{f.type}</span>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Add Media</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                </label>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Include at least 2 clear photos of the damage. For livestock claims, ensure the official <b>ear tag is clearly visible</b>. 
                  <br />
                  <span className="text-[10px] text-slate-400">
                    Limits: Images max 5MB, Videos max 50MB (MP4).
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 'DETAILS' && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Claim Information</h3>
              <div className="space-y-4">
                {selectedPolicy?.policyType === 'livestock' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      Livestock Ear Tag Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tagNumber}
                      onChange={e => setTagNumber(e.target.value)}
                      placeholder="e.g. NP-CHT-001"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-slate-700">
                    Description of Incident <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe what happened, when it happened, and the extent of damage..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none"
                  />
                  <p className="text-[10px] text-slate-400 text-right">{description.length}/500 chars (min 10)</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 'REVIEW' && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Review & Submit</h3>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy</span>
                    <span className="text-sm font-black text-slate-900">{selectedPolicy?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coverage</span>
                    <span className="text-sm font-black text-slate-900">Rs. {selectedPolicy?.coverageAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Files</span>
                    <span className="text-sm font-black text-slate-900">{files.length} file(s)</span>
                  </div>
                  {tagNumber && (
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ear Tag</span>
                      <span className="text-sm font-black text-slate-900">{tagNumber}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</span>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">{description}</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Your claim will be reviewed by the KrishiYug team within <b>2-3 business days</b>. 
                    You will receive notifications at each stage of the process.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={step === 'POLICY'}
          onClick={() => {
            if (step === 'EVIDENCE') setStep('POLICY');
            if (step === 'DETAILS') setStep('EVIDENCE');
            if (step === 'REVIEW') setStep('DETAILS');
          }}
          className="rounded-2xl px-8 h-12 border-slate-200"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step === 'REVIEW' ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-emerald-950 hover:bg-black text-white rounded-2xl px-8 h-12 shadow-xl shadow-emerald-200 font-black uppercase tracking-widest text-[11px]"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Claim <ChevronRight className="w-4 h-4 ml-2" /></>}
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (step === 'POLICY' && selectedPolicy) setStep('EVIDENCE');
              else if (step === 'EVIDENCE' && files.length > 0) setStep('DETAILS');
              else if (step === 'DETAILS' && description.length >= 10) setStep('REVIEW');
              else toast.error('Please complete this step before continuing.');
            }}
            className="bg-emerald-950 hover:bg-black text-white rounded-2xl px-8 h-12 shadow-xl shadow-emerald-200 font-black uppercase tracking-widest text-[11px]"
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
