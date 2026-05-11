import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Globe, 
  Save, 
  Info,
  Server
} from 'lucide-react';

export const AdminSettings = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Platform Settings</h1>
        <p className="text-sm text-slate-500">Configure global platform parameters and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 font-heading">General Configuration</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Platform Name</label>
                <input type="text" defaultValue="Krishiyug" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Support Email</label>
                <input type="email" defaultValue="support@krishiyug.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
               <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-bold text-indigo-900">Maintenance Mode</p>
                    <p className="text-xs text-indigo-700">Temporarily disable platform access for users.</p>
                  </div>
               </div>
               <button className="w-12 h-6 bg-slate-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
               </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 font-heading">Security & Access</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500">Require 2FA for all administrative accounts.</p>
              </div>
              <button className="w-12 h-6 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
              </button>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Session Timeout</p>
                <p className="text-xs text-slate-500">Automatically logout inactive admins after set time.</p>
              </div>
              <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none">
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>4 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                 <Server className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                 <h4 className="text-lg font-bold">All Systems Operational</h4>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">99.9% Uptime</span>
           </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="rounded-xl px-8">Cancel</Button>
          <Button className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl px-8">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
