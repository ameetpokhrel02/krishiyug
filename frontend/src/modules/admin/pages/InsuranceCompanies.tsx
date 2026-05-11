import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { Organization } from '../types';

const mockInsurers: Organization[] = [
  { id: 'INS1', name: 'Shikhar Insurance Co. Ltd.', type: 'INSURANCE_COMPANY', district: 'Kathmandu', status: 'ACTIVE', createdAt: '2023-01-01' },
  { id: 'INS2', name: 'Sagarmatha Insurance', type: 'INSURANCE_COMPANY', district: 'Kathmandu', status: 'ACTIVE', createdAt: '2023-01-05' },
  { id: 'INS3', name: 'Neco Insurance', type: 'INSURANCE_COMPANY', district: 'Kathmandu', status: 'INACTIVE', createdAt: '2023-02-10' },
];

export const InsuranceCompanyManagement = () => {
  const columns = [
    {
      header: 'Company Name',
      accessorKey: 'name',
      cell: (row: Organization) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <div className="w-6 h-6 rounded bg-indigo-900" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-[10px] text-slate-500">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Headquarters',
      accessorKey: 'district',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Organization) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          "bg-red-50 text-red-600 border-red-100"
        )}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Registration Date',
      accessorKey: 'createdAt',
      cell: (row: Organization) => (
        <p className="text-sm text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable 
        title="Insurance Companies" 
        description="Monitor and manage insurance partners on the platform."
        columns={columns}
        data={mockInsurers}
        onAdd={() => console.log('Add insurer')}
        searchPlaceholder="Search insurance companies..."
      />
    </div>
  );
};
