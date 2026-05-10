import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, PlayCircle, BotMessageSquare,
  Sparkles, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50 -z-10" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-800 text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Next-Gen Agricultural Insurance</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-indigo-950 leading-[1.15] mb-6 tracking-tight">
              AI-Powered <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-indigo-500">
                Claims Intelligence
              </span> <br className="hidden lg:block" />
              for Nepal
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
              Helping farmers file crop and livestock claims faster using conversational AI, fraud detection, and transparent verification workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to={PATHS.AUTH.ROLE_SELECTION}
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                File a Claim Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl font-medium border border-slate-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
                Watch Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Palika Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <BotMessageSquare className="w-4 h-4 text-indigo-500" />
                <span>Voice AI Assistant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>Real-time Tracking</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content (Mockups) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative lg:h-[700px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
          >
            {/* Product Screenshot Image */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 40 }}
              className="relative z-10 w-full max-w-[720px] transform-gpu"
            >
              <img
                src="https://res.cloudinary.com/dm0vvpzs9/image/upload/v1778440603/Gemini_Generated_Image_nn1ugwnn1ugwnn1u_1_khanjg.png"
                alt="Krishiyug Dashboard Preview — AI-powered insurance claim intelligence platform"
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(49,46,129,0.25)]"
                loading="eager"
              />
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
