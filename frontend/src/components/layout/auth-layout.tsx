import { motion } from 'framer-motion';
import { Outlet, Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Tractor } from 'lucide-react';
import { PATHS } from '@/routes/paths';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30">
      {/* Left Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-24 py-12 relative z-10">
        <Link to={PATHS.HOME} className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center shadow-inner">
            <Leaf className="w-5 h-5 text-amber-500" />
          </div>
          <span className="font-heading font-bold text-2xl text-indigo-950 tracking-tight">
            Krishiyug
          </span>
        </Link>
        
        <div className="w-full max-w-md mx-auto mt-16">
          <Outlet />
        </div>
      </div>

      {/* Right Column: Premium Visual */}
      <div className="hidden lg:flex w-1/2 bg-indigo-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-800/40 via-indigo-950 to-indigo-950 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-indigo-600/20 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full -z-10" />

        <div className="relative z-10 mt-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl xl:text-5xl font-heading font-bold text-white leading-tight mb-6"
          >
            Empowering Nepal's <br /> Agriculture with AI
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-indigo-200 text-lg max-w-md leading-relaxed"
          >
            Join thousands of farmers, Palikas, and insurance companies building a transparent, intelligent claims ecosystem.
          </motion.p>
        </div>

        {/* Abstract Floating Cards Visual */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-12 h-full w-full">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.5, type: 'spring' }}
             className="relative w-full max-w-sm"
           >
              {/* Card 1 */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl transform rotate-6">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                       <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Claim Verified</p>
                      <p className="text-xs text-emerald-300">Palika Approved</p>
                    </div>
                 </div>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-400 rounded-full" />
                 </div>
              </div>

              {/* Card 2 */}
              <div className="relative z-10 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-indigo-500/30">
                 <div className="flex justify-between items-center mb-6">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Tractor className="w-6 h-6 text-amber-400" />
                   </div>
                   <div className="px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-200 text-xs font-medium border border-indigo-500/30">
                     Active Policy
                   </div>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2 font-heading">Livestock Insurance</h3>
                 <p className="text-indigo-200 text-sm mb-6">Coverage active until Dec 2026</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-900/40 p-3 rounded-xl border border-indigo-700/50">
                      <p className="text-xs text-indigo-300 mb-1">Insured Value</p>
                      <p className="font-semibold text-white">Rs. 150,000</p>
                    </div>
                    <div className="bg-indigo-900/40 p-3 rounded-xl border border-indigo-700/50">
                      <p className="text-xs text-indigo-300 mb-1">Status</p>
                      <p className="font-semibold text-emerald-400">Secure</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};
