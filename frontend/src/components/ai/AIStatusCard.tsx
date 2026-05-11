import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIStatusCardProps {
  status: 'analyzing' | 'complete' | 'flagged';
  title: string;
  description: string;
  confidence?: number;
}

export const AIStatusCard = ({ status, title, description, confidence }: AIStatusCardProps) => {
  const getIcon = () => {
    switch (status) {
      case 'analyzing': return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'complete': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'flagged': return <AlertCircle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getBorder = () => {
    switch (status) {
      case 'analyzing': return 'border-primary/20 bg-primary/5';
      case 'complete': return 'border-green-100 bg-green-50/30';
      case 'flagged': return 'border-amber-100 bg-amber-50/30';
    }
  };

  return (
    <Card className={`border shadow-sm overflow-hidden transition-all duration-300 ${getBorder()}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
          {description}
        </p>
        {confidence && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 bg-zinc-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-zinc-500">{(confidence * 100).toFixed(0)}% AI Confidence</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
