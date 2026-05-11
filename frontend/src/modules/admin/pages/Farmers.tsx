import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { User } from '../types';

const mockFarmers: User[] = [
  { id: '1', name: 'Ram Bahadur', phone: '9841234567', email: 'ram@example.com', role: 'FARMER', status: 'ACTIVE', createdAt: '2024-03-10' },
  { id: '2', name: 'Sita Devi', phone: '9851234567', email: 'sita@example.com', role: 'FARMER', status: 'ACTIVE', createdAt: '2024-03-12' },
  { id: '3', name: 'Krishna Subedi', phone: '9801234567', email: 'krishna@example.com', role: 'FARMER', status: 'INACTIVE', createdAt: '2024-03-15' },
  { id: '4', name: 'Maya Thapa', phone: '9811234567', email: 'maya@example.com', role: 'FARMER', status: 'SUSPENDED', createdAt: '2024-03-18' },
];

export const FarmerManagement = () => {
  const columns = [
    {
      header: 'Farmer Name',
      accessorKey: 'name',
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-xs">
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
      header: 'Contact',
      accessorKey: 'phone',
      cell: (row: User) => (
        <div>
          <p className="font-medium text-slate-700">{row.phone}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Joined Date',
      accessorKey: 'createdAt',
      cell: (row: User) => (
        <p className="text-sm text-slate-600">{new Date(row.createdAt).toLocaleDateString()}</p>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: User) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          row.status === 'INACTIVE' ? "bg-slate-50 text-slate-500 border-slate-100" :
          "bg-red-50 text-red-600 border-red-100"
        )}>
          {row.status}
        </span>
      ),
    },
  ];

  const handleAddFarmer = () => {
    // Logic for opening modal
    console.log('Opening add farmer modal');
  };

  return (
    <div className="space-y-6">
      <AdminDataTable 
        title="Farmer Management" 
        description="View and manage all registered farmers across Nepal."
        columns={columns}
        data={mockFarmers}
        onAdd={handleAddFarmer}
        searchPlaceholder="Search farmers by name, phone or ID..."
      />
    </div>
  );
};
