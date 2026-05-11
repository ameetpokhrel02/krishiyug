import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { Claim } from '../types';
import { Clock, AlertTriangle, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

const mockClaims: Claim[] = [
  { id: 'CLM001', farmerId: 'F1', farmerName: 'Ram Bahadur', amount: 45000, status: 'PENDING', riskScore: 12, createdAt: '2024-03-15', district: 'Jhapa' },
  { id: 'CLM002', farmerId: 'F2', farmerName: 'Sita Devi', amount: 120000, status: 'FLAGGED', riskScore: 88, createdAt: '2024-03-16', district: 'Morang' },
  { id: 'CLM003', farmerId: 'F3', farmerName: 'Krishna Subedi', amount: 85000, status: 'APPROVED', riskScore: 5, createdAt: '2024-03-14', district: 'Kaski' },
  { id: 'CLM004', farmerId: 'F4', farmerName: 'Maya Thapa', amount: 32000, status: 'UNDER_REVIEW', riskScore: 45, createdAt: '2024-03-17', district: 'Rupandehi' },
];

export const ClaimsMonitoring = () => {
  const columns = [
    {
      header: 'Claim ID',
      accessorKey: 'id',
      cell: (row: Claim) => <span className="font-bold text-slate-900">{row.id}</span>,
    },
    {
      header: 'Farmer',
      accessorKey: 'farmerName',
      cell: (row: Claim) => (
        <div>
          <p className="font-semibold text-slate-700">{row.farmerName}</p>
          <p className="text-[10px] text-slate-500">{row.district}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row: Claim) => <span className="font-bold text-slate-900">Rs. {row.amount.toLocaleString()}</span>,
    },
    {
      header: 'AI Risk Score',
      accessorKey: 'riskScore',
      cell: (row: Claim) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                row.riskScore > 70 ? "bg-red-500" : row.riskScore > 30 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${row.riskScore}%` }}
            />
          </div>
          <span className={cn(
            "text-xs font-bold",
            row.riskScore > 70 ? "text-red-600" : row.riskScore > 30 ? "text-amber-600" : "text-emerald-600"
          )}>
            {row.riskScore}%
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Claim) => {
        const statusMap = {
          PENDING: { label: 'Pending', icon: Clock, color: 'bg-blue-50 text-blue-600 border-blue-100' },
          UNDER_REVIEW: { label: 'Review', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          REJECTED: { label: 'Rejected', icon: XCircle, color: 'bg-red-50 text-red-600 border-red-100' },
          FLAGGED: { label: 'Flagged', icon: ShieldAlert, color: 'bg-red-600 text-white border-red-700 shadow-sm animate-pulse' },
        };
        const config = statusMap[row.status as keyof typeof statusMap];
        const Icon = config.icon;
        return (
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            config.color
          )}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable 
        title="Claims Monitoring" 
        description="Monitor and process agricultural insurance claims in real-time."
        columns={columns}
        data={mockClaims}
        searchPlaceholder="Search claims by ID or farmer name..."
      />
    </div>
  );
};
