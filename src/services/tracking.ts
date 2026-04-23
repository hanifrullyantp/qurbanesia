import { supabase } from '../lib/supabaseClient';

export type QurbanCase = {
  id: string;
  shohibul_id: string;
  animal_id: string | null;
  status: string;
  last_updated_at: string;
};

export type TrackingEvent = {
  id: string;
  status: string;
  message: string | null;
  occurred_at: string;
  meta: any;
};

export async function listMyQurbanCases(): Promise<QurbanCase[]> {
  // If Shohibul has its own login (profiles.role=shohibul),
  // we map via shohibuls.user_id.
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return [];

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('user_id', userId)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile?.tenant_id) return [];

  const { data: shohibuls, error: shErr } = await supabase
    .from('shohibuls')
    .select('id')
    .eq('tenant_id', profile.tenant_id)
    .eq('user_id', userId);
  if (shErr) throw shErr;

  const shohibulIds = (shohibuls ?? []).map((s: any) => s.id);
  if (shohibulIds.length === 0) return [];

  const { data, error } = await supabase
    .from('qurban_cases')
    .select('id,shohibul_id,animal_id,status,last_updated_at')
    .in('shohibul_id', shohibulIds)
    .order('last_updated_at', { ascending: false });

  if (error) throw error;
  return (data as QurbanCase[]) ?? [];
}

export async function listTrackingEvents(qurbanCaseId: string): Promise<TrackingEvent[]> {
  const { data, error } = await supabase
    .from('tracking_events')
    .select('id,status,message,occurred_at,meta')
    .eq('qurban_case_id', qurbanCaseId)
    .order('occurred_at', { ascending: true });

  if (error) throw error;
  return (data as TrackingEvent[]) ?? [];
}

