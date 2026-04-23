import { supabase } from '../lib/supabaseClient';

export type PaymentRow = {
  id: string;
  tenant_id: string;
  shohibul_id: string;
  amount_idr: number;
  method: string | null;
  proof_path: string | null;
  status: 'submitted' | 'verified' | 'rejected';
  payer_name: string | null;
  transfer_at: string | null;
  verified_by: string | null;
  verified_at: string | null;
  reject_reason: string | null;
  tenant_bank_account_id: string | null;
  paid_at: string;
};

async function getTenantId(): Promise<string> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('profiles').select('tenant_id').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data?.tenant_id) throw new Error('Tenant not set on profile');
  return data.tenant_id as string;
}

export async function listSubmittedPayments(): Promise<(PaymentRow & { shohibul_name?: string; shohibul_phone?: string })[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('id,tenant_id,shohibul_id,amount_idr,method,proof_path,status,payer_name,transfer_at,verified_by,verified_at,reject_reason,tenant_bank_account_id,paid_at, shohibuls!inner(name,phone)')
    .eq('status', 'submitted')
    .order('paid_at', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as any[]).map((r) => ({
    ...(r as PaymentRow),
    shohibul_name: r.shohibuls?.name,
    shohibul_phone: r.shohibuls?.phone,
  }));
}

export async function listMyPayments(shohibulId: string): Promise<PaymentRow[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('id,tenant_id,shohibul_id,amount_idr,method,proof_path,status,payer_name,transfer_at,verified_by,verified_at,reject_reason,tenant_bank_account_id,paid_at')
    .eq('shohibul_id', shohibulId)
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return (data as PaymentRow[]) ?? [];
}

export async function createPayment(params: {
  shohibulId: string;
  amountIdr: number;
  method?: string;
  payerName?: string;
  transferAt?: string;
  tenantBankAccountId?: string | null;
}): Promise<string> {
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('payments')
    .insert({
      tenant_id: tenantId,
      shohibul_id: params.shohibulId,
      amount_idr: params.amountIdr,
      method: params.method ?? null,
      payer_name: params.payerName ?? null,
      transfer_at: params.transferAt ?? null,
      tenant_bank_account_id: params.tenantBankAccountId ?? null,
      status: 'submitted',
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function uploadPaymentProof(params: { paymentId: string; file: File }): Promise<string> {
  const tenantId = await getTenantId();
  const ext = params.file.name.split('.').pop() || 'jpg';
  const path = `${tenantId}/${params.paymentId}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(path, params.file, {
    upsert: true,
    contentType: params.file.type || 'image/jpeg',
  });
  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase.from('payments').update({ proof_path: path }).eq('id', params.paymentId);
  if (updateError) throw updateError;
  return path;
}

export async function getSignedProofUrl(proofPath: string): Promise<string> {
  const { data, error } = await supabase.storage.from('payment-proofs').createSignedUrl(proofPath, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export async function verifyPayment(paymentId: string) {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'verified', verified_at: new Date().toISOString(), verified_by: (await supabase.auth.getUser()).data.user?.id ?? null, reject_reason: null })
    .eq('id', paymentId);
  if (error) throw error;
}

export async function rejectPayment(paymentId: string, reason: string) {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected', verified_at: new Date().toISOString(), verified_by: (await supabase.auth.getUser()).data.user?.id ?? null, reject_reason: reason })
    .eq('id', paymentId);
  if (error) throw error;
}

