import { supabase } from '../lib/supabaseClient';

export type ShohibulRow = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  qurban_type: 'sapi_1_7' | 'kambing' | 'domba';
  grade: 'ekonomi' | 'standar' | 'premium';
  niat: string | null;
  delivery_pref: 'ambil_sendiri' | 'antar';
  wants_offal: boolean;
  wants_skin: boolean;
  status: 'terdaftar' | 'dp' | 'cicilan' | 'lunas';
  total_amount_idr: number;
  paid_amount_idr: number;
};

export async function listShohibuls(): Promise<ShohibulRow[]> {
  const { data, error } = await supabase
    .from('shohibuls')
    .select('id,code,name,phone,email,address,qurban_type,grade,niat,delivery_pref,wants_offal,wants_skin,status,total_amount_idr,paid_amount_idr')
    .order('registered_at', { ascending: false });
  if (error) throw error;
  return (data as ShohibulRow[]) ?? [];
}

async function getTenantId(): Promise<string> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('profiles').select('tenant_id').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data?.tenant_id) throw new Error('Tenant not set on profile');
  return data.tenant_id as string;
}

export async function getNextShohibulCode(): Promise<string> {
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('shohibuls')
    .select('code')
    .eq('tenant_id', tenantId)
    .order('code', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  const last = (data?.code as string | undefined) ?? 'SH-000';
  const m = last.match(/SH-(\d+)/i);
  const n = m ? Number(m[1]) : 0;
  const next = n + 1;
  return `SH-${next.toString().padStart(3, '0')}`;
}

export async function createShohibul(params: {
  name: string;
  phone: string;
  qurban_type: 'sapi_1_7' | 'kambing' | 'domba';
  grade: 'ekonomi' | 'standar' | 'premium';
  niat?: string;
  delivery_pref: 'ambil_sendiri' | 'antar';
  total_amount_idr: number;
}) {
  const tenantId = await getTenantId();
  const code = await getNextShohibulCode();
  const userId = (await supabase.auth.getUser()).data.user?.id ?? null;

  const { data, error } = await supabase
    .from('shohibuls')
    .insert({
      tenant_id: tenantId,
      code,
      name: params.name,
      phone: params.phone,
      qurban_type: params.qurban_type,
      grade: params.grade,
      niat: params.niat ?? null,
      delivery_pref: params.delivery_pref,
      wants_offal: true,
      wants_skin: false,
      status: 'terdaftar',
      total_amount_idr: params.total_amount_idr,
      paid_amount_idr: 0,
      user_id: null,
    })
    .select('id,code')
    .single();

  if (error) throw error;
  return { id: data.id as string, code: data.code as string, created_by: userId };
}

