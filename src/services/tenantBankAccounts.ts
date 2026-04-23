import { supabase } from '../lib/supabaseClient';

export type TenantBankAccount = {
  id: string;
  tenant_id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_default: boolean;
  is_active: boolean;
  notes: string | null;
};

export async function getDefaultTenantBankAccount(): Promise<TenantBankAccount | null> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile?.tenant_id) return null;

  const { data, error } = await supabase
    .from('tenant_bank_accounts')
    .select('id,tenant_id,bank_name,account_number,account_holder,is_default,is_active,notes')
    .eq('tenant_id', profile.tenant_id)
    .eq('is_active', true)
    .order('is_default', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as TenantBankAccount | null) ?? null;
}

