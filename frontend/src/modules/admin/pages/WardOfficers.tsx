import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { User } from '../types';

const mockWardOfficers: User[] = [
  { id: 'OFF001', name: 'Suman Shrestha', phone: '9841001122', email: 'suman@biratnagar.gov.np', role: 'PALIKA_OFFICER', status: 'ACTIVE', createdAt: '2023-10-01', organizationId: 'M3' },
  { id: 'OFF002', name: 'Rita Karki', phone: '9851001122', email: 'rita@kathmandu.gov.np', role: 'PALIKA_OFFICER', status: 'ACTIVE', createdAt: '2023-10-15', organizationId: 'M1' },
  { id: 'OFF003', name: 'Ganesh Thapa', phone: '9801001122', email: 'ganesh@lalitpur.gov.np', role: 'PALIKA_OFFICER', status: 'INACTIVE', createdAt: '2023-11-05', organizationId: 'M2' },
];

export const WardOfficerManagement = () => {
  const columns = [
    {
      header: 'Officer Name',
      accessorKey: 'name',
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
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
      header: 'Contact Info',
      accessorKey: 'email',
      cell: (row: User) => (
        <div>
          <p className="text-sm text-slate-700 font-medium">{row.email}</p>
          <p className="text-xs text-slate-500">{row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Palika ID',
      accessorKey: 'organizationId',
      cell: (row: User) => <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{row.organizationId}</span>,
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
        title="Ward / Palika Officers" 
        description="Manage government officer accounts for Palika verification."
        columns={columns}
        data={mockWardOfficers}
        onAdd={() => console.log('Add ward officer')}
        searchPlaceholder="Search officers by name, email or ID..."
      />
    </div>
  );
};
