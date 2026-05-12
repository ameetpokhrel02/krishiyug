import { useEffect, useMemo, useState } from 'react';
import { Loader2, ShieldCheck, UserRound } from 'lucide-react';
import ProfileEdit from '@/components/common/ProfileEdit';
import { profileAPI } from '@/services/api';

type ProfileUser = {
  _id?: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  photo?: string;
  role?: string;
  companyName?: string;
  farmerDetails?: Record<string, any>;
};

const roleLabels: Record<string, string> = {
  admin: 'System Admin',
  farmer: 'Farmer Portal',
  insurance_company: 'Insurance Portal',
};

const getInitials = (name?: string) =>
  name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'KY';

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await profileAPI.getProfile();
        const profile = response.data?.data || response.data;

        if (!mounted) return;

        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (error) {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const role = user?.role || currentUser?.role || 'farmer';
  const roleLabel = roleLabels[role] || 'Profile';
  const initials = getInitials(user?.name || currentUser?.name);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-8 text-center shadow-sm">
          <p className="text-lg font-bold text-rose-700">Failed to load profile</p>
          <p className="mt-2 text-sm text-rose-600">Please refresh the page or sign in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-6 lg:py-8">
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-900 text-white shadow-[0_30px_90px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure profile center
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200/80">{roleLabel}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Manage your profile</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Keep your contact details and profile photo up to date so every dashboard, claim flow, and support
                step stays aligned.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24px] bg-white/10 text-xl font-black text-white">
              {user.photo ? <img src={user.photo} alt={user.name} className="h-full w-full object-cover" /> : initials}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user.name}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <ProfileEdit
            user={user}
            onProfileUpdated={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900">
              <UserRound className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-black uppercase tracking-[0.25em]">Profile snapshot</p>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-slate-400">Name</dt>
                <dd className="mt-1 font-semibold text-slate-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="mt-1 font-semibold text-slate-900">{user.phoneNumber || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="mt-1 font-semibold text-slate-900">{user.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Role</dt>
                <dd className="mt-1 font-semibold text-slate-900">{roleLabel}</dd>
              </div>
            </dl>
          </div>

          {user.role === 'farmer' && user.farmerDetails ? (
            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Farmer details</p>
              <div className="mt-4 space-y-3 text-sm text-slate-800">
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-slate-400">Farm type</p>
                  <p className="mt-1 font-semibold">{user.farmerDetails.farmType || 'Not set'}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-slate-400">Farm size</p>
                  <p className="mt-1 font-semibold">{user.farmerDetails.farmSize ?? 'Not set'}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-slate-400">Location</p>
                  <p className="mt-1 font-semibold">
                    {[
                      user.farmerDetails.location?.district,
                      user.farmerDetails.location?.palika,
                      user.farmerDetails.location?.ward,
                    ]
                      .filter(Boolean)
                      .join(' • ') || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
