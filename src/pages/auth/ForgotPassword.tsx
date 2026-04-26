import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { mapAuthErrorToMessage } from '../../auth/mapAuthError';

/**
 * Password reset email uses Supabase Auth "Recover" flow.
 * Supabase must allow this `redirectTo` origin in:
 * - Authentication → URL Configuration → Site URL + Redirect URLs
 * See README “Auth: password reset (Supabase)”.
 */
function recoveryRedirectTo(): string {
  return `${window.location.origin}/reset-password`;
}

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const eTrim = email.trim();
    if (!eTrim) {
      setError('Email wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(eTrim, {
        redirectTo: recoveryRedirectTo(),
      });
      if (resetErr) throw resetErr;
      setInfo('Jika email terdaftar, kami sudah mengirim link reset password. Cek inbox (dan folder spam).');
    } catch (err) {
      setError(mapAuthErrorToMessage(err));
    } finally {
      setSubmitting(false);
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Lupa password</h1>
          <p className="text-slate-500">Masukkan email. Kamu akan menerima link untuk mengatur password baru.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 space-y-6"
        >
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

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-bold">{error}</div>
          )}
          {info && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl p-4 text-sm font-bold">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 disabled:bg-emerald-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {submitting ? 'Mengirim...' : 'Kirim link reset'}
            <Send className="w-4 h-4" />
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
