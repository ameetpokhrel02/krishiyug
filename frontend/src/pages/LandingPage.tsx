import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  ArrowRight,
  MapPin,
  Sparkles,
  Locate,
  Loader2,
  Navigation,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useLanguage } from '@/context/LanguageContext';
import axios from 'axios';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WhyChooseSection } from '@/components/landing/WhyChooseSection';
import { AIChatbot } from '@/components/chatbot/ai-chatbot';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function LandingPage() {
  const { lang, setLang, t } = useLanguage();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLoc, setDetectedLoc] = useState<{ district: string; palika: string } | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await axios.post(`${API_URL}/location/reverse-geocode`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        if (res.data.success) {
          setDetectedLoc(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsDetecting(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dm0vvpzs9/image/upload/v1778505238/In_the_Frame_rlnxoc.jpg"
            className="w-full h-full object-cover brightness-[0.8]"
            alt="Agri Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
        </div>

        <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Krishiyug</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#map" className="text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors">Live Map</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'ne' : 'en')}
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase rounded-full hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Globe className="w-3 h-3" />
              {lang === 'en' ? 'नेपाली' : 'English'}
            </button>
            <Link to={PATHS.AUTH.LOGIN} className="text-[10px] font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-widest">{t('login')}</Link>
            <Link to={PATHS.AUTH.ROLE_SELECTION}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-10 text-[10px] font-black uppercase tracking-widest">
                {t('getStarted')}
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 rounded-full mb-6 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Official Agri-InsurTech Portal
            </div>
            <h1 className="text-7xl md:text-[100px] font-black text-white leading-[0.9] tracking-tighter mb-8">
              {t('heroTitle')} <br />
              <span className="text-emerald-400">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="text-lg text-white/80 max-w-lg mb-10 font-medium">{t('heroDesc')}</p>
            <div className="flex gap-4">
              <Link to={PATHS.AUTH.ROLE_SELECTION}>
                <Button className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-950/40 group">
                  {t('getStarted')}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real-time Map Detection Section */}
      <section id="map" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                <Navigation className="w-4 h-4" />
                Live Geographic Analysis
              </div>
              <h2 className="text-5xl font-black tracking-tighter leading-tight text-slate-900">
                {t('detectLoc')}
              </h2>

              <div className="p-10 bg-slate-50 border border-slate-100 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MapPin className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  {detectedLoc ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-900">{detectedLoc.district}</p>
                          <p className="text-sm font-bold text-slate-400">{detectedLoc.palika} Municipality</p>
                        </div>
                      </div>
                      <Button onClick={() => setDetectedLoc(null)} variant="outline" className="text-[10px] font-bold uppercase rounded-full mt-4">Scan Another Area</Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <Button
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                        className="w-full h-16 bg-emerald-950 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-4"
                      >
                        {isDetecting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Locate className="w-5 h-5" />
                            {t('detectBtn')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative aspect-square bg-slate-900 rounded-[50px] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Map View" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isDetecting && (
                  <div className="w-40 h-40 border-2 border-emerald-500 rounded-full animate-ping opacity-20" />
                )}
                <div className="relative">
                  <MapPin className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Story Section */}
      <section className="py-32 bg-[#064e3b] text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-[50px] overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dm0vvpzs9/image/upload/v1778506287/__dddnjk.jpg"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  alt="Farmer Throwing Seeds"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white text-[#064e3b] p-10 rounded-[40px] shadow-2xl max-w-xs">
                <p className="text-4xl font-black mb-4">"पसिनाको <br /> कदर"</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Tradition meets Trust</p>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2 space-y-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">SUCCESS STORIES</p>
              <h2 className="text-7xl font-black tracking-tighter leading-[0.9]">
                {lang === 'en' ? 'Empowering the Individual' : 'व्यक्तिगत सशक्तिकरण'}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* How Our System Works Section */}
      <HowItWorksSection />

      {/* Why Choose Krishiyug Section */}
      <WhyChooseSection />

      {/* Footer Branding */}
      <footer className="pt-32 pb-12 px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-950 rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-emerald-950">Krishiyug</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 DIGITAL TRUST NETWORK.</p>
        </div>
      </footer>

      {/* Global AI Chatbot for Landing Page Guidance */}
      <AIChatbot />
    </div>
  );
}
