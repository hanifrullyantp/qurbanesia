import { supabase, supabaseProjectUrl, supabasePublicAnonKey } from './supabaseClient';

function abortAfter(ms: number): AbortSignal {
  const t = (AbortSignal as any)?.timeout as undefined | ((n: number) => AbortSignal);
  if (typeof t === 'function') return t(ms);
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
  msg?: string;
  error_code?: string;
};

/**
 * Direct GoTrue password grant — avoids rare cases where supabase-js auth methods never settle.
 */
export async function signInWithPasswordDirect(email: string, password: string) {
  const url = `${supabaseProjectUrl}/auth/v1/token?grant_type=password`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabasePublicAnonKey,
      Authorization: `Bearer ${supabasePublicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    signal: abortAfter(20000),
  });

  const json = (await res.json()) as TokenResponse;

  if (!res.ok) {
    const msg = json.msg || json.error_description || json.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  if (!json.access_token || !json.refresh_token) {
    throw new Error('Login gagal: respons token tidak lengkap.');
  }

  const setSessionPromise = supabase.auth.setSession({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
  });

  const timeout = new Promise<never>((_, rej) => {
    setTimeout(() => rej(new Error('Gagal menyimpan sesi (timeout).')), 15000);
  });

  const result = await Promise.race([
    setSessionPromise.then((r) => ({ ok: true as const, r })),
    timeout.then(() => ({ ok: false as const })),
  ]);

  if (!result.ok) {
    throw new Error('Gagal menyimpan sesi (timeout).');
  }

  if (result.r.error) throw result.r.error;
}
