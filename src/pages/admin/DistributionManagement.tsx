import React from 'react';
import { 
  Package, 
  Truck, 
  Users, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Settings, 
  MoreVertical,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  QrCode,
  Download
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { AnimalYield } from '../../types';
import { getDistributionConfig, listAnimalYields } from '../../services/distribution';

const DistributionManagement = () => {
  const [bagWeight, setBagWeight] = React.useState(1.5);
  const [shohibulMeat, setShohibulMeat] = React.useState(2.0);
  const [yields, setYields] = React.useState<AnimalYield[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const cfg = await getDistributionConfig();
        if (!cancelled && cfg) {
          setBagWeight(Number(cfg.bag_weight_kg));
          setShohibulMeat(Number(cfg.shohibul_meat_kg));
        }

        const rows = await listAnimalYields();
        if (cancelled) return;
        setYields(
          rows.map((y) => ({
            animalId: y.animal_id,
            meatWeight: Number(y.meat_weight_kg),
            offalWeight: Number(y.offal_weight_kg),
            boneWeight: Number(y.bone_weight_kg),
            totalBags: y.total_bags,
            shohibulBags: y.shohibul_bags,
            mustahikBags: y.mustahik_bags,
            distributedBags: y.distributed_bags,
            status: y.status,
          })),
        );
        setError(null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Gagal memuat distribusi');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalMustahikBags = yields.reduce((acc, y) => acc + y.mustahikBags, 0);
  const totalDistributed = yields.reduce((acc, y) => acc + y.distributedBags, 0);

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Manajemen Distribusi</h1>
          <p className="text-slate-500 font-medium italic">Konfigurasi kantong & monitoring real-time pembagian daging.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white text-slate-600 border border-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Label
           </button>
           <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
              Cetak QR Paket
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Distribution Dashboard Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Kantong</div>
                    <div className="text-2xl font-black text-slate-900">{yields.reduce((acc, y) => acc + y.totalBags, 0)}</div>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sudah Dibagikan</div>
                    <div className="text-2xl font-black text-emerald-600">{totalDistributed}</div>
                 </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Truck className="w-20 h-20" />
                 </div>
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Sisa Kantong</div>
                 <div className="text-3xl font-black text-white">{totalMustahikBags - totalDistributed}</div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(totalDistributed/totalMustahikBags)*100}%` }}></div>
                 </div>
              </div>
           </div>

           {/* Per-Animal Yield Monitoring */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h2 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" /> Hasil per Sapi
                 </h2>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Real-time dari Panitia</span>
              </div>
              <div className="overflow-x-auto">
                 {loading && (
                   <div className="p-10 text-center text-slate-500 font-bold">Memuat yield...</div>
                 )}
                 {error && !loading && (
                   <div className="p-10 text-center text-red-700 font-bold bg-red-50 border-t border-red-100">{error}</div>
                 )}
                 <table className="w-full">
                    <thead>
                       <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-4">ID Hewan</th>
                          <th className="px-4 py-4">Daging (Yield)</th>
                          <th className="px-4 py-4">Jeroan/Tulang</th>
                          <th className="px-4 py-4">Jatah Shohibul</th>
                          <th className="px-4 py-4">Kantong Mustahik</th>
                          <th className="px-8 py-4 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {yields.map((y) => (
                         <tr key={y.animalId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5">
                               <div className="text-sm font-black text-slate-800">{y.animalId}</div>
                               <div className="text-[8px] font-bold text-slate-400 uppercase">Sapi Limosin</div>
                            </td>
                            <td className="px-4 py-5">
                               <div className="text-xs font-black text-slate-700">{y.meatWeight} Kg</div>
                               <div className="text-[8px] font-bold text-emerald-600 uppercase">Yield Aktif</div>
                            </td>
                            <td className="px-4 py-5">
                               <div className="text-[10px] font-bold text-slate-500">{y.offalWeight} Kg / {y.boneWeight} Kg</div>
                            </td>
                            <td className="px-4 py-5">
                               <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black">{y.shohibulBags} Ktg</span>
                               </div>
                               <div className="text-[8px] font-bold text-slate-400 uppercase mt-1">Ready for pickup</div>
                            </td>
                            <td className="px-4 py-5">
                               <div className="text-sm font-black text-slate-900">{y.mustahikBags}</div>
                               <div className="text-[8px] font-bold text-slate-400 uppercase">Kantong @{bagWeight}kg</div>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <span className={cn(
                                 "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                                 y.status === 'distributed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                 y.status === 'packed' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                 "bg-orange-50 text-orange-600 border-orange-100"
                               )}>
                                  {y.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Configuration Sidebar */}
        <div className="space-y-8">
           {/* Bag Config */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <Settings className="w-5 h-5 text-slate-400" /> Aturan Kantong
              </h2>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berat Kantong Distribusi</label>
                    <div className="flex items-center gap-3">
                       <input 
                        type="number" 
                        step="0.1"
                        value={bagWeight} 
                        onChange={(e) => setBagWeight(Number(e.target.value))}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-black text-slate-700 outline-none focus:border-emerald-500" 
                       />
                       <span className="font-black text-slate-400">KG</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jatah Daging Shohibul (1/7)</label>
                    <div className="flex items-center gap-3">
                       <input 
                        type="number" 
                        step="0.1"
                        value={shohibulMeat} 
                        onChange={(e) => setShohibulMeat(Number(e.target.value))}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-black text-slate-700 outline-none focus:border-emerald-500" 
                       />
                       <span className="font-black text-slate-400">KG</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed italic">Panitia akan otomatis memisahkan {shohibulMeat} Kg daging + 1/7 jeroan & tulang untuk setiap shohibul.</p>
                 </div>

                 <button className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                    Terapkan Aturan
                 </button>
              </div>
           </div>

           {/* Distribution Progress (Mustahik) */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <Truck className="w-5 h-5 text-emerald-600" /> Progress Mustahik
              </h2>
              <div className="space-y-6">
                 {[
                   { label: 'Zona Barat', distributed: 45, total: 100, color: 'bg-blue-500' },
                   { label: 'Zona Utara', distributed: 12, total: 80, color: 'bg-orange-500' },
                   { label: 'Zona Selatan', distributed: 0, total: 50, color: 'bg-slate-300' },
                 ].map((zona, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-500">{zona.label}</span>
                         <span className="text-slate-900">{zona.distributed} / {zona.total}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full transition-all duration-1000", zona.color)} style={{ width: `${(zona.distributed/zona.total)*100}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Quick Link Card */}
           <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <QrCode className="w-24 h-24" />
              </div>
              <h3 className="font-black text-xl mb-2 uppercase tracking-tight">Scan Serah Terima</h3>
              <p className="text-emerald-100 text-[10px] font-medium mb-6 leading-relaxed">Buka scanner untuk konfirmasi pembagian daging ke shohibul atau mustahik di lokasi.</p>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all">
                 Launch Scanner
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionManagement;
