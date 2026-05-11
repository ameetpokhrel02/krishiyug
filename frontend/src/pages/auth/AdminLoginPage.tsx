import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const AdminLoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await authAPI.adminLogin({ identifier, password });
      
      // Response structure: { data: { statusCode, success, message, data: { user, token } } }
      const responseData = response?.data; // The ApiResponse object
      const token = responseData?.data?.token;
      const user = responseData?.data?.user;
      
      if (responseData?.success && token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success('Login successful!');
        navigate(PATHS.ADMIN.ROOT);
      } else {
        toast.error(responseData?.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col p-8 lg:p-12 justify-center bg-white"
    >
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-4 border border-emerald-100">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Administrator Access</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-sm text-slate-500 mb-6">
            Use the admin account created by the KrishiYug team. Admins do not register from the public form.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 mt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email or Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              placeholder="Enter your email or phone number"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="form-checkbox rounded border-slate-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
              disabled={isLoading}
            />
            Remember Me
          </label>
        </div>
        <Button type="submit" className="w-full h-14 bg-emerald-950 hover:bg-black text-white rounded-2xl font-bold shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-[11px]">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Signing In...' : 'Sign In to System'}
        </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLoginPage;
