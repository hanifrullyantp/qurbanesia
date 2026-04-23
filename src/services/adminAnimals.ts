import { supabase } from '../lib/supabaseClient';

export async function createAnimal(params: {
  code: string;
  name?: string;
  type: 'sapi' | 'kambing' | 'domba';
  breed?: string;
  weight_label?: string;
  age_label?: string;
  source?: string;
  max_capacity?: number;
}) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data: profile, error: pErr } = await supabase.from('profiles').select('tenant_id').eq('user_id', userId).maybeSingle();
  if (pErr) throw pErr;
  if (!profile?.tenant_id) throw new Error('Tenant not set on profile');

  const { data, error } = await supabase
    .from('animals')
    .insert({
      tenant_id: profile.tenant_id,
      code: params.code,
      name: params.name ?? null,
      type: params.type,
      breed: params.breed ?? null,
      weight_label: params.weight_label ?? null,
      age_label: params.age_label ?? null,
      source: params.source ?? null,
      max_capacity: params.max_capacity ?? (params.type === 'sapi' ? 7 : 1),
      status: 'terdaftar',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function listAssignableShohibuls() {
  const { data, error } = await supabase
    .from('shohibuls')
    .select('id,code,name,phone,status,total_amount_idr,paid_amount_idr')
    .order('registered_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as any[];
}

export async function assignShohibulToAnimal(params: { animalId: string; shohibulId: string }) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data: profile, error: pErr } = await supabase.from('profiles').select('tenant_id').eq('user_id', userId).maybeSingle();
  if (pErr) throw pErr;
  if (!profile?.tenant_id) throw new Error('Tenant not set on profile');

  const { error } = await supabase.from('animal_participants').insert({
    tenant_id: profile.tenant_id,
    animal_id: params.animalId,
    shohibul_id: params.shohibulId,
  });
  if (error) throw error;
}

