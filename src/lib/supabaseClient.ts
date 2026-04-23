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

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env. Provide one of: (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY) or (SUPABASE_URL + SUPABASE_ANON_KEY) or (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY).',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

