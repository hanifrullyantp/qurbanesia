import { supabase } from '../lib/supabaseClient';
import type { Profile } from './AuthProvider';

export async function fetchProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, tenant_id, role, full_name, phone, mosque_position, address, location_full')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as Profile) ?? null;
}
