import React from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Download,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DataTableProps {
  title: string;
  description?: string;
  columns: {
    header: string;
    accessorKey: string;
    cell?: (row: any) => React.ReactNode;
  }[];
  data: any[];
  onAdd?: () => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  actions?: (row: any) => React.ReactNode;
}

export const AdminDataTable = ({
  title,
  description,
  columns,
  data,
  onAdd,
  isLoading,
  searchPlaceholder = "Search platform records...",
  actions
}: DataTableProps) => {
  return (
    <div className="space-y-6">
      {/* Table Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-indigo-950 tracking-tighter">{title}</h2>
          {description && <p className="text-sm text-slate-500 font-medium">{description}</p>}
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 outline-none transition-all shadow-sm"
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-200 bg-white p-0">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
          {onAdd && (
            <Button onClick={onAdd} className="h-12 px-6 bg-indigo-900 hover:bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {columns.map((col, i) => (
                  <th key={i} className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {col.header}
                       <ArrowUpDown className="w-3 h-3 opacity-30" />
                    </div>
                  </th>
                ))}
                {actions && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-8 py-6">
                        <div className="h-4 bg-slate-100 rounded-lg w-full" />
                      </td>
                    ))}
                    {actions && <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-lg w-8 ml-auto" /></td>}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <p className="text-sm font-bold text-slate-400 italic">No entries found in registry</p>
                       <p className="text-xs text-slate-300 uppercase tracking-widest font-black">Platform clean</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    {columns.map((col, j) => (
                      <td key={j} className="px-8 py-6 text-sm text-slate-600 font-medium">
                        {col.cell ? col.cell(row) : row[col.accessorKey]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-8 py-6 text-right">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="flex items-center gap-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Page 1 <span className="text-slate-300 mx-2">|</span> {data.length} Records Loaded
             </p>
             <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
               <Download className="w-3 h-3 mr-2" />
               Export CSV
             </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl border-slate-200" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
               <Button className="h-10 w-10 p-0 rounded-xl bg-indigo-900 text-white font-black text-xs shadow-lg shadow-indigo-100">1</Button>
               <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl text-slate-400 font-black text-xs">2</Button>
            </div>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl border-slate-200">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
