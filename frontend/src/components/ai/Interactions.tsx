import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const VoiceInputButton = ({ onTranscript: _onTranscript }: { onTranscript: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Logic for speech-to-text would go here
    if (!isListening) {
      console.log("Started listening...");
    } else {
      console.log("Stopped listening.");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full transition-all duration-300 ${isListening ? 'bg-red-50 border-red-200 scale-110 shadow-lg' : 'hover:bg-primary/5'}`}
      onClick={toggleListening}
    >
      {isListening ? (
        <MicOff className="w-5 h-5 text-red-500 animate-pulse" />
      ) : (
        <Mic className="w-5 h-5 text-primary" />
      )}
    </Button>
  );
};

export const SuggestionChips = ({ suggestions, onSelect }: { suggestions: string[], onSelect: (s: string) => void }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm"
        >
          {s}
        </button>
      ))}
    </div>
  );
};
