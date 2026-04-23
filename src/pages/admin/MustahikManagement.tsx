import React from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  UserPlus, 
  MapPin, 
  Truck, 
  FileText, 
  Smartphone, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Mustahik } from '../../types';

const MustahikManagement = () => {
  const [mustahikList] = React.useState<Mustahik[]>([
    { id: 'M-001', name: 'Ibu Siti Aminah', phone: '0812-1111', nik: '3201xxxxxxx', address: 'RT 01 RW 02, Desa Sukamaju', zone: 'Zona Barat', category: 'janda', familyCount: 4, allocation: 2, status: 'received', deliveryMethod: 'delivery' },
    { id: 'M-002', name: 'Bpk. Ahmad Junaidi', phone: '0812-2222', nik: '3201xxxxxxx', address: 'Panti Asuhan Al-Kautsar', zone: 'Zona Utara', category: 'yatim', familyCount: 15, allocation: 10, status: 'shipped', deliveryMethod: 'delivery' },
    { id: 'M-003', name: 'Pak Heru', phone: '0812-3333', nik: '3201xxxxxxx', address: 'Gubug Sawah', zone: 'Zona Selatan', category: 'miskin', familyCount: 2, allocation: 1, status: 'verified', deliveryMethod: 'pickup' },
  ]);

  const stats = [
    { label: 'Total Penerima', value: '1,250', color: 'text-slate-900' },
    { label: 'Terverifikasi', value: '1,120', color: 'text-blue-600' },
    { label: 'Sudah Terima', value: '450', color: 'text-emerald-600' },
    { label: 'Dalam Antrian', value: '670', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Manajemen Mustahik</h1>
          <p className="text-slate-500 font-medium">Data penerima manfaat, verifikasi NIK, dan status distribusi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-emerald-600 border border-emerald-200 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-sm">
            <FileText className="w-4 h-4" /> Import Data
          </button>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            <UserPlus className="w-4 h-4" /> Tambah Mustahik
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
             <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
           <div className="relative flex-1 w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari NIK atau Nama..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100">
                 <Filter className="w-3.5 h-3.5" /> Filter Zona
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all uppercase tracking-widest">
                 <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Blast WA Antrian
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full">
             <thead>
               <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                 <th className="px-8 py-5">Penerima (Mustahik)</th>
                 <th className="px-4 py-5">Kategori & Alamat</th>
                 <th className="px-4 py-5">Alokasi</th>
                 <th className="px-4 py-5">Status</th>
                 <th className="px-4 py-5">Metode</th>
                 <th className="px-8 py-5 text-right">Aksi</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {mustahikList.map((m) => (
                 <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                   <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs border border-slate-200">
                            {m.name.charAt(5)}
                         </div>
                         <div>
                            <div className="font-black text-slate-900 text-sm">{m.name}</div>
                            <div className="text-[10px] font-bold text-slate-400">NIK: {m.nik}</div>
                         </div>
                      </div>
                   </td>
                   <td className="px-4 py-5">
                      <div className="text-xs font-black text-slate-700 uppercase tracking-tighter">{m.category}</div>
                      <div className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{m.address}</div>
                   </td>
                   <td className="px-4 py-5">
                      <div className="flex items-center gap-1.5">
                         <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black">{m.allocation} Ktg</span>
                      </div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase mt-1">± {m.allocation * 1.5} Kg</div>
                   </td>
                   <td className="px-4 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        m.status === 'received' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        m.status === 'shipped' ? "bg-blue-50 text-blue-600 border-blue-100 animate-pulse" :
                        "bg-slate-50 text-slate-500 border-slate-100"
                      )}>
                        {m.status}
                      </span>
                   </td>
                   <td className="px-4 py-5">
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400">
                         {m.deliveryMethod === 'delivery' ? <Truck className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                         {m.deliveryMethod}
                      </div>
                   </td>
                   <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">Anti-Duplikasi Aktif</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIK Cross-check across tenants</p>
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-400">Previous</button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2">
                 Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MustahikManagement;
