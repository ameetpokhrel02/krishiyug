import React, { useState } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VoiceInputButton } from "./Interactions";

interface ChatInputProps {
  onSend: (message: string) => void;
  onImageUpload?: (file: File) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSend, onImageUpload, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="pr-20 py-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none ring-offset-transparent focus-visible:ring-1 focus-visible:ring-primary/20"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <VoiceInputButton onTranscript={(text) => setInput(text)} />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-zinc-400 hover:text-primary"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && onImageUpload?.(e.target.files[0])}
            />
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="rounded-2xl h-[52px] w-[52px] p-0 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
