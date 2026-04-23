import { createClient } from '@supabase/supabase-js';

type Env = Record<string, string | boolean | undefined>;
const env = import.meta.env as unknown as Env;

const supabaseUrl =
  (env.VITE_SUPABASE_URL as string | undefined) ??
  (env.SUPABASE_URL as string | undefined) ??
  (env.NEXT_PUBLIC_SUPABASE_URL as string | undefined);

const supabaseAnonKey =
  (env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  (env.SUPABASE_ANON_KEY as string | undefined) ??
  (env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined);

function normalizeSupabaseUrl(raw: string) {
  let u = raw.trim();
  // Some users accidentally paste PostgREST base (`.../rest/v1`). Auth endpoints must be under `.../auth/v1`.
  u = u.replace(/\/rest\/v1\/?$/i, '');
  u = u.replace(/\/+$/g, '');
  return u;
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env. Provide one of: (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) or (SUPABASE_URL + SUPABASE_ANON_KEY) or (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY).',
  );
}

const resolvedUrl = normalizeSupabaseUrl(supabaseUrl);

/** Abort hanging fetches so UI can show a clear error instead of spinning forever. */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const ms = 20000;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(input, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

export const supabase = createClient(resolvedUrl, supabaseAnonKey, {
  global: { fetch: fetchWithTimeout },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // PKCE can hang or fail on some static/embedded deployments; implicit is simpler for SPA password login.
    flowType: 'implicit',
    detectSessionInUrl: true,
  },
});

