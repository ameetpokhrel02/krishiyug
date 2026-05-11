import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(PATHS.AUTH.RESET_PASSWORD);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        <Link to={PATHS.AUTH.LOGIN} className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block transition-colors">
          &larr; Back to login
        </Link>
        <h1 className="text-3xl font-heading font-bold text-indigo-950 mb-2">
          Forgot Password
        </h1>
        <p className="text-slate-500">
          Enter your registered email or phone to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email or Phone</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="Enter your email or phone"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 transition-all shadow-md mt-6"
        >
          Send Reset Link
        </button>
      </form>
    </motion.div>
  );
};
