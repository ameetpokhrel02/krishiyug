import { useState, useEffect } from 'react';
import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/platform';
import { UserPlus, Loader2, X, Phone, User, Mail, Shield, Building2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUserManagement = () => {
  const [activeRole, setActiveRole] = useState<string>('farmer');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    role: 'ward_official',
    companyName: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [activeRole]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response: any = await adminAPI.getUsers(activeRole);
      setUsers(response?.data?.data || []);
    } catch (err: any) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phoneNumber || !form.role) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminAPI.provisionUser(form);
      toast.success(`User provisioned as ${form.role.replace('_', ' ')}`);
      setShowModal(false);
      setForm({ name: '', phoneNumber: '', email: '', role: 'ward_official', companyName: '', password: '' });
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Name', 
      accessorKey: 'name',
      cell: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
            {u.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{u.name}</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">{u.role}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Contact Details', 
      accessorKey: 'phoneNumber',
      cell: (u: any) => (
        <div>
          <p className="text-sm text-slate-900 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400" />
            {u.phoneNumber}
          </p>
          {u.email && (
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3" />
              {u.email}
            </p>
          )}
        </div>
      )
    },
    { 
      header: 'Affiliation', 
      accessorKey: 'companyName',
      cell: (u: any) => (
        <span className="text-xs text-slate-600 font-medium italic">
          {u.companyName || u.farmerDetails?.location?.district || 'System'}
        </span>
      )
    },
    { 
      header: 'Joined', 
      accessorKey: 'createdAt',
      cell: (u: any) => <span className="text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span> 
    },
  ];

  const roleTabs = [
    { label: 'Farmers', value: 'farmer' },
    { label: 'Ward Officers', value: 'ward_official' },
    { label: 'Insurance Partners', value: 'insurance_company' },
    { label: 'Admins', value: 'admin' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">User Management</h1>
          <p className="text-sm text-slate-500">Manage all platform stakeholders and provision internal access.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl h-11 px-6 shadow-lg shadow-indigo-200 font-black uppercase tracking-widest text-[10px]"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Provision Internal User
        </Button>
      </div>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-full md:w-max gap-1">
        {roleTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveRole(tab.value)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeRole === tab.value 
                ? "bg-indigo-900 text-white shadow-lg" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <AdminDataTable 
          title={`${activeRole.replace('_', ' ')}s Registry`}
          columns={columns}
          data={users}
        />
      )}

      {/* Provision Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
              onClick={() => !isSubmitting && setShowModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter">Provision Internal User</h3>
                      <p className="text-sm text-slate-500">Create accounts for partners and staff.</p>
                    </div>
                  </div>
                  <button onClick={() => !isSubmitting && setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input 
                        required type="text" value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> Phone Number
                      </label>
                      <input 
                        required type="tel" value={form.phoneNumber}
                        onChange={e => setForm({...form, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" 
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <input 
                      type="email" value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" 
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Shield className="w-3 h-3" /> Role
                      </label>
                      <select 
                        value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                      >
                        <option value="ward_official">Ward Officer</option>
                        <option value="insurance_company">Insurance Partner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" /> Organization
                      </label>
                      <input 
                        type="text" value={form.companyName}
                        onChange={e => setForm({...form, companyName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" 
                        placeholder="e.g. Ward 07 or Shikhar Ins."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Custom Password (Optional)
                    </label>
                    <input 
                      type="password" value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" 
                      placeholder="Leave blank for default"
                    />
                    <p className="text-[9px] text-slate-400 italic">Default password: Krishiyug@123</p>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 border-slate-200 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" disabled={isSubmitting}
                      className="flex-1 bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
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
