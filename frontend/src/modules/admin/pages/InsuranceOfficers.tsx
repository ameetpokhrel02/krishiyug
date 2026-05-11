import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { User } from '../types';

const mockInsuranceOfficers: User[] = [
  { id: 'IO001', name: 'Binod Sharma', phone: '9842001122', email: 'binod@shikhar.com', role: 'INSURANCE_OFFICER', status: 'ACTIVE', createdAt: '2023-12-01', organizationId: 'INS1' },
  { id: 'IO002', name: 'Sarita Gurung', phone: '9852001122', email: 'sarita@sagarmatha.com', role: 'INSURANCE_OFFICER', status: 'ACTIVE', createdAt: '2023-12-10', organizationId: 'INS2' },
  { id: 'IO003', name: 'Prakash Rai', phone: '9802001122', email: 'prakash@neco.com', role: 'INSURANCE_OFFICER', status: 'INACTIVE', createdAt: '2024-01-05', organizationId: 'INS3' },
];

export const InsuranceOfficerManagement = () => {
  const columns = [
    {
      header: 'Officer Name',
      accessorKey: 'name',
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-[10px] text-slate-500">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Insurance Co.',
      accessorKey: 'organizationId',
      cell: (row: User) => <span className="text-sm font-semibold text-slate-700">{row.organizationId}</span>,
    },
    {
      header: 'Contact Info',
      accessorKey: 'email',
      cell: (row: User) => (
        <div>
          <p className="text-sm text-slate-600">{row.email}</p>
          <p className="text-xs text-slate-400">{row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: User) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          "bg-slate-50 text-slate-500 border-slate-100"
        )}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable 
        title="Insurance Officers" 
        description="Manage accounts for insurance company adjusters and officers."
        columns={columns}
        data={mockInsuranceOfficers}
        onAdd={() => console.log('Add insurance officer')}
        searchPlaceholder="Search insurance officers..."
      />
    </div>
  );
};
