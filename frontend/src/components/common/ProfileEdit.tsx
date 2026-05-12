import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Loader2, Upload, UserRound } from 'lucide-react';
import { profileAPI } from '@/services/api';
import { cn } from '@/lib/utils';

type Role = 'admin' | 'farmer' | 'insurance_company' | string;

interface ProfileEditProps {
  user: {
    _id?: string;
    name: string;
    phoneNumber?: string;
    email?: string;
    photo?: string;
    role?: Role;
    companyName?: string;
    farmerDetails?: Record<string, any>;
  };
  onProfileUpdated?: (data: any) => void;
}

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const roleLabels: Record<string, string> = {
  admin: 'System Admin',
  farmer: 'Farmer',
  insurance_company: 'Insurance Partner',
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

export default function ProfileEdit({ user, onProfileUpdated }: ProfileEditProps) {
  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [email, setEmail] = useState(user.email || '');
  const [companyName, setCompanyName] = useState(user.companyName || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(user.photo || '');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleLabel = roleLabels[user.role || ''] || 'User';
  const initials = useMemo(() => getInitials(user.name), [user.name]);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('Image must be less than 2MB.');
      return;
    }

    if (photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
    setNotice('');
    setDirty(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());

      if (phoneNumber.trim()) formData.append('phoneNumber', phoneNumber.trim());
      if (email.trim()) formData.append('email', email.trim());
      if (companyName.trim()) formData.append('companyName', companyName.trim());
      if (photoFile) formData.append('photo', photoFile);

      const response = await profileAPI.updateProfile(formData);
      const updatedProfile = response.data?.data || response.data;

      if (updatedProfile?.name) {
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }

      onProfileUpdated?.(updatedProfile);
      setDirty(false);

      if (updatedProfile?.warning) {
        setNotice(updatedProfile.warning);
      }
    } catch (requestError: any) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        'Unable to update profile. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="overflow-hidden rounded-[28px] border border-white/10 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 px-6 py-6 text-white sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300/90">Profile settings</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Edit your account</h2>
            <p className="max-w-xl text-sm text-white/70">
              Keep your profile information current so every dashboard, claim flow, and support step stays in sync.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-5">
          <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
            <div className="relative mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100 shadow-sm">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-50 text-5xl font-black text-emerald-700">
                  {initials}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-500 cursor-pointer"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
                Upload
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div className="mt-4 space-y-2 text-center">
              <p className="text-sm font-bold text-slate-900">Profile photo</p>
              <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 2MB</p>
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Profile summary</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-slate-400">Role</dt>
                <dd className="font-semibold text-slate-900">{roleLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Name</dt>
                <dd className="font-semibold text-slate-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Contact</dt>
                <dd className="font-semibold text-slate-900">{phoneNumber || email || 'Not provided'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {notice}
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Full name</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setDirty(true);
                }}
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Phone number</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                  setDirty(true);
                }}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit number"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setDirty(true);
                }}
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Organization / company</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setDirty(true);
                }}
                placeholder={user.role === 'insurance_company' ? 'Insurance company name' : 'Optional'}
              />
            </label>
          </div>

          {user.role === 'farmer' && user.farmerDetails ? (
            <div className="rounded-[26px] border border-emerald-100 bg-emerald-50/60 p-5">
              <div className="flex items-center gap-2 text-emerald-800">
                <UserRound className="h-4 w-4" />
                <p className="text-sm font-black uppercase tracking-[0.25em]">Farmer profile details</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-slate-400">Farm type</p>
                  <p className="mt-1 font-semibold text-slate-900">{user.farmerDetails.farmType || 'Not set'}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-slate-400">Farm size</p>
                  <p className="mt-1 font-semibold text-slate-900">{user.farmerDetails.farmSize ?? 'Not set'}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 sm:col-span-2">
                  <p className="text-slate-400">Location</p>
                  <p className="mt-1 font-semibold text-slate-900">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {dirty ? 'You have unsaved changes.' : 'Your profile is up to date.'}
            </p>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition',
                loading
                  ? 'cursor-not-allowed bg-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 cursor-pointer'
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
