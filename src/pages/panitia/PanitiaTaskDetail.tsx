import React from 'react';
import { 
  ChevronLeft, 
  Clock, 
  Camera, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../../utils/cn';

const PanitiaTaskDetail = () => {
  const { id } = useParams();
  const [weights, setWeights] = React.useState({ meat: '', offal: '', skin: '', bone: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const data = {
    title: 'Timbang Sapi #S-003',
    priority: 'HIGH',
    due: 'Hari ini 09:00 WIB',
    assignee: 'Dedi',
    division: 'Proses Daging',
    instructions: 'Timbang sapi #S-003 setelah proses pengulitan. Catat berat daging, jeroan, kulit secara terpisah di aplikasi ini.',
    checklist: [
      { id: 1, label: 'Siapkan timbangan', completed: true },
      { id: 2, label: 'Pastikan timbangan dikalibrasi', completed: true },
      { id: 3, label: 'Timbang daging', completed: false },
      { id: 4, label: 'Timbang jeroan', completed: false },
      { id: 5, label: 'Timbang kulit', completed: false },
      { id: 6, label: 'Foto hasil timbangan', completed: false },
      { id: 7, label: 'Input berat ke aplikasi', completed: false },
    ]
  };

  const handleFinishTask = () => {
    setIsSubmitting(true);
    // Simulate API call to update Distribution & Admin Dashboard
    setTimeout(() => {
      alert("Data Yield Hewan S-003 Berhasil Terkirim ke Admin & Manajemen Distribusi!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans">
      <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-30 flex items-center justify-between">
         <Link to="/panitia" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
         </Link>
         <h1 className="font-black text-slate-800 uppercase tracking-widest text-sm">Task Detail</h1>
         <div className="w-10"></div> {/* Spacer */}
      </header>

      <div className="p-5 space-y-6">
         {/* Task Status Header */}
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {data.priority}
               </div>
            </div>
            <div className="flex items-center gap-3 mb-4 text-orange-500 font-bold text-xs uppercase tracking-widest">
               <Clock className="w-4 h-4 animate-spin-slow" /> In Progress
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{data.title}</h2>
            <div className="flex flex-col gap-2">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Due: {data.due}
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600"></div> Div: {data.division}
               </div>
            </div>
         </div>

         {/* Instructions */}
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Instruksi Kerja</h3>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{data.instructions}"</p>
         </div>

         {/* Checklist */}
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
               <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Sub-Task Checklist</h3>
            </div>
            <div className="p-2">
               {data.checklist.map((item) => (
                 <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group">
                    <button className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all active:scale-90",
                      item.completed ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white border-slate-200"
                    )}>
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                    <span className={cn(
                      "text-sm font-bold transition-all",
                      item.completed ? "text-slate-400 line-through" : "text-slate-700"
                    )}>
                      {item.label}
                    </span>
                 </div>
               ))}
            </div>
         </div>

         {/* Weight Input Fields */}
         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">⚖️ Input Berat Aktual (Kg)</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daging</label>
                  <input type="number" placeholder="0.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-black outline-none focus:border-emerald-500 transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jeroan</label>
                  <input type="number" placeholder="0.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-black outline-none focus:border-emerald-500 transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kulit</label>
                  <input type="number" placeholder="0.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-black outline-none focus:border-emerald-500 transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tulang</label>
                  <input type="number" placeholder="0.0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-black outline-none focus:border-emerald-500 transition-all" />
               </div>
            </div>
         </div>

         {/* Photo Upload */}
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Bukti Foto</h3>
               <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Required: 1 Photo</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all">
                  <Camera className="w-8 h-8" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Ambil Foto</span>
               </button>
               <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Gallery</span>
               </button>
            </div>
         </div>

         {/* Comments/Notes */}
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Catatan (Opsional)</h3>
            <textarea 
               className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 outline-none focus:border-emerald-500 transition-all h-24 resize-none"
               placeholder="Tulis catatan lapangan..."
            ></textarea>
         </div>

         {/* Final Action Buttons */}
         <div className="flex flex-col gap-3">
            <button 
              onClick={handleFinishTask}
              disabled={isSubmitting}
              className={cn(
                "w-full py-5 text-white rounded-3xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2",
                isSubmitting ? "bg-slate-400" : "bg-emerald-600 shadow-emerald-600/30 active:scale-95"
              )}
            >
               {isSubmitting ? <Clock className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
               {isSubmitting ? 'Mengirim Data...' : 'Selesaikan & Kirim Data Yield'}
            </button>
            <button className="w-full py-4 bg-white text-red-600 border border-red-100 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
               <AlertCircle className="w-4 h-4" /> Laporkan Masalah
            </button>
         </div>
      </div>
    </div>
  );
};

export default PanitiaTaskDetail;
