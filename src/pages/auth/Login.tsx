import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { supabase } from '../../lib/supabaseClient';
import { resolveAfterAuthPath } from '../../auth/resolveAfterAuth';
import { fetchProfileByUserId } from '../../auth/profileQuery';
import { mapAuthErrorToMessage } from '../../auth/mapAuthError';
import { signInWithPasswordDirect } from '../../lib/goTruePasswordLogin';

const USE_DIRECT_GOTRUE =
  (import.meta.env.VITE_USE_DIRECT_GOTRUE_LOGIN as string | undefined) === 'true';

const PROFILE_WAIT_MS = 15_000;
const PROFILE_POLL_EVERY_MS = 200;

async function waitForProfileRow(userId: string): Promise<import('../../auth/AuthProvider').Profile | null> {
  const deadline = Date.now() + PROFILE_WAIT_MS;
  while (Date.now() < deadline) {
    try {
      const p = await fetchProfileByUserId(userId);
      if (p) return p;
    } catch {
      // table/network hiccup — keep polling
    }
    await new Promise((r) => setTimeout(r, PROFILE_POLL_EVERY_MS));
  }
  return null;
}

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, loading, refreshProfile, user } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [statusText, setStatusText] = React.useState<string | null>(null);

  React.useEffect(() => {
    const e = searchParams.get('email');
    if (e) {
      setEmail((prev) => prev || decodeURIComponent(e));
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (loading) return;
    if (!profile && !user) return;
    let cancelled = false;
    (async () => {
      const returnTo = searchParams.get('returnTo');
      const path =
        returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
          ? returnTo
          : await resolveAfterAuthPath(profile ?? null);
      if (!cancelled) navigate(path, { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [profile, loading, navigate, searchParams, user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const eTrim = email.trim();
    if (!eTrim || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setSubmitting(true);
    setStatusText('Mencoba login...');
    try {
      if (USE_DIRECT_GOTRUE) {
        await signInWithPasswordDirect(eTrim, password);
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: eTrim,
          password,
        });
        if (signInErr) throw signInErr;
        if (!data.user?.id) throw new Error('Login gagal: tidak ada data pengguna.');
      }

      setStatusText('Memuat profil...');
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const uid = userData.user?.id;
      if (!uid) throw new Error('Sesi tidak valid setelah login.');

      const p = await waitForProfileRow(uid);
      await refreshProfile();

      if (p) {
        const returnTo = searchParams.get('returnTo');
        const path =
          returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
            ? returnTo
            : await resolveAfterAuthPath(p);
        navigate(path, { replace: true });
        return;
      }

      navigate('/demo', { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(mapAuthErrorToMessage(err));
    } finally {
      setSubmitting(false);
      setStatusText(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-sm font-bold text-slate-500">Memuat sesi...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Masuk</h1>
          <p className="text-slate-500">Gunakan akun yang sudah didaftarkan oleh admin platform.</p>
        </div>

        {searchParams.get('signup') === '1' && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-sm font-bold text-center">
            Pendaftaran berhasil. Silakan login. Jika diminta verifikasi email, cek inbox kamu dulu.
          </div>
        )}
        {searchParams.get('reset') === '1' && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-sm font-bold text-center">
            Password berhasil diubah. Silakan masuk dengan password baru.
          </div>
        )}
        {searchParams.get('already') === '1' && (
          <div className="mb-6 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl p-4 text-sm font-bold text-center">
            Email ini sudah terdaftar. Silakan masuk di bawah (email sudah kami isikan jika tersedia).
          </div>
        )}
        {searchParams.get('verify') === '1' && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl p-4 text-sm font-bold text-center">
            Verifikasi email berhasil. Silakan masuk.
          </div>
        )}

        <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 space-y-6">
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
                disabled={submitting}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={submitting}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-bold">
              {error}
              {String(error).toLowerCase().includes('verifikasi') && (
                <div className="mt-2 text-xs font-bold text-red-700/80">
                  Cek folder spam, lalu coba link verifikasi dari email.
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
