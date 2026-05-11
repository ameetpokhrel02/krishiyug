import { motion } from 'framer-motion';

export const WorkflowSection = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Transparent Claim Lifecycle
          </h2>
          <p className="text-lg text-slate-400">
            Every step is tracked, verified, and accessible to authorized stakeholders.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
           {/* Vertical Line */}
           <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 -translate-x-1/2" />
           
           {[
             { title: 'Farmer submits data', user: 'Farmer', side: 'left' },
             { title: 'AI validates evidence', user: 'System', side: 'right' },
             { title: 'Ward Officer reviews', user: 'Ward', side: 'left' },
             { title: 'Witnesses attest', user: 'Witness', side: 'right' },
             { title: 'Insurance approves payout', user: 'Insurance', side: 'left' },
           ].map((step, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className={`relative flex items-center justify-between mb-12 ${step.side === 'left' ? 'md:flex-row-reverse' : ''}`}
             >
               <div className="hidden md:block w-5/12" />
               
               <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-indigo-900 border-4 border-slate-900 -translate-x-1/2 flex items-center justify-center z-10">
                 <div className="w-2 h-2 rounded-full bg-indigo-400" />
               </div>

               <div className="w-full md:w-5/12 pl-12 md:pl-0">
                 <div className={`p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl ${step.side === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                   <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">{step.user}</span>
                   <h4 className="text-xl font-semibold text-slate-100 font-heading">{step.title}</h4>
                 </div>
               </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};
