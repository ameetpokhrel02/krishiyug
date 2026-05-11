import { motion } from 'framer-motion';
import { Bot, Mic, ShieldCheck, Search, BellRing } from 'lucide-react';

export const AIFeaturesSection = () => {
  const features = [
    {
      title: 'Conversational AI Chatbot',
      description: 'Farmers can chat in Nepali to file claims, reducing the complexity of digital forms.',
      icon: Bot,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Voice Assistant',
      description: 'Support for voice notes to overcome literacy barriers in rural areas.',
      icon: Mic,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'AI Image Verification',
      description: 'Computer vision pre-screens photos for disease symptoms or structural damage.',
      icon: Search,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Automated Fraud Detection',
      description: 'Metadata analysis and duplicate checks prevent fraudulent claims at the source.',
      icon: ShieldCheck,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Smart Notifications',
      description: 'Real-time SMS and push alerts keep all stakeholders informed of status changes.',
      icon: BellRing,
      color: 'bg-blue-50 text-blue-600',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              Intelligence at Every Step
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Krishiyug utilizes advanced artificial intelligence to automate manual checks, guide farmers, and flag anomalies, reducing claim processing time by up to 80%.
            </p>
            
            <div className="space-y-6">
              {features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {features.slice(3).map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold text-slate-100 mb-3 font-heading">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
            
            {/* Visual AI indicator mock */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.3 }}
               className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-2xl relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2 relative z-10 font-heading">99.9%</h4>
              <p className="text-indigo-100 relative z-10">Accuracy in automated fraud metadata detection.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
