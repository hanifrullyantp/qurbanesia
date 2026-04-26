import type { AppRole } from './AuthProvider';

/**
 * Default dashboard for each role (role-first routing after login/signup).
 */
export function postLoginPath(role: AppRole | null | undefined): string {
  if (!role) return '/';
  switch (role) {
    case 'super_admin':
      return '/super-admin';
    case 'admin_masjid':
      return '/admin';
    case 'panitia':
      return '/panitia';
    case 'jagal':
      return '/jagal';
    case 'supplier':
      return '/supplier';
    case 'shohibul':
      return '/shohibul';
    case 'penerima':
      return '/penerima';
    default:
      return '/';
  }
}
