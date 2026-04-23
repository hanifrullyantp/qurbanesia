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

export const supabase = createClient(normalizeSupabaseUrl(supabaseUrl), supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

