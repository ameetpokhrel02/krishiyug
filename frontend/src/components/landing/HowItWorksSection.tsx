import { motion } from 'framer-motion';
import { Smartphone, Mic, CheckSquare, FileCheck, ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Report Damage Instantly',
      description: 'Farmers report crop or livestock damage via voice or text using our intuitive AI chatbot.',
      icon: Smartphone,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      num: '02',
      title: 'AI Claim Guidance',
      description: 'The AI ensures all required photos and documents are collected perfectly before submission.',
      icon: Mic,
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/20',
    },
    {
      num: '03',
      title: 'Ward & Witness Verification',
      description: 'Local authorities and witnesses digitally sign off on the claim\'s authenticity securely.',
      icon: CheckSquare,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
    },
    {
      num: '04',
      title: 'Insurance Decision',
      description: 'Insurance companies receive a verified, fraud-checked claim ready for rapid payout.',
      icon: FileCheck,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
      },
    },
  } as const;

  return (
    <section id="how-it-works" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100">
            Process Workflow
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How Krishiyug <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Simplifies Everything</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            A streamlined, digital-first workflow that connects farmers, local authorities, and insurance providers in one seamless ecosystem.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector Arrow (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%-1.5rem)] w-12 z-0 opacity-20 group-hover:opacity-40 transition-opacity">
                  <ArrowRight className="w-8 h-8 text-indigo-400" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  {/* Icon Container */}
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${step.color} ${step.shadow} flex items-center justify-center relative z-10 shadow-2xl transition-all duration-300`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-slate-50 text-slate-900 z-20">
                    {step.num}
                  </div>

                  {/* Decorative Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full`} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95">
            Start Your First Report
          </button>
        </motion.div>
      </div>
    </section>
  );
};
