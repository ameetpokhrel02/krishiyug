import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Eye,
  EyeOff,
  Loader2,
  X,
  Phone,
  Lock,
  User,
  Briefcase,
  CheckCircle2,
  MoreVertical,
  Edit2,
  Trash2,
  Power
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AdminDataTable } from '../components/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddInsuranceCompanyForm>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<AddInsuranceCompanyForm>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    companyName: '',
  });

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

  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setEditForm({
      name: company.name || '',
      phoneNumber: company.phoneNumber || '',
      companyName: company.companyName || '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    setSubmitting(true);
    try {
      await adminAPI.updateUser(selectedCompany._id, editForm);
      toast.success('Insurance company updated successfully');
      setShowEditModal(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (company: any) => {
    try {
      await adminAPI.toggleUserStatus(company._id);
      toast.success(`Company ${company.status === 'active' ? 'deactivated' : 'activated'} successfully`);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to toggle company status');
    }
  };

  const handleDelete = async (company: any) => {
    if (!confirm(`Are you sure you want to delete ${company.companyName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(company._id);
      toast.success('Insurance company deleted successfully');
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete company');
    }
  };

  const columns = [
    {
      header: 'Company',
      accessorKey: 'companyName',
      cell: (company: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{company.companyName || '—'}</p>
            <p className="text-[10px] text-slate-400 font-mono">{company._id?.slice(-8)}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Person',
      accessorKey: 'name',
      cell: (company: any) => <span className="text-sm text-slate-700 font-medium">{company.name || '—'}</span>
    },
    {
      header: 'Phone',
      accessorKey: 'phoneNumber',
      cell: (company: any) => <span className="text-sm text-slate-600">{company.phoneNumber || '—'}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (company: any) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          company.status === 'active'
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-slate-100 text-slate-500 border-slate-200"
        )}>
          {company.status || 'active'}
        </span>
      )
    },
    {
      header: 'Registered',
      accessorKey: 'createdAt',
      cell: (company: any) => (
        <span className="text-sm text-slate-500">
          {company.createdAt ? new Date(company.createdAt).toLocaleDateString('en-NP') : '—'}
        </span>
      )
    },
  ];

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

      {/* Companies Table */}
      <AdminDataTable
        title="Insurance Partners Registry"
        columns={columns}
        data={companies}
        isLoading={loading}
        searchPlaceholder="Search by company name, contact, or phone..."
        actions={(company: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl">
                <MoreVertical className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-200 shadow-xl">
              <DropdownMenuItem
                onClick={() => handleEdit(company)}
                className="cursor-pointer rounded-xl text-sm font-semibold"
              >
                <Edit2 className="mr-2 h-4 w-4 text-indigo-600" />
                Edit Company
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleStatus(company)}
                className="cursor-pointer rounded-xl text-sm font-semibold"
              >
                <Power className={cn("mr-2 h-4 w-4", company.status === 'active' ? 'text-orange-600' : 'text-emerald-600')} />
                {company.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(company)}
                className="cursor-pointer rounded-xl text-sm font-semibold text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

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

      {/* Edit Company Modal */}
      <AnimatePresence>
        {showEditModal && selectedCompany && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowEditModal(false)}
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
                      <Edit2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tighter">Edit Insurance Company</h2>
                      <p className="text-xs text-slate-400">Update company information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => !submitting && setShowEditModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> Company Name
                    </label>
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={e => setEditForm(f => ({ ...f, companyName: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="e.g. Nepal Life Insurance Company"
                    />
                  </div>

                  {/* Contact Person Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Contact Person Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="e.g. Sita Sharma"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={e => setEditForm(f => ({ ...f, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="e.g. 9876543212"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => !submitting && setShowEditModal(false)}
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
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" />Updating...</>
                      ) : (
                        'Update Company'
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
