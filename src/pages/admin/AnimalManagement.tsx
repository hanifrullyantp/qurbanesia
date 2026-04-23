import React from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  TrendingUp, 
  Package, 
  History, 
  X, 
  Eye, 
  Users, 
  MessageCircle, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { MasjidAnimal } from '../../types';
import { listAnimalParticipants, listAnimals } from '../../services/animals';
import { assignShohibulToAnimal, createAnimal, listAssignableShohibuls } from '../../services/adminAnimals';

const AnimalManagement = () => {
  const [selectedAnimal, setSelectedAnimal] = React.useState<MasjidAnimal | null>(null);
  const [viewingShohibul, setViewingShohibul] = React.useState<{
    id: string;
    name: string;
    phone: string;
    status: string;
    totalAmount: number;
    paidAmount: number;
    niat?: string;
    address?: string;
  } | null>(null);

  const [animals, setAnimals] = React.useState<MasjidAnimal[]>([]);
  const [participantsByAnimal, setParticipantsByAnimal] = React.useState<Record<string, any[]>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newAnimal, setNewAnimal] = React.useState({
    code: '',
    name: '',
    type: 'sapi' as 'sapi' | 'kambing' | 'domba',
    breed: '',
    weight_label: '',
    age_label: '',
    source: '',
    max_capacity: 7,
  });
  const [assignOpenForAnimalId, setAssignOpenForAnimalId] = React.useState<string | null>(null);
  const [assignCandidates, setAssignCandidates] = React.useState<any[]>([]);
  const [assignLoading, setAssignLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const rows = await listAnimals();
        if (cancelled) return;
        setAnimals(
          rows.map((a) => ({
            id: a.id,
            name: a.name ?? a.code,
            type: a.type,
            breed: a.breed ?? '-',
            weight: a.weight_label ?? '-',
            status: a.status as any,
            photo:
              a.photo_path
                ? a.photo_path
                : 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400',
            shohibulIds: [],
            maxCapacity: a.max_capacity,
            source: a.source ?? '-',
            age: a.age_label ?? '-',
            code: a.code,
          })),
        );
        setError(null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Gagal memuat data hewan');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getParticipants = (animalId: string) => participantsByAnimal[animalId] ?? [];

  const stats = [
    { label: 'Total Sapi', value: '42', icon: <TrendingUp className="w-5 h-5" />, color: 'blue' },
    { label: 'Total Kambing', value: '38', icon: <Package className="w-5 h-5" />, color: 'orange' },
    { label: 'Sudah Sembelih', value: '18', icon: <CheckCircle2 className="w-5 h-5" />, color: 'emerald' },
    { label: 'Belum Tiba', value: '5', icon: <Clock className="w-5 h-5" />, color: 'red' },
  ];

  return (
    <div className="space-y-8 pb-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Manajemen Hewan</h1>
          <p className="text-slate-500 font-medium">Monitoring stok, kesehatan, dan alokasi shohibul.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-600 border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <QrCode className="w-4 h-4" /> Scan QR
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" /> Tambah Hewan
          </button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
               <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  stat.color === 'orange' ? "bg-orange-50 text-orange-600" :
                  stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                  "bg-red-50 text-red-600"
               )}>
                  {stat.icon}
               </div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
               <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
         ))}
      </div>

      {/* Animal Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
         {loading && (
           <div className="md:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-10 text-center text-slate-500 font-bold">
             Memuat data hewan...
           </div>
         )}
         {error && !loading && (
           <div className="md:col-span-2 bg-red-50 rounded-[3rem] border border-red-100 p-10 text-center text-red-700 font-bold">
             {error}
           </div>
         )}
         {animals.map((animal) => {
            const participants = getParticipants(animal.id);
            const isFull = participants.length >= animal.maxCapacity;

            return (
              <div key={animal.id} className="bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all group overflow-hidden">
                 {/* Card Header: Animal Info */}
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                       <div className="w-20 h-20 bg-white rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group-hover:scale-105 transition-transform">
                          <img src={animal.photo} className="w-full h-full object-cover" alt={animal.name} />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-2xl font-black text-slate-900 tracking-tight">{animal.name}</h3>
                             <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                               animal.status === 'selesai' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"
                             )}>{animal.status}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <span>{(animal as any).code ?? animal.id}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                             <span>{animal.weight}</span>
                          </div>
                       </div>
                    </div>
                    <button
                      onClick={async () => {
                        setSelectedAnimal(animal);
                        try {
                          const rows = await listAnimalParticipants(animal.id);
                          setParticipantsByAnimal((prev) => ({ ...prev, [animal.id]: rows }));
                        } catch {
                          // ignore for now; UI still works without participants
                        }
                      }}
                      className="p-3 bg-white text-slate-400 border border-slate-200 rounded-2xl hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all"
                    >
                       <Eye className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Participants Section */}
                 <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" /> Daftar Pengqurban ({participants.length}/{animal.maxCapacity})
                       </h4>
                       {!isFull && (
                         <button
                           onClick={async () => {
                             setAssignOpenForAnimalId(animal.id);
                             setAssignLoading(true);
                             try {
                               const cands = await listAssignableShohibuls();
                               setAssignCandidates(cands);
                             } finally {
                               setAssignLoading(false);
                             }
                           }}
                           className="text-[10px] font-black text-emerald-600 uppercase hover:underline"
                         >
                           + Tambah
                         </button>
                       )}
                    </div>

                    <div className="space-y-3">
                       {participants.length === 0 ? (
                         <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 text-[10px] font-bold text-slate-400 uppercase">Belum ada pengqurban assigned.</div>
                       ) : (
                         participants.map((p, idx) => (
                           <div 
                            key={p.id} 
                            onClick={() => setViewingShohibul(p)}
                            className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-emerald-100 transition-all group/item cursor-pointer"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">{idx+1}</div>
                                 <div>
                                    <div className="text-sm font-black text-slate-800 group-hover/item:text-emerald-600">{p.name}</div>
                                    <div className="flex items-center gap-2">
                                       <span className={cn(
                                         "text-[8px] font-black uppercase",
                                         p.status === 'lunas' ? "text-emerald-600" : "text-orange-500"
                                       )}>{p.status}</span>
                                       <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                       <span className="text-[8px] font-bold text-slate-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.paidAmount)} / {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.totalAmount)}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                 <button className="p-2 bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-100 active:scale-90 transition-transform">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                         ))
                       )}
                    </div>

                    {/* Progress Bar for Animal Completion */}
                    <div className="space-y-2 pt-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-slate-400">Total Pembayaran</span>
                          <span className="text-slate-900">
                             {Math.round((participants.reduce((acc, p) => acc + p.paidAmount, 0) / (animal.maxCapacity * 4500000)) * 100) || 0}%
                          </span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(participants.reduce((acc, p) => acc + p.paidAmount, 0) / (animal.maxCapacity * 4500000)) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                 </div>
              </div>
            );
         })}

         <button className="border-4 border-dashed border-slate-100 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-emerald-500 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all group">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all">
               <Plus className="w-8 h-8" />
            </div>
            <span className="font-black text-xs uppercase tracking-widest">Daftarkan Sapi/Kambing Baru</span>
         </button>
      </div>

      {/* Animal Detail Slide-over */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedAnimal(null)}></div>
           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black">
                       {((selectedAnimal as any).code ?? selectedAnimal.id).toString().charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{(selectedAnimal as any).code ?? selectedAnimal.id}</h2>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedAnimal.type}</div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedAnimal(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8 space-y-10">
                 <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg">
                    <img src={selectedAnimal.photo} className="w-full h-full object-cover" alt="Main" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berat Aktual</div>
                       <div className="text-2xl font-black text-slate-900 mt-1">{selectedAnimal.weight}</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Umur</div>
                       <div className="text-2xl font-black text-slate-900 mt-1">{selectedAnimal.age || '-'}</div>
                    </div>
                 </div>

                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <History className="w-4 h-4 text-blue-600" /> Update Harian Panitia
                    </h3>
                    <div className="space-y-4">
                       {(selectedAnimal.dailyUpdates || []).map((update: any, i: number) => (
                         <div key={i} className="flex gap-4 items-start p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                               <img src={update.photo} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-black text-slate-400 uppercase">{update.date}</span>
                                  <span className="text-[10px] font-bold text-emerald-600 italic">{update.weight}</span>
                               </div>
                               <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{update.msg}"</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>

                 <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between">
                    <div className="space-y-1">
                       <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sertifikat Medis</div>
                       <div className="text-sm font-black text-emerald-900">{selectedAnimal.healthCert || 'Verified by Dept. Pertanian'}</div>
                    </div>
                    <button className="px-4 py-2 bg-white text-emerald-600 rounded-xl text-[10px] font-black uppercase shadow-sm border border-emerald-100">Lihat File</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Shohibul Detail Side-over (Reused Logic) */}
      {viewingShohibul && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingShohibul(null)}></div>
           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-3xl flex items-center justify-center font-black text-lg">
                       {viewingShohibul.name.charAt(5)}
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{viewingShohibul.name}</h2>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{viewingShohibul.id}</div>
                    </div>
                 </div>
                 <button onClick={() => setViewingShohibul(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8 space-y-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niat Qurban</div>
                       <p className="text-sm font-black text-slate-800 italic mt-1">"{viewingShohibul.niat}"</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Bayar</div>
                       <div className="mt-2">
                         <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {viewingShohibul.status}
                         </span>
                       </div>
                    </div>
                 </div>

                 <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-emerald-600" /> Kontak & Alamat
                    </h3>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <MessageCircle className="w-4 h-4 text-emerald-500" /> {viewingShohibul.phone}
                       </div>
                       <div className="flex items-start gap-3 text-sm font-medium text-slate-500">
                          <MapPin className="w-4 h-4 text-slate-300 mt-1" /> {viewingShohibul.address || 'Alamat belum diisi'}
                       </div>
                    </div>
                 </section>

                 <div className="pt-10 border-t border-slate-100">
                    <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                       <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add Animal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <div className="font-black uppercase tracking-widest text-sm">Tambah Hewan</div>
              <button onClick={() => setIsAddOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode (S-001)</label>
                  <input value={newAnimal.code} onChange={(e) => setNewAnimal({ ...newAnimal, code: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama</label>
                  <input value={newAnimal.name} onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis</label>
                  <select value={newAnimal.type} onChange={(e) => setNewAnimal({ ...newAnimal, type: e.target.value as any, max_capacity: e.target.value === 'sapi' ? 7 : 1 })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none">
                    <option value="sapi">Sapi</option>
                    <option value="kambing">Kambing</option>
                    <option value="domba">Domba</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasitas</label>
                  <input type="number" value={newAnimal.max_capacity} onChange={(e) => setNewAnimal({ ...newAnimal, max_capacity: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Breed</label>
                  <input value={newAnimal.breed} onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berat (label)</label>
                  <input value={newAnimal.weight_label} onChange={(e) => setNewAnimal({ ...newAnimal, weight_label: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Umur (label)</label>
                  <input value={newAnimal.age_label} onChange={(e) => setNewAnimal({ ...newAnimal, age_label: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sumber</label>
                  <input value={newAnimal.source} onChange={(e) => setNewAnimal({ ...newAnimal, source: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" />
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    await createAnimal(newAnimal as any);
                    const rows = await listAnimals();
                    setAnimals(
                      rows.map((a) => ({
                        id: a.id,
                        name: a.name ?? a.code,
                        type: a.type,
                        breed: a.breed ?? '-',
                        weight: a.weight_label ?? '-',
                        status: a.status as any,
                        photo: a.photo_path ? a.photo_path : 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400',
                        shohibulIds: [],
                        maxCapacity: a.max_capacity,
                        source: a.source ?? '-',
                        age: a.age_label ?? '-',
                        code: a.code,
                      })),
                    );
                    setIsAddOpen(false);
                    setNewAnimal({ code: '', name: '', type: 'sapi', breed: '', weight_label: '', age_label: '', source: '', max_capacity: 7 });
                  } catch (e: any) {
                    alert(e?.message ?? 'Gagal menambah hewan');
                  }
                }}
                className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Shohibul Modal */}
      {assignOpenForAnimalId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAssignOpenForAnimalId(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <div className="font-black uppercase tracking-widest text-sm">Assign Shohibul</div>
              <button onClick={() => setAssignOpenForAnimalId(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              {assignLoading && <div className="text-slate-500 font-bold">Memuat kandidat...</div>}
              {!assignLoading &&
                assignCandidates.map((s) => (
                  <button
                    key={s.id}
                    onClick={async () => {
                      try {
                        await assignShohibulToAnimal({ animalId: assignOpenForAnimalId, shohibulId: s.id });
                        const rows = await listAnimalParticipants(assignOpenForAnimalId);
                        setParticipantsByAnimal((prev) => ({ ...prev, [assignOpenForAnimalId]: rows }));
                        setAssignOpenForAnimalId(null);
                      } catch (e: any) {
                        alert(e?.message ?? 'Gagal assign');
                      }
                    }}
                    className="w-full p-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl text-left flex items-center justify-between"
                  >
                    <div>
                      <div className="font-black text-slate-800 text-sm">
                        {s.name} <span className="text-slate-400 text-xs">({s.code})</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {s.phone} • {s.status}
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase">Pilih</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <Package className="w-32 h-32" />
            </div>
            <div className="space-y-2 relative z-10">
               <h3 className="text-xl font-black uppercase tracking-tight">Cetak Label Daging</h3>
               <p className="text-slate-400 text-xs font-medium">Batch printing label untuk paket daging shohibul.</p>
               <button className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:underline">Mulai Cetak →</button>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between group cursor-pointer">
            <div className="space-y-2">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Input Hasil Yield</h3>
               <p className="text-slate-500 text-xs font-medium">Catat berat daging & jeroan setelah pemotongan.</p>
               <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-4 hover:underline">Buka Form Input →</button>
            </div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
               <TrendingUp className="w-8 h-8" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnimalManagement;
