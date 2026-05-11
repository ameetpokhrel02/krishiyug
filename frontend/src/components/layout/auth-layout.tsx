import { motion } from 'framer-motion';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Sparkles, MapPin, Navigation } from 'lucide-react';
import { PATHS } from '@/routes/paths';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-white overflow-hidden font-sans">
      {/* Left Column: Auth Form */}
      <div className="flex-1 flex flex-col relative z-10 bg-white min-w-0">
        <div className="p-8 lg:p-12">
          <Link to={PATHS.HOME} className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 bg-emerald-950 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-xl shadow-emerald-900/10 border border-emerald-900/5">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
               <span className="text-3xl font-black text-emerald-950 tracking-tighter block leading-none">Krishiyug</span>
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Digital Trust Network</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>

      {/* Right Column: Clean Premium Sidebar */}
      <div className="hidden lg:flex flex-1 bg-emerald-950 relative items-center justify-center p-20 overflow-hidden">
        {/* Background Subtle Image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://res.cloudinary.com/dm0vvpzs9/image/upload/v1778505238/In_the_Frame_rlnxoc.jpg" 
             className="w-full h-full object-cover opacity-20 brightness-50"
             alt="Agri Context"
           />
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/90 to-transparent" />
        </div>

        {/* Abstract Glows */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Secured by Satellite AI</span>
               </div>
               <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                 Protecting <br />
                 Nepal's <br />
                 <span className="text-emerald-400">Green Future.</span>
               </h2>
               <p className="text-xl text-emerald-100/50 font-medium leading-relaxed max-w-md">
                 Join the intelligent ecosystem where technology meets tradition to protect every harvest.
               </p>
            </div>

            {/* Single Clean Identity Card */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="p-10 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl relative group overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
                  <Navigation className="w-32 h-32 text-white" />
               </div>
               
               <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center">
                     <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Network Status</p>
                        <p className="text-sm font-black text-white">Active Verification</p>
                     </div>
                  </div>
                  
                  <div>
                     <p className="text-[10px] font-black text-emerald-100/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        Region Coverage
                     </p>
                     <p className="text-2xl font-black text-white tracking-tight">Jhapa, Nepal</p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-widest">Real-time GPS Active</p>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Brand Watermark */}
        <div className="absolute bottom-12 right-12 opacity-10">
           <span className="text-8xl font-black tracking-tighter text-white uppercase select-none">TRUST</span>
        </div>
      </div>
    </div>
  );
};
