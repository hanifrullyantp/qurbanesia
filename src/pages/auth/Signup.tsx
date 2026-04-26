import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, User, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';
import { postLoginPath } from '../../auth/postLoginPath';
import { isUserAlreadyRegisteredError } from '../../auth/signupErrors';

const Signup = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [statusText, setStatusText] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (!profile) return;
    navigate(postLoginPath(profile.role), { replace: true });
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
      if (!fullName.trim()) {
        throw new Error('Nama lengkap wajib diisi.');
      }
      if (!phone.trim()) {
        throw new Error('No. HP wajib diisi.');
      }
      if (password.length < 8) {
        throw new Error('Password minimal 8 karakter.');
      }

      const redirect = `${window.location.origin}/auth/confirm`;
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirect,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });
      if (signUpError) {
        if (isUserAlreadyRegisteredError(signUpError)) {
          const q = new URLSearchParams();
          q.set('email', email.trim());
          q.set('already', '1');
          navigate(`/login?${q.toString()}`, { replace: true });
          return;
        }
        throw signUpError;
      }

      setDone(true);
      setStatusText('Berhasil. Mengarahkan ke login...');
      navigate('/login?signup=1', { replace: true });
    } catch (err: any) {
      console.error('Signup error:', err);
      const errMsg = String(err?.message || '').toLowerCase();
      if (err?.name === 'AbortError' || errMsg.includes('aborted') || errMsg.includes('signal is aborted')) {
        setError(
          'Permintaan daftar terhenti (timeout). Cek jaringan/adblock, atau pastikan env Supabase benar. Lihat Network tab untuk request ke /auth/v1/signup.',
        );
        return;
      }
      const msg = err?.message ?? 'Signup gagal';
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
          <p className="text-slate-500">
            Cukup email, nama, dan nomor HP. Data masjid diatur nanti oleh admin masjid setelah akun terhubung ke
            organisasi.
          </p>
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
                placeholder="Nama sesuai identitas"
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
            {submitting ? 'Memproses...' : 'Daftar'} <ArrowRight className="w-4 h-4" />
          </button>

          {statusText && <div className="text-center text-xs font-bold text-slate-500">{statusText}</div>}

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
