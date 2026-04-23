import { supabase } from '../lib/supabaseClient';

export async function findDistributionByCode(packageCode: string) {
  const { data, error } = await supabase
    .from('distributions')
    .select('id,package_code,status,driver_name,driver_phone,bags,mustahik_id,shohibul_id')
    .eq('package_code', packageCode)
    .maybeSingle();
  if (error) throw error;
  return data as any | null;
}

export async function confirmDistributionReceived(distributionId: string) {
  const { error } = await supabase
    .from('distributions')
    .update({ status: 'received', received_at: new Date().toISOString() })
    .eq('id', distributionId);
  if (error) throw error;
}

