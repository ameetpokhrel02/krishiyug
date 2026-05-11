import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { Organization } from '../types';

const mockMunicipalities: Organization[] = [
  { id: 'M1', name: 'Kathmandu Metropolitan City', type: 'PALIKA', district: 'Kathmandu', status: 'ACTIVE', createdAt: '2023-01-01' },
  { id: 'M2', name: 'Lalitpur Metropolitan City', type: 'PALIKA', district: 'Lalitpur', status: 'ACTIVE', createdAt: '2023-01-01' },
  { id: 'M3', name: 'Biratnagar Metropolitan City', type: 'PALIKA', district: 'Morang', status: 'ACTIVE', createdAt: '2023-02-15' },
  { id: 'M4', name: 'Pokhara Lekhnath', type: 'PALIKA', district: 'Kaski', status: 'INACTIVE', createdAt: '2023-03-20' },
];

export const WardManagement = () => {
  const columns = [
    {
      header: 'Municipality Name',
      accessorKey: 'name',
      cell: (row: Organization) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-[10px] text-slate-500">{row.id}</p>
        </div>
      ),
    },
    {
      header: 'District',
      accessorKey: 'district',
      cell: (row: Organization) => (
        <span className="text-sm text-slate-600 font-medium">{row.district}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Organization) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          "bg-slate-50 text-slate-500 border-slate-100"
        )}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: (row: Organization) => (
        <p className="text-sm text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable 
        title="Municipality Management" 
        description="Manage Palika offices and their configurations."
        columns={columns}
        data={mockMunicipalities}
        onAdd={() => console.log('Add municipality')}
        searchPlaceholder="Search municipalities..."
      />
    </div>
  );
};
