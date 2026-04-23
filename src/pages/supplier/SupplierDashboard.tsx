import React from 'react';
import { 
  TrendingUp, 
  Store, 
  Package, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Star, 
  MoreVertical, 
  LayoutGrid, 
  FileText, 
  Eye, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { SupplierAnimal, SupplierOrder } from '../../types';

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'stock' | 'orders' | 'finance'>('overview');

  const stats = [
    { label: 'Total Stok', value: '85', icon: <Store className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Terjual', value: '62', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Sisa Stok', value: '23', icon: <Package className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
  ];

  const animals: SupplierAnimal[] = [
    { id: 'S-001', type: 'sapi', breed: 'Limosin', weight: 520, age: 2.5, grade: 'premium', price: 28500000, status: 'sold', ownerId: 'sup1', photos: [] },
    { id: 'S-005', type: 'sapi', breed: 'Simental', weight: 500, age: 2.2, grade: 'premium', price: 26500000, status: 'booked', ownerId: 'sup1', photos: [] },
    { id: 'K-015', type: 'kambing', breed: 'PE', weight: 45, age: 1.5, grade: 'standar', price: 3500000, status: 'available', ownerId: 'sup1', photos: [] },
  ];

  const orders: SupplierOrder[] = [
    { id: 'ORD-448', buyerName: 'Masjid Ar-Rahman', animalIds: ['S-001', 'S-002'], totalPrice: 105000000, paidAmount: 50000000, escrowStatus: 'held', deliveryStatus: 'preparing', orderDate: '2026-05-20' },
    { id: 'ORD-445', buyerName: 'Masjid Al-Ikhlas', animalIds: ['S-005'], totalPrice: 45000000, paidAmount: 45000000, escrowStatus: 'released', deliveryStatus: 'arrived', orderDate: '2026-05-18' },
  ];

  return (
    <div className="space-y-8 pb-10 font-sans">
      {/* Profile & Navigation Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
                  <img src="https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Supplier" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-900 mb-1">CV Ternak Berkah</h1>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                     <div className="flex items-center gap-1 text-orange-500">
                        <Star className="w-3 h-3 fill-orange-500" /> 4.8 Rating
                     </div>
                     <div className="flex items-center gap-1 text-emerald-600">
                        <ShieldCheck className="w-3 h-3" /> Verified Seller
                     </div>
                     <div className="text-slate-400">📍 Boyolali, Jawa Tengah</div>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Animal
               </button>
               <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                  <Settings className="w-5 h-5" />
               </button>
            </div>
         </div>

         <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
              { id: 'stock', label: 'Live Stock', icon: <Store className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
              { id: 'finance', label: 'Finance', icon: <CreditCard className="w-4 h-4" /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                  activeTab === tab.id ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
         </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
           <div className="lg:col-span-2 space-y-8">
              <div className="grid sm:grid-cols-3 gap-6">
                 {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.color)}>
                          {stat.icon}
                       </div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                       <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    </div>
                 ))}
              </div>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-10 opacity-10">
                    <TrendingUp className="w-40 h-40" />
                 </div>
                 <h2 className="text-xl font-bold mb-8 flex items-center gap-2 uppercase tracking-tight">
                    <CreditCard className="w-5 h-5 text-emerald-400" /> Marketplace Performance
                 </h2>
                 <div className="grid sm:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                       <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Listing Views</div>
                          <div className="text-4xl font-black text-white">12.4K</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</div>
                          <div className="text-xl font-black text-emerald-400">4.2%</div>
                       </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                       <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Competitor Benchmark</h4>
                       <p className="text-xs text-slate-300 leading-relaxed font-medium">Harga Sapi Limosin Anda 5% lebih kompetitif dibanding rata-rata wilayah Boyolali.</p>
                       <button className="text-[9px] font-black text-white uppercase tracking-widest mt-4 underline underline-offset-4">Lihat Analisa Pasar</button>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8" />
                 </div>
                 <h4 className="font-black text-slate-900 uppercase text-sm mb-2">Certification Health</h4>
                 <p className="text-[10px] text-slate-500 font-medium mb-6">Pastikan seluruh hewan memiliki SKKH (Surat Keterangan Kesehatan Hewan) terbaru.</p>
                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                    <span>Certificated</span>
                    <span className="text-emerald-600">92%</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                 </div>
                 <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Update Certificates</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-300">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-slate-900 uppercase tracking-tight">Manajemen Hewan & Marketplace</h2>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Bulk Upload</button>
                 <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700">Add New Animal</button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <th className="px-8 py-5">Hewan</th>
                       <th className="px-4 py-5">Spec</th>
                       <th className="px-4 py-5">Price</th>
                       <th className="px-4 py-5">Status</th>
                       <th className="px-4 py-5">SKKH</th>
                       <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {animals.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative group-hover:shadow-lg transition-all">
                                  <img src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="Animal" />
                               </div>
                               <div>
                                  <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{a.id}</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">{a.breed}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-5">
                            <div className="text-xs font-black text-slate-700">{a.weight} Kg</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase">{a.grade}</div>
                         </td>
                         <td className="px-4 py-5">
                            <div className="text-xs font-black text-slate-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(a.price)}</div>
                         </td>
                         <td className="px-4 py-5">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                              a.status === 'available' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              a.status === 'booked' ? "bg-blue-50 text-blue-600 border-blue-100" :
                              "bg-slate-100 text-slate-400 border-slate-200"
                            )}>
                               {a.status}
                            </span>
                         </td>
                         <td className="px-4 py-5">
                            <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-black uppercase">
                               <ShieldCheck className="w-3 h-3" /> Verified
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-slate-300 hover:text-slate-900"><Eye className="w-4 h-4" /></button>
                               <button className="p-2 text-slate-300 hover:text-slate-900"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
           {orders.map(order => (
             <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.id} • {order.orderDate}</div>
                         <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{order.buyerName}</h3>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase border",
                        order.escrowStatus === 'held' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>
                        Escrow: {order.escrowStatus}
                      </span>
                   </div>
                   
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                         <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                         <div className="text-[9px] font-black text-slate-400 uppercase">Delivery Status</div>
                         <div className="text-sm font-bold text-slate-700 uppercase tracking-tight">{order.deliveryStatus}</div>
                      </div>
                      <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Update Status</button>
                   </div>

                   <div className="flex gap-4">
                      {order.animalIds.map(aid => (
                        <div key={aid} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 border border-slate-200">#{aid}</div>
                      ))}
                   </div>
                </div>

                <div className="w-full md:w-72 bg-slate-50 rounded-3xl p-6 flex flex-col justify-between border border-slate-100">
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-400">Order Value</span>
                         <span className="text-slate-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-400">Payment Paid</span>
                         <span className="text-emerald-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.paidAmount)}</span>
                      </div>
                      <div className="h-[1px] bg-slate-200"></div>
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-400">Remaining</span>
                         <span className="text-orange-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.totalPrice - order.paidAmount)}</span>
                      </div>
                   </div>
                   <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      Manage Transaction <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-300">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Escrow Balance</h2>
                    <p className="text-xs text-slate-500 font-medium italic">Dana yang tersimpan aman di sistem Qurbanesia sebelum dicairkan.</p>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available for Withdrawal</div>
                    <div className="text-4xl font-black text-emerald-600">Rp 1.540.000.000</div>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-xl space-y-4">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Withdrawal Status</h4>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                       </div>
                       <div>
                          <div className="text-lg font-black italic">No pending requests</div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Your last withdraw: Rp 120M (15 May)</p>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all mt-4">
                       Request New Withdrawal
                    </button>
                 </div>
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Bank Account</h4>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                       </div>
                       <div>
                          <div className="text-sm font-black text-slate-800 uppercase tracking-tight">Bank Syariah Indonesia</div>
                          <div className="text-xs font-bold text-slate-400 tracking-tighter">1234 **** **** 9087 (Verified)</div>
                       </div>
                    </div>
                    <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Change Account</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
