import { motion } from 'framer-motion';
import { Tractor, Building2, Shield, Eye, Users, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { id: 'farmer', title: 'Farmer', icon: Tractor, desc: 'File claims & track status', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'palika', title: 'Palika Officer', icon: Building2, desc: 'Verify local claims', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'insurance', title: 'Insurance Officer', icon: Shield, desc: 'Process payouts', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { id: 'witness', title: 'Witness', icon: Eye, desc: 'Attest local claims', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'cooperative', title: 'Cooperative Agent', icon: Users, desc: 'Manage member claims', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'admin', title: 'Admin', icon: ShieldAlert, desc: 'Platform management', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  ];

  const handleSelectRole = (roleId: string) => {
    navigate(`${PATHS.AUTH.REGISTER}?role=${roleId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        <Link to={PATHS.AUTH.WELCOME} className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-heading font-bold text-indigo-950 mb-2">
          Choose Your Role
        </h1>
        <p className="text-slate-500">
          Select how you want to use the Krishiyug platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <motion.button
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole(role.id)}
            className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all text-left"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${role.color}`}>
              <role.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{role.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{role.desc}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to={PATHS.AUTH.LOGIN} className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          Log in
        </Link>
      </div>
    </motion.div>
  );
};
