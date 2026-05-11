import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, ArrowRight, ShieldCheck, ChevronLeft, Locate, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATHS } from '@/routes/paths';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [isDetecting, setIsDetecting] = useState(false);
  const [location, setLocation] = useState({ district: '', palika: '' });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await axios.post(`${API_URL}/location/reverse-geocode`, {
            lat: latitude,
            lng: longitude
          });

          if (response.data.success) {
            setLocation({
              district: response.data.data.district || '',
              palika: response.data.data.palika || ''
            });
          }
        } catch (error) {
          console.error("Location Detection Error:", error);
          alert("Failed to detect location. Please enter manually.");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        alert("Permission denied or location unavailable.");
        setIsDetecting(false);
      }
    );
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

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate(PATHS.AUTH.OTP_VERIFICATION); }}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ram Bahadur" 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="tel" 
                placeholder="98XXXXXXXX" 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Farm Location</label>
                <button 
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
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
                    value={location.district}
                    onChange={(e) => setLocation({...location, district: e.target.value})}
                    placeholder="District" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                  />
                </div>
                <input 
                  type="text" 
                  value={location.palika}
                  onChange={(e) => setLocation({...location, palika: e.target.value})}
                  placeholder="Palika" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                />
             </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-6">
             <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
             <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
               Real-time GPS tracking is enabled for your land. By registering, you agree to provide accurate field coordinates for insurance verification.
             </p>
          </div>

          <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] mt-4">
            Verify & Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
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
