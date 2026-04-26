import { supabase } from '../lib/supabaseClient';

export type TenantRow = {
  id: string;
  name: string;
  location: string | null;
  logo_url: string | null;
  plan: string;
  status: string;
  onboarding_profile_complete: boolean;
  created_at: string;
};

export async function fetchTenantById(tenantId: string): Promise<TenantRow | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('id, name, location, logo_url, plan, status, onboarding_profile_complete, created_at')
    .eq('id', tenantId)
    .maybeSingle();
  if (error) throw error;
  return data as TenantRow | null;
}

export async function fetchTenantPublic(tenantId: string): Promise<{ name: string; location: string | null } | null> {
  const { data, error } = await supabase.rpc('get_tenant_public', { p_tenant_id: tenantId });
  if (error) {
    return null;
  }
  const row = Array.isArray(data) ? data[0] : (data as { o_name?: string; o_location?: string | null } | null);
  if (!row?.o_name) return null;
  return { name: row.o_name, location: row.o_location ?? null };
}

export async function updateTenantMasjidData(input: {
  tenantId: string;
  name: string;
  location: string;
  markComplete?: boolean;
}) {
  const { markComplete = true, ...rest } = input;
  const { error } = await supabase
    .from('tenants')
    .update({
      name: rest.name.trim(),
      location: rest.location.trim() || null,
      onboarding_profile_complete: markComplete,
    })
    .eq('id', rest.tenantId);
  if (error) throw error;
}
