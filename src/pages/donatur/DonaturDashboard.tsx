import React from 'react';
import { 
  Heart, 
  MapPin, 
  Gift, 
  Users, 
  BarChart3,
  Globe,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Download
} from 'lucide-react';
import { cn } from '../../utils/cn';

const DonaturDashboard = () => {
  const donationPrograms = [
    { 
      id: 'P-1', 
      title: 'Patungan Sapi untuk Dhuafa (1/7)', 
      desc: 'Qurban sapi untuk masyarakat di daerah terpencil NTT.', 
      progress: 4, 
      target: 7, 
      price: 'Rp 2.500.000',
      color: 'bg-emerald-500'
    },
    { 
      id: 'P-2', 
      title: 'Kambing Utuh untuk Yatim', 
      desc: 'Distribusi daging qurban untuk panti asuhan di Jakarta.', 
      progress: 12, 
      target: 20, 
      price: 'Rp 3.200.000',
      color: 'bg-blue-500'
    }
  ];

  const impactStats = [
    { label: 'Penerima Manfaat', value: '1,240 KK', icon: <Users className="w-5 h-5" /> },
    { label: 'Masjid Terbantu', value: '12 Unit', icon: <Globe className="w-5 h-5" /> },
    { label: 'Total Donasi', value: 'Rp 45M', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Welcome Hero */}
      <section className="bg-red-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-red-600/20">
         <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">Semangat Berbagi, Bpk. Faisal! ❤️</h1>
            <p className="text-red-100 text-lg max-w-xl">Donasi qurban Anda sangat berarti bagi mereka yang membutuhkan di seluruh penjuru negeri.</p>
            <div className="mt-8 flex gap-4">
               <button className="bg-white text-red-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-50 transition-all flex items-center gap-2">
                  <Gift className="w-4 h-4" /> Cari Program Baru
               </button>
               <button className="bg-red-700 text-white border border-red-500 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-800 transition-all">
                  Lihat Riwayat Donasi
               </button>
            </div>
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
         <Heart className="absolute top-10 right-10 w-32 h-32 text-white/5 -rotate-12" />
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Active Donations */}
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Program Donasi Aktif</h2>
              <button className="text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Lihat Semua</button>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              {donationPrograms.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all group">
                   <div className="flex justify-between items-start mb-6">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", p.color)}>
                         <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.id}</span>
                   </div>
                   <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-red-600 transition-colors">{p.title}</h3>
                   <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{p.desc}</p>
                   
                   <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-end text-[10px] font-black uppercase">
                         <span className="text-slate-400">Terkumpul {p.progress}/{p.target}</span>
                         <span className="text-slate-800">{Math.round((p.progress/p.target)*100)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full transition-all duration-1000", p.color)} style={{ width: `${(p.progress/p.target)*100}%` }}></div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="text-sm font-black text-slate-900">{p.price}</div>
                      <button className="text-xs font-black text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Donasi <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              ))}
           </div>

           {/* Impact Map Preview */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Globe className="w-40 h-40" />
              </div>
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                 <MapPin className="w-5 h-5 text-red-400" /> Peta Sebaran Donasi
              </h2>
              <div className="h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center border-dashed">
                 <p className="text-slate-500 font-bold italic text-sm">Interactive Impact Map Area</p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                 {impactStats.map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                       <div className="flex justify-center text-red-400 mb-2">{stat.icon}</div>
                       <div className="text-lg font-black">{stat.value}</div>
                       <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Donation Impact Report Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <BarChart3 className="w-10 h-10" />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Impact Report 2025</h3>
              <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">
                 Donasi Anda telah membantu 45 KK di Desa Sukamaju mendapatkan daging qurban yang layak.
              </p>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                 <Download className="w-4 h-4" /> Download Laporan Impact
              </button>
           </div>

           {/* Verify Certificate */}
           <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-24 h-24" />
              </div>
              <h3 className="font-black text-xl mb-4 leading-tight">Sertifikat Donasi Anda</h3>
              <p className="text-emerald-100 text-xs font-medium mb-6 leading-relaxed">
                 Setiap donasi dilengkapi dengan sertifikat digital yang bisa Anda gunakan sebagai lampiran laporan pajak pribadi/perusahaan.
              </p>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-black text-xs hover:bg-emerald-50 transition-all">
                 Lihat Sertifikat
              </button>
           </div>

           {/* Featured Testimonial */}
           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 italic">
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                 "Terima kasih donatur Qurbanesia. Baru tahun ini warga kami di pelosok bisa merasakan daging sapi premium. Semoga berkah."
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                 <div>
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Ust. Mansyur</div>
                    <div className="text-[8px] font-bold text-slate-400">Pengurus Masjid NTT</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DonaturDashboard;
