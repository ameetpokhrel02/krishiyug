import { AIAvatar } from "./AIAvatar";

interface MessageProps {
  content: string;
  timestamp?: string;
}

export const AIMessageBubble = ({ content, timestamp }: MessageProps) => {
  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
      <AIAvatar />
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-zinc-800 dark:text-zinc-200">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        {timestamp && <span className="text-[10px] text-zinc-500 ml-1">{timestamp}</span>}
      </div>
    </div>
  );
};

export const UserMessageBubble = ({ content, timestamp }: MessageProps) => {
  return (
    <div className="flex items-start justify-end gap-3 mb-4 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="flex flex-col items-end gap-1 max-w-[80%]">
        <div className="bg-primary p-4 rounded-2xl rounded-tr-none shadow-md text-primary-foreground">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        {timestamp && <span className="text-[10px] text-zinc-500 mr-1">{timestamp}</span>}
      </div>
    </div>
  );
};
