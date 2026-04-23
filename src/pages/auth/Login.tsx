import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, loading } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [statusText, setStatusText] = React.useState<string | null>(null);

  const withTimeout = React.useCallback(async <T,>(p: Promise<T>, ms: number, label: string) => {
    let t: any;
    const timeout = new Promise<never>((_, rej) => {
      t = setTimeout(() => rej(new Error(`${label} timeout (${ms / 1000}s). Cek koneksi & Supabase URL.`)), ms);
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
    setStatusText('Mencoba login...');
    try {
      const { error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        25000,
        'Login',
      );
      if (signInError) throw signInError;
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.name === 'AbortError' || String(err?.message || '').toLowerCase().includes('aborted')) {
        setError(
          'Permintaan login terhenti (timeout). Biasanya karena jaringan/adblock memblokir ke Supabase, atau env URL/key salah. Coba nonaktifkan adblock untuk domain ini, atau cek Network tab untuk request ke /auth/v1/token.',
        );
        return;
      }
      setError(err?.message ?? 'Login gagal');
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
            <span className="text-3xl font-bold text-slate-900 tracking-tight">Qurbanesia<span className="text-emerald-600">.id</span></span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Masuk</h1>
          <p className="text-slate-500">Gunakan akun yang sudah didaftarkan oleh admin platform.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 space-y-6">
          {searchParams.get('signup') === '1' && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-sm font-bold">
              Pendaftaran berhasil. Silakan login. Jika diminta verifikasi email, cek inbox kamu dulu.
            </div>
          )}
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
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-bold">
              {error}
              {String(error).toLowerCase().includes('email') && String(error).toLowerCase().includes('confirm') && (
                <div className="mt-2 text-xs font-bold text-red-700/80">
                  Solusi: buka inbox email kamu, klik link verifikasi, lalu coba login lagi.
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 disabled:bg-emerald-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {submitting ? 'Memproses...' : 'Masuk'} <ArrowRight className="w-4 h-4" />
          </button>

          {statusText && <div className="text-center text-xs font-bold text-slate-500">{statusText}</div>}
        </form>

        <p className="text-center mt-12 text-slate-400 text-sm">
          Belum memiliki akun?{' '}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
            Daftar
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
