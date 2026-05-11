import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Eye,
  EyeOff,
  Loader2,
  X,
  Phone,
  Lock,
  User,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Backend POST /api/admin/insurance-company expects:
// { name, phoneNumber, password, companyName }
interface AddInsuranceCompanyForm {
  name: string;
  phoneNumber: string;
  password: string;
  companyName: string;
}

const emptyForm: AddInsuranceCompanyForm = {
  name: '',
  phoneNumber: '',
  password: '',
  companyName: '',
};

export const InsuranceCompanyManagement = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddInsuranceCompanyForm>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<AddInsuranceCompanyForm>>({});

  const fetchCompanies = async () => {
    try {
      // Currently we get companies from the seed data via the admin API
      // Insurance companies are Users with role=insurance_company
      const res = await adminAPI.getInsuranceCompanies();
      setCompanies((res as any).data?.data || []);
    } catch {
      // If endpoint not available, show empty state gracefully
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const validate = (): boolean => {
    const newErrors: Partial<AddInsuranceCompanyForm> = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.name.trim()) newErrors.name = 'Contact person name is required';
    if (!/^[0-9]{10}$/.test(form.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await adminAPI.createInsuranceCompany({
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        companyName: form.companyName.trim(),
      });
      toast.success(`Insurance company "${form.companyName}" registered successfully!`);
      setForm(emptyForm);
      setShowForm(false);
      await fetchCompanies();
    } catch (err: any) {
      const msg = err?.message || err?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = companies.filter(c =>
    !search ||
    c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Insurance Companies</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all registered insurance partners on the platform. Only KrishiYug Admin can onboard companies.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl px-6 h-11 shadow-lg shadow-indigo-200 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Insurance Company
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by company name, contact, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Company', 'Contact Person', 'Phone', 'Status', 'Registered'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-400 font-medium">No insurance companies registered yet.</p>
                      <Button onClick={() => setShowForm(true)} variant="outline" className="mt-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        <Plus className="w-3 h-3 mr-2" /> Add First Company
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((company: any) => (
                    <tr key={company._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{company.companyName || '—'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{company._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{company.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{company.phoneNumber || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {company.createdAt ? new Date(company.createdAt).toLocaleDateString('en-NP') : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowForm(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tighter">Register Insurance Company</h2>
                      <p className="text-xs text-slate-400">Creates login credentials for the insurance portal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => !submitting && setShowForm(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={e => { setForm(f => ({ ...f, companyName: e.target.value })); setErrors(er => ({ ...er, companyName: '' })); }}
                      placeholder="e.g. Nepal Life Insurance Company"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                        errors.companyName ? "border-red-300 bg-red-50" : "border-slate-200"
                      )}
                    />
                    {errors.companyName && <p className="text-red-500 text-[10px] font-bold">{errors.companyName}</p>}
                  </div>

                  {/* Contact Person Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
                      placeholder="e.g. Sita Sharma"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                        errors.name ? "border-red-300 bg-red-50" : "border-slate-200"
                      )}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Phone Number (Login ID) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={e => { setForm(f => ({ ...f, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })); setErrors(er => ({ ...er, phoneNumber: '' })); }}
                      placeholder="e.g. 9876543212"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                        errors.phoneNumber ? "border-red-300 bg-red-50" : "border-slate-200"
                      )}
                    />
                    {errors.phoneNumber ? (
                      <p className="text-red-500 text-[10px] font-bold">{errors.phoneNumber}</p>
                    ) : (
                      <p className="text-slate-400 text-[10px]">This phone number will be used to log into the insurance portal.</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Initial Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                        placeholder="Min 8 characters"
                        className={cn(
                          "w-full px-4 py-3 pr-12 bg-slate-50 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
                          errors.password ? "border-red-300 bg-red-50" : "border-slate-200"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[10px] font-bold">{errors.password}</p>}
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      The company will log into the <b>Insurance Partner Portal</b> using their phone number and this password. Share credentials securely.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => !submitting && setShowForm(false)}
                      disabled={submitting}
                      className="flex-1 h-12 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-[10px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 h-12 bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" />Registering...</>
                      ) : (
                        <><Building2 className="w-4 h-4 mr-2" />Register Company</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
