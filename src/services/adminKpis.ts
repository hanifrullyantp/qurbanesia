import { supabase } from '../lib/supabaseClient';

export async function getAdminKpis() {
  const { data: animals, error: aErr } = await supabase.from('animals').select('type,status');
  if (aErr) throw aErr;

  const { data: shohibuls, error: sErr } = await supabase.from('shohibuls').select('status');
  if (sErr) throw sErr;

  const { data: dists, error: dErr } = await supabase.from('distributions').select('status,bags');
  if (dErr) throw dErr;

  const totalSapi = (animals ?? []).filter((x: any) => x.type === 'sapi').length;
  const totalKambing = (animals ?? []).filter((x: any) => x.type !== 'sapi').length;
  const sudahSembelih = (animals ?? []).filter((x: any) => ['proses_daging','dikemas','siap_kirim','selesai'].includes(x.status)).length;

  const verifiedShohibul = (shohibuls ?? []).filter((x: any) => x.status === 'lunas').length;

  const distributedBags = (dists ?? []).filter((x: any) => x.status === 'received').reduce((acc: number, r: any) => acc + (r.bags ?? 0), 0);
  const totalBags = (dists ?? []).reduce((acc: number, r: any) => acc + (r.bags ?? 0), 0);

  return { totalSapi, totalKambing, sudahSembelih, verifiedShohibul, distributedBags, totalBags };
}

