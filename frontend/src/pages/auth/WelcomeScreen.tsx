import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const WelcomeScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-bold text-indigo-950 mb-3">
          Welcome to Krishiyug
        </h1>
        <p className="text-slate-500">
          The intelligent agricultural insurance platform for Nepal.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          to={PATHS.AUTH.LOGIN}
          className="group relative flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors">Log In</h3>
              <p className="text-sm text-slate-500">Access your existing account</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to={PATHS.AUTH.ROLE_SELECTION}
          className="group relative flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors">Create Account</h3>
              <p className="text-sm text-slate-500">Register as a new user</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
};
