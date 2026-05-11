import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATHS } from '@/routes/paths';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ phoneNumber: '', password: '' });
  const selectedRole = location.state?.selectedRole || 'FARMER';
  const canRegister = selectedRole === 'FARMER';

  const roleLabels: Record<string, string> = {
    FARMER: 'Farmer',
    WARD_OFFICER: 'Ward Officer',
    INSURANCE_OFFICER: 'Insurance Officer',
    ADMIN: 'Administrator',
    insurance_agent: 'Insurance Agent',
    ward_official: 'Ward Official',
    insurance_company: 'Insurance Company'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.phoneNumber || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await authAPI.login({
        phoneNumber: credentials.phoneNumber,
        password: credentials.password
      });

      // Response structure: { data: { statusCode, success, message, data: { user, token, redirectTo } } }
      const responseData = response?.data;
      const token = responseData?.data?.token;
      const user = responseData?.data?.user;
      const redirectTo = responseData?.data?.redirectTo;

      if (responseData?.success && token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful!');
        
        // Route based on the backend's redirectTo or user role
        const path = redirectTo || PATHS.DASHBOARD[user?.role as keyof typeof PATHS.DASHBOARD] || '/dashboard';
        navigate(path);
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
    <div className="flex-1 flex flex-col p-8 lg:p-12 justify-center bg-white">
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-4 border border-emerald-100">
             <ShieldCheck className="w-3 h-3" />
             <span className="text-[10px] font-bold uppercase tracking-widest">{roleLabels[selectedRole]} Access</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tighter mb-2 font-heading">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Secure login to your agricultural dashboard.</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Contact Identity</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Phone Number (10 digits)" 
                value={credentials.phoneNumber}
                onChange={(e) => setCredentials({...credentials, phoneNumber: e.target.value.replace(/\D/g, '')})}
                disabled={isLoading}
                maxLength={10}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Security Key</label>
              <Link to={PATHS.AUTH.FORGOT_PASSWORD} className="text-[10px] font-bold text-emerald-600 hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                disabled={isLoading}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm disabled:opacity-50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 bg-emerald-950 hover:bg-black text-white rounded-2xl font-bold shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-[11px] disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In to System'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-6">
          {canRegister ? (
            <p className="text-slate-500 text-sm">
              New to Krishiyug? {' '}
              <Link to={PATHS.AUTH.ROLE_SELECTION} className="text-emerald-600 font-bold hover:underline">Register Here</Link>
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              {selectedRole === 'ADMIN'
                ? 'Admins use the dedicated login page and are onboarded by the KrishiYug team.'
                : 'This role is onboarded by the KrishiYug team and does not self-register.'}
            </p>
          )}
          <div className="flex items-center gap-4 py-2 opacity-30">
            <div className="h-px bg-slate-400 flex-1" />
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Digital Trust Network</span>
            <div className="h-px bg-slate-400 flex-1" />
          </div>
          <p className="text-[9px] text-slate-400 leading-relaxed px-4 italic">
            "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals & happiness."
          </p>
        </div>
      </div>
    </div>
  );
};
