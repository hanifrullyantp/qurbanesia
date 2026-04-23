import React from 'react';
import { 
  Plus, 
  Search, 
  Share2, 
  MoreVertical, 
  Eye, 
  Edit3, 
  BarChart3,
  Clock,
  CheckCircle2,
  X,
  FileText,
  Filter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const SopManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const sops = [
    { id: '1', title: 'SOP Divisi Penyembelihan', status: 'published', updated: '15 Mei 2026', readCount: '8/10', color: 'bg-red-500' },
    { id: '2', title: 'SOP Divisi Proses Daging', status: 'published', updated: '16 Mei 2026', readCount: '6/8', color: 'bg-blue-500' },
    { id: '3', title: 'SOP Divisi Pengemasan & Packaging', status: 'draft', updated: '-', readCount: '0/6', color: 'bg-emerald-500' },
    { id: '4', title: 'SOP Divisi Distribusi', status: 'published', updated: '17 Mei 2026', readCount: '12/12', color: 'bg-orange-500' },
    { id: '5', title: 'SOP Keselamatan & P3K', status: 'published', updated: '10 Mei 2026', readCount: '25/45', color: 'bg-slate-700' },
    { id: '6', title: 'SOP Kebersihan & Limbah', status: 'published', updated: '12 Mei 2026', readCount: '15/20', color: 'bg-emerald-700' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">SOP Management</h1>
          <p className="text-slate-500">Standard Operating Procedure per divisi panitia</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-600 border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Clock className="w-4 h-4" /> Duplikat Tahun Lalu
          </button>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            <Plus className="w-4 h-4" /> Buat SOP Baru
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Filter & Search</h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Cari SOP..." className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Semua</button>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Published</button>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Draft</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-400">
               <BarChart3 className="w-5 h-5" /> SOP Tracking
            </h3>
            <div className="space-y-4 text-xs">
               <div className="flex justify-between items-center text-slate-400">
                 <span>Telah Membaca</span>
                 <span className="font-bold text-emerald-400">72%</span>
               </div>
               <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500" style={{ width: '72%' }}></div>
               </div>
               <p className="text-slate-500 leading-relaxed italic">
                 Sistem akan mengirimkan pengingat otomatis via WhatsApp H-3 Idul Adha bagi panitia yang belum membaca SOP.
               </p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">🔔 Kirim Pengingat Manual</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-4">
            {sops.map((sop) => (
              <div key={sop.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-full h-1.5", sop.color)}></div>
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border",
                    sop.status === 'published' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
                  )}>
                    {sop.status}
                  </div>
                  <button className="p-2 text-slate-300 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical className="w-4 h-4" /></button>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">{sop.title}</h3>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" /> Updated: {sop.updated}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Read confirmation: <span className="text-slate-900">{sop.readCount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link 
                    to={`/admin/sop/${sop.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                  >
                    <Eye className="w-4 h-4" /> View SOP
                  </Link>
                  <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 hover:bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 hover:bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full mt-6 py-8 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-emerald-500 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all group"
          >
             <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-2xl transition-all border border-transparent group-hover:border-emerald-50">
               <Plus className="w-8 h-8" />
             </div>
             <span className="font-black text-xs uppercase tracking-[0.2em]">Build New Standard Operating Procedure</span>
          </button>
        </div>

        {/* Add SOP Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
             <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                         <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="font-black text-lg uppercase tracking-tight">Standard Operating Procedure Builder</h3>
                   </div>
                   <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-10 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SOP Title</label>
                      <input type="text" placeholder="Misal: Prosedur Pengemasan Daging Vakum" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10" />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Division</label>
                         <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none">
                            <option>Div. Sembelih</option>
                            <option>Div. Pengemasan</option>
                            <option>Div. Distribusi</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template Type</label>
                         <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none">
                            <option>Standard Procedure</option>
                            <option>Sharia Compliance</option>
                            <option>Health & Safety</option>
                         </select>
                      </div>
                   </div>
                   <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-400">
                      <FileText className="w-10 h-10 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">Drag & Drop SOP File (PDF/Docx)</p>
                   </div>
                   <button className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all">
                      Create & Publish to Panitia
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SopManagement;
