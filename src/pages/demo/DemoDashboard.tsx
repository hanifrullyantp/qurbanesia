import React from 'react';
import { Link } from 'react-router-dom';
import {
  Beef,
  Building2,
  LayoutDashboard,
  QrCode,
  Sparkles,
  Truck,
  Users,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';

const DUMMY_STATS = {
  hewan: { sapi: 12, kambing: 34, selesai: 8 },
  shohibul: 42,
  panitia: 11,
  progress: 72,
  lastUpdate: '2 menit lalu',
};

const DUMMY_HAPPENING = [
  { id: '1', t: 'Hari ini', a: 'Sapi S-04 masuk proses penuangan', s: 'selesai' },
  { id: '2', t: 'Kemarin', a: 'Distribusi paket ke zona B', s: 'berlangsung' },
  { id: '3', t: 'Kemarin', a: 'Verifikasi pembayaran shohibul #108', s: 'selesai' },
];

const ROLE_TABS: { id: string; label: string; blurb: string; Icon: React.ElementType; tone: string }[] = [
  {
    id: 'admin',
    label: 'Admin masjid (cuplikan)',
    blurb: 'Ringkasan command center: hewan, keuangan, dan notifikasi — ini data contoh, bukan data instansi asli.',
    Icon: Building2,
    tone: 'from-emerald-500/15 to-white',
  },
  {
    id: 'shohibul',
    label: 'Shohibul (cuplikan)',
    blurb: 'Tracking qurban, sertifikat, dan bukti setoran — tampilan yang sama dengan produksi, tanpa data pribadi.',
    Icon: UserCheck,
    tone: 'from-blue-500/15 to-white',
  },
  {
    id: 'panitia',
    label: 'Panitia (cuplikan)',
    blurb: 'Alur tugas & kanban proses; bantu cek alur sebelum jadi anggota resmi lewat kode/approval.',
    Icon: Users,
    tone: 'from-amber-500/15 to-white',
  },
  {
    id: 'jagal',
    label: 'Jagal (cuplikan)',
    blurb: 'Antrian hewan, timer, dan bukti proses; gambaran lapangan (dummy).',
    Icon: Truck,
    tone: 'from-slate-500/20 to-white',
  },
];

/**
 * Dashboard demo: data dummy, read-only, untuk akun belum terhubung ke masjid (tanpa tenant / belum peran penuh).
 */
export default function DemoDashboard() {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = React.useState('admin');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b border-violet-200 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-center text-sm font-extrabold text-white shadow-md">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" />
          Mode demo — data di bawah hanya contoh, bukan data masjid asli.
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Qurbanesia demo</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Dashboard jelajah</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Akun <span className="font-mono font-bold text-slate-800">{profile?.full_name || 'Pengguna'}</span>
              {profile?.role && (
                <>
                  {' '}
                  · peran: <span className="font-bold">{profile.role.replace('_', ' ')}</span>
                </>
              )}{' '}
              belum terhubung ke data masjid. Lihat contoh tampilan per peran, lalu hubungkan lewat kode, QR, atau
              pengajuan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/view"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black uppercase tracking-widest text-violet-700 shadow ring-1 ring-slate-200"
            >
              <QrCode className="h-4 w-4" />
              Buka /view (QR)
            </Link>
            <button
              type="button"
              onClick={() => signOut().then(() => (window.location.href = '/'))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase text-slate-600"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase text-slate-400">Hewan tercatat (dummy)</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{DUMMY_STATS.hewan.sapi + DUMMY_STATS.hewan.kambing}</div>
            <div className="text-xs text-slate-500">Sapi {DUMMY_STATS.hewan.sapi} · Kambing {DUMMY_STATS.hewan.kambing}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase text-slate-400">Shohibul (dummy)</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{DUMMY_STATS.shohibul}</div>
            <div className="text-xs text-slate-500">Aktif musim contoh</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase text-slate-400">Kesiapan (dummy)</div>
            <div className="mt-1 text-2xl font-black text-violet-600">{DUMMY_STATS.progress}%</div>
            <div className="text-xs text-slate-500">Update {DUMMY_STATS.lastUpdate}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase text-slate-400">Panitia lapangan (dummy)</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{DUMMY_STATS.panitia}</div>
            <div className="text-xs text-slate-500">Slot aktif contoh</div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {ROLE_TABS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setTab(r.id)}
              className={
                'flex-1 min-w-[120px] rounded-xl px-3 py-2 text-left text-xs font-bold transition ' +
                (tab === r.id
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100')
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        {ROLE_TABS.filter((r) => r.id === tab).map((r) => (
          <div
            key={r.id}
            className={`mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br ${r.tone} p-6 shadow-sm`}
          >
            <div className="mb-2 flex items-center gap-2">
              <r.Icon className="h-6 w-6 text-slate-700" />
              <h2 className="text-lg font-extrabold text-slate-900">{r.label}</h2>
            </div>
            <p className="text-sm text-slate-600">{r.blurb}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-800">
              {tab === 'admin' && (
                <>
                  <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                    <span>Estimasi dana masuk (dummy)</span>
                    <span className="font-mono font-bold">Rp 128.500.000</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                    <span>Pemberitahuan terjadwal</span>
                    <span className="font-bold text-emerald-600">3 aktif (contoh)</span>
                  </div>
                </>
              )}
              {tab === 'shohibul' && (
                <div className="rounded-xl bg-white/80 px-3 py-4 text-center font-bold text-slate-500">
                  Progress qurban: tahap 3/6 (dummy) — peta & foto akan muncul di produksi.
                </div>
              )}
              {tab === 'panitia' && (
                <div className="rounded-xl bg-white/80 px-3 py-4">
                  Tugas hari ini: 5 item (dummy). Koordinasi divisi: Proses, Distribusi, Logistik.
                </div>
              )}
              {tab === 'jagal' && (
                <div className="rounded-xl bg-white/80 px-3 py-4 text-center">
                  Antrian 2 sapi (dummy) · Timer & checklist mengikuti SOP.
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
            <Beef className="h-5 w-5 text-amber-600" />
            Kegiatan (dummy, feed)
          </h3>
          <ul className="space-y-2">
            {DUMMY_HAPPENING.map((h) => (
              <li key={h.id} className="flex items-start justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">{h.t}</div>
                  <div className="font-medium text-slate-800">{h.a}</div>
                </div>
                <span
                  className={
                    'shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ' +
                    (h.s === 'selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')
                  }
                >
                  {h.s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 p-6 text-center">
          <LayoutDashboard className="h-8 w-8 text-violet-500" />
          <p className="text-sm font-bold text-slate-700">Siap terhubung ke masjid asli?</p>
          <p className="max-w-md text-xs text-slate-500">
            Gunakan kode undangan, QR dari admin, atau ajukan lewat /view. Setelah admin menyetujui, kamu diarahkan ke
            dashboard peran sebenarnya.
          </p>
          <Link
            to="/view"
            className="mt-1 text-sm font-extrabold text-violet-600 underline"
          >
            Buka mode pantau & pengajuan →
          </Link>
        </div>
      </div>
    </div>
  );
}
