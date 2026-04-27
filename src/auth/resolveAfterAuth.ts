import type { Profile } from './AuthProvider';
import { postLoginPath } from './postLoginPath';
import { listMyPendingJoinRequests } from '../services/joinRequests';

/**
 * Setelah login/verifikasi:
 * - pending join → /view? (konteks masjid)
 * - belum punya tenant (bukan super_admin) → /demo (dashboard contoh + data dummy)
 * - selain itu → dashboard peran
 */
export async function resolveAfterAuthPath(profile: Profile | null | undefined): Promise<string> {
  if (!profile) return '/demo';
  if (profile.role === 'super_admin') return postLoginPath(profile.role);

  try {
    const pending = await listMyPendingJoinRequests();
    if (pending.length > 0) {
      const t = pending[0].tenant_id;
      return `/view?t=${encodeURIComponent(t)}&pending=1`;
    }
  } catch {
    // tabel belum termigrasi: lanjut
  }

  if (!profile.tenant_id) {
    return '/demo';
  }

  return postLoginPath(profile.role);
}
