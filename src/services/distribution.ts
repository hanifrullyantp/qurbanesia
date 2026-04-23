import { supabase } from '../lib/supabaseClient';

export type DistributionConfig = {
  tenant_id: string;
  bag_weight_kg: number;
  shohibul_meat_kg: number;
};

export type AnimalYieldRow = {
  animal_id: string;
  meat_weight_kg: number;
  offal_weight_kg: number;
  bone_weight_kg: number;
  total_bags: number;
  shohibul_bags: number;
  mustahik_bags: number;
  distributed_bags: number;
  status: 'pending' | 'packed' | 'distributed';
};

export async function getDistributionConfig(): Promise<DistributionConfig | null> {
  const { data, error } = await supabase.from('distribution_configs').select('tenant_id,bag_weight_kg,shohibul_meat_kg').maybeSingle();
  if (error) throw error;
  return (data as DistributionConfig | null) ?? null;
}

export async function listAnimalYields(): Promise<AnimalYieldRow[]> {
  const { data, error } = await supabase
    .from('animal_yields')
    .select('animal_id,meat_weight_kg,offal_weight_kg,bone_weight_kg,total_bags,shohibul_bags,mustahik_bags,distributed_bags,status')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as AnimalYieldRow[]) ?? [];
}

