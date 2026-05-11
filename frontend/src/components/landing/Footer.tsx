import { motion } from 'framer-motion';
import { Leaf, MessageCircle, Globe, Mail, Phone, ArrowUpRight, ArrowRight, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const Footer = () => {
  const { lang } = useLanguage();

  const footerLinks = [
    {
      titleEn: 'Ecosystem',
      titleNe: 'प्रणाली',
      links: [
        { nameEn: 'How it Works', nameNe: 'कसरी काम गर्छ?', href: '#' },
        { nameEn: 'Browse Policies', nameNe: 'बीमा नीतिहरू', href: '#' },
        { nameEn: 'Live GIS Map', nameNe: 'लाइभ नक्सा', href: '#' },
        { nameEn: 'Stakeholders', nameNe: 'सरोकारवालाहरू', href: '#' },
      ]
    },
    {
      titleEn: 'Governance',
      titleNe: 'सुशासन',
      links: [
        { nameEn: 'About Krishiyug', nameNe: 'हाम्रो बारेमा', href: '#' },
        { nameEn: 'Verification Process', nameNe: 'प्रमाणीकरण प्रक्रिया', href: '#' },
        { nameEn: 'Privacy Protocol', nameNe: 'गोपनीयता नीति', href: '#' },
        { nameEn: 'Terms of Use', nameNe: 'सेवाका सर्तहरू', href: '#' },
      ]
    },
    {
      titleEn: 'Farmer Support',
      titleNe: 'किसान सहयोग',
      links: [
        { nameEn: 'Help Center', nameNe: 'मद्दत केन्द्र', href: '#' },
        { nameEn: 'Claim Guide', nameNe: 'दावी मार्गनिर्देशन', href: '#' },
        { nameEn: 'Expert Consultation', nameNe: 'विज्ञ परामर्श', href: '#' },
        { nameEn: 'Community', nameNe: 'समुदाय', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-[#020617] pt-0 pb-12 text-white relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top CTA Banner */}
      <div className="max-w-7xl mx-auto px-8 relative z-10 -translate-y-1/2">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-12 md:p-16 rounded-[40px] shadow-2xl shadow-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white leading-tight">
              {lang === 'en' ? "Ready to Secure Your Farm's Future?" : "आफ्नो फार्मको भविष्य सुरक्षित गर्न तयार हुनुहुन्छ?"}
            </h3>
            <p className="text-emerald-50 text-lg font-medium opacity-90">
              {lang === 'en' ? "Join thousands of farmers protected by AI-verified insurance." : "एआई-प्रमाणित बीमाद्वारा सुरक्षित हजारौं किसानहरूमा सामेल हुनुहोस्।"}
            </p>
          </div>
          <Link to={PATHS.AUTH.ROLE_SELECTION} className="relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-emerald-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl transition-all flex items-center gap-3"
            >
              {lang === 'en' ? 'Get Started' : 'सुरु गर्नुहोस्'}
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-black tracking-tighter text-white">Krishiyug</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              {lang === 'en'
                ? "Nepal's premier digital trust network for agricultural resilience. Powered by AI, secured by community."
                : "कृषि उत्थानशीलताका लागि नेपालको प्रमुख डिजिटल ट्रस्ट नेटवर्क। एआई द्वारा संचालित, समुदाय द्वारा सुरक्षित।"}
            </p>
            <div className="flex gap-4">
              {[MessageCircle, Share2, Globe, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5, scale: 1.1, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.5)' }}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="lg:col-span-1 space-y-10">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                {lang === 'en' ? section.titleEn : section.titleNe}
              </h4>
              <ul className="space-y-5">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors font-bold text-sm flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {lang === 'en' ? link.nameEn : link.nameNe}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-10">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
              {lang === 'en' ? 'Support' : 'सहयोग'}
            </h4>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-sm font-bold">hello@krishiyug.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Call Support</p>
                  <p className="text-sm font-bold">+977 1 2345678</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} KRISHIYUG. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[10px] font-black text-slate-600 hover:text-emerald-500 transition-colors uppercase tracking-widest">Privacy Protocol</a>
              <a href="#" className="text-[10px] font-black text-slate-600 hover:text-emerald-500 transition-colors uppercase tracking-widest">Security Audit</a>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Trust Network</span>
            </div>
            <motion.button
              whileHover={{ y: -5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-emerald-500/50 transition-all"
            >
              <ArrowRight className="w-5 h-5 -rotate-90 text-emerald-500" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};
