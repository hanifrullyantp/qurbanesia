import React from 'react';
import { 
  ChevronLeft, 
  Share2, 
  Download, 
  ShieldCheck, 
  QrCode,
  Award,
  Camera,
  ArrowRight
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const CertificateView = () => {
  const { id } = useParams();
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const data = {
    shohibulName: 'BUDI SANTOSO',
    qurbanType: '1/7 Sapi Premium',
    year: '1446H / 2025M',
    masjidName: 'Masjid Al-Ikhlas, Jakarta Selatan',
    date: '8 Juni 2025',
    serialNumber: `CERT-${id}-QX2026`,
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-0 font-sans">
      <div className="flex items-center justify-between mb-8">
        <Link to="/shohibul/tracking/1" className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-emerald-600 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Live Tracking
        </Link>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Premium Certificate Design */}
      <div 
        ref={certificateRef}
        className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl border-[16px] border-emerald-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] -ml-40 -mb-40"></div>

        <div className="relative z-10 border-4 border-emerald-100/50 p-8 md:p-12 rounded-[2rem]">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-600/30 rotate-3">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Sertifikat Ibadah</div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-serif tracking-tight text-center w-full">PIAGAM QURBAN</h1>
            </div>

            <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>

            <p className="text-slate-500 font-medium text-lg italic">Diberikan kepada shohibul qurban:</p>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-6xl font-black text-emerald-600 font-serif">{data.shohibulName}</h2>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Peserta Qurban {data.year}</div>
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-slate-600 text-lg leading-relaxed">
                Telah menunaikan ibadah qurban berupa <span className="font-bold text-slate-900 underline decoration-emerald-200 underline-offset-8">{data.qurbanType}</span> yang telah disembelih sesuai syariat Islam pada tanggal <span className="font-bold text-slate-900">{data.date}</span> di <span className="font-bold text-slate-900">{data.masjidName}</span>.
              </p>
            </div>

            <p className="text-emerald-700 font-bold italic text-sm md:text-lg">
              "Semoga Allah SWT menerima amal ibadah qurban Anda dan menjadikannya sebagai saksi ketaatan di akhirat kelak. Amin."
            </p>

            {/* Certificate Footer */}
            <div className="grid md:grid-cols-3 gap-12 items-end pt-12">
               <div className="text-center md:text-left space-y-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial Number</div>
                    <div className="text-xs font-black text-slate-900">{data.serialNumber}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 inline-block">
                    <QrCode className="w-24 h-24 text-emerald-900" />
                    <div className="mt-2 text-[8px] font-black text-emerald-700 uppercase tracking-widest">Verify Authenticity</div>
                  </div>
               </div>

               <div className="hidden md:block">
                  <div className="w-32 h-32 mx-auto bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 opacity-20">
                    <Award className="w-16 h-16 text-emerald-600" />
                  </div>
               </div>

               <div className="text-center md:text-right space-y-4">
                  <div className="relative inline-block px-8">
                    <div className="text-3xl font-serif italic text-slate-300 -rotate-6 absolute top-0 left-0 right-0 opacity-40">Ridwan Mansyur</div>
                    <div className="w-48 h-[1px] bg-slate-200 mt-12 mb-4 mx-auto md:ml-auto"></div>
                    <div className="font-black text-slate-900 text-sm uppercase tracking-widest">H. Ridwan Mansyur</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ketua Panitia Al-Ikhlas</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
             <ShieldCheck className="w-3 h-3 text-emerald-400" /> Powered by Qurbanesia.id
           </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20 group cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Camera className="w-24 h-24" />
            </div>
            <h3 className="font-black text-xl mb-2 uppercase tracking-tight">Share to IG Story</h3>
            <p className="text-emerald-100 text-sm mb-6 leading-relaxed">Pamerkan sertifikat Anda di Instagram dengan format yang pas untuk story.</p>
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
              Luncurkan <ArrowRight className="w-4 h-4" />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer">
            <h3 className="font-black text-xl mb-2 text-slate-900 uppercase tracking-tight">Download Album</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Dapatkan semua koleksi foto hewan qurban Anda dari awal hingga akhir dalam satu file ZIP.</p>
            <div className="flex items-center gap-2 font-black text-xs text-emerald-600 uppercase tracking-widest">
              Download ZIP <Download className="w-4 h-4" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default CertificateView;
