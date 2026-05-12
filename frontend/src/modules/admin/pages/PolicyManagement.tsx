import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  Leaf,
  Baby,
  CloudRain,
  Loader2,
  ToggleLeft,
  ToggleRight,
  MapPinned,
  Building2,
  Percent,
  CircleDollarSign,
  X,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';

const policyTypes = [
  { label: 'Crop', value: 'crop' },
  { label: 'Livestock', value: 'livestock' },
  { label: 'Weather', value: 'weather' },
] as const;

type PolicyType = 'crop' | 'livestock' | 'weather';

type PolicyRecord = {
  _id: string;
  name: string;
  description: string;
  coverageAmount: number;
  premium: number;
  policyType: PolicyType;
  applicableRegions?: string[];
  isActive: boolean;
  insuranceCompanyId?: {
    _id?: string;
    name?: string;
    companyName?: string;
  } | string;
  createdAt?: string;
};

type PolicyFormState = {
  name: string;
  description: string;
  coverageAmount: string;
  premium: string;
  policyType: PolicyType;
  applicableRegions: string;
  insuranceCompanyId: string;
  isActive: boolean;
};

const emptyForm: PolicyFormState = {
  name: '',
  description: '',
  coverageAmount: '',
  premium: '',
  policyType: 'crop',
  applicableRegions: '',
  insuranceCompanyId: '',
  isActive: true,
};

const getCompanyLabel = (company?: PolicyRecord['insuranceCompanyId']) => {
  if (!company) return '—';
  if (typeof company === 'string') return company;
  return company.companyName || company.name || '—';
};

const getPolicyIcon = (type: PolicyType) => {
  if (type === 'livestock') return Baby;
  if (type === 'weather') return CloudRain;
  return Leaf;
};

