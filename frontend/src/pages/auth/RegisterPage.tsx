import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import { LocationMapPicker } from '@/components/common/LocationMapPicker';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'farmer';
  const navigate = useNavigate();

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleMapLocationSelect = (location: { district: string; municipality: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      district: location.district || prev.district,
      municipality: location.municipality || prev.municipality,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'insurance') {
      localStorage.setItem('mockRole', 'INSURANCE');
      navigate(PATHS.DASHBOARD.INSURANCE);
    } else {
      navigate(PATHS.AUTH.OTP_VERIFICATION);
    }
  };

  const detectLocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            
            if (apiKey) {
              const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
              
              if (response.data.results && response.data.results.length > 0) {
                const addressComponents = response.data.results[0].address_components;
                
                let district = '';
                let municipality = '';
                
                addressComponents.forEach((comp: any) => {
                  if (comp.types.includes('administrative_area_level_3') || comp.types.includes('locality')) {
                    municipality = comp.long_name;
                  }
                  if (comp.types.includes('administrative_area_level_2')) {
                    district = comp.long_name;
                  }
                });

                setFormData(prev => ({
                  ...prev,
                  district: district || prev.district,
                  municipality: municipality || prev.municipality
                }));
              }
            }
          } catch (error) {
            console.error('Error fetching location data', error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error', error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  };

  const renderFields = () => {
    switch (role) {
      case 'farmer':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" name="fullName" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="e.g. Ram Bahadur" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input type="tel" name="phone" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="98XXXXXXXX" />
              </div>
              
              <div className="col-span-2 flex justify-end gap-2">
                 <LocationMapPicker onLocationSelect={handleMapLocationSelect} />
                 <button type="button" onClick={detectLocation} disabled={isLoadingLocation} className="text-xs font-medium text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2.5 py-1.5 rounded-md border border-indigo-100">
                   {isLoadingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                   Auto-detect
                 </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">District</label>
                <input type="text" name="district" value={formData.district || ''} onChange={handleInputChange} required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="District" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Municipality</label>
                <input type="text" name="municipality" value={formData.municipality || ''} onChange={handleInputChange} required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Municipality/Ward" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Insurance Number (Optional)</label>
                <input type="text" name="insuranceNumber" onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="If applicable" />
              </div>
            </div>
          </>
          );
      case 'ward':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Officer Name</label>
                <input type="text" name="officerName" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Designation</label>
                <input type="text" name="designation" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="e.g. Agriculture Officer" />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                 <LocationMapPicker onLocationSelect={handleMapLocationSelect} />
                 <button type="button" onClick={detectLocation} disabled={isLoadingLocation} className="text-xs font-medium text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2.5 py-1.5 rounded-md border border-indigo-100">
                   {isLoadingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                   Auto-detect
                 </button>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Municipality</label>
                <input type="text" name="municipality" value={formData.municipality || ''} required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Office Email</label>
                <input type="email" name="email" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="officer@ward.gov.np" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input type="tel" name="phone" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
            </div>
          </>
        );
      case 'insurance':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Officer Name</label>
                <input type="text" name="officerName" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Insurance Company</label>
                <select name="company" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                  <option value="">Select Company</option>
                  <option value="shikhar">Shikhar Insurance</option>
                  <option value="nlgi">NLGI Insurance</option>
                  <option value="sagarmatha">Sagarmatha Insurance</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Official Email</label>
                <input type="email" name="email" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="name@company.com.np" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input type="tel" name="phone" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" name="fullName" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input type="tel" name="phone" required onChange={handleInputChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        <Link to={PATHS.AUTH.ROLE_SELECTION} className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block transition-colors">
          &larr; Change Role
        </Link>
        <h1 className="text-3xl font-heading font-bold text-indigo-950 mb-2 capitalize">
          {role} Registration
        </h1>
        <p className="text-slate-500">
          Enter your details to create your account.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        
        {renderFields()}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 transition-all shadow-md mt-6"
        >
          Continue
        </button>
      </form>
    </motion.div>
  );
};
