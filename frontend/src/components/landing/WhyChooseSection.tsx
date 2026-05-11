import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Globe, Smartphone, Zap, Bot, LayoutDashboard, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRef } from 'react';

const TiltCard = ({ feature, lang }: { feature: any, lang: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-12 rounded-[60px] bg-slate-900/40 border border-white/5 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-slate-900/60"
    >
      {/* Dynamic Spotlight Mask */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`,
          maskImage: 'linear-gradient(black, black)',
          WebkitMaskImage: 'linear-gradient(black, black)'
        } as any}
      />

      <div style={{ transform: "translateZ(75px)" }} className="relative z-10">
        {/* Floating Icon Dock */}
        <div className="relative mb-12 w-20 h-20">
          <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${feature.iconBg} blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
          <div className="absolute inset-0 rounded-[2rem] border border-white/10 group-hover:border-white/40 transition-colors duration-500" />
          <div className="h-full w-full rounded-[2rem] bg-slate-950 flex items-center justify-center relative z-10 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             <feature.icon className={`w-10 h-10 ${feature.iconColor} group-hover:scale-125 transition-transform duration-500`} />
          </div>
          <div className="absolute -inset-2 border border-white/5 rounded-[2.5rem] scale-90 group-hover:scale-110 group-hover:opacity-0 transition-all duration-700" />
        </div>

        <h3 className={`text-3xl font-black mb-6 tracking-tight leading-tight transition-colors ${lang === 'ne' ? 'leading-[1.4] text-4xl' : ''}`}>
          <span className="text-slate-200 group-hover:text-white transition-colors">
            {lang === 'en' ? feature.titleEn : feature.titleNe}
          </span>
        </h3>
        
        <p className={`text-base text-slate-500 font-medium leading-relaxed group-hover:text-slate-300 transition-colors ${lang === 'ne' ? 'leading-[1.8] text-lg' : ''}`}>
          {lang === 'en' ? feature.descEn : feature.descNe}
        </p>
      </div>

      <div className="absolute top-0 right-0 p-8">
         <div className={`w-2 h-2 rounded-full ${feature.dotColor} opacity-20 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.5)]`} />
      </div>

      <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
};

export const WhyChooseSection = () => {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const features = [
    {
      icon: Globe,
      titleEn: 'Satellite-Secured',
      titleNe: 'उपग्रह-प्रमाणित सुरक्षा',
      descEn: 'AI-powered satellite verification for instant crop damage assessment.',
      descNe: 'एआई-आधारित उपग्रह प्रमाणीकरण मार्फत बालीको क्षतिको तुरुन्तै र सही मूल्याङ्कन।',
      iconColor: 'text-emerald-400',
      iconBg: 'from-emerald-500 to-emerald-900',
      dotColor: 'bg-emerald-400',
    },
    {
      icon: Smartphone,
      titleEn: 'Multi-Channel Access',
      titleNe: 'बहु-प्रणाली पहुँच',
      descEn: 'File claims via smartphone, voice notes, or even simple SMS.',
      descNe: 'स्मार्टफोन, भ्वाइस नोट वा सामान्य एसएमएस मार्फत सजिलै दावी पेश गर्न सकिने।',
      iconColor: 'text-cyan-400',
      iconBg: 'from-cyan-500 to-cyan-900',
      dotColor: 'bg-cyan-400',
    },
    {
      icon: Zap,
      titleEn: 'Instant Payouts',
      titleNe: 'द्रुत भुक्तानी सेवा',
      descEn: 'Quick claim settlement within days, directly to your bank account.',
      descNe: 'दावीको फछ्र्यौट केही दिनमै, सिधै तपाईको बैंक खातामा सुरक्षित भुक्तानी।',
      iconColor: 'text-orange-400',
      iconBg: 'from-orange-500 to-orange-900',
      dotColor: 'bg-orange-400',
    },
    {
      icon: Bot,
      titleEn: 'AI Assistant',
      titleNe: 'बौद्धिक एआई सहायक',
      descEn: '24/7 intelligent guidance in both Nepali and English languages.',
      descNe: 'नेपाली र अंग्रेजी दुबै भाषामा २४/७ उपलब्ध बौद्धिक र सरल मार्गदर्शन।',
      iconColor: 'text-purple-400',
      iconBg: 'from-purple-500 to-purple-900',
      dotColor: 'bg-purple-400',
    },
    {
      icon: LayoutDashboard,
      titleEn: 'Real-Time Dashboard',
      titleNe: 'तुरुन्तै ड्यासबोर्ड',
      descEn: 'Track your policies, claims, and market prices in real-time.',
      descNe: 'आफ्नो बीमा नीति, दावीको स्थिति र बजारको ताजा भाउ वास्तविक समयमा हेर्नुहोस्।',
      iconColor: 'text-blue-400',
      iconBg: 'from-blue-500 to-blue-900',
      dotColor: 'bg-blue-400',
    },
    {
      icon: Heart,
      titleEn: 'Farmer-First Design',
      titleNe: 'किसान-मैत्री संरचना',
      descEn: 'Built specifically for the needs of rural agricultural communities.',
      descNe: 'ग्रामीण कृषि समुदायका विशिष्ट आवश्यकताहरूलाई ध्यानमा राखेर निर्माण गरिएको।',
      iconColor: 'text-pink-400',
      iconBg: 'from-pink-500 to-pink-900',
      dotColor: 'bg-pink-400',
    },
  ];

  return (
    <section 
      ref={containerRef} 
      className="py-48 bg-[#020617] text-white relative overflow-hidden perspective-2000"
      onMouseMove={(e) => {
        const x = e.clientX;
        const y = e.clientY;
        containerRef.current?.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current?.style.setProperty('--mouse-y', `${y}px`);
      }}
    >
      <style>{`
        .perspective-2000 { perspective: 2000px; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none opacity-20">
         <motion.div 
           style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]), rotate: 45 }}
           className="absolute top-20 left-10 w-64 h-64 border border-white/5 rounded-[4rem]"
         />
         <motion.div 
           style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]), rotate: -15 }}
           className="absolute bottom-20 right-10 w-96 h-96 border border-white/5 rounded-[6rem]"
         />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />
      <motion.div 
        style={{ scale: useTransform(scrollYProgress, [0, 1], [0.5, 1.5]), opacity: 0.15 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-500/10 rounded-full blur-[180px]" 
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-emerald-400 text-[11px] font-black uppercase tracking-[0.5em] mb-12 shadow-2xl"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
            {lang === 'en' ? 'The KrishiYug Standard' : 'कृषियुगको उत्कृष्ट सेवा'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-7xl md:text-[130px] font-black tracking-tighter mb-16 leading-[0.75] text-white ${lang === 'ne' ? 'leading-[1.1] text-8xl md:text-[110px]' : ''}`}
          >
            {lang === 'en' ? (
              <>Innovation <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-cyan-400">Without Limits</span></>
            ) : (
              <>असीमित <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-cyan-400">नवाचार र सेवा</span></>
            )}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: 'spring', damping: 20 }}
            >
              <TiltCard feature={feature} lang={lang} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
