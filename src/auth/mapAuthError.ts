import type { AuthError } from '@supabase/supabase-js';

/**
 * User-facing messages for common Supabase Auth errors (Indonesian).
 */
export function mapAuthErrorToMessage(err: unknown): string {
  if (!err) return 'Login gagal. Coba lagi.';

  const a = err as AuthError;
  const code = String(a?.code || '').toLowerCase();
  const msg = String(a?.message || err || '').toLowerCase();

  if (code === 'invalid_credentials' || msg.includes('invalid login') || msg.includes('invalid email or password')) {
    return 'Email atau password salah.';
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Email belum diverifikasi. Cek inbox dan klik link verifikasi, lalu coba login lagi.';
  }
  if (msg.includes('user_banned') || msg.includes('banned')) {
    return 'Akun dinonaktifkan. Hubungi admin.';
  }
  if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network request failed')) {
    return 'Tidak bisa menghubungi server Supabase. Cek koneksi, VPN, atau adblock, dan pastikan domain *.supabase.co tidak diblokir.';
  }
  if (msg.includes('aborted') || (err as { name?: string })?.name === 'AbortError') {
    return 'Permintaan terhenti (timeout). Coba lagi atau cek jaringan / URL Supabase di env.';
  }

  return String((err as { message?: string })?.message || 'Login gagal. Coba lagi.');
}
