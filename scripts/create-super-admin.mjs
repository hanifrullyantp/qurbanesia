import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

function getEnv(...keys) {
  for (const k of keys) {
    const v = process.env[k];
    if (v && String(v).trim().length > 0) return v;
  }
  return undefined;
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env. Required: SUPABASE_URL (or VITE_/NEXT_PUBLIC_) and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/create-super-admin.mjs <email> <password>');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let userId;
{
  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (cErr && !String(cErr.message || '').toLowerCase().includes('already been registered')) {
    console.error('createUser failed:', cErr.message);
    process.exit(1);
  }

  userId = created?.user?.id;
}

if (!userId) {
  // user already exists -> find by email
  const { data: list, error: lErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (lErr) {
    console.error('listUsers failed:', lErr.message);
    process.exit(1);
  }
  const match = (list?.users ?? []).find((u) => String(u.email).toLowerCase() === String(email).toLowerCase());
  userId = match?.id;
}

if (!userId) {
  console.error('No user id returned from Supabase.');
  process.exit(1);
}

const { error: pErr } = await admin.from('profiles').upsert({
  user_id: userId,
  tenant_id: null,
  role: 'super_admin',
  full_name: email.split('@')[0],
});
if (pErr) {
  console.error('profiles upsert failed:', pErr.message);
  process.exit(1);
}

console.log('OK. Created super_admin:', { userId, email });

