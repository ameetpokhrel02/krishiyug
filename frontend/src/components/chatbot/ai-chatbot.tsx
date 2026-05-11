import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { aiAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Namaste! I am your Krishiyug AI assistant. How can I help you with your agriculture insurance today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Connect to real AI endpoint
      const response: any = await aiAPI.chat(newMessages);
      const botReply = response?.data?.reply || "I'm having trouble processing that right now. Please try again or contact support.";
      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm offline. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-[22px] shadow-2xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center p-0 transition-all hover:scale-110 active:scale-95 group"
          >
            <Bot className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center border-4 border-[#f8faf8]">
               <Sparkles className="w-2 h-2 text-white fill-white" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <Card className="w-[380px] h-[550px] shadow-2xl flex flex-col border-emerald-100 bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="bg-emerald-900 p-6 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center border border-white/10">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm font-black tracking-tight">Krishiyug AI</CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Assistant</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <CardContent 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfdfc] custom-scrollbar"
              >
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={cn(
                      "max-w-[85%] p-4 text-sm leading-relaxed",
                      m.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-[24px] rounded-tr-none shadow-lg shadow-emerald-600/10' 
                        : 'bg-white border border-emerald-100 text-slate-700 rounded-[24px] rounded-tl-none shadow-sm'
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-emerald-100 p-4 rounded-[24px] rounded-tl-none shadow-sm flex items-center gap-2">
                       <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                       <span className="text-xs text-slate-400 font-medium italic">Assistant is typing...</span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 border-t border-slate-50 bg-white">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex w-full gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100"
                >
                  <input 
                    placeholder="Ask about crops, policies..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-4 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
