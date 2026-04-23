import React from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  ChevronLeft,
  ShieldCheck,
  Heart,
  Send,
  Package
} from 'lucide-react';
import { cn } from '../../utils/cn';

const PenerimaStatus = () => {
  const [isReceived, setIsReceived] = React.useState(false);
  const [thankYouMsg, setThankYouMsg] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);

  const data = {
    name: 'Ibu Siti Aminah',
    status: 'dalam_pengiriman',
    packageSize: '2.5 Kg Daging + Jeroan',
    packageCode: 'PKT-2025-0847',
    driver: {
      name: 'Bpk. Rudi',
      phone: '0812-3456-7890'
    },
    eta: '10:30 WIB',
    distance: '2.3 Km',
    etaMinutes: '8 menit'
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen font-sans pb-10">
      {/* Mini Header */}
      <header className="bg-emerald-600 text-white p-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-2 mb-4 opacity-80">
           <ShieldCheck className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-widest">Masjid Al-Ikhlas Jakarta</span>
        </div>
        <h1 className="text-xl font-black mb-1 leading-tight">Assalamu'alaikum, {data.name.split(' ')[1]} 👋</h1>
        <p className="text-emerald-100 text-xs font-medium">Ibadah qurban Anda tahun ini sedang kami proses.</p>
      </header>

      <div className="p-5 space-y-6">
        {/* Status Card */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex items-center gap-3 text-orange-500 font-black text-[10px] uppercase tracking-widest mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></div>
              {isReceived ? 'Diterima' : 'Dalam Pengiriman'}
           </div>
           
           <div className="flex items-start justify-between gap-4 mb-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                       <Package className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paket Qurban</div>
                       <div className="text-sm font-black text-slate-800">{data.packageSize}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                       <Truck className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengantar</div>
                       <div className="text-sm font-black text-slate-800">{data.driver.name}</div>
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimasi Tiba</div>
                 <div className="text-2xl font-black text-emerald-600 tabular-nums">{data.eta.split(' ')[0]}</div>
                 <div className="text-[10px] font-black text-emerald-600 uppercase">{data.eta.split(' ')[1]}</div>
              </div>
           </div>

           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Paket:</span>
              <span className="text-xs font-black text-slate-600">{data.packageCode}</span>
           </div>
        </section>

        {/* Map Placeholder */}
        <section className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="aspect-video bg-slate-100 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center">
              {/* Simulated Map UI */}
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.8272, -6.1751,13/400x200?access_token=dummy')] bg-cover opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div className="px-3 py-1 bg-white rounded-full shadow-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                    Sapi Sedang Diantar
                 </div>
              </div>
           </div>
           <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jarak</span>
                    <span className="text-sm font-black text-slate-800">{data.distance}</span>
                 </div>
                 <div className="w-[1px] h-6 bg-slate-100"></div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA</span>
                    <span className="text-sm font-black text-slate-800">~{data.etaMinutes}</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                    <Phone className="w-5 h-5" />
                 </button>
                 <button className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </section>

        {/* Confirmation Button */}
        {!isReceived ? (
          <button 
            onClick={() => setIsReceived(true)}
            className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             <CheckCircle2 className="w-5 h-5" /> KONFIRMASI TERIMA DAGING
          </button>
        ) : (
          <div className="bg-emerald-50 p-6 rounded-[2rem] border-2 border-emerald-100 text-center space-y-4">
             <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <h3 className="font-black text-emerald-800">Alhamdulillah, Diterima!</h3>
             <p className="text-xs font-medium text-emerald-700 leading-relaxed italic">"Terima kasih telah mengonfirmasi penerimaan. Semoga berkah bagi kita semua."</p>
          </div>
        )}

        {/* Thank you note */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" /> Kirim Ucapan Terima Kasih
           </h3>
           <textarea 
              value={thankYouMsg}
              onChange={(e) => setThankYouMsg(e.target.value)}
              className="w-full h-24 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 outline-none focus:border-emerald-500 transition-all resize-none"
              placeholder="Jazakallah khairan, semoga menjadi amal ibadah yg diterima 🤲"
           ></textarea>
           <button 
            onClick={() => setIsSent(true)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
           >
              {isSent ? 'TERKIRIM!' : 'KIRIM UCAPAN'} {isSent ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4" />}
           </button>
        </section>
      </div>

      <footer className="px-6 py-8 text-center">
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
            Didistribusikan secara Amanah oleh<br/>Panitia Qurban Masjid Al-Ikhlas<br/>Powered by Qurbanesia.id
         </p>
      </footer>
    </div>
  );
};

export default PenerimaStatus;
