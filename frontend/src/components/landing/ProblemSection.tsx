import { Clock, FileWarning, ShieldAlert, AlertCircle, WifiOff, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
  const problems = [
    {
      title: 'Paperwork Delays',
      description: 'Manual forms take weeks to process, leaving farmers waiting for much-needed funds.',
      icon: Clock,
    },
    {
      title: 'Verification Bottlenecks',
      description: 'Physical inspections are slow, subjective, and hard to coordinate in remote areas.',
      icon: Users,
    },
    {
      title: 'High Fraud Risks',
      description: 'Lack of digital proof leads to duplicate claims and manipulated evidence.',
      icon: ShieldAlert,
    },
    {
      title: 'Low Transparency',
      description: 'Farmers have no visibility into their claim status once submitted to the Palika.',
      icon: FileWarning,
    },
    {
      title: 'Digital Barriers',
      description: 'Complex apps exclude farmers who are not tech-savvy or have poor internet access.',
      icon: WifiOff,
    },
    {
      title: 'Low Awareness',
      description: 'Many farmers do not know how to correctly document damage for successful claims.',
      icon: AlertCircle,
    },
  ];

  return (
    <section id="problem" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-indigo-950 mb-4">
            The Agricultural Claim Crisis
          </h2>
          <p className="text-lg text-slate-600">
            Filing an agricultural insurance claim in Nepal is broken. It's slow, opaque, and prone to errors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 font-heading">{problem.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
