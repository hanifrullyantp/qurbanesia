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

async function getTenantId(): Promise<string> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('profiles').select('tenant_id').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data?.tenant_id) throw new Error('Tenant not set on profile');
  return data.tenant_id as string;
}

export async function listTenantBankAccounts(): Promise<TenantBankAccount[]> {
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('tenant_bank_accounts')
    .select('id,tenant_id,bank_name,account_number,account_holder,is_default,is_active,notes')
    .eq('tenant_id', tenantId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as TenantBankAccount[]) ?? [];
}

export async function createTenantBankAccount(params: {
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_default?: boolean;
  notes?: string | null;
}) {
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('tenant_bank_accounts')
    .insert({
      tenant_id: tenantId,
      bank_name: params.bank_name,
      account_number: params.account_number,
      account_holder: params.account_holder,
      is_default: params.is_default ?? false,
      is_active: true,
      notes: params.notes ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function setDefaultTenantBankAccount(accountId: string) {
  const tenantId = await getTenantId();
  // Clear previous default
  const { error: clearError } = await supabase
    .from('tenant_bank_accounts')
    .update({ is_default: false })
    .eq('tenant_id', tenantId)
    .eq('is_default', true);
  if (clearError) throw clearError;

  const { error } = await supabase
    .from('tenant_bank_accounts')
    .update({ is_default: true, is_active: true })
    .eq('tenant_id', tenantId)
    .eq('id', accountId);
  if (error) throw error;
}

export async function deactivateTenantBankAccount(accountId: string) {
  const tenantId = await getTenantId();
  const { error } = await supabase
    .from('tenant_bank_accounts')
    .update({ is_active: false, is_default: false })
    .eq('tenant_id', tenantId)
    .eq('id', accountId);
  if (error) throw error;
}

