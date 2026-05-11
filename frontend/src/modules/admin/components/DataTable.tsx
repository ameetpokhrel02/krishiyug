import React from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Download,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
}

export const AdminDataTable = ({ 
  title, 
  description, 
  columns, 
  data, 
  onAdd, 
  isLoading,
  searchPlaceholder = "Search..."
}: DataTableProps) => {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-indigo-950 font-heading">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="bg-indigo-900 hover:bg-indigo-950 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="h-8 w-px bg-slate-200 mx-1" />
          <p className="text-xs text-slate-500 font-medium">Show:</p>
          <select className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {col.header}
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                      </td>
                    ))}
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 italic">
                    No data found.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    {columns.map((col, j) => (
                      <td key={j} className="px-6 py-4 text-sm text-slate-600">
                        {col.cell ? col.cell(row) : row[col.accessorKey]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold">1</span> to <span className="font-bold">{data.length}</span> of <span className="font-bold">156</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-indigo-900 text-white border-indigo-900 hover:bg-indigo-950">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
