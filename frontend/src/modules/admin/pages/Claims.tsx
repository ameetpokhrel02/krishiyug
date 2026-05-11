import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  Loader2,
  AlertTriangle,
  Filter,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

type StatusFilter = 'all' | 'pending' | 'admin_verified' | 'refund_approved' | 'rejected';

export const ClaimsMonitoring = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      const res = await adminAPI.getAllClaims();
      const data = (res as any).data?.data || [];
      setClaims(data);
      setFiltered(data);
    } catch {
      toast.error('Could not load claims data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClaims(); }, []);

  useEffect(() => {
    let result = [...claims];
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.farmerId?.name?.toLowerCase().includes(q) ||
        c.farmerId?.phoneNumber?.includes(q) ||
        c._id?.toLowerCase().includes(q) ||
        c.farmerId?.farmerDetails?.location?.district?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [statusFilter, search, claims]);

  const handleVerify = async (claimId: string) => {
    setActing(claimId);
    try {
      await adminAPI.verifyClaim(claimId, 'Claim verified by admin — forwarded to insurance company');
      toast.success('Claim verified and forwarded to insurance company.');
      await fetchClaims();
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed.');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (claimId: string) => {
    setActing(claimId);
    try {
      await adminAPI.rejectClaim(claimId, 'Insufficient evidence or invalid claim');
      toast.success('Claim rejected successfully.');
      await fetchClaims();
    } catch (err: any) {
      toast.error(err?.message || 'Rejection failed.');
    } finally {
      setActing(null);
    }
  };

  const statusFilters: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'All', value: 'all', count: claims.length },
    { label: 'Pending', value: 'pending', count: claims.filter(c => c.status === 'pending').length },
    { label: 'Verified', value: 'admin_verified', count: claims.filter(c => c.status === 'admin_verified').length },
    { label: 'Approved', value: 'refund_approved', count: claims.filter(c => c.status === 'refund_approved').length },
    { label: 'Rejected', value: 'rejected', count: claims.filter(c => c.status === 'rejected').length },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; style: string; icon: any }> = {
      pending:        { label: 'Pending',       style: 'bg-blue-50 text-blue-700 border-blue-100',    icon: Clock },
      admin_verified: { label: 'Verified',      style: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: ShieldCheck },
      refund_approved:{ label: 'Approved',      style: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
      rejected:       { label: 'Rejected',      style: 'bg-red-50 text-red-700 border-red-100',        icon: XCircle },
    };
    return map[status] || { label: status, style: 'bg-slate-50 text-slate-600 border-slate-100', icon: AlertTriangle };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo-950 mb-1">Claims Monitoring</h1>
        <p className="text-sm text-slate-500">
          Verify and manage all agricultural insurance claims across the platform.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map(sf => (
          <button
            key={sf.value}
            onClick={() => setStatusFilter(sf.value)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
              statusFilter === sf.value
                ? "bg-indigo-950 text-white border-indigo-950"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            )}
          >
            {sf.label}
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[8px]",
              statusFilter === sf.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {sf.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by farmer name, phone, district, or claim ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['Claim ID', 'Farmer', 'District', 'Policy Type', 'Coverage', 'Evidence', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <Filter className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No claims match the selected filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((claim: any) => {
                  const badge = getStatusBadge(claim.status);
                  const BadgeIcon = badge.icon;
                  const canVerify = claim.status === 'pending';

                  return (
                    <tr key={claim._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500 font-bold">
                        #{claim._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                            {claim.farmerId?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">{claim.farmerId?.name || '—'}</p>
                            <p className="text-[10px] text-slate-400">{claim.farmerId?.phoneNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {claim.farmerId?.farmerDetails?.location?.district || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase capitalize whitespace-nowrap">
                          {claim.policyId?.policyType || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900 whitespace-nowrap">
                        Rs. {claim.policyId?.coverageAmount?.toLocaleString() || '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="text-[10px] font-bold text-slate-500">
                          {(claim.media?.images?.length || 0)}🖼 {claim.media?.video ? '1🎥' : ''}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap",
                          badge.style
                        )}>
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {canVerify && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleVerify(claim._id)}
                                disabled={acting === claim._id}
                                className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase whitespace-nowrap"
                              >
                                {acting === claim._id
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : <><ShieldCheck className="w-3 h-3 mr-1" />Verify</>
                                }
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(claim._id)}
                                disabled={acting === claim._id}
                                className="h-7 px-3 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[9px] font-black uppercase whitespace-nowrap"
                              >
                                <XCircle className="w-3 h-3 mr-1" />Reject
                              </Button>
                            </>
                          )}
                          <Link to={PATHS.ADMIN.CLAIM_DETAIL(claim._id)}>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg">
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-6 text-xs text-slate-500">
          <span>Total: <strong className="text-slate-900">{claims.length}</strong></span>
          <span>Showing: <strong className="text-slate-900">{filtered.length}</strong></span>
          <span>Pending: <strong className="text-blue-600">{claims.filter(c => c.status === 'pending').length}</strong></span>
        </div>
      </div>
    </div>
  );
};
