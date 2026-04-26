import type { Profile } from './AuthProvider';
import { postLoginPath } from './postLoginPath';
import { listMyPendingJoinRequests } from '../services/joinRequests';

/**
 * Tujuan setelah login/verifikasi: pending join → /view, shohibul belum punya tenant → /view, selain itu dashboard peran.
 */
export async function resolveAfterAuthPath(profile: Profile | null | undefined): Promise<string> {
  if (!profile) return '/view';
  if (profile.role === 'super_admin') return postLoginPath(profile.role);

  try {
    const pending = await listMyPendingJoinRequests();
    if (pending.length > 0) {
      const t = pending[0].tenant_id;
      return `/view?t=${encodeURIComponent(t)}&pending=1`;
    }
  } catch {
    // tabel belum termigrasi: lanjut ke aturan bawah
  }

  if (profile.role === 'shohibul' && !profile.tenant_id) {
    return '/view';
  }

  return postLoginPath(profile.role);
}
