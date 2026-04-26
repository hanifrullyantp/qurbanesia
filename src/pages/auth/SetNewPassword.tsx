import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { mapAuthErrorToMessage } from '../../auth/mapAuthError';

const SESSION_WAIT_MS = 8_000;
const SESSION_POLL_EVERY_MS = 100;

/**
 * Opened from email link with hash fragments. Supabase client (see `supabaseClient`) uses
 * `detectSessionInUrl: true` so the session is established from the URL.
 */
export default function SetNewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [sessionReady, setSessionReady] = React.useState(false);
  const [sessionWaitDone, setSessionWaitDone] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const deadline = Date.now() + SESSION_WAIT_MS;
      while (Date.now() < deadline && !cancelled) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!cancelled) {
            setSessionReady(true);
            setSessionWaitDone(true);
          }
          return;
        }
        await new Promise((r) => setTimeout(r, SESSION_POLL_EVERY_MS));
      }
      if (!cancelled) setSessionWaitDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== password2) {
      setError('Konfirmasi password tidak sama.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: upd } = await supabase.auth.updateUser({ password });
      if (upd) throw upd;
      await supabase.auth.signOut();
      navigate('/login?reset=1', { replace: true });
    } catch (err) {
      setError(mapAuthErrorToMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!sessionWaitDone) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-sm font-bold text-slate-500">Memuat sesi reset password...</p>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[2rem] p-8 shadow-lg text-center">
          <p className="text-slate-800 font-bold mb-2">Link tidak valid atau sudah kadaluarsa</p>
          <p className="text-slate-500 text-sm mb-6">Minta link baru dari halaman lupa password.</p>
          <Link to="/forgot-password" className="text-emerald-600 font-bold text-sm">
            Lupa password
          </Link>
        </div>
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Password baru</h1>
          <p className="text-slate-500">Atur password baru untuk akun kamu.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password baru</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                disabled={submitting}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Konfirmasi password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi password"
                disabled={submitting}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-bold">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 disabled:bg-emerald-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {submitting ? 'Menyimpan...' : 'Simpan password'}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center mt-8">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  );
}
