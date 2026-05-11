import { Leaf, MessageCircle, Globe, Share2, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-amber-500" />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                Krishiyug
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              AI-powered agricultural insurance claim intelligence platform for Nepal. Bringing transparency, speed, and trust to the ecosystem.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-900 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-900 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-900 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">AI Capabilities</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Farmer Guide</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Ward Portal Docs</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Krishiyug. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Mail className="w-4 h-4" />
            hello@krishiyug.com
          </div>
        </div>
      </div>
    </footer>
  );
};
