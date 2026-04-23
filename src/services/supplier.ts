import { supabase } from '../lib/supabaseClient';

export async function listMySupplierAnimals() {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { data: supplier, error: sErr } = await supabase.from('suppliers').select('id').eq('owner_user_id', userId).maybeSingle();
  if (sErr) throw sErr;
  if (!supplier?.id) throw new Error('Supplier profile belum dibuat (tabel suppliers)');

  const { data, error } = await supabase
    .from('supplier_animals')
    .select('id,type,breed,weight_kg,age_years,grade,price_idr,status,photos')
    .eq('supplier_id', supplier.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listMySupplierOrders() {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { data: supplier, error: sErr } = await supabase.from('suppliers').select('id,name').eq('owner_user_id', userId).maybeSingle();
  if (sErr) throw sErr;
  if (!supplier?.id) throw new Error('Supplier profile belum dibuat (tabel suppliers)');

  const { data, error } = await supabase
    .from('orders')
    .select('id,tenant_id,status,total_price_idr,paid_amount_idr,escrow_status,created_at')
    .eq('supplier_id', supplier.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

