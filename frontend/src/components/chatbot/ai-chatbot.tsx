import { useState } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Namaste! I am your Krishiyug AI assistant. How can I help you with your insurance claim today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: "I've analyzed your request. Please upload a photo of the crop damage to continue." }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 flex items-center justify-center p-0"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] h-[500px] shadow-2xl flex flex-col border-primary/20 bg-card overflow-hidden">
      <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <CardTitle className="text-white text-sm">Krishiyug AI Assistant</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white border border-border text-foreground rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-3 border-t border-border bg-white">
        <div className="flex w-full gap-2">
          <Input 
            placeholder="Type your question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
