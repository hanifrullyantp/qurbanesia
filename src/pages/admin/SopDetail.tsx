import React from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  PlayCircle, 
  FileText, 
  Download,
  Share2,
  Bell,
  CheckSquare,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const SopDetail = () => {
  const data = {
    title: 'SOP Divisi Penyembelihan',
    status: 'published',
    version: 'V.2.0',
    revisedAt: '15 Mei 2026',
    purpose: 'Memastikan proses penyembelihan berjalan sesuai syariat Islam, aman, higienis, dan terdokumentasi dengan baik.',
    coordinator: 'Ust. Hasan',
    personnel: [
      { role: 'Koordinator', name: 'Ust. Hasan' },
      { role: 'Jagal Utama', name: 'Ust. Mahmud, Ust. Salim' },
      { role: 'Asisten', name: '4 orang' },
      { role: 'Petugas Fiksasi', name: '4 orang' },
    ],
    equipment: [
      'Pisau sembelih tajam (min. 2 buah)',
      'Batu asah / pengasah pisau',
      'Tali pengikat',
      'Terpal / alas',
      'Ember penampung darah',
      'Air bersih',
      'Sarung tangan',
      'Kompas / penunjuk kiblat',
      'P3K'
    ],
    steps: [
      {
        title: 'STEP 1: PERSIAPAN (05:00 - 06:00 WIB)',
        items: [
          'Bersihkan area penyembelihan',
          'Siapkan semua peralatan',
          'Pastikan pisau tajam (test potong kertas)',
          'Tentukan arah kiblat & beri tanda',
          'Siapkan air bersih & ember',
          'Briefing tim (doa bersama)'
        ]
      },
      {
        title: 'STEP 2: PRE-SEMBELIH (per hewan)',
        items: [
          'Scan QR Code hewan di aplikasi',
          'Verifikasi data hewan & nama shohibul',
          'Foto hewan (WAJIB - dari aplikasi)',
          'Checklist kelayakan syar\'i (Umur, Sehat, Tidak Cacat, Tidak Kurus)',
          'Beri minum hewan',
          'Baringkan dengan lembut, arah kiblat',
          'Tutup mata hewan (sunnah)'
        ]
      },
      {
        title: 'STEP 3: PENYEMBELIHAN',
        items: [
          'Jagal membaca "Bismillahi Allahu Akbar"',
          'Baca niat qurban + nama shohibul',
          'Sembelih dengan satu tarikan cepat',
          'Putus 3 saluran (hulqum, mari\', wadajain)',
          'Klik "Mulai Sembelih" di aplikasi',
          'Tunggu darah berhenti & hewan tidak bergerak',
          'Klik "Selesai Sembelih" di aplikasi',
          'Foto post-sembelih (WAJIB)',
          'JANGAN kuliti sebelum hewan benar-benar mati'
        ]
      }
    ],
    rules: {
      do: ['Sembelih sesuai syariat', 'Dokumentasikan setiap tahap', 'Bersihkan area berkala'],
      dont: [
        'Menyembelih di depan hewan lain yang menunggu',
        'Mengasah pisau di depan hewan',
        'Menyiksa / kasar terhadap hewan',
        'Menguliti sebelum hewan mati sempurna',
        'Menyembelih tanpa membaca Bismillah'
      ]
    },
    readers: [
      { name: 'Hasan', read: true },
      { name: 'Mahmud', read: true },
      { name: 'Salim', read: true },
      { name: 'Andi', read: true },
      { name: 'Beni', read: true },
      { name: 'Cahyo', read: true },
      { name: 'Dodi', read: true },
      { name: 'Eko', read: true },
      { name: 'Farid', read: false },
      { name: 'Gunawan', read: false },
    ]
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <Link to="/admin/sop" className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-emerald-600 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Daftar SOP
        </Link>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
             <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            <Share2 className="w-4 h-4" /> Share ke Divisi
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main SOP Content */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{data.status}</span>
                     <span className="text-slate-400 font-bold text-xs">{data.version}</span>
                   </div>
                   <h1 className="text-3xl font-black text-slate-900">{data.title}</h1>
                </div>
                <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Revisi Terakhir:<br/>{data.revisedAt}
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                 <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Tujuan SOP</h4>
                 <p className="text-slate-600 text-sm leading-relaxed italic">"{data.purpose}"</p>
              </div>
            </div>

            <div className="p-10 space-y-12">
               {/* Personnel & Equipment */}
               <div className="grid sm:grid-cols-2 gap-10">
                 <div>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" /> Personel Terkait
                    </h3>
                    <ul className="space-y-3">
                      {data.personnel.map((p, i) => (
                        <li key={i} className="flex justify-between text-xs border-b border-slate-50 pb-2">
                          <span className="text-slate-400">{p.role}</span>
                          <span className="font-bold text-slate-700">{p.name}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-emerald-600" /> Peralatan Wajib
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.equipment.map((e, i) => (
                        <span key={i} className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">☑️ {e}</span>
                      ))}
                    </div>
                 </div>
               </div>

               {/* Procedure Steps */}
               <div className="space-y-8">
                  <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                    <Clock className="w-6 h-6 text-emerald-600" /> Prosedur Step-by-Step
                  </h3>
                  <div className="space-y-6">
                    {data.steps.map((step, i) => (
                      <div key={i} className="relative pl-8 border-l-2 border-slate-100 pb-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-emerald-500"></div>
                        <h4 className="font-black text-slate-800 text-sm mb-4 uppercase tracking-wider">{step.title}</h4>
                        <ul className="space-y-3">
                          {step.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                              <span className="w-5 h-5 bg-slate-50 text-[10px] font-black text-slate-400 rounded-lg flex items-center justify-center shrink-0">{i+1}.{j+1}</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Rules */}
               <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Boleh Dilakukan
                    </h4>
                    <ul className="space-y-3">
                      {data.rules.do.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100">
                    <h4 className="text-xs font-black text-red-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Larangan (Critical)
                    </h4>
                    <ul className="space-y-3">
                      {data.rules.dont.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-red-800 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Read Confirmation Tracking */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900">Tracking Baca</h3>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">8/10 Selesai</span>
             </div>
             
             <div className="space-y-4">
                {data.readers.map((reader, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", reader.read ? "bg-emerald-500" : "bg-slate-200")}></div>
                      <span className={cn("text-sm font-bold", reader.read ? "text-slate-700" : "text-slate-400")}>{reader.name}</span>
                    </div>
                    {reader.read ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <button className="text-[10px] font-black text-orange-600 hover:underline uppercase tracking-tighter flex items-center gap-1">
                        <Bell className="w-3 h-3" /> Remind
                      </button>
                    )}
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" /> Broadcast ke Anggota
             </button>
          </div>

          {/* Resources */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
             <h3 className="font-bold text-slate-900 mb-6">Lampiran & Media</h3>
             <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all group">
                   <PlayCircle className="w-6 h-6 text-emerald-600" />
                   <div className="text-left">
                      <div className="text-xs font-bold text-slate-800">Video Tutorial Sembelih</div>
                      <div className="text-[10px] text-slate-400">MP4 • 12 MB</div>
                   </div>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all group">
                   <FileText className="w-6 h-6 text-blue-600" />
                   <div className="text-left">
                      <div className="text-xs font-bold text-slate-800">Panduan Fiqh Qurban</div>
                      <div className="text-[10px] text-slate-400">PDF • 2 MB</div>
                   </div>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SopDetail;
