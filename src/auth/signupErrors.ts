/**
 * Map Supabase GoTrue / Auth errors on signUp to "user already exists" (email terdaftar).
 */
export function isUserAlreadyRegisteredError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { message?: string; code?: string; status?: number };
  const code = String(e.code || '').toLowerCase();
  const msg = String(e.message || '').toLowerCase();
  if (code === 'user_already_exists' || code === 'email_address_not_available') return true;
  if (msg.includes('user already registered')) return true;
  if (msg.includes('already been registered')) return true;
  if (msg.includes('already exists')) return true;
  if (msg.includes('email address') && msg.includes('already')) return true;
  if (e.status === 422 && (msg.includes('already') || msg.includes('exists'))) return true;
  return false;
}
