import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  MessageCircle,
  FileText,
  UserPlus,
  ArrowRight,
  X,
  CreditCard,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Users,
  Phone
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { ShohibulStatus } from '../../types';
import { createShohibul, listShohibuls } from '../../services/shohibuls';
import { getSignedProofUrl, listMyPayments } from '../../services/payments';

const ShohibulManagement = () => {
  const [selectedShohibul, setSelectedShohibul] = React.useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Form State for Adding
  const [newShohibul, setNewShohibul] = React.useState({
    name: '',
    phone: '',
    qurbanType: 'sapi_1_7',
    grade: 'premium',
    niat: '',
    delivery: 'ambil_sendiri',
    totalAmount: 4500000
  });

  const [shohibuls, setShohibuls] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const rows = await listShohibuls();
        if (cancelled) return;
        setShohibuls(
          rows.map((s) => ({
            id: s.code,
            dbId: s.id,
            name: s.name,
            phone: s.phone,
            email: s.email ?? undefined,
            address: s.address ?? undefined,
            qurbanType: s.qurban_type,
            grade: s.grade,
            niat: s.niat ?? '',
            meatPreference: { delivery: s.delivery_pref, wantsOffal: s.wants_offal, wantsSkin: s.wants_skin },
            status: s.status,
            totalAmount: s.total_amount_idr,
            paidAmount: s.paid_amount_idr,
            registrationDate: '',
            payments: [],
          })),
        );
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Gagal memuat data shohibul');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveShohibul = () => {
    (async () => {
      try {
        await createShohibul({
          name: newShohibul.name,
          phone: newShohibul.phone,
          qurban_type: newShohibul.qurbanType as any,
          grade: newShohibul.grade as any,
          niat: newShohibul.niat,
          delivery_pref: newShohibul.delivery as any,
          total_amount_idr: Number(newShohibul.totalAmount),
        });
        const rows = await listShohibuls();
        setShohibuls(
          rows.map((s) => ({
            id: s.code,
            dbId: s.id,
            name: s.name,
            phone: s.phone,
            email: s.email ?? undefined,
            address: s.address ?? undefined,
            qurbanType: s.qurban_type,
            grade: s.grade,
            niat: s.niat ?? '',
            meatPreference: { delivery: s.delivery_pref, wantsOffal: s.wants_offal, wantsSkin: s.wants_skin },
            status: s.status,
            totalAmount: s.total_amount_idr,
            paidAmount: s.paid_amount_idr,
            registrationDate: '',
            payments: [],
          })),
        );
        setIsAddModalOpen(false);
        setNewShohibul({ name: '', phone: '', qurbanType: 'sapi_1_7', grade: 'premium', niat: '', delivery: 'ambil_sendiri', totalAmount: 4500000 });
      } catch (e: any) {
        alert(e?.message ?? 'Gagal menambah shohibul');
      }
    })();
  };

  const stats = [
    { label: 'Total Shohibul', value: shohibuls.length.toString(), icon: <Users className="w-4 h-4" />, color: 'text-slate-900' },
    { label: 'Lunas', value: shohibuls.filter(s => s.status === 'lunas').length.toString(), icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-600' },
    { label: 'Cicilan/DP', value: shohibuls.filter(s => s.status === 'cicilan' || s.status === 'dp').length.toString(), icon: <Clock className="w-4 h-4" />, color: 'text-orange-500' },
    { label: 'Belum assigned', value: shohibuls.filter(s => !s.animalId).length.toString(), icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-500' },
  ];

  const getStatusBadge = (status: ShohibulStatus) => {
    switch (status) {
      case 'lunas': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'cicilan': return "bg-orange-50 text-orange-600 border-orange-100";
      case 'dp': return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <div className="space-y-8 pb-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Data Shohibul</h1>
          <p className="text-slate-500 font-medium">Manajemen pendaftaran, pembayaran, dan alokasi hewan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
            <FileText className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            <UserPlus className="w-4 h-4" /> Daftar Shohibul
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50", stat.color.replace('text', 'bg').replace('600', '50').replace('500', '50'))}>
                {stat.icon}
             </div>
             <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                <div className={cn("text-xl font-black", stat.color)}>{stat.value}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
           <div className="relative flex-1 w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari nama atau no WhatsApp..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all shadow-inner" />
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100">
                 <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                 <MessageCircle className="w-4 h-4 text-emerald-400" /> Broadcast
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           {loading && <div className="p-10 text-center text-slate-500 font-bold">Memuat data...</div>}
           {error && !loading && <div className="p-10 text-center text-red-700 font-bold bg-red-50 border-t border-red-100">{error}</div>}
           <table className="w-full">
             <thead>
               <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                 <th className="px-8 py-5">Nama Shohibul</th>
                 <th className="px-4 py-5">Qurban & Grade</th>
                 <th className="px-4 py-5">Status Bayar</th>
                 <th className="px-4 py-5">Terbayar</th>
                 <th className="px-4 py-5">Alokasi</th>
                 <th className="px-8 py-5 text-right">Aksi</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {shohibuls.map((s) => (
                 <tr
                   key={s.id}
                   onClick={async () => {
                     try {
                       const pays = await listMyPayments(s.dbId);
                       const enriched = await Promise.all(
                         pays.map(async (p) => ({
                           id: p.id,
                           amount: p.amount_idr,
                           date: new Date(p.paid_at).toISOString().slice(0, 10),
                           method: p.method ?? '-',
                           proofUrl: p.proof_path ? await getSignedProofUrl(p.proof_path) : undefined,
                           status: p.status,
                           rejectReason: p.reject_reason ?? undefined,
                         })),
                       );
                       setSelectedShohibul({ ...s, payments: enriched });
                     } catch {
                       setSelectedShohibul(s);
                     }
                   }}
                   className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                 >
                   <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs border border-slate-200 uppercase">
                            {s.name.charAt(5)}
                         </div>
                         <div>
                            <div className="font-black text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">{s.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{s.phone}</div>
                         </div>
                      </div>
                   </td>
                   <td className="px-4 py-5">
                      <div className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                         {s.qurbanType.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase italic">{s.grade}</div>
                   </td>
                   <td className="px-4 py-5">
                      <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", getStatusBadge(s.status))}>
                         {s.status}
                      </span>
                   </td>
                   <td className="px-4 py-5">
                      <div className="text-xs font-black text-slate-900">
                         {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(s.paidAmount)}
                      </div>
                      <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                         <div className="h-full bg-emerald-500" style={{ width: `${(s.paidAmount/s.totalAmount)*100}%` }}></div>
                      </div>
                   </td>
                   <td className="px-4 py-5">
                      {s.animalId ? (
                         <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> {s.animalId}
                         </div>
                      ) : (
                         <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-2 py-1 rounded-lg border border-red-100 w-fit">
                            <AlertCircle className="w-3 h-3" /> No Animal
                         </div>
                      )}
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

      {/* Add Shohibul Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                       <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-black text-lg uppercase tracking-tight">Daftar Shohibul Baru</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Input Manual oleh Admin</p>
                    </div>
                 </div>
                 <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                       <input 
                        type="text" 
                        value={newShohibul.name}
                        onChange={(e) => setNewShohibul({...newShohibul, name: e.target.value})}
                        placeholder="Misal: Bpk Ahmad" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No WhatsApp</label>
                       <input 
                        type="text" 
                        value={newShohibul.phone}
                        onChange={(e) => setNewShohibul({...newShohibul, phone: e.target.value})}
                        placeholder="0812xxxx" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Qurban</label>
                       <select 
                        value={newShohibul.qurbanType}
                        onChange={(e) => setNewShohibul({...newShohibul, qurbanType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none"
                       >
                          <option value="sapi_1_7">Sapi (1/7 Bagian)</option>
                          <option value="kambing">Kambing</option>
                          <option value="domba">Domba</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</label>
                       <select 
                        value={newShohibul.grade}
                        onChange={(e) => setNewShohibul({...newShohibul, grade: e.target.value as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none"
                       >
                          <option value="ekonomi">Ekonomi</option>
                          <option value="standar">Standar</option>
                          <option value="premium">Premium</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Tagihan (IDR)</label>
                    <input
                      type="number"
                      value={newShohibul.totalAmount}
                      onChange={(e) => setNewShohibul({ ...newShohibul, totalAmount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niat Qurban Atas Nama</label>
                    <textarea 
                      value={newShohibul.niat}
                      onChange={(e) => setNewShohibul({...newShohibul, niat: e.target.value})}
                      placeholder="Contoh: Budi bin Ahmad & Keluarga" 
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                    ></textarea>
                 </div>
                 <button 
                  onClick={handleSaveShohibul}
                  className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95"
                 >
                    Daftarkan & Kirim WA Konfirmasi
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Shohibul Detail Side-over */}
      {selectedShohibul && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedShohibul(null)}></div>
           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-3xl flex items-center justify-center font-black text-lg shadow-xl shadow-emerald-500/20">
                       {selectedShohibul.name.charAt(5)}
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedShohibul.name}</h2>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedShohibul.id}</div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedShohibul(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8 space-y-10">
                 {/* Quick Info Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-1">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niat Qurban</div>
                       <p className="text-sm font-black text-slate-800 leading-tight italic">"{selectedShohibul.niat}"</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-1">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Bayar</div>
                       <span className={cn("inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mt-2", getStatusBadge(selectedShohibul.status))}>
                          {selectedShohibul.status}
                       </span>
                    </div>
                 </div>

                 {/* Tabular Details */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <FileText className="w-4 h-4 text-emerald-600" /> Informasi Lengkap
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Kontak WhatsApp</div>
                          <div className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                             <Phone className="w-3.5 h-3.5" /> {selectedShohibul.phone}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Email</div>
                          <div className="text-sm font-bold text-slate-700">{selectedShohibul.email || '-'}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Alamat</div>
                          <div className="text-sm font-medium text-slate-600 flex items-start gap-2">
                             <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> {selectedShohibul.address || '-'}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Daging</div>
                          <div className="text-xs font-black text-slate-800 uppercase tracking-tighter">
                             {selectedShohibul.meatPreference.delivery.replace('_', ' ')} • {selectedShohibul.meatPreference.wantsOffal ? '+Jeroan' : 'Daging Saja'}
                          </div>
                       </div>
                    </div>
                 </section>

                 {/* Animal Assignment Selection */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Users className="w-4 h-4 text-blue-600" /> Alokasi Kelompok Hewan
                    </h3>
                    {selectedShohibul.animalId ? (
                       <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 font-black">S</div>
                             <div>
                                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Animal Allocated</div>
                                <div className="text-sm font-black text-blue-900">{selectedShohibul.animalId} • Limosin Premium</div>
                             </div>
                          </div>
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ubah Alokasi</button>
                       </div>
                    ) : (
                       <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center gap-4 text-center">
                          <AlertCircle className="w-8 h-8 text-red-400" />
                          <div>
                             <p className="text-xs font-bold text-slate-600">Belum Ada Hewan</p>
                             <p className="text-[10px] text-slate-400 mt-1">Masukkan shohibul ini ke dalam kelompok sapi atau kambing.</p>
                          </div>
                          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Assign ke Hewan</button>
                       </div>
                    )}
                 </section>

                 {/* Payment History */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <CreditCard className="w-4 h-4 text-orange-500" /> Riwayat Pembayaran
                    </h3>
                    <div className="space-y-4">
                       {selectedShohibul.payments.map((p, i) => (
                         <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                  {p.status === 'verified' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  ) : p.status === 'rejected' ? (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-orange-500" />
                                  )}
                               </div>
                               <div>
                                  <div className="text-sm font-black text-slate-800">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.amount)}</div>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{p.method} • {p.date}</div>
                                  <div className="text-[9px] font-black uppercase tracking-widest mt-1">
                                    {p.status === 'verified' ? (
                                      <span className="text-emerald-600">verified</span>
                                    ) : p.status === 'rejected' ? (
                                      <span className="text-red-600">rejected</span>
                                    ) : (
                                      <span className="text-orange-600">submitted</span>
                                    )}
                                    {p.status === 'rejected' && p.rejectReason && (
                                      <span className="text-slate-400 font-bold normal-case ml-2">({p.rejectReason})</span>
                                    )}
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {p.proofUrl && (
                                <a className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline" href={p.proofUrl} target="_blank" rel="noreferrer">
                                  Lihat Bukti <ExternalLink className="w-3 inline" />
                                </a>
                              )}
                            </div>
                         </div>
                       ))}
                       <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex justify-between items-center shadow-xl">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Total Tagihan</div>
                             <div className="text-2xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedShohibul.totalAmount)}</div>
                          </div>
                          <div className="text-right space-y-1">
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sisa</div>
                             <div className="text-lg font-black text-orange-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedShohibul.totalAmount - selectedShohibul.paidAmount)}</div>
                          </div>
                       </div>
                    </div>
                 </section>

                 <div className="pt-10 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <button className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                       <MessageCircle className="w-4 h-4" /> Hubungi WhatsApp
                    </button>
                    <button className="py-4 bg-slate-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all">
                       Hapus Shohibul
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ShohibulManagement;
