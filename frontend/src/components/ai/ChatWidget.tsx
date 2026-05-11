import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIMessageBubble, UserMessageBubble } from "./MessageBubbles";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { SuggestionChips } from "./Interactions";
import { Sparkles, X, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "नमस्ते! म कृषियुग AI सहायक हुँ। म तपाईंलाई बीमा दावी गर्न मद्दत गर्न सक्छु। के भयो, कृपया बताउनुहोस्?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "बाख्रा मरेको छ",
    "बाली नष्ट भयो",
    "दावी प्रक्रिया के हो?",
    "कागजात के चाहिन्छ?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const newMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        })
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-[400px] h-[600px] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Krishiyug AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] opacity-80">Online | AI-Assisted</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-2">
              {messages.map((msg, i) => (
                msg.role === 'model' ? (
                  <AIMessageBubble key={i} content={msg.content} timestamp={msg.timestamp} />
                ) : (
                  <UserMessageBubble key={i} content={msg.content} timestamp={msg.timestamp} />
                )
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Footer Area */}
          <div className="p-4 pt-0">
            <SuggestionChips suggestions={suggestions} onSelect={handleSend} />
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-16 w-16 shadow-2xl shadow-primary/40 flex items-center justify-center p-0 transition-all duration-300 hover:scale-110 active:scale-95 group"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      )}
    </div>
  );
};
