import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, ArrowRight, ShieldCheck, ChevronLeft, Locate, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATHS } from '@/routes/paths';
import { locationAPI, authAPI } from '@/services/api';
import { toast } from 'sonner';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    district: '',
    palika: '',
    wardNumber: '',
  });
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response: any = await locationAPI.reverseGeocode(latitude, longitude);

          if (response?.success || response?.data) {
            setFormData(prev => ({
              ...prev,
              district: response?.data?.district || '',
              palika: response?.data?.palika || '',
              wardNumber: response?.data?.ward || ''
            }));
            toast.success('Location detected successfully!');
          } else {
            toast.error(response?.message || 'Failed to detect location');
          }
        } catch (error: any) {
          console.error("Location Detection Error:", error);
          toast.error("Failed to detect location. Please enter manually.");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        toast.error("Permission denied or location unavailable.");
        setIsDetecting(false);
      }
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phoneNumber || !formData.password || !formData.district || !formData.palika) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.phoneNumber.length !== 10 || !/^[6-9]/.test(formData.phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await authAPI.register({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: 'farmer',
        farmerDetails: {
          location: {
            district: formData.district,
            palika: formData.palika,
            ward: formData.wardNumber || ''
          }
        }
      });

      if (response?.success || response?.data?.token) {
        const token = response?.data?.token || response?.token;
        const user = response?.data?.user || response?.user;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Registration successful!');
        navigate(PATHS.FARMER.OVERVIEW);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Registration failed. Try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 justify-center">
      <div className="max-w-sm mx-auto w-full">
        <Link to={PATHS.AUTH.ROLE_SELECTION} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Change Role
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">Farmer Registry</h1>
          <p className="text-slate-500 text-sm">Join the ecosystem to protect your agricultural assets.</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ram Bahadur" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="tel"
                maxLength={10} 
                placeholder="98XXXXXXXX" 
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input 
              type="password" 
              placeholder="Min 8 characters" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm disabled:opacity-50"
            />
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Farm Location</label>
                <button 
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetecting || isLoading}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Locate className="w-3 h-3" />}
                  Auto-Detect
                </button>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="District" 
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all disabled:opacity-50"
                  />
                </div>
                <input 
                  type="text" 
                  value={formData.palika}
                  onChange={(e) => setFormData({...formData, palika: e.target.value})}
                  placeholder="Palika" 
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all disabled:opacity-50"
                />
             </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-6">
             <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
             <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
               Real-time GPS tracking is enabled for your land. By registering, you agree to provide accurate field coordinates for insurance verification.
             </p>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Verify & Create Account'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account? {' '}
            <Link to={PATHS.AUTH.LOGIN} className="text-indigo-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
