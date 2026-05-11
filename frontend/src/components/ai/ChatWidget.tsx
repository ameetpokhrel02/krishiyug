import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  X, 
  Bot, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sendChat } from '@/services/aiService';

interface Message {
  role: 'user' | 'assistant';
  parts: { text: string }[];
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      parts: [{ text: "नमस्कार! म कृषियुग एआई सहायक हुँ। म तपाईंलाई बीमा वा दाबी प्रक्रियामा कसरी मद्दत गर्न सक्छु? (Hello! I am Krishiyug AI. How can I help you?)" }] 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<'ne-NP' | 'en-US'>('ne-NP');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.concat(userMessage);
      const response = await sendChat(history);
      const aiMessage: Message = { role: 'assistant', parts: [{ text: response.message }] };
      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-speak if the user was using voice
      if (isListening || true) { // Defaulting to speak for better accessibility
        speak(response.message);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        parts: [{ text: "माफ गर्नुहोस्, अहिले सेवामा समस्या छ। (Sorry, there's a service issue right now.)" }] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[400px] max-w-[90vw] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative">
                  <Bot className="w-6 h-6" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-900" />
                </div>
                <div>
                  <h3 className="font-bold">Krishiyug Assistant</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-200 uppercase font-black tracking-widest">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Powered by AI
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLanguage(l => l === 'ne-NP' ? 'en-US' : 'ne-NP')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{language === 'ne-NP' ? 'नेपाली' : 'EN'}</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100" 
                      : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"
                  )}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-indigo-700 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'ne-NP' ? "तपाईंको प्रश्न लेख्नुहोस्..." : "Ask your question..."}
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                />

                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-900 hover:bg-indigo-950 text-white w-10 h-10 rounded-xl p-0 shadow-lg shadow-indigo-100"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3 px-1">
                 <button 
                   onClick={() => window.speechSynthesis.cancel()} 
                   className={cn(
                     "flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors",
                     isSpeaking ? "text-indigo-600" : "text-slate-400"
                   )}
                 >
                    {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    {isSpeaking ? "Speaking AI response..." : "Voice Output Active"}
                 </button>
                 <span className="text-[9px] text-slate-400 italic">Nepali/English Supported</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-indigo-900 text-white rounded-2xl shadow-2xl shadow-indigo-200 flex items-center justify-center relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
           <Sparkles className="w-2.5 h-2.5 text-indigo-900" />
        </div>
      </motion.button>
    </div>
  );
};
