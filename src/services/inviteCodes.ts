import { supabase } from '../lib/supabaseClient';

export type ResolveInviteResult = { tenantId: string; defaultRole: string | null };

export async function resolveInviteCode(code: string): Promise<ResolveInviteResult | null> {
  const c = (code || '').trim().toUpperCase();
  if (c.length < 2) return null;
  const { data, error } = await supabase.rpc('resolve_invite_code', { p_code: c });
  if (error) {
    console.error(error);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : (data as { out_tenant_id?: string; out_default_role?: string | null } | null);
  if (!row?.out_tenant_id) return null;
  return { tenantId: row.out_tenant_id, defaultRole: row.out_default_role ?? null };
}
