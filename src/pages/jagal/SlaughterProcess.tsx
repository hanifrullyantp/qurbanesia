import React from 'react';
import { 
  ChevronLeft, 
  Clock, 
  Camera, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../../utils/cn';

const SlaughterProcess = () => {
  const { id } = useParams();
  const [seconds, setSeconds] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans">
      <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-30 flex items-center justify-between">
         <Link to="/jagal" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
         </Link>
         <h1 className="font-black text-slate-800 uppercase tracking-widest text-sm">PROSES SEMBELIH - {id}</h1>
         <div className="w-10"></div>
      </header>

      <div className="p-5 space-y-6">
        {/* Step 1 & 2 Completed Summary */}
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
           </div>
           <div>
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Langkah 1 & 2</div>
              <h3 className="font-black text-emerald-900 leading-tight">Checklist & Foto Awal SELESAI</h3>
           </div>
        </div>

        {/* Step 3: Timer */}
        <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Clock className="w-24 h-24" />
           </div>
           <div className="text-center relative z-10 space-y-6">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Waktu Berjalan</div>
              <div className="text-5xl font-black tabular-nums tracking-tighter">{formatTime(seconds)}</div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 inline-block">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimulai Pada: <span className="text-white ml-2">08:36 WIB</span></p>
              </div>
           </div>
        </section>

        {/* Step 4: Sharia Confirmation */}
        <section className="space-y-4">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Langkah 4: Konfirmasi Fisik</div>
           <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              {[
                'Darah berhenti mengalir',
                'Hewan sudah tidak bergerak',
                'Refleks mata sudah hilang'
              ].map((text, i) => (
                <button key={i} className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                   <div className="w-6 h-6 rounded-lg border-2 border-slate-200 group-hover:border-emerald-500 bg-white flex items-center justify-center transition-all">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100" />
                   </div>
                   <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{text}</span>
                </button>
              ))}
           </div>
        </section>

        {/* Step 5: Post-Slaughter Photo */}
        <section className="space-y-4">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Langkah 5: Foto Selesai</div>
           <button className="w-full aspect-video bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all">
                 <Camera className="w-8 h-8" />
              </div>
              <span className="font-black text-[10px] uppercase tracking-widest">AMBIL FOTO POST-SEMBELIH</span>
           </button>
        </section>

        {/* Step 6: Handover */}
        <section className="space-y-4 pt-4">
           <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tujuan Berikutnya</div>
                    <div className="text-xs font-black text-slate-800 uppercase">Div. Pengulitan & Pemotongan</div>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={() => setIsActive(false)}
             className="w-full py-5 bg-emerald-600 text-white rounded-[2.5rem] font-black text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
           >
              <CheckCircle2 className="w-5 h-5" /> KONFIRMASI SELESAI
           </button>
        </section>

        {/* Info Disclaimer */}
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
           <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
           <p className="text-[10px] font-medium text-blue-800 leading-relaxed italic">
              "Data penyembelihan akan tercatat permanen di sistem sebagai bukti amanah dan kesesuaian syariat Islam."
           </p>
        </div>
      </div>
    </div>
  );
};

export default SlaughterProcess;
