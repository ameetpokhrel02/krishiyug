import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2 } from 'lucide-react';

export const ProductPreviewSection = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-indigo-950 mb-6 leading-tight">
              A Premium Experience <br className="hidden md:block"/> for Modern Agriculture
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              We've combined enterprise-grade governance with consumer-grade design. The Krishiyug platform is intuitive, fast, and accessible across all devices.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                 <span className="text-slate-700 font-medium">Responsive Web App</span>
              </div>
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                 <span className="text-slate-700 font-medium">Role-Based Access Control</span>
              </div>
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                 <span className="text-slate-700 font-medium">Data Export & Reporting</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-slate-100 rounded-[2rem] p-4 lg:p-6 shadow-2xl border border-slate-200">
               {/* Browser Window Chrome */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-slate-200 text-[10px] text-slate-400 font-medium w-1/2 justify-center shadow-sm">
                      <LayoutDashboard className="w-3 h-3" />
                      app.krishiyug.com
                    </div>
                  </div>
                  
                  {/* Mock UI Content */}
                  <div className="p-4 bg-slate-50 grid grid-cols-4 gap-4 h-[300px]">
                     {/* Sidebar */}
                     <div className="col-span-1 bg-white rounded-lg border border-slate-200 p-3 flex flex-col gap-2 hidden sm:flex">
                        <div className="w-16 h-4 bg-indigo-100 rounded mb-4" />
                        <div className="w-full h-6 bg-indigo-50 rounded" />
                        <div className="w-full h-6 bg-slate-100 rounded" />
                        <div className="w-full h-6 bg-slate-100 rounded" />
                     </div>
                     {/* Main Area */}
                     <div className="col-span-4 sm:col-span-3 flex flex-col gap-4">
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                           <div className="w-24 h-5 bg-slate-200 rounded" />
                           <div className="w-8 h-8 rounded-full bg-indigo-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-20 bg-white rounded-lg border border-slate-200 p-3">
                             <div className="w-12 h-3 bg-slate-100 rounded mb-2" />
                             <div className="w-16 h-6 bg-emerald-100 rounded" />
                           </div>
                           <div className="h-20 bg-white rounded-lg border border-slate-200 p-3">
                             <div className="w-12 h-3 bg-slate-100 rounded mb-2" />
                             <div className="w-16 h-6 bg-amber-100 rounded" />
                           </div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-3">
                           <div className="w-32 h-4 bg-slate-100 rounded mb-4" />
                           <div className="space-y-2">
                             <div className="w-full h-8 bg-slate-50 rounded" />
                             <div className="w-full h-8 bg-slate-50 rounded" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
