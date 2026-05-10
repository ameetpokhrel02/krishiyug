import { motion } from 'framer-motion';
import { Smartphone, Mic, CheckSquare, FileCheck } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Report Damage Instantly',
      description: 'Farmers report crop or livestock damage via voice or text using the AI chatbot.',
      icon: Smartphone,
    },
    {
      num: '02',
      title: 'AI Claim Guidance',
      description: 'The AI ensures all required photos and documents are collected before submission.',
      icon: Mic,
    },
    {
      num: '03',
      title: 'Palika & Witness Verification',
      description: 'Local authorities and witnesses digitally sign off on the claim\'s authenticity.',
      icon: CheckSquare,
    },
    {
      num: '04',
      title: 'Insurance Decision',
      description: 'Insurance companies receive a verified, fraud-checked claim ready for rapid payout.',
      icon: FileCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-indigo-950 mb-4">
            How Krishiyug Works
          </h2>
          <p className="text-lg text-slate-600">
            A streamlined, digital-first workflow from farm to finance.
          </p>
        </div>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-100 -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-white flex items-center justify-center mb-6 shadow-xl relative group">
                  <step.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border-2 border-white text-indigo-950">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3 font-heading">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