export const AdminPolicyManagement = () => {
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | PolicyType>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyRecord | null>(null);
  const [form, setForm] = useState<PolicyFormState>(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [policyRes, companyRes] = await Promise.all([
        adminAPI.getPolicies(),
        adminAPI.getInsuranceCompanies(),
      ]);

      setPolicies(policyRes.data?.data || []);
      setInsuranceCompanies(companyRes.data?.data || []);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingPolicy(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (policy: PolicyRecord) => {
    setEditingPolicy(policy);
    setForm({
      name: policy.name || '',
      description: policy.description || '',
      coverageAmount: String(policy.coverageAmount ?? ''),
      premium: String(policy.premium ?? ''),
      policyType: policy.policyType,
      applicableRegions: policy.applicableRegions?.join(', ') || '',
      insuranceCompanyId:
        typeof policy.insuranceCompanyId === 'string'
          ? policy.insuranceCompanyId
          : policy.insuranceCompanyId?._id || '',
      isActive: policy.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPolicy(null);
    setForm(emptyForm);
  };

  const submitPolicy = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.insuranceCompanyId) {
      toast.error('Please fill all required policy fields');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      coverageAmount: Number(form.coverageAmount),
      premium: Number(form.premium),
      policyType: form.policyType,
      applicableRegions: form.applicableRegions
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      insuranceCompanyId: form.insuranceCompanyId,
      isActive: form.isActive,
    };

    if (!payload.coverageAmount || !payload.premium) {
      toast.error('Coverage amount and premium must be valid numbers');
      return;
    }

    setSaving(true);
    try {
      if (editingPolicy) {
        await adminAPI.updatePolicy(editingPolicy._id, payload);
        toast.success('Policy updated successfully');
      } else {
        await adminAPI.createPolicy(payload);
        toast.success('Policy created successfully');
      }
      closeModal();
      await fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  const togglePolicy = async (policy: PolicyRecord) => {
    try {
      await adminAPI.togglePolicyStatus(policy._id);
      toast.success(`Policy ${policy.isActive ? 'deactivated' : 'activated'} successfully`);
      await fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update policy status');
    }
  };

  const deletePolicy = async (policy: PolicyRecord) => {
    if (!confirm(`Delete policy "${policy.name}"? This cannot be undone.`)) return;

    try {
      await adminAPI.deletePolicy(policy._id);
      toast.success('Policy deleted successfully');
      await fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete policy');
    }
  };

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesType = activeType === 'all' || policy.policyType === activeType;
      const searchTerm = search.trim().toLowerCase();
      const providerName = getCompanyLabel(policy.insuranceCompanyId).toLowerCase();

      const matchesSearch =
        !searchTerm ||
        policy.name?.toLowerCase().includes(searchTerm) ||
        policy.description?.toLowerCase().includes(searchTerm) ||
        providerName.includes(searchTerm);

      return matchesType && matchesSearch;
    });
  }, [activeType, policies, search]);

  const stats = useMemo(() => {
    const activeCount = policies.filter((policy) => policy.isActive).length;
    const draftCount = policies.length - activeCount;
    const avgPremium = policies.length
      ? policies.reduce((total, policy) => total + Number(policy.premium || 0), 0) / policies.length
      : 0;
    const totalCoverage = policies.reduce((total, policy) => total + Number(policy.coverageAmount || 0), 0);

    return [
      { label: 'Active Policies', value: activeCount.toString(), icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
      { label: 'Drafts', value: draftCount.toString(), icon: ToggleLeft, color: 'text-amber-600 bg-amber-50' },
      { label: 'Avg Premium', value: `${avgPremium.toFixed(1)}%`, icon: Percent, color: 'text-emerald-600 bg-emerald-50' },
      { label: 'Coverage Pool', value: `Rs. ${(totalCoverage / 1000000).toFixed(1)}M`, icon: CircleDollarSign, color: 'text-blue-600 bg-blue-50' },
    ];
  }, [policies]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700">
            Nepal policy registry
          </div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">Policy Frameworks</h1>
            <p className="text-sm text-slate-500 max-w-2xl">
              Define and manage agricultural insurance policies for Nepal. These policies are what farmers buy and
              insurers review on the platform.
            </p>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl h-11 px-6 shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn('p-3 rounded-xl', stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-lg font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search policies, regions, or providers..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'crop', 'livestock', 'weather'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveType(tab)}
                className={cn(
                  'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                  activeType === tab
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-lg shadow-indigo-100'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {tab === 'all' ? 'All Categories' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Regions</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-6" colSpan={7}>
                      <div className="h-12 rounded-2xl bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-bold text-slate-400 italic">No policies found</p>
                      <p className="text-xs text-slate-300 uppercase tracking-widest font-black">
                        Create the first Nepal policy for the platform
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => {
                  const Icon = getPolicyIcon(policy.policyType);

                  return (
                    <tr key={policy._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                            policy.policyType === 'livestock'
                              ? 'bg-amber-50 text-amber-600'
                              : policy.policyType === 'weather'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-emerald-50 text-emerald-600'
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{policy.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">{policy.policyType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 font-medium">
                          {getCompanyLabel(policy.insuranceCompanyId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-indigo-600">{policy.premium}%</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        Rs. {Number(policy.coverageAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
                          <MapPinned className="w-3.5 h-3.5 text-slate-400" />
                          {policy.applicableRegions?.length ? (
                            policy.applicableRegions.map((region) => (
                              <span key={region} className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">
                                {region}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">All regions</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-flex items-center gap-1',
                          policy.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        )}>
                          {policy.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                          {policy.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(policy)}
                            className="h-9 rounded-xl border-slate-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-indigo-700 hover:bg-indigo-50"
                          >
                            <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePolicy(policy)}
                            className={cn(
                              'h-9 rounded-xl border-slate-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest',
                              policy.isActive
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            )}
                          >
                            {policy.isActive ? (
                              <ToggleLeft className="mr-1.5 h-3.5 w-3.5" />
                            ) : (
                              <ToggleRight className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {policy.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePolicy(policy)}
                            className="h-9 rounded-xl border-red-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200]"
              onClick={() => !saving && closeModal()}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-emerald-950 px-8 py-6 text-white flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200">
                      Government policy setup
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">
                      {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
                    </h3>
                    <p className="text-sm text-white/70 max-w-2xl">
                      Set up agricultural insurance policies that can be shown to farmers and insurers across Nepal.
                    </p>
                  </div>
                  <button
                    onClick={() => !saving && closeModal()}
                    className="rounded-2xl bg-white/10 p-2 text-white hover:bg-white/15 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid gap-6 p-8 lg:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Policy name</span>
                    <input
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Monsoon Crop Shield"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Insurance company</span>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={form.insuranceCompanyId}
                        onChange={(event) => setForm((current) => ({ ...current, insuranceCompanyId: event.target.value }))}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      >
                        <option value="">Select insurance partner</option>
                        {insuranceCompanies.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.companyName || company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Description</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                      className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Describe what this policy covers, eligibility, and claim basis."
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Policy type</span>
                    <select
                      value={form.policyType}
                      onChange={(event) => setForm((current) => ({ ...current, policyType: event.target.value as PolicyType }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    >
                      {policyTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Coverage amount (Rs.)</span>
                    <input
                      type="number"
                      value={form.coverageAmount}
                      onChange={(event) => setForm((current) => ({ ...current, coverageAmount: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="100000"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Premium (%)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={form.premium}
                      onChange={(event) => setForm((current) => ({ ...current, premium: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="2.5"
                    />
                  </label>

                  <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Applicable regions</span>
                    <input
                      value={form.applicableRegions}
                      onChange={(event) => setForm((current) => ({ ...current, applicableRegions: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="e.g. Rupandehi, Kathmandu, Chitwan"
                    />
                    <p className="text-xs text-slate-400">Separate multiple districts or regions with commas. Leave blank for all of Nepal.</p>
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Make this policy active immediately</p>
                      <p className="text-xs text-slate-500">Active policies appear to farmers and insurance teams.</p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    These policies are presented as <span className="font-semibold text-slate-700">Nepal agricultural insurance</span> offerings on the platform.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="h-11 rounded-2xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitPolicy}
                      disabled={saving}
                      className="h-11 rounded-2xl bg-indigo-900 px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-950"
                    >
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {editingPolicy ? 'Save Changes' : 'Create Policy'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
