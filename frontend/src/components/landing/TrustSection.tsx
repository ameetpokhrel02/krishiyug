import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Handshake, Activity } from 'lucide-react';

export const TrustSection = () => {
  const partners = [
    { 
      name: 'Ward Verification', 
      role: 'Local Government', 
      icon: ShieldCheck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      description: 'Verified land and identity records from local authorities.'
    },
    { 
      name: 'AI Fraud Detection', 
      role: 'Security', 
      icon: Cpu, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      description: 'Advanced algorithms to detect and prevent insurance fraud.'
    },
    { 
      name: 'Insurance Collaboration', 
      role: 'Finance', 
      icon: Handshake, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      description: 'Seamless integration with major agriculture insurance providers.'
    },
    { 
      name: 'Real-time Tracking', 
      role: 'Transparency', 
      icon: Activity, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      description: 'Full transparency for claims processing and fund transfers.'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  } as const;

  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">
            Ecosystem Trust
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by stakeholders across the <span className="text-indigo-600">agricultural ecosystem</span>
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className={`w-14 h-14 rounded-2xl ${partner.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <partner.icon className={`w-7 h-7 ${partner.color}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {partner.name}
                </h3>
                <p className="text-xs font-medium text-indigo-600/70 uppercase tracking-wider">
                  {partner.role}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed pt-2 max-w-[200px]">
                  {partner.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-1 h-1 rounded-full ${partner.bg.replace('bg-', 'bg-')}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
