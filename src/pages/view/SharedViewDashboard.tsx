import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, Building2, Eye, QrCode, ShieldCheck, Users } from 'lucide-react';
import { ViewModeBanner } from '../../components/view/ViewModeBanner';
import { useAuth } from '../../auth/AuthProvider';
import { resolveInviteCode } from '../../services/inviteCodes';
import { createJoinRequest, activateTenantAsMasjidRpc } from '../../services/joinRequests';
import { fetchTenantPublic } from '../../services/tenants';
import type { AppRole } from '../../auth/AuthProvider';

const REQUEST_ROLES: { value: AppRole; label: string }[] = [
  { value: 'shohibul', label: 'Shohibul' },
  { value: 'panitia', label: 'Panitia' },
  { value: 'penerima', label: 'Mustahik / penerima' },
  { value: 'jagal', label: 'Jagal' },
];

const STORAGE_KEY = 'qurbanesia_view_tenant';

export default function SharedViewDashboard() {
  const [searchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();
  const [tenantId, setTenantId] = React.useState<string | null>(null);
  const [tenantName, setTenantName] = React.useState<string | null>(null);
  const [rolePick, setRolePick] = React.useState<AppRole>('shohibul');
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [actMsg, setActMsg] = React.useState<string | null>(null);
  const [actErr, setActErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const [showActivate, setShowActivate] = React.useState(false);
  const [masjidName, setMasjidName] = React.useState('');
  const [masjidLoc, setMasjidLoc] = React.useState('');

  React.useEffect(() => {
    const t = searchParams.get('t');
    const c = searchParams.get('c');
    if (t) {
      setTenantId(t);
      try {
        sessionStorage.setItem(STORAGE_KEY, t);
      } catch {
        /* ignore */
      }
    } else if (c) {
      void (async () => {
        const r = await resolveInviteCode(c);
        if (r?.tenantId) {
          setTenantId(r.tenantId);
          if (r.defaultRole) setRolePick(r.defaultRole as AppRole);
          try {
            sessionStorage.setItem(STORAGE_KEY, r.tenantId);
          } catch {
            /* ignore */
          }
        }
      })();
    } else {
      try {
        const s = sessionStorage.getItem(STORAGE_KEY);
        if (s) setTenantId(s);
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (!tenantId) return;
    void (async () => {
      try {
        const row = await fetchTenantById(tenantId);
        setTenantName(row?.name ?? null);
      } catch {
        setTenantName(null);
      }
    })();
  }, [tenantId]);

  const onSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setActErr(null);
    setActMsg(null);
    if (!tenantId || !user) {
      setErr('Login terlebih dahulu, dan pastikan ada kode / link masjid.');
      return;
    }
    setBusy(true);
    try {
      await createJoinRequest({ tenantId, requestedRole: rolePick, message: null });
      setMsg('Permintaan terkirim. Admin masjid akan memverifikasi.');
      await refreshProfile();
    } catch (e: unknown) {
      setErr((e as Error)?.message || 'Gagal mengirim permintaan.');
    } finally {
      setBusy(false);
    }
  };

  const onActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!user) {
      setErr('Login dulu.');
      return;
    }
    if (masjidName.trim().length < 2) {
      setErr('Nama masjid wajib diisi.');
      return;
    }
    setBusy(true);
    try {
      await activateTenantAsMasjidRpc(masjidName.trim(), masjidLoc.trim());
      setMsg('Aktivasi berhasil. Mengalihkan…');
      await refreshProfile();
      window.location.href = '/admin';
    } catch (e: unknown) {
      setErr((e as Error)?.message || 'Gagal aktivasi.');
    } finally {
      setBusy(false);
    }
  };

  const showJoinPanel = !!user && !!tenantId && profile?.role === 'shohibul';
  const showActivatePanel =
    !!user && !profile?.tenant_id && profile?.role === 'shohibul' && !tenantId;

  return (
    <div className="min-h-screen bg-slate-50">
      <ViewModeBanner />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg">
            <Eye className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Pantau kegiatan</h1>
            <p className="text-sm text-slate-500">Dashboard ringkas (read). Gunakan kode/QR masjid dari admin.</p>
          </div>
        </div>

        {tenantName && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400">Konteks masjid</div>
              <div className="font-bold text-slate-800">{tenantName}</div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Activity className="mb-2 h-6 w-6 text-emerald-600" />
            <div className="text-2xl font-black text-slate-900">—</div>
            <div className="text-xs font-bold text-slate-500">Aktifitas 24h</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Users className="mb-2 h-6 w-6 text-blue-600" />
            <div className="text-2xl font-black text-slate-900">—</div>
            <div className="text-xs font-bold text-slate-500">Jamaah / panitia</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <ShieldCheck className="mb-2 h-6 w-6 text-amber-600" />
            <div className="text-2xl font-black text-slate-900">Aman</div>
            <div className="text-xs font-bold text-slate-500">Status transparansi</div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-100/60 p-4 text-center text-sm text-slate-500">
          <QrCode className="mx-auto mb-2 h-8 w-8 text-slate-400" />
          Pakai <span className="font-mono font-bold">?c=KODE</span> di URL atau pindai QR — data tenant terhubung
          otomatis.
        </div>

        {showActivatePanel && (
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-md">
            <h2 className="mb-1 text-lg font-extrabold text-slate-900">Aktivasi sebagai pengurus masjid</h2>
            <p className="mb-4 text-sm text-slate-500">Buat data masjid dan jadi admin (sekali). Butuh kebijakan internal untuk produksi.</p>
            {!showActivate ? (
              <button
                type="button"
                onClick={() => setShowActivate(true)}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white"
              >
                Mulai aktivasi
              </button>
            ) : (
              <form onSubmit={onActivate} className="space-y-3">
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold"
                  placeholder="Nama masjid / lembaga"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                />
                <textarea
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold"
                  placeholder="Alamat / lokasi"
                  rows={2}
                  value={masjidLoc}
                  onChange={(e) => setMasjidLoc(e.target.value)}
                />
                {actErr && <div className="text-sm font-bold text-red-600">{actErr}</div>}
                {actMsg && <div className="text-sm font-bold text-emerald-600">{actMsg}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-black uppercase text-white"
                >
                  {busy ? 'Menyimpan...' : 'Aktifkan & jadi admin'}
                </button>
              </form>
            )}
          </div>
        )}

        {showJoinPanel && (
          <form onSubmit={onSubmitRequest} className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-md">
            <h2 className="mb-1 text-lg font-extrabold text-slate-900">Ajukan peran</h2>
            <p className="mb-4 text-sm text-slate-500">Pilih peran; admin memutuskan. Kamu dalam mode tampil sampai disetujui.</p>
            <select
              className="mb-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold"
              value={rolePick}
              onChange={(e) => setRolePick(e.target.value as AppRole)}
            >
              {REQUEST_ROLES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {err && <div className="mb-2 text-sm font-bold text-red-600">{err}</div>}
            {msg && <div className="mb-2 text-sm font-bold text-emerald-600">{msg}</div>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-black uppercase text-white"
            >
              {busy ? 'Mengirim...' : 'Kirim permintaan'}
            </button>
          </form>
        )}

        {!user && (
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/signup" className="font-bold text-emerald-600">
              Daftar
            </Link>{' '}
            atau{' '}
            <Link to="/login" className="font-bold text-emerald-600">
              masuk
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
