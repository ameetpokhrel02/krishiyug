import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShieldCheck,
  Search,
  Bell,
  Menu,
  LogOut,
  Leaf
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/insurance' },
  { icon: FileText, label: 'Claims Registry', path: '/insurance/claims' },
  { icon: Users, label: 'Insured Farmers', path: '/insurance/farmers' },
  { icon: ShieldCheck, label: 'Active Policies', path: '/insurance/policies' },
];

export const InsuranceOfficerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8faf8] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-emerald-950 text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center border border-white/10">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
               <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none block">Krishiyug</span>
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Insurer Portal</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative",
                    isActive 
                      ? "bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-500/20" 
                      : "text-emerald-100/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-emerald-100/30")} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                  {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Company Account</p>
              <p className="text-sm font-bold text-white truncate">Shikhar Insurance Co.</p>
            </div>
            <button className="flex items-center gap-4 px-5 py-4 text-emerald-100/40 hover:text-white transition-colors w-full group">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-24 bg-white border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <button 
               className="lg:hidden p-3 bg-slate-50 text-slate-600 rounded-xl"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu className="w-6 h-6" />
             </button>
             <div className="relative w-80 hidden xl:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search registry or ID..." 
                 className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all text-sm"
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 relative group transition-all">
              <Bell className="w-5 h-5 group-hover:rotate-12" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">Binod Sharma</p>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Claims Auditor</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-600 text-xs shadow-inner">
                BS
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 overflow-y-auto">
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
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
