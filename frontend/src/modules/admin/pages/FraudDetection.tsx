import { AdminDataTable } from '../components/DataTable';
import { cn } from '@/lib/utils';
import type { FraudAlert } from '../types';
import { AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

const mockAlerts: FraudAlert[] = [
  { id: 'ALR001', claimId: 'CLM002', reason: 'Abnormal claim frequency from same Palika', severity: 'HIGH', status: 'OPEN', createdAt: '2024-03-16' },
  { id: 'ALR002', claimId: 'CLM005', reason: 'Inconsistent photo metadata detected', severity: 'MEDIUM', status: 'OPEN', createdAt: '2024-03-17' },
  { id: 'ALR003', claimId: 'CLM008', reason: 'Farmer identity verification mismatch', severity: 'LOW', status: 'RESOLVED', createdAt: '2024-03-15' },
];

export const FraudMonitoring = () => {
  const columns = [
    {
      header: 'Alert ID',
      accessorKey: 'id',
      cell: (row: FraudAlert) => <span className="font-bold text-slate-900">{row.id}</span>,
    },
    {
      header: 'Claim ID',
      accessorKey: 'claimId',
      cell: (row: FraudAlert) => <span className="text-sm font-semibold text-indigo-600">{row.claimId}</span>,
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row: FraudAlert) => <p className="text-sm text-slate-600 max-w-xs truncate">{row.reason}</p>,
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row: FraudAlert) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.severity === 'HIGH' ? "bg-red-50 text-red-600 border-red-100" :
          row.severity === 'MEDIUM' ? "bg-amber-50 text-amber-600 border-amber-100" :
          "bg-blue-50 text-blue-600 border-blue-100"
        )}>
          {row.severity}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: FraudAlert) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.status === 'OPEN' ? "bg-red-600 text-white border-red-700 shadow-sm animate-pulse" :
          row.status === 'RESOLVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          "bg-slate-50 text-slate-500 border-slate-100"
        )}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
           </div>
           <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Active Alerts</p>
              <h4 className="text-2xl font-bold text-red-900">12</h4>
           </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
           </div>
           <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Medium Risk</p>
              <h4 className="text-2xl font-bold text-amber-900">45</h4>
           </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
           </div>
           <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Resolved</p>
              <h4 className="text-2xl font-bold text-emerald-900">892</h4>
           </div>
        </div>
      </div>

      <AdminDataTable 
        title="Fraud Intelligence" 
        description="Monitor AI-detected suspicious activities and fraud alerts."
        columns={columns}
        data={mockAlerts}
        searchPlaceholder="Search alerts by ID or claim..."
      />
    </div>
  );
};
