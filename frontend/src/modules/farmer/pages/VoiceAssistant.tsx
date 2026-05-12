import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiAPI } from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const FarmerVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  // Browser Speech Recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.length > 5) handleProcessVoice();
    } else {
      setTranscript('');
      setAiResponse(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleProcessVoice = async () => {
    setIsProcessing(true);
    try {
      // Use the voice-claim or chat endpoint
      const response: any = await aiAPI.chat([{ role: 'user', content: `[Voice Transcript]: ${transcript}` }]);
      setAiResponse(response?.data?.reply || "I've processed your voice request. How else can I help?");
      toast.success('Voice command processed');
    } catch (err) {
      toast.error('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 mb-4">
           <Sparkles className="w-4 h-4 fill-emerald-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Advanced AI Voice Engine</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Talk to Krishiyug</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Report claims, check policy status, or ask farming advice using just your voice. We support English and Nepali (BETA).
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-12">
        {/* Pulsing Mic Button */}
        <div className="relative">
           <AnimatePresence>
             {isListening && (
               <>
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 2, opacity: 0 }}
                   exit={{ opacity: 0 }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 bg-emerald-500 rounded-full z-0"
                 />
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 2.5, opacity: 0 }}
                   exit={{ opacity: 0 }}
                   transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                   className="absolute inset-0 bg-emerald-400/30 rounded-full z-0"
                 />
               </>
             )}
           </AnimatePresence>
           
           <button
             onClick={toggleListening}
             disabled={isProcessing}
             className={cn(
               "relative z-10 w-40 h-40 rounded-[60px] flex items-center justify-center shadow-2xl transition-all active:scale-95",
               isListening ? "bg-emerald-600 text-white" : "bg-white text-emerald-600 border border-slate-100"
             )}
           >
             {isListening ? (
               <MicOff className="w-16 h-16 animate-pulse" />
             ) : (
               <Mic className="w-16 h-16" />
             )}
           </button>
        </div>

        {/* Status Text */}
        <div className="text-center h-8">
           <p className={cn(
             "text-sm font-black uppercase tracking-[0.3em] transition-colors",
             isListening ? "text-emerald-500" : "text-slate-300"
           )}>
             {isListening ? "Listening Now..." : isProcessing ? "Thinking..." : "Tap to Start Speaking"}
           </p>
        </div>

        {/* Live Transcript Box */}
        <div className="w-full max-w-2xl bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm min-h-[160px] flex flex-col justify-center text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0" />
           
           <AnimatePresence mode="wait">
             {transcript ? (
               <motion.p 
                 key="transcript"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-xl font-bold text-slate-800 leading-relaxed italic"
               >
                 "{transcript}"
               </motion.p>
             ) : (
               <motion.p 
                 key="placeholder"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-slate-300 font-medium"
               >
                 Your spoken words will appear here...
               </motion.p>
             )}
           </AnimatePresence>
        </div>

        {/* AI Response Card */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-emerald-950 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-6">
                  <Volume2 className="w-6 h-6 text-emerald-400" />
               </div>
               <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                     <Waves className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Assistant Response</h3>
                     <p className="text-xl font-medium leading-relaxed italic text-emerald-50">
                       {aiResponse}
                     </p>
                     <Button className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] h-10 mt-4">
                        Perform Action <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-100">
         <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
            <Volume2 className="w-6 h-6 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900 tracking-tight">Voice Recognition</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Speak naturally. We automatically convert your voice to text and process commands.</p>
         </div>
         <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900 tracking-tight">Instant Action</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">"My livestock has a fever" → We start a claim automatically for you.</p>
         </div>
         <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900 tracking-tight">AI Insights</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Ask advice about pest control or crop cycles using the latest agricultural AI.</p>
         </div>
      </div>
    </div>
  );
};
