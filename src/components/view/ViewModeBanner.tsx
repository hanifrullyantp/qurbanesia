import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';

/**
 * Bar merah atas di mode pantau / view (bisa publik).
 */
export function ViewModeBanner() {
  const { user } = useAuth();

  const returnTo = `${window.location.pathname}${window.location.search}`;
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;

  if (user) {
    return (
      <div className="sticky top-0 z-[100] bg-amber-600 text-white px-4 py-2 text-center text-xs font-bold shadow">
        Mode pantau saja — permintaan peran diproses oleh admin masjid.
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-red-600 text-white px-4 py-2.5 shadow">
      <span className="text-xs font-bold">Anda melihat dashboard ringkas (read-only). Login untuk mengajukan peran.</span>
      <Link
        to={loginHref}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50"
      >
        <LogIn className="h-4 w-4" />
        Login
      </Link>
    </div>
  );
}
