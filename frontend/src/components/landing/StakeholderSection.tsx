import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tractor, Building2, Shield, Eye } from 'lucide-react';

export const StakeholderSection = () => {
  const [activeTab, setActiveTab] = useState('farmer');

  const tabs = [
    { id: 'farmer', label: 'Farmers', icon: Tractor },
    { id: 'ward', label: 'Ward', icon: Building2 },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'witness', label: 'Witnesses', icon: Eye },
  ];

  const content: Record<string, { title: string; benefits: string[]; imageColor: string }> = {
    farmer: {
      title: 'Effortless Claims, Faster Payouts',
      benefits: [
        'File claims in Nepali using voice or text.',
        'No travel required to submit documents.',
        'Real-time updates on claim status via SMS.',
        'Fair assessment with AI assistance.'
      ],
      imageColor: 'bg-emerald-100',
    },
    ward: {
      title: 'Streamlined Verification Workflow',
      benefits: [
        'Centralized dashboard for all local claims.',
        'Digital signatures for instant approval.',
        'Reduce physical inspection visits.',
        'Data-driven insights into local agricultural risks.'
      ],
      imageColor: 'bg-blue-100',
    },
    insurance: {
      title: 'Fraud Prevention & Efficiency',
      benefits: [
        'Receive verified, standardized claim packets.',
        'Automated AI checks for duplicate or edited photos.',
        'Reduce processing overhead and administrative costs.',
        'Improve farmer trust through rapid settlements.'
      ],
      imageColor: 'bg-indigo-100',
    },
    witness: {
      title: 'Simple Digital Attestation',
      benefits: [
        'Verify claims remotely via SMS links.',
        'Secure OTP-based authentication.',
        'No paperwork or physical signatures required.',
        'Transparent contribution to community welfare.'
      ],
      imageColor: 'bg-amber-100',
    }
  };

  return (
    <section id="stakeholders" className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-indigo-950 mb-4">
            Built for the Entire Ecosystem
          </h2>
          <p className="text-lg text-slate-600">
            Connecting everyone involved in agricultural insurance on one secure platform.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-12 items-center h-full"
            >
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-6">
                  {content[activeTab].title}
                </h3>
                <ul className="space-y-4">
                  {content[activeTab].benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-600 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Abstract Visual Representation */}
              <div className={`w-full h-[300px] rounded-2xl ${content[activeTab].imageColor} border border-slate-100 relative overflow-hidden flex items-center justify-center`}>
                 <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: 0.2 }}
                   className="relative z-10 w-48 h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-white/50"
                 >
                    {activeTab === 'farmer' && <Tractor className="w-20 h-20 text-emerald-500" />}
                    {activeTab === 'ward' && <Building2 className="w-20 h-20 text-blue-500" />}
                    {activeTab === 'insurance' && <Shield className="w-20 h-20 text-indigo-500" />}
                    {activeTab === 'witness' && <Eye className="w-20 h-20 text-amber-500" />}
                 </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
