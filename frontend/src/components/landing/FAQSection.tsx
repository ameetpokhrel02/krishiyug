import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does the AI verify claims?',
      answer: 'Our AI analyzes submitted photos for signs of disease, structural damage, and ensures metadata (like location and time) matches the claim details to prevent fraud.'
    },
    {
      question: 'Do farmers need a smartphone to use this?',
      answer: 'While a smartphone provides the best experience, farmers can also file claims through SMS, voice calls, or with the assistance of a Ward officer.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. Krishiyug employs enterprise-grade encryption and strictly adheres to Nepal\'s data privacy laws. Only authorized stakeholders can access your claim details.'
    },
    {
      question: 'How long does a claim take to process?',
      answer: 'By digitizing the workflow, Krishiyug reduces processing time from weeks to just a few days, depending on the insurance company\'s final review.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-indigo-950 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl transition-colors ${openIndex === index ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-white'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === index ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
