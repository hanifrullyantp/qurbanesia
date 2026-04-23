import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Camera, 
  ChevronRight, 
  Play, 
  List, 
  History, 
  Info, 
  ShieldCheck,
  Users,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { listActiveAnimalQueue } from '../../services/opsTracking';

const JagalDashboard = () => {
  const [queue, setQueue] = React.useState<any[]>([]);
  const [loadingQueue, setLoadingQueue] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingQueue(true);
        const rows = await listActiveAnimalQueue();
        if (cancelled) return;
        const sapi = rows.filter((a) => a.type === 'sapi');
        setQueue(
          sapi.map((a: any, idx: number) => ({
            id: a.id,
            label: `#${idx + 1} Sapi`,
            time: '-',
            status: a.status === 'sedang_disembelih' ? 'active' : a.status === 'selesai' ? 'done' : 'pending',
            code: a.code,
          })),
        );
      } finally {
        if (!cancelled) setLoadingQueue(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const shohibulList = [
    'Ahmad bin Salim',
    'Hendra Wijaya',
    'Irfan Hakim',
    'Joko Widodo',
    'Kurniawan',
    'Lukman Hakim',
    'Muhammad Rizki'
  ];

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Jagal Header */}
      <header className="bg-slate-900 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=hasan" alt="Ust. Hasan" />
             </div>
             <div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Jagal Utama</div>
                <div className="font-black text-lg text-white">Ust. Hasan</div>
             </div>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-white/5">
             Al-Ikhlas
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">08:15 WIB</span>
           </div>
           <div className="flex gap-4">
              <div className="text-center">
                 <div className="text-[8px] font-black text-slate-500 uppercase">Sapi</div>
                 <div className="text-xs font-black text-emerald-400">5/42</div>
              </div>
              <div className="text-center border-l border-white/10 pl-4">
                 <div className="text-[8px] font-black text-slate-500 uppercase">Kambing</div>
                 <div className="text-xs font-black text-slate-400">0/38</div>
              </div>
           </div>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Slaughter Queue */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <List className="w-3 h-3" /> Antrian Sembelih
            </h2>
            <span className="text-[10px] font-black text-emerald-600 uppercase">35 Lagi</span>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="max-h-48 overflow-y-auto scrollbar-hide divide-y divide-slate-50">
                {loadingQueue && <div className="p-4 text-slate-500 font-bold">Memuat antrian...</div>}
                {queue.map((item) => (
                  <div key={item.id} className={cn(
                    "flex items-center justify-between p-4 transition-colors",
                    item.status === 'active' ? "bg-emerald-50" : "bg-white"
                  )}>
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "w-8 h-8 rounded-lg flex items-center justify-center border-2",
                         item.status === 'done' ? "bg-emerald-500 border-emerald-500 text-white" :
                         item.status === 'active' ? "bg-white border-emerald-500 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" :
                         "bg-white border-slate-100 text-slate-300"
                       )}>
                          {item.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-black">{item.id.split('-')[1]}</span>}
                       </div>
                       <div>
                          <div className={cn("text-xs font-black", item.status === 'done' ? "text-slate-400" : "text-slate-800")}>{item.label} {item.code}</div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase">{item.time} WIB • {item.status === 'active' ? 'NOW' : item.status.toUpperCase()}</div>
                       </div>
                    </div>
                    {item.status === 'active' && <div className="text-[10px] font-black text-emerald-600 uppercase italic">Proses</div>}
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Current Animal Detail */}
        <section className="space-y-4">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sapi #S-005 (Sekarang)</div>
           <div className="bg-white rounded-[2rem] border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-emerald-50/30 flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Target Sembelih</div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">SAPI #S-005</h3>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimasi</div>
                    <div className="text-lg font-black text-slate-900">500 Kg</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">Coklat Tua</div>
                 </div>
              </div>

              <div className="p-6 space-y-6">
                 {/* Shohibul List */}
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Users className="w-3.5 h-3.5" /> Shohibul (Niat Qurban)
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                       {shohibulList.map((name, i) => (
                         <div key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                            <span className="text-[8px] text-slate-300">{i+1}.</span> {name}
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Sharia Checklist */}
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5" /> Checklist Syar'i (WAJIB)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                       {['Hewan Layak', 'Arah Kiblat', 'Pisau Tajam', 'Niat Dibacakan'].map((item, i) => (
                         <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                               <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[9px] font-black text-slate-600 uppercase">{item}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="space-y-3 pt-2">
                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                       <Camera className="w-4 h-4" /> AMBIL FOTO PRE-SEMBELIH
                    </button>
                    <Link to="/jagal/process/S-005" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                       <Play className="w-4 h-4 fill-white" /> MULAI PENYEMBELIHAN
                    </Link>
                 </div>
              </div>
           </div>
        </section>

        {/* Info Alert */}
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
           <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
           <p className="text-[10px] font-medium text-orange-800 leading-relaxed">
             Pastikan foto pre-sembelih terlihat jelas sebelum menekan tombol mulai. Foto akan langsung terkirim ke WhatsApp shohibul.
           </p>
        </div>
      </div>

      {/* Bottom Nav Jagal */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 max-w-md mx-auto">
         <button className="flex flex-col items-center gap-1 text-emerald-600">
            <List className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Antrian</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <Camera className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Foto</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <History className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Riwayat</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <Info className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Fikih</span>
         </button>
      </nav>
    </div>
  );
};

export default JagalDashboard;
