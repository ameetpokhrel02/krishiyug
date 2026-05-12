import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  ShieldAlert, 
  History, 
  Settings,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  UserRound
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogoutDialog } from '@/components/shared/LogoutDialog';
import { PATHS } from '@/routes/paths';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Building2, label: 'Insurance Partners', path: '/admin/insurance/companies' },
  { icon: ShieldCheck, label: 'Policy Registry', path: '/admin/policies' },
  { icon: FileText, label: 'Claims Monitoring', path: '/admin/claims' },
  { icon: ShieldAlert, label: 'Fraud Detection', path: '/admin/fraud' },
  { icon: History, label: 'Audit Logs', path: '/admin/audit-logs' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
  { icon: UserRound, label: 'Profile', path: PATHS.ADMIN.PROFILE },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-indigo-950 text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:block shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-indigo-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover:rotate-6 transition-transform">
              <Zap className="w-7 h-7 text-indigo-400 fill-indigo-400/20" />
            </div>
            <div>
               <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none block">Krishiyug</span>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Platform Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group relative",
                    isActive 
                      ? "bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/20" 
                      : "text-indigo-100/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-indigo-100/30")} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                  {isActive && <motion.div layoutId="activeNavAdmin" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary */}
          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Authenticated As</p>
              <p className="text-sm font-bold text-white truncate">{user?.name || 'System Admin'}</p>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-4 px-5 py-4 text-indigo-100/40 hover:text-red-400 transition-colors w-full group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Sign Out System</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-6">
             <button 
               className="lg:hidden p-3 bg-slate-50 text-slate-600 rounded-xl"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu className="w-6 h-6" />
             </button>
             <div className="relative w-96 hidden xl:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search platform resources, users, or claims..." 
                 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[20px] outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all text-sm font-medium"
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 relative group transition-all">
              <Bell className="w-5 h-5 group-hover:rotate-12" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Super Administrator</p>
              </div>
              <Link
                to={PATHS.ADMIN.PROFILE}
                className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xs shadow-inner cursor-pointer hover:ring-2 hover:ring-indigo-500/20 transition"
                title="Edit profile"
              >
                {initials}
              </Link>
            </div>
          </div>
        </header>

        <div className="p-10 overflow-y-auto bg-slate-50/50 flex-1">
          <Outlet />
        </div>
      </main>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <LogoutDialog open={showLogout} onClose={() => setShowLogout(false)} theme="indigo" />
    </div>
  );
};
