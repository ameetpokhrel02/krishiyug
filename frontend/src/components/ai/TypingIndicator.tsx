import React from 'react';
import { AIAvatar } from "./AIAvatar";

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <AIAvatar />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};
