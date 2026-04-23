import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';

const Signup = () => {
  const navigate = useNavigate();
  const { profile, loading, refreshProfile } = useAuth();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

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
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (signUpError) throw signUpError;

      // If email confirmations are enabled, there may be no session yet.
      const userId = data.user?.id;
      if (userId) {
        // Default: create profile as shohibul (tenant assigned later by admin)
        const { error: pErr } = await supabase.from('profiles').insert({
          user_id: userId,
          tenant_id: null,
          role: 'shohibul',
          full_name: fullName || null,
          phone: null,
        });
        // If profile already exists (e.g. trigger or admin-created), ignore.
        if (pErr && !String(pErr.message || '').toLowerCase().includes('duplicate')) throw pErr;
      }

      await refreshProfile().catch(() => {});
      setDone(true);
      // If session exists, AuthProvider will redirect; otherwise show confirmation message.
    } catch (err: any) {
      setError(err?.message ?? 'Signup gagal');
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Daftar</h1>
          <p className="text-slate-500">Buat akun baru. Nanti admin bisa assign tenant & role sesuai kebutuhan.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 space-y-6">
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
            Daftar <ArrowRight className="w-4 h-4" />
          </button>

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

