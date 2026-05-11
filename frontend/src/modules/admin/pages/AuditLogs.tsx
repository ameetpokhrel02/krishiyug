import { AdminDataTable } from '../components/DataTable';

const mockLogs = [
  { id: 'LOG001', user: 'Amit Pokhrel', action: 'Created Ward Officer account', target: 'suman@biratnagar.gov.np', timestamp: '2024-03-18 14:20:05', ip: '192.168.1.1' },
  { id: 'LOG002', user: 'Amit Pokhrel', action: 'Approved Insurance Co.', target: 'Shikhar Insurance', timestamp: '2024-03-18 12:15:30', ip: '192.168.1.1' },
  { id: 'LOG003', user: 'Amit Pokhrel', action: 'Deactivated Farmer', target: 'ram@example.com', timestamp: '2024-03-18 10:05:12', ip: '192.168.1.1' },
  { id: 'LOG004', user: 'System', action: 'AI Fraud Alert Generated', target: 'CLM002', timestamp: '2024-03-17 23:45:00', ip: 'internal' },
];

export const AuditLogs = () => {
  const columns = [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: (row: any) => <span className="text-xs font-medium text-slate-500">{row.timestamp}</span>,
    },
    {
      header: 'User',
      accessorKey: 'user',
      cell: (row: any) => <span className="font-semibold text-slate-900">{row.user}</span>,
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: (row: any) => <span className="text-sm font-medium text-indigo-600">{row.action}</span>,
    },
    {
      header: 'Target',
      accessorKey: 'target',
      cell: (row: any) => <span className="text-sm text-slate-600 italic">{row.target}</span>,
    },
    {
      header: 'IP Address',
      accessorKey: 'ip',
      cell: (row: any) => <span className="text-xs font-mono text-slate-400">{row.ip}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable 
        title="Audit Logs" 
        description="Security and activity logs for all administrative actions."
        columns={columns}
        data={mockLogs}
        searchPlaceholder="Search logs by user or action..."
      />
    </div>
  );
};
