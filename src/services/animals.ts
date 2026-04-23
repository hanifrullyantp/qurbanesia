import { supabase } from '../lib/supabaseClient';

export type Animal = {
  id: string;
  code: string;
  name: string | null;
  type: 'sapi' | 'kambing' | 'domba';
  breed: string | null;
  weight_label: string | null;
  status: string;
  photo_path: string | null;
  max_capacity: number;
  source: string | null;
  age_label: string | null;
};

export type AnimalParticipant = {
  shohibul_id: string;
  name: string;
  phone: string;
  status: string;
  total_amount_idr: number;
  paid_amount_idr: number;
};

export async function listAnimals(): Promise<Animal[]> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .maybeSingle();

  if (!profile?.tenant_id) return [];

  const { data, error } = await supabase
    .from('animals')
    .select('id,code,name,type,breed,weight_label,status,photo_path,max_capacity,source,age_label')
    .eq('tenant_id', profile.tenant_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Animal[]) ?? [];
}

export async function listAnimalParticipants(animalId: string): Promise<AnimalParticipant[]> {
  const { data, error } = await supabase
    .from('animal_participants')
    .select('shohibul_id, shohibuls!inner(name,phone,status,total_amount_idr,paid_amount_idr)')
    .eq('animal_id', animalId);

  if (error) throw error;

  return ((data ?? []) as any[]).map((row) => ({
    shohibul_id: row.shohibul_id,
    name: row.shohibuls.name,
    phone: row.shohibuls.phone,
    status: row.shohibuls.status,
    total_amount_idr: row.shohibuls.total_amount_idr,
    paid_amount_idr: row.shohibuls.paid_amount_idr,
  }));
}

