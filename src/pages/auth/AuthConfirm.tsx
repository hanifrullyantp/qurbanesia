import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../auth/AuthProvider';
import { fetchProfileByUserId } from '../../auth/profileQuery';
import { resolveAfterAuthPath } from '../../auth/resolveAfterAuth';

const MAX_WAIT_MS = 15_000;
const STEP_MS = 200;

/**
 * Dibuka dari link verifikasi email Supabase (redirect_to = .../auth/confirm).
 * Hash access_token diproses oleh supabase-js (detectSessionInUrl).
 */
export default function AuthConfirm() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const deadline = Date.now() + MAX_WAIT_MS;
      let session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] = null;
      while (Date.now() < deadline && !cancelled) {
        const { data, error: sErr } = await supabase.auth.getSession();
        if (sErr) {
          if (!cancelled) setError(sErr.message);
          return;
        }
        session = data.session;
        if (session?.user) break;
        await new Promise((r) => setTimeout(r, STEP_MS));
      }
      if (cancelled) return;
      if (!session?.user?.id) {
        setError('Tidak ada sesi setelah verifikasi. Coba buka link dari email sekali lagi, atau login manual.');
        return;
      }
      try {
        await refreshProfile();
        const p = await fetchProfileByUserId(session.user.id);
        if (!p) {
          if (!cancelled) {
            setError('Profil belum tersedia. Coba login manual atau hubungi admin.');
            return;
          }
        }
        const path = p ? await resolveAfterAuthPath(p) : '/demo';
        if (!cancelled) navigate(path, { replace: true });
      } catch (e) {
        if (!cancelled) {
          setError((e as Error)?.message || 'Gagal melanjutkan setelah verifikasi.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, refreshProfile]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <p className="text-center text-sm font-bold text-slate-700 max-w-md">{error}</p>
        <Link to="/login?verify=1" className="mt-6 text-sm font-bold text-emerald-600">
          Ke halaman login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
      <p className="text-sm font-bold text-slate-600">Memverifikasi email...</p>
    </div>
  );
}
