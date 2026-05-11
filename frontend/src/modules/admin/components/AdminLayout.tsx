import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserRound, 
  Building2, 
  ShieldAlert, 
  FileText, 
  PieChart, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Search,
  UserCircle
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { label: 'Farmer Management', icon: UserRound, path: '/admin/farmers' },
  { 
    label: 'Ward Management', 
    icon: Building2, 
    items: [
      { label: 'Municipalities', path: '/admin/wards/municipalities' },
      { label: 'Ward Officers', path: '/admin/wards/officers' },
    ]
  },
  { 
    label: 'Insurance Management', 
    icon: ShieldAlert, 
    items: [
      { label: 'Companies', path: '/admin/insurance/companies' },
      { label: 'Insurance Officers', path: '/admin/insurance/officers' },
    ]
  },
  { label: 'Claims Monitoring', icon: FileText, path: '/admin/claims' },
  { label: 'Fraud Detection', icon: ShieldAlert, path: '/admin/fraud' },
  { label: 'Analytics', icon: PieChart, path: '/admin/analytics' },
  { label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs' },
];

const SidebarItem = ({ item, isCollapsed }: { item: any; isCollapsed: boolean }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = location.pathname === item.path || item.items?.some((sub: any) => sub.path === location.pathname);

  if (item.items) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
            isActive ? "bg-indigo-50 text-indigo-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-90")} />
          )}
        </button>
        {isOpen && !isCollapsed && (
          <div className="ml-9 mt-1 space-y-1">
            {item.items.map((sub: any) => (
              <Link
                key={sub.path}
                to={sub.path}
                className={cn(
                  "block px-3 py-1.5 text-sm rounded-md transition-colors",
                  location.pathname === sub.path 
                    ? "text-indigo-600 font-medium" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 mb-1 group",
        location.pathname === item.path 
          ? "bg-indigo-50 text-indigo-900 shadow-sm" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
    </Link>
  );
};

export const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-inter">
      {/* Sidebar Desktop */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 fixed h-full z-30",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-sm bg-amber-500" />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-heading font-bold text-xl text-indigo-950 tracking-tight">Krishiyug</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="mb-4">
            {!isSidebarCollapsed && <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Menu</p>}
            {navItems.map((item) => (
              <SidebarItem key={item.label} item={item} isCollapsed={isSidebarCollapsed} />
            ))}
          </div>

          <div className="pt-4 border-t border-slate-50">
             {!isSidebarCollapsed && <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">System</p>}
             <SidebarItem item={{ label: 'Notifications', icon: Bell, path: '/admin/notifications' }} isCollapsed={isSidebarCollapsed} />
             <SidebarItem item={{ label: 'Settings', icon: Settings, path: '/admin/settings' }} isCollapsed={isSidebarCollapsed} />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-w-0",
        isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden lg:flex" 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-3 py-1.5 w-64 lg:w-96 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all border border-transparent focus-within:border-indigo-500/30">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-slate-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            
            <div className="h-8 w-px bg-slate-200 mx-1" />
            
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Amit Pokhrel</p>
                <p className="text-[10px] text-slate-500 mt-1">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-indigo-600" />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="relative w-72 bg-white h-full flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm bg-amber-500" />
                </div>
                <span className="font-heading font-bold text-xl text-indigo-950 tracking-tight">Krishiyug</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4">
              {navItems.map((item) => (
                <SidebarItem key={item.label} item={item} isCollapsed={false} />
              ))}
            </nav>

            <div className="p-4 border-t border-slate-50">
              <button className="flex items-center gap-3 w-full px-3 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
};
