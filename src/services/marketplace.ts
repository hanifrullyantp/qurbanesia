import { supabase } from '../lib/supabaseClient';

export type MarketplaceAnimal = {
  id: string;
  supplier_id: string;
  type: 'sapi' | 'kambing' | 'domba';
  breed: string | null;
  weight_kg: number | null;
  age_years: number | null;
  grade: 'ekonomi' | 'standar' | 'premium';
  price_idr: number;
  status: 'available' | 'booked' | 'sold' | 'delivered';
  photos: string[] | null;
  video_url: string | null;
};

export async function listMarketplaceAnimals(): Promise<MarketplaceAnimal[]> {
  const { data, error } = await supabase
    .from('supplier_animals')
    .select('id,supplier_id,type,breed,weight_kg,age_years,grade,price_idr,status,photos,video_url')
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as MarketplaceAnimal[]) ?? [];
}

export async function createOrder(params: {
  supplierId: string;
  items: { supplierAnimalId: string; priceIdr: number; quantity?: number }[];
}) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile?.tenant_id) throw new Error('Tenant not set on profile');

  const total = params.items.reduce((acc, it) => acc + it.priceIdr * (it.quantity ?? 1), 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      tenant_id: profile.tenant_id,
      supplier_id: params.supplierId,
      status: 'submitted',
      total_price_idr: total,
      paid_amount_idr: 0,
      created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
    })
    .select('id')
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from('order_items').insert(
    params.items.map((it) => ({
      order_id: order.id,
      supplier_animal_id: it.supplierAnimalId,
      quantity: it.quantity ?? 1,
      price_idr: it.priceIdr,
    })),
  );

  if (itemsError) throw itemsError;
  return order.id as string;
}

