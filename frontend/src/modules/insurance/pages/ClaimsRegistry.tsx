import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { insuranceAPI } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type ClaimStatus = 'all' | 'admin_verified' | 'refund_approved' | 'rejected' | 'pending';

export const InsuranceClaimsRegistry = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ClaimStatus>('all');
  const [search, setSearch] = useState('');
  const [deciding, setDeciding] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const fetchClaims = async () => {
    try {
      const res = await insuranceAPI.getAllClaims();
      const data = (res as any).data?.data || [];
      setClaims(data);
      setFiltered(data);
    } catch (err) {
      toast.error('Failed to load claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClaims(); }, []);

  useEffect(() => {
    let result = [...claims];
    if (filter !== 'all') result = result.filter(c => c.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.farmerId?.name?.toLowerCase().includes(q) ||
        c.farmerId?.phoneNumber?.includes(q) ||
        c._id?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [filter, search, claims]);

  const handleDecision = async (claimId: string, action: 'approved' | 'rejected', reason?: string) => {
    setDeciding(claimId);
    try {
      await insuranceAPI.decideClaim({ claimId, action, reason });
      toast.success(`Claim ${action === 'approved' ? 'approved' : 'rejected'} successfully.`);
      await fetchClaims();
      setSelectedClaim(null);
    } catch (err: any) {
      toast.error(err?.message || 'Decision failed. Please try again.');
    } finally {
      setDeciding(null);
    }
  };

  const statusFilters: { label: string; value: ClaimStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Needs Decision', value: 'admin_verified' },
    { label: 'Approved', value: 'refund_approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Pending Admin', value: 'pending' },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; style: string }> = {
      pending: { label: 'Pending Admin', style: 'bg-slate-100 text-slate-600' },
      admin_verified: { label: 'Needs Your Decision', style: 'bg-amber-100 text-amber-700' },
      refund_approved: { label: 'Approved', style: 'bg-emerald-100 text-emerald-700' },
      rejected: { label: 'Rejected', style: 'bg-red-100 text-red-700' },
    };
    return map[status] || { label: status, style: 'bg-slate-100 text-slate-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Claims Registry</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review and decide on verified claims assigned to your insurance portfolio.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by farmer name, phone, or claim ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(sf => (
            <button
              key={sf.value}
              onClick={() => setFilter(sf.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                filter === sf.value
                  ? "bg-emerald-950 text-white border-emerald-950"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              )}
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['Claim ID', 'Farmer', 'District', 'Policy Type', 'Coverage', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No claims match the selected filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((claim: any) => {
                  const badge = getStatusBadge(claim.status);
                  const canDecide = claim.status === 'admin_verified';
                  return (
                    <tr key={claim._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold">
                        #{claim._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-700 text-xs">
                            {claim.farmerId?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{claim.farmerId?.name || '—'}</p>
                            <p className="text-[10px] text-slate-400">{claim.farmerId?.phoneNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {claim.farmerId?.farmerDetails?.location?.district || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase capitalize">
                          {claim.policyId?.policyType || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">
                        Rs. {claim.policyId?.coverageAmount?.toLocaleString() || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest", badge.style)}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {canDecide ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDecision(claim._id, 'approved')}
                              disabled={deciding === claim._id}
                              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase"
                            >
                              {deciding === claim._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3 mr-1" />Approve</>}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecision(claim._id, 'rejected', 'Claim rejected by insurance company')}
                              disabled={deciding === claim._id}
                              className="h-8 px-3 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[10px] font-black uppercase"
                            >
                              <XCircle className="w-3 h-3 mr-1" />Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {claim.status === 'pending' ? 'Awaiting Admin' : 'Decided'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex gap-6 text-sm text-slate-500">
        <span>Total: <strong className="text-slate-900">{claims.length}</strong></span>
        <span>Showing: <strong className="text-slate-900">{filtered.length}</strong></span>
        <span>Needs Decision: <strong className="text-amber-600">{claims.filter(c => c.status === 'admin_verified').length}</strong></span>
      </div>
    </div>
  );
};
