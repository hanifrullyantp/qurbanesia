import { supabase } from '../lib/supabaseClient';
import type { AppRole } from '../auth/AuthProvider';

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export type JoinRequestRow = {
  id: string;
  user_id: string;
  tenant_id: string;
  requested_role: AppRole;
  status: JoinRequestStatus;
  message: string | null;
  created_at: string;
};

const selectJoin =
  'id, user_id, tenant_id, requested_role, status, message, created_at' as const;

export async function listMyPendingJoinRequests(): Promise<JoinRequestRow[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user?.id) return [];
  const { data, error } = await supabase
    .from('join_requests')
    .select(selectJoin)
    .eq('user_id', u.user.id)
    .eq('status', 'pending');
  if (error) {
    if (String(error.message || '').includes('relation') || String(error.message || '').includes('does not exist')) {
      return [];
    }
    throw error;
  }
  return (data as JoinRequestRow[]) ?? [];
}

export async function listAllPendingJoinRequests(): Promise<JoinRequestRow[]> {
  const { data, error } = await supabase
    .from('join_requests')
    .select(selectJoin)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) {
    if (String(error.message || '').includes('relation') || String(error.message || '').includes('does not exist')) {
      return [];
    }
    throw error;
  }
  return (data as JoinRequestRow[]) ?? [];
}

export async function listPendingForMyTenant(tenantId: string): Promise<JoinRequestRow[]> {
  const { data, error } = await supabase
    .from('join_requests')
    .select(selectJoin)
    .eq('tenant_id', tenantId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) {
    if (String(error.message || '').includes('relation') || String(error.message || '').includes('does not exist')) {
      return [];
    }
    throw error;
  }
  return (data as JoinRequestRow[]) ?? [];
}

export async function createJoinRequest(input: {
  tenantId: string;
  requestedRole: AppRole;
  message?: string;
}): Promise<void> {
  const { data: u, error: ue } = await supabase.auth.getUser();
  if (ue || !u.user?.id) throw new Error('Harus login untuk mengirim permintaan.');
  const { error } = await supabase.from('join_requests').insert({
    user_id: u.user.id,
    tenant_id: input.tenantId,
    requested_role: input.requestedRole,
    message: input.message?.trim() || null,
  });
  if (error) throw error;
}

export async function approveJoinRequestRpc(id: string): Promise<void> {
  const { error } = await supabase.rpc('approve_join_request', { p_request_id: id });
  if (error) throw error;
}

export async function rejectJoinRequestRpc(id: string): Promise<void> {
  const { error } = await supabase.rpc('reject_join_request', { p_request_id: id });
  if (error) throw error;
}

export async function activateTenantAsMasjidRpc(masjidName: string, location: string): Promise<string> {
  const { data, error } = await supabase.rpc('activate_tenant_as_masjid', {
    p_masjid_name: masjidName,
    p_location: location,
  });
  if (error) throw error;
  return String(data);
}
