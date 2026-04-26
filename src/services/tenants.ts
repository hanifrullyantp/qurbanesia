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
