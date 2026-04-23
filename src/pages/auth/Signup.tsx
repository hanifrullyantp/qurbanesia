import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, User, MapPin, Phone, Building2, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';

const Signup = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [mosqueName, setMosqueName] = React.useState('');
  const [locationFull, setLocationFull] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [mosquePosition, setMosquePosition] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [statusText, setStatusText] = React.useState<string | null>(null);

  const withTimeout = React.useCallback(async <T,>(p: Promise<T>, ms: number, label: string) => {
    let t: any;
    const timeout = new Promise<never>((_, rej) => {
      t = setTimeout(() => rej(new Error(`${label} timeout (${ms / 1000}s). Cek koneksi & env Supabase.`)), ms);
    });
    try {
      return await Promise.race([p, timeout]);
    } finally {
      clearTimeout(t);
    }
  }, []);

  React.useEffect(() => {
    if (loading) return;
    if (!profile) return;
    const dest =
      profile.role === 'super_admin'
        ? '/super-admin'
        : profile.role === 'admin_masjid'
          ? '/admin'
          : profile.role === 'panitia'
            ? '/panitia'
            : profile.role === 'jagal'
              ? '/jagal'
              : profile.role === 'supplier'
                ? '/supplier'
                : profile.role === 'shohibul'
                  ? '/shohibul'
                  : '/';
    navigate(dest, { replace: true });
  }, [profile, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setDone(false);
    setStatusText('Mengirim pendaftaran...');
    try {
      if (!email.trim() || !password) {
        throw new Error('Email dan password wajib diisi.');
      }
      if (password.length < 8) {
        throw new Error('Password minimal 8 karakter.');
      }

      const { data, error: signUpError } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              mosque_name: mosqueName,
              location_full: locationFull,
              mosque_position: mosquePosition,
              phone,
              address,
            },
          },
        }),
        15000,
        'Signup',
      );
      if (signUpError) throw signUpError;

      setDone(true);
      setStatusText('Berhasil. Mengarahkan ke login...');
      navigate('/login?signup=1', { replace: true });
    } catch (err: any) {
      const msg = err?.message ?? 'Signup gagal';
      console.error('Signup error:', err);
      setError(msg);
    } finally {
      setSubmitting(false);
      setStatusText(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              Qurbanesia<span className="text-emerald-600">.id</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Daftar</h1>
          <p className="text-slate-500">Buat akun baru. Nanti admin bisa assign tenant & role sesuai kebutuhan.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Masjid</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={mosqueName}
                onChange={(e) => setMosqueName(e.target.value)}
                type="text"
                placeholder="Masjid ..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi lengkap Masjid</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <textarea
                value={locationFull}
                onChange={(e) => setLocationFull(e.target.value)}
                rows={3}
                placeholder="Alamat/lokasi masjid (kecamatan, kota, provinsi, patokan)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Nama"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan di Masjid</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={mosquePosition}
                onChange={(e) => setMosquePosition(e.target.value)}
                type="text"
                placeholder="Contoh: Ketua DKM / Bendahara / Sekretaris"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No HP</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat lengkap</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Alamat rumah/kantor (untuk kebutuhan administrasi)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="nama@contoh.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-bold">
              {error}
              <div className="mt-2 text-xs font-bold text-red-700/80">
                Jika ini timeout/blank, pastikan `VITE_SUPABASE_URL` base (tanpa `/rest/v1`) dan browser bisa akses
                `https://&lt;ref&gt;.supabase.co/auth/v1/health`.
              </div>
            </div>
          )}

          {done && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-sm font-bold">
              Akun berhasil dibuat. Jika diminta verifikasi email, cek inbox kamu lalu kembali ke halaman login.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 disabled:bg-emerald-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {submitting ? 'Memproses...' : 'Daftar'} <ArrowRight className="w-4 h-4" />
          </button>

          {statusText && <div className="text-center text-xs font-bold text-slate-500">{statusText}</div>}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-white text-slate-700 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Sudah punya akun? Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

