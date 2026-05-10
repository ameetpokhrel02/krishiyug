import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-950" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/30 blur-[120px] rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
          Ready to Transform Agricultural Insurance?
        </h2>
        <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
          Join farmers, Palikas, and insurance companies building a transparent, AI-driven future for Nepal's agriculture.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={PATHS.AUTH.ROLE_SELECTION}
            className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-indigo-950 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-xl"
          >
            Create an Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-indigo-900/50 text-white rounded-xl font-medium border border-indigo-700 hover:bg-indigo-800/50 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};
