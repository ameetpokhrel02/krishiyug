import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  ShieldCheck,
  Leaf,
  Baby,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Policy } from '@/types/platform';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';

const mockPolicies: Policy[] = [
  { id: 'P1', title: 'Monsoon Crop Guard', category: 'CROP', description: 'Comprehensive coverage for paddy and maize against floods and droughts.', premiumRate: 2.5, coverageAmount: 100000, insuranceCompanyId: 'INS1', insuranceCompanyName: 'Shikhar Insurance', status: 'ACTIVE' },
  { id: 'P2', title: 'Livestock Wellness Plus', category: 'LIVESTOCK', description: 'Premium protection for cattle and buffalos against diseases and accidents.', premiumRate: 1.8, coverageAmount: 150000, insuranceCompanyId: 'INS2', insuranceCompanyName: 'Sagarmatha Insurance', status: 'ACTIVE' },
  { id: 'P3', title: 'Poultry Safety Net', category: 'LIVESTOCK', description: 'Protect your commercial poultry farm from common avian flu and disasters.', premiumRate: 3.0, coverageAmount: 80000, insuranceCompanyId: 'INS1', insuranceCompanyName: 'Shikhar Insurance', status: 'ACTIVE' },
];

export const AdminPolicyManagement = () => {
  const [policies] = useState<Policy[]>(mockPolicies);
  const [activeTab, setActiveTab] = useState<'policies' | 'applications'>('policies');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Verification Modal State
  const [verifyModal, setVerifyModal] = useState<{ show: boolean, type: 'verify' | 'reject', app: any | null }>({ show: false, type: 'verify', app: null });
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPolicyApplications();
      setApplications((res as any).data?.data || []);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!verifyModal.app) return;
    setProcessing(true);
    try {
      if (verifyModal.type === 'verify') {
        await adminAPI.verifyPolicyApplication(verifyModal.app._id, remarks);
        toast.success('Application verified successfully!');
      } else {
        await adminAPI.rejectPolicyApplication(verifyModal.app._id, remarks);
        toast.success('Application rejected!');
      }
      setVerifyModal({ show: false, type: 'verify', app: null });
      setRemarks('');
      fetchApplications();
    } catch (err: any) {
      toast.error(err?.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  import('react').then(React => {
    React.useEffect(() => {
      if (activeTab === 'applications') {
        fetchApplications();
      }
    }, [activeTab]);
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Policy Frameworks</h1>
          <p className="text-sm text-slate-500">Define and manage standardized insurance products available on the platform.</p>
        </div>
        <Button className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl h-11 px-6 shadow-lg shadow-indigo-200">
          <Plus className="w-4 h-4 mr-2" />
          Create New Policy
        </Button>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Policies', value: '12', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Drafts', value: '3', icon: Activity, color: 'text-amber-600 bg-amber-50' },
          { label: 'Avg Premium', value: '2.4%', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Enrolled', value: '8.2k', icon: Activity, color: 'text-blue-600 bg-blue-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-lg font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('policies')}
          className={cn(
            "px-6 py-3 text-sm font-bold border-b-2 transition-colors",
            activeTab === 'policies' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          Policies Overview
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={cn(
            "px-6 py-3 text-sm font-bold border-b-2 transition-colors",
            activeTab === 'applications' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          Farmer Applications
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'policies' ? (
          <>
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search policies or categories..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
           </div>
           <div className="flex items-center gap-2">
              <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none">
                <option>All Categories</option>
                <option>Crop Insurance</option>
                <option>Livestock Insurance</option>
              </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Name & Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        policy.category === 'CROP' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {policy.category === 'CROP' ? <Leaf className="w-4 h-4" /> : <Baby className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{policy.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{policy.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{policy.insuranceCompanyName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-indigo-600">{policy.premiumRate}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    Rs. {policy.coverageAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </>
        ) : (
          /* Applications Tab */
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No applications found.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{app.farmerId?.name}</p>
                        <p className="text-xs text-slate-500">{app.farmerId?.phoneNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{app.policyId?.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{app.policyId?.policyType}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex flex-col gap-1">
                          <div>
                            {app.applicationDetails?.farmSize ? `Size: ${app.applicationDetails.farmSize} ` : ''}
                            {app.applicationDetails?.cropTypes?.length ? `| Crops: ${app.applicationDetails.cropTypes.join(', ')} ` : ''}
                            {app.applicationDetails?.livestockCount ? `| Animals: ${app.applicationDetails.livestockCount} ` : ''}
                          </div>
                          <div className="text-xs text-slate-500">
                            <strong>Municipality:</strong> {app.applicationDetails?.municipalityName || 'N/A'} | <strong>Ward:</strong> {app.applicationDetails?.wardNumber} | <strong>ID:</strong> {app.applicationDetails?.citizenshipNumber}
                          </div>
                          <div className="text-xs text-slate-500">
                            <strong>Lalpurja:</strong> {app.applicationDetails?.landOwnershipNo || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-500">
                            <strong>Bank:</strong> {app.applicationDetails?.bankName || 'N/A'} | <strong>A/C:</strong> {app.applicationDetails?.bankAccountNo || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-500">
                            <strong>Nominee:</strong> {app.applicationDetails?.nomineeName || 'N/A'}
                            {app.applicationDetails?.nomineePhone && ` (${app.applicationDetails.nomineePhone})`}
                          </div>
                          
                          {(app.applicationDetails?.citizenshipImageUrl || app.applicationDetails?.lalpurjaImageUrl) && (
                            <div className="mt-2 flex gap-3">
                              {app.applicationDetails?.citizenshipImageUrl && (
                                <a 
                                  href={app.applicationDetails.citizenshipImageUrl} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                                >
                                  View Citizenship
                                </a>
                              )}
                              {app.applicationDetails?.lalpurjaImageUrl && (
                                <a 
                                  href={app.applicationDetails.lalpurjaImageUrl} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                                >
                                  View Lalpurja
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        )}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                             <Button size="sm" onClick={() => setVerifyModal({ show: true, type: 'verify', app })} className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 text-xs rounded-lg">
                                Verify
                             </Button>
                             <Button size="sm" variant="outline" onClick={() => setVerifyModal({ show: true, type: 'reject', app })} className="border-red-200 text-red-600 hover:bg-red-50 h-8 text-xs rounded-lg">
                                Reject
                             </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Verify/Reject Modal */}
      {verifyModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {verifyModal.type === 'verify' ? 'Verify Application' : 'Reject Application'}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Add remarks for {verifyModal.app?.farmerId?.name}'s application.
            </p>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm mb-4"
              rows={4}
              placeholder="Enter remarks..."
            />
            <div className="flex gap-3">
              <Button onClick={() => setVerifyModal({ show: false, type: 'verify', app: null })} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleAction} disabled={processing} className={cn(
                "flex-1 text-white rounded-xl",
                verifyModal.type === 'verify' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
              )}>
                {processing ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
