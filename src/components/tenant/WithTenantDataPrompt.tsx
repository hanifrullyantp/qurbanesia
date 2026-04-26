import React from 'react';
import { X, Building2, MapPin, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth, type AppRole } from '../../auth/AuthProvider';
import { fetchTenantById, updateTenantMasjidData, type TenantRow } from '../../services/tenants';

/** Peran yang melihat prompt kelengkapan (bukan super_admin: tidak punya konteks masjid lewat tenant). */
const ROLES_WITH_TENANT_PROMPT: AppRole[] = ['admin_masjid', 'panitia', 'shohibul', 'jagal'];

/**
 * Pembeda “siapa yang boleh mengisi data masjid”:
 * - Hanya `profiles.role === 'admin_masjid'` DAN `profiles.tenant_id` tidak null.
 * - Selain itu modal bersifat informatif (baca saja) — sesuai kebijakan: data org diisi admin masjid.
 */
function sessionDismissKey(userId: string) {
  return `qurbanesia_tenant_prompt_dismissed_${userId}`;
}

function needsPrompt(profile: { role: AppRole; tenant_id: string | null } | null, tenant: TenantRow | null | undefined): boolean {
  if (!profile) return false;
  if (profile.role === 'super_admin' || profile.role === 'supplier' || profile.role === 'penerima') {
    return false;
  }
  if (!ROLES_WITH_TENANT_PROMPT.includes(profile.role)) return false;
  if (!profile.tenant_id) return true;
  if (!tenant) return true;
  if (!tenant.onboarding_profile_complete) return true;
  const loc = (tenant.location || '').trim();
  const n = (tenant.name || '').trim();
  if (n.length < 2 || loc.length < 3) return true;
  return false;
}

/**
 * Diletakkan di layout “halaman awal” per area (admin/shohibul, panitia, jagal).
 */
export function WithTenantDataPrompt({ children }: { children: React.ReactNode }) {
  const { profile, loading, user, refreshProfile } = useAuth();
  const [tenant, setTenant] = React.useState<TenantRow | null>(null);
  const [loadingTenant, setLoadingTenant] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');

  const isAdminMasjid = profile?.role === 'admin_masjid';
  const canEditMasjidData = isAdminMasjid && !!profile?.tenant_id;

  React.useEffect(() => {
    if (!user?.id) return;
    setDismissed(sessionStorage.getItem(sessionDismissKey(user.id)) === '1');
  }, [user?.id]);

  React.useEffect(() => {
    if (loading) return;
    if (!profile?.tenant_id) {
      setTenant(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingTenant(true);
      try {
        const t = await fetchTenantById(profile.tenant_id!);
        if (!cancelled) {
          setTenant(t);
          if (t) {
            setName(t.name || '');
            setLocation(t.location || '');
          }
        }
      } catch {
        if (!cancelled) setTenant(null);
      } finally {
        if (!cancelled) setLoadingTenant(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, profile?.tenant_id, profile?.role]);

  React.useEffect(() => {
    if (loading || loadingTenant) return;
    if (dismissed) {
      setOpen(false);
      return;
    }
    if (needsPrompt(profile, tenant)) setOpen(true);
    else setOpen(false);
  }, [loading, loadingTenant, profile, tenant, dismissed]);

  const onDismiss = () => {
    if (user?.id) {
      sessionStorage.setItem(sessionDismissKey(user.id), '1');
    }
    setDismissed(true);
    setOpen(false);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id) return;
    setSaveError(null);
    if (name.trim().length < 2) {
      setSaveError('Nama masjid minimal 2 karakter.');
      return;
    }
    if (location.trim().length < 3) {
      setSaveError('Lokasi / alamat masjid wajib diisi (min. 3 karakter).');
      return;
    }
    setSaving(true);
    try {
      await updateTenantMasjidData({
        tenantId: profile.tenant_id,
        name: name.trim(),
        location: location.trim(),
        markComplete: true,
      });
      const t = await fetchTenantById(profile.tenant_id);
      setTenant(t);
      await refreshProfile();
      setOpen(false);
    } catch (e: any) {
      setSaveError(e?.message || 'Gagal menyimpan. Pastikan akun admin masjid dan kebijakan RLS di Supabase sudah diterapkan (migration 202604260001).');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <>{children}</>;

  return (
    <>
      {children}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onDismiss} aria-hidden />
          <div
            className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tenant-prompt-title"
          >
            <button
              type="button"
              onClick={onDismiss}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-8">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 id="tenant-prompt-title" className="text-lg font-extrabold text-slate-900">
                Kelengkapan data {profile?.tenant_id ? 'masjid' : 'organisasi'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isAdminMasjid
                  ? 'Sebagai admin masjid, kamu yang melengkapi profil masjid. Pengguna selain admin hanya melihat pemberitahuan.'
                  : 'Pengisian data masjid/organisasi hanya dilakukan oleh peran admin masjid.'}
              </p>
            </div>

            {!profile?.tenant_id && (
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                Akunmu belum di-assign ke <span className="font-bold">masjid/tenant</span> di platform. Setelah
                dihubungkan oleh admin, data masjid dapat dilengkapi oleh <span className="font-bold">admin masjid</span>.
                Kamu masih dapat menutup jendela ini dan beraktivitas; prompt dapat muncul lagi di sesi berikutnya.
              </div>
            )}

            {profile?.tenant_id && canEditMasjidData && (
              <form onSubmit={onSave} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama masjid / lembaga</label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold text-slate-800"
                      placeholder="Contoh: Masjid Al-Falah"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lokasi / alamat</label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold text-slate-800"
                      placeholder="Alamat lengkap, kecamatan, kota"
                    />
                  </div>
                </div>
                {saveError && <div className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{saveError}</div>}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Simpan &amp; selesaikan
                </button>
              </form>
            )}

            {profile?.tenant_id && !canEditMasjidData && needsPrompt(profile, tenant) && (
              <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-bold text-slate-800">Status data masjid</p>
                {tenant && (
                  <p>
                    <span className="font-semibold">Nama: </span>
                    {tenant.name || '—'}
                  </p>
                )}
                {tenant && (
                  <p>
                    <span className="font-semibold">Lokasi: </span>
                    {tenant.location?.trim() || '— (belum diisi)'}
                  </p>
                )}
                <p>
                  Lengkapi lewat akun <span className="font-bold">admin masjid</span> (role admin) — kamu hanya
                  menerima pengingat.
                </p>
              </div>
            )}

            {!canEditMasjidData && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onDismiss}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
