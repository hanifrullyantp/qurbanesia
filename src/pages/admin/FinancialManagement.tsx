import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Users, 
  Calculator,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  Settings,
  Scale,
  Package
} from 'lucide-react';
import { cn } from '../../utils/cn';

const FinancialManagement = () => {
  // 1. Fixed Global Costs (Shared by all animals/shohibul)
  const [globalCosts, setGlobalCosts] = React.useState({
    materials: 2500000, // Plastik, tali, terpal, dll
    services: 5000000,  // Jasa kordinator, kebersihan umum
    operational: 3000000, // Listrik, tenda utama, transport umum
    others: 1500000     // Biaya tak terduga global
  });

  // 2. Animal Tiers (Variable Costs per grade)
  const [tiers, setTiers] = React.useState([
    { id: 'A', label: 'Grade Premium', basePrice: 28000000, prodCost: 1500000, targetCount: 3 },
    { id: 'B', label: 'Grade Standar', basePrice: 21000000, prodCost: 1000000, targetCount: 5 },
    { id: 'C', label: 'Grade Ekonomi', basePrice: 17500000, prodCost: 800000, targetCount: 2 },
  ]);

  // Calculations
  const totalAnimals = tiers.reduce((acc, t) => acc + t.targetCount, 0);
  const totalParticipants = totalAnimals * 7;
  const totalGlobalCost = globalCosts.materials + globalCosts.services + globalCosts.operational + globalCosts.others;
  
  // Cost portion per participant for global overhead
  const fixedPortion = totalParticipants > 0 ? totalGlobalCost / totalParticipants : 0;

  const calculateUrunan = (basePrice: number, prodCost: number) => {
    const variablePortion = (basePrice + prodCost) / 7;
    return variablePortion + fixedPortion;
  };

  const handleTierChange = (id: string, field: string, value: number) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const records = [
    { id: 'F-001', type: 'income', category: 'Shohibul Payment', from: 'Ahmad Sulaiman', amount: 'Rp 4.500.000', status: 'completed', date: '15 Mei' },
    { id: 'F-002', type: 'expense', category: 'Livestock DP', from: 'CV Ternak Berkah', amount: 'Rp 15.000.000', status: 'completed', date: '16 Mei' },
    { id: 'F-003', type: 'expense', category: 'Operational', from: 'Toko Plastik', amount: 'Rp 850.000', status: 'pending', date: '18 Mei' },
  ];

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Manajemen Keuangan</h1>
          <p className="text-slate-500 font-medium italic">Monitor arus kas, pembayaran supplier, dan urunan qurban.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Catat Transaksi
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                 <ArrowUpRight className="w-3 h-3" /> 12%
              </div>
           </div>
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pemasukan</div>
              <div className="text-2xl font-black text-slate-900">Rp 425.000.000</div>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                 <TrendingDown className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">
                 <ArrowDownRight className="w-3 h-3" /> 5%
              </div>
           </div>
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pengeluaran</div>
              <div className="text-2xl font-black text-slate-900">Rp 180.500.000</div>
           </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet className="w-24 h-24" />
           </div>
           <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Saldo Kas (Net)</div>
           <div className="text-3xl font-black text-white relative z-10">Rp 244.500.000</div>
           <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
              <span>Dana Amanah Terkumpul</span>
              <span className="text-emerald-400">On Track ✅</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* 🛠️ STEP 1: Global Shared Expenses */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                 <Calculator className="w-6 h-6 text-blue-600" /> 1. Biaya Operasional Bersama (Fixed)
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                 {[
                    { id: 'materials', label: 'Biaya Bahan (Plastik, Tali, dll)', icon: <Package className="w-4 h-4" /> },
                    { id: 'services', label: 'Biaya Jasa (Kordinator, Kebersihan)', icon: <Users className="w-4 h-4" /> },
                    { id: 'operational', label: 'Biaya Ops (Listrik, Tenda, ATK)', icon: <Settings className="w-4 h-4" /> },
                    { id: 'others', label: 'Biaya Lain-lain (Emergency)', icon: <AlertCircle className="w-4 h-4" /> },
                 ].map(item => (
                    <div key={item.id} className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">{item.icon} {item.label}</label>
                       <input 
                        type="number" 
                        value={(globalCosts as any)[item.id]} 
                        onChange={(e) => setGlobalCosts({...globalCosts, [item.id]: Number(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10" 
                       />
                    </div>
                 ))}
              </div>
              <div className="p-6 bg-slate-900 rounded-[2rem] flex justify-between items-center text-white">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Biaya Bersama</span>
                 <span className="text-lg font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalGlobalCost)}</span>
              </div>
           </div>

           {/* 🐄 STEP 2: Tiered Animal Planning */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                 <Scale className="w-6 h-6 text-emerald-600" /> 2. Perencanaan Kelas Sapi & Target
              </h2>
              
              <div className="space-y-6">
                 {tiers.map((tier) => (
                    <div key={tier.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 group hover:border-emerald-200 transition-all">
                       <div className="flex justify-between items-center">
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{tier.label}</h3>
                          <div className="flex items-center gap-3">
                             <label className="text-[9px] font-black text-slate-400 uppercase">Target Hewan</label>
                             <input 
                              type="number" 
                              value={tier.targetCount} 
                              onChange={(e) => handleTierChange(tier.id, 'targetCount', Number(e.target.value))}
                              className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-center font-black text-emerald-600 outline-none" 
                             />
                          </div>
                       </div>
                       
                       <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Harga Dasar Sapi</label>
                             <input 
                              type="number" 
                              value={tier.basePrice} 
                              onChange={(e) => handleTierChange(tier.id, 'basePrice', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Biaya Produksi (Per Ekor)</label>
                             <input 
                              type="number" 
                              value={tier.prodCost} 
                              onChange={(e) => handleTierChange(tier.id, 'prodCost', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10" 
                             />
                          </div>
                       </div>

                       <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urunan Akhir (Tier {tier.id})</div>
                             <div className="text-2xl font-black text-emerald-600">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(calculateUrunan(tier.basePrice, tier.prodCost))}
                             </div>
                          </div>
                          <div className="text-right space-y-1 opacity-60">
                             <div className="text-[8px] font-bold text-slate-500 uppercase">Portion Biaya Bersama</div>
                             <div className="text-xs font-black text-slate-700">+{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(fixedPortion)} / orang</div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                 <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                 <div className="space-y-1">
                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Analisa Planning:</h4>
                    <p className="text-xs text-blue-700 leading-relaxed font-medium italic">"Total Target: {totalAnimals} Sapi. Total Shohibul: {totalParticipants} orang. Biaya operasional bersama dibagi rata ke seluruh pengqurban untuk menjamin keadilan beban biaya tetap."</p>
                 </div>
              </div>
           </div>

           {/* Transaction History */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h2 className="font-black text-slate-900 uppercase tracking-tight">Transaksi Terkini</h2>
                 <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Download Laporan</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-4">ID / Tanggal</th>
                          <th className="px-4 py-4">Kategori</th>
                          <th className="px-4 py-4">Dari/Kepada</th>
                          <th className="px-4 py-4">Jumlah</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Aksi</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {records.map((r) => (
                         <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5">
                               <div className="text-xs font-black text-slate-800">{r.id}</div>
                               <div className="text-[10px] font-bold text-slate-400">{r.date} Mei 2026</div>
                            </td>
                            <td className="px-4 py-5">
                               <span className="text-[10px] font-black uppercase text-slate-400">{r.category}</span>
                            </td>
                            <td className="px-4 py-5">
                               <div className="text-xs font-bold text-slate-700">{r.from}</div>
                            </td>
                            <td className="px-4 py-5">
                               <div className={cn("text-sm font-black", r.type === 'income' ? 'text-emerald-600' : 'text-red-600')}>
                                  {r.type === 'income' ? '+' : '-'} {r.amount}
                               </div>
                            </td>
                            <td className="px-4 py-5">
                               <span className={cn(
                                 "px-3 py-1 rounded-full text-[8px] font-black uppercase",
                                 r.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                               )}>
                                 {r.status}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <button className="p-2 text-slate-300 hover:text-slate-900"><MoreVertical className="w-4 h-4" /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Shohibul Payment Status */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <Users className="w-5 h-5 text-blue-600" /> Status Pembayaran
              </h2>
              <div className="space-y-6">
                 {[
                   { label: 'Shohibul Lunas', count: 130, progress: 85, color: 'bg-emerald-500' },
                   { label: 'Shohibul Cicilan', count: 20, progress: 12, color: 'bg-orange-500' },
                   { label: 'Belum Bayar', count: 6, progress: 3, color: 'bg-red-500' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-500">{stat.label}</span>
                         <span className="text-slate-900">{stat.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full", stat.color)} style={{ width: `${stat.progress}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Supplier Payment Timeline */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <ShieldCheck className="w-5 h-5 text-emerald-600" /> Pembayaran Supplier
              </h2>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CV Ternak Berkah</div>
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-black text-slate-800">Rp 105.000.000</span>
                       <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Lunas ✅</span>
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peternakan Jaya</div>
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-black text-slate-800">Rp 45.000.000</span>
                       <span className="text-[8px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">DP Paid 🟡</span>
                    </div>
                 </div>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                 Bayar Pelunasan <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
