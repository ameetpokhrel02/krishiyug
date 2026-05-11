import { useState } from 'react';
import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/types/platform';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockUsers: User[] = [
  { id: '1', name: 'Ram Bahadur', phone: '9841234567', email: 'ram@example.com', role: 'FARMER', status: 'ACTIVE', createdAt: '2024-03-10' },
  { id: '2', name: 'Suman Shrestha', phone: '9841001122', email: 'suman@biratnagar.gov.np', role: 'PALIKA_OFFICER', status: 'ACTIVE', createdAt: '2023-10-01', organizationId: 'M3' },
  { id: '3', name: 'Binod Sharma', phone: '9842001122', email: 'binod@shikhar.com', role: 'INSURANCE_OFFICER', status: 'ACTIVE', createdAt: '2023-12-01', organizationId: 'INS1' },
];

export const AdminUserManagement = () => {
  const [activeRole, setActiveRole] = useState<UserRole>('FARMER');
  const [showModal, setShowModal] = useState(false);

  const filteredUsers = mockUsers.filter(u => u.role === activeRole);

  const columns = [
    { 
      header: 'Name', 
      accessorKey: 'name',
      cell: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
            {u.name.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-slate-900">{u.name}</span>
        </div>
      )
    },
    { 
      header: 'Contact', 
      accessorKey: 'phone',
      cell: (u: User) => (
        <div>
          <p className="text-sm text-slate-900">{u.phone}</p>
          <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (u: User) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          u.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
        )}>
          {u.status}
        </span>
      )
    },
    { 
      header: 'Joined', 
      accessorKey: 'createdAt',
      cell: (u: User) => <span className="text-sm text-slate-500">{u.createdAt}</span> 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950 font-heading mb-1">User Management</h1>
          <p className="text-sm text-slate-500">Manage all platform stakeholders and their access levels.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl h-11 px-6 shadow-lg shadow-indigo-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Provision New User
        </Button>
      </div>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-full md:w-max">
        {(['FARMER', 'PALIKA_OFFICER', 'INSURANCE_OFFICER'] as const).map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
              activeRole === role 
                ? "bg-indigo-900 text-white shadow-lg" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            {role === 'FARMER' ? 'Farmers' : role === 'PALIKA_OFFICER' ? 'Ward Officers' : 'Insurance Officers'}
          </button>
        ))}
      </div>

      <AdminDataTable 
        title={`${activeRole.replace('_', ' ')}s Registry`}
        columns={columns}
        data={filteredUsers}
      />

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Provision User</h3>
                    <p className="text-sm text-slate-500">Create internal accounts for partners.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                       <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                       <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Role</label>
                       <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
                          <option value="PALIKA_OFFICER">Ward Officer</option>
                          <option value="INSURANCE_OFFICER">Insurance Officer</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Organization ID</label>
                       <input type="text" placeholder="e.g. INS-001" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setShowModal(false)}>Cancel</Button>
                 <Button className="flex-1 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl h-12 font-bold shadow-xl shadow-indigo-100">
                    Create Account
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
