
import { Outlet } from 'react-router-dom';
import { AIChatbot } from '@/components/chatbot/ai-chatbot';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Krishiyug AI</h2>
        </div>
        <nav className="mt-6 px-4">
          {/* Navigation links will go here */}
          <div className="space-y-1">
            <div className="h-10 px-4 flex items-center rounded-lg bg-primary/10 text-primary font-medium cursor-pointer">
              Dashboard
            </div>
            <div className="h-10 px-4 flex items-center rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
              Claims
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header Placeholder */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="text-sm font-medium text-muted-foreground">
            Welcome back, <span className="text-foreground font-semibold">Krishiyug Farmer</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              KF
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Global AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

