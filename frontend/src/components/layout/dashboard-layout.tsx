import { Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, ShieldCheck, 
  Users, BarChart3, Bell, Settings, LogOut,
  ScanSearch 
} from 'lucide-react';
import { AIChatbot } from '@/components/chatbot/ai-chatbot';
import { PATHS } from '@/routes/paths';

export const DashboardLayout = () => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();
  const profilePath =
    user?.role === 'admin'
      ? PATHS.ADMIN.PROFILE
      : user?.role === 'insurance_company'
        ? PATHS.INSURANCE.PROFILE
        : PATHS.FARMER.PROFILE;
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Krishiyug AI</h2>
        </div>
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer shadow-sm transition-all">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <FileText className="w-5 h-5" />
              Claims Queue
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <ShieldCheck className="w-5 h-5" />
              Active Policies
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <Users className="w-5 h-5" />
              Farmer Database
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <ScanSearch className="w-5 h-5" />
              Fraud Detection
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <Bell className="w-5 h-5" />
              Notifications
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <Settings className="w-5 h-5" />
              Settings
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-all cursor-pointer">
              <LogOut className="w-5 h-5" />
              Logout
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
            <Link
              to={profilePath}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold cursor-pointer hover:ring-2 hover:ring-primary"
              title="Edit Profile"
            >
              KF
            </Link>
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

