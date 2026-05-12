import { motion, useScroll, useTransform } from 'framer-motion';
import { UserPlus, Search, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRef } from 'react';

export const HowItWorksSection = () => {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const steps = [
    {
      num: '01',
      titleEn: 'Register & Onboard',
      titleNe: 'दर्ता र आबद्धता',
      descEn: 'Create an account and verify your farming details in minutes.',
      descNe: 'आफ्नो खाता सिर्जना गर्नुहोस् र केही मिनेटमै खेतीको विवरण प्रमाणित गर्नुहोस्।',
      icon: UserPlus,
      color: 'from-emerald-400 to-emerald-600',
      glow: 'emerald',
    },
    {
      num: '02',
      titleEn: 'Browse Policies',
      titleNe: 'बीमा योजना छनौट',
      descEn: 'Explore coverage options tailored to your specific crop and location.',
      descNe: 'तपाईंको बाली र स्थान अनुसारका उत्कृष्ट बीमा योजनाहरू पत्ता लगाउनुहोस्।',
      icon: Search,
      color: 'from-cyan-400 to-cyan-600',
      glow: 'cyan',
    },
    {
      num: '03',
      titleEn: 'Purchase Coverage',
      titleNe: 'बीमा खरिद प्रक्रिया',
      descEn: 'Secure your farm with instant digital payments and no paperwork.',
      descNe: 'कुनै झन्झटिलो कागजी कार्य बिना डिजिटल भुक्तानी मार्फत बीमा गर्नुहोस्।',
      icon: ShieldCheck,
      color: 'from-purple-400 to-purple-600',
      glow: 'purple',
    },
    {
      num: '04',
      titleEn: 'File Claim',
      titleNe: 'दावी पेश गर्ने विधि',
      descEn: 'Report losses instantly via app or SMS for rapid AI-verified payouts.',
      descNe: 'क्षति भएमा एप वा एसएमएसबाट तुरुन्तै दावी गरी छिटो भुक्तानी पाउनुहोस्।',
      icon: Zap,
      color: 'from-orange-400 to-orange-600',
      glow: 'orange',
    },
  ];

  return (
    <section ref={containerRef} className="py-40 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] -mr-96 -mt-96" 
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[120px] -ml-96 -mb-96" 
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {lang === 'en' ? 'Digital Transformation' : 'पूर्ण डिजिटल प्रणाली'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-6xl md:text-[100px] font-black tracking-tighter text-slate-900 mb-10 leading-[0.85] ${lang === 'ne' ? 'leading-[1.2] text-7xl md:text-[90px]' : ''}`}
          >
            {lang === 'en' ? (
              <>How Our System <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600">Works for You</span></>
            ) : (
              <>हाम्रो प्रणालीले कसरी <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600">काम गर्छ?</span></>
            )}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-1 z-0 px-24">
            <svg className="w-full h-full overflow-visible">
              <motion.path
                d="M 0 0 H 1000"
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray="10 10"
                style={{ pathLength: scrollYProgress }}
              />
              <defs>
                <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 50 }}
              className="relative group"
            >
              <div className="h-full p-12 rounded-[50px] bg-white border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] group-hover:shadow-[0_50px_100px_rgba(0,0,0,0.06)] transition-all duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="absolute top-10 right-10 text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-50 to-white select-none pointer-events-none leading-none">
                  {step.num}
                </div>

                <div className="relative z-10">
                  <div className="relative mb-12">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl transition-all duration-500`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                  </div>

                  <h3 className={`text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight group-hover:translate-x-2 transition-transform duration-500 ${lang === 'ne' ? 'leading-[1.4] text-4xl' : ''}`}>
                    {lang === 'en' ? step.titleEn : step.titleNe}
                  </h3>
                  
                  <p className={`text-base text-slate-500 font-medium leading-relaxed ${lang === 'ne' ? 'leading-[1.8] text-lg' : ''}`}>
                    {lang === 'en' ? step.descEn : step.descNe}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  {lang === 'en' ? 'Learn More' : 'थप जानकारी'}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
