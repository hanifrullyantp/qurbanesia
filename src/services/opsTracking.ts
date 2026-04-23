import { supabase } from '../lib/supabaseClient';

export async function listActiveAnimalQueue() {
  const { data, error } = await supabase
    .from('animals')
    .select('id,code,name,type,status')
    .order('code', { ascending: true });
  if (error) throw error;
  return (data ?? []) as any[];
}

export async function createTrackingEventForAnimal(animalId: string, status: string, message: string) {
  // Get cases linked to this animal (via qurban_cases.animal_id)
  const { data: cases, error: cErr } = await supabase.from('qurban_cases').select('id,tenant_id').eq('animal_id', animalId);
  if (cErr) throw cErr;

  if (!cases || cases.length === 0) {
    // Still update animal status only
    const { error } = await supabase.from('animals').update({ status }).eq('id', animalId);
    if (error) throw error;
    return;
  }

  // Insert event for each case
  const tenantId = cases[0].tenant_id;
  const { error: eErr } = await supabase.from('tracking_events').insert(
    cases.map((qc: any) => ({
      tenant_id: tenantId,
      qurban_case_id: qc.id,
      status,
      message,
      occurred_at: new Date().toISOString(),
      meta: { animal_id: animalId },
    })),
  );
  if (eErr) throw eErr;

  // Update animal status
  const { error: aErr } = await supabase.from('animals').update({ status }).eq('id', animalId);
  if (aErr) throw aErr;

  // Update cases status
  const { error: qErr } = await supabase.from('qurban_cases').update({ status, last_updated_at: new Date().toISOString() }).eq('animal_id', animalId);
  if (qErr) throw qErr;
}

