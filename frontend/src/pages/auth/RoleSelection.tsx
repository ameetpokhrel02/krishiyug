import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tractor, 
  ShieldCheck, 
  Settings, 
  ChevronLeft
} from 'lucide-react';
import { PATHS } from '@/routes/paths';
import { cn } from '@/lib/utils';

const roles = [
  {
    id: 'FARMER',
    title: 'Farmer',
    description: 'Protect your crops & livestock',
    icon: Tractor,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'hover:border-emerald-500',
  },
  {
    id: 'INSURANCE_OFFICER',
    title: 'Insurance Partner',
    description: 'Process & verify claims',
    icon: ShieldCheck,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'hover:border-emerald-500',
  },
  {
    id: 'ADMIN',
    title: 'KrishiYug Team',
    description: 'Platform verification & mediation',
    icon: Settings,
    color: 'bg-slate-50 text-slate-600',
    borderColor: 'hover:border-slate-500',
  },
];

export const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    if (roleId === 'FARMER') {
      // Farmers navigate to login; registration link is available from there
      navigate(PATHS.AUTH.LOGIN, { state: { selectedRole: roleId } });
    } else if (roleId === 'ADMIN') {
      // Admins use the dedicated admin login page and do not register
      navigate(PATHS.AUTH.ADMIN_LOGIN, { state: { selectedRole: roleId } });
    } else {
      // Insurance partners are onboarded by KrishiYug and can only login
      navigate(PATHS.AUTH.LOGIN, { state: { selectedRole: roleId } });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 justify-center bg-white">
      <div className="max-w-md mx-auto w-full">
        <Link to={PATHS.HOME} className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors mb-12 uppercase tracking-[0.2em]">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Portal
        </Link>

        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Identify Yourself</h1>
        <p className="text-slate-500 mb-12 text-sm font-medium leading-relaxed">
          Select your role to access the Krishiyug ecosystem. Farmers can self-register, while partners must be onboarded by our team.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(role.id)}
              className={cn(
                "p-8 rounded-[32px] border-2 border-slate-100 text-left transition-all group flex items-center gap-6 shadow-sm hover:shadow-xl",
                role.borderColor
              )}
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-inner", role.color)}>
                <role.icon className="w-8 h-8" />
              </div>
              <div>
                 <h3 className="font-black text-slate-900 text-lg tracking-tight">{role.title}</h3>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-widest mt-1">{role.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 text-center">
           <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 mb-8">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Need Partnership?</p>
              <p className="text-xs text-emerald-600 font-medium">Contact partnership@krishiyug.com for onboarding.</p>
           </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Official krishiyug.com trust network
          </p>
        </div>
      </div>
    </div>
  );
};
