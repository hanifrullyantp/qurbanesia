import React from 'react';
import { 
  CheckCircle2, 
  Camera, 
  MapPin, 
  ChevronLeft,
  Share2,
  Download,
  ShieldCheck,
  PlayCircle,
  ChevronDown,
  Image as ImageIcon,
  Users,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useParams } from 'react-router-dom';
import { listTrackingEvents } from '../../services/tracking';

const LiveTracking = () => {
  const { id } = useParams();
  const [expandedPhotos, setExpandedPhotos] = React.useState<string | null>(null);
  const [pipeline, setPipeline] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const events = await listTrackingEvents(id);
        if (cancelled) return;
        setPipeline(
          events.map((e) => ({
            id: e.id,
            label: (e.status ?? '').toString().replaceAll('_', ' ').toUpperCase(),
            desc: e.message ?? '',
            time: new Date(e.occurred_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            ...((e.meta as any) ?? {}),
          })),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const activeStep = Math.max(0, pipeline.length - 1);

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-0 font-sans">
      <div className="flex items-center justify-between mb-8">
        <Link to="/shohibul" className="p-2 -ml-2 hover:bg-white rounded-xl transition-all">
          <ChevronLeft className="w-6 h-6 text-slate-500" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-slate-900 tracking-tight uppercase text-xs">Masjid Al-Ikhlas</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Ibadah Qurban Anda</h1>
        <p className="text-slate-500 font-medium">Assalamu'alaikum, <span className="text-emerald-600 font-bold">Pak Budi 👋</span></p>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
           <div className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
             <CheckCircle2 className="w-3.5 h-3.5" /> LUNAS
           </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jenis Qurban</div>
                <div className="font-bold text-slate-900">Sapi - Grade Premium</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kelompok</div>
                <div className="font-bold text-slate-900 italic">Sapi #007 (1/7 Bagian)</div>
              </div>
           </div>
           <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Niat Qurban Atas Nama</div>
                <div className="font-bold text-emerald-600">Budi Santoso & Keluarga</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga</div>
                <div className="font-bold text-slate-900">Rp 4.500.000</div>
              </div>
           </div>
        </div>
      </div>

      {/* Real-time Tracking Timeline */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-10">
           <div className="h-[2px] flex-1 bg-slate-100"></div>
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Live Tracking Real-Time</h2>
           <div className="h-[2px] flex-1 bg-slate-100"></div>
        </div>

        <div className="relative pl-10 md:pl-16">
          {/* Vertical Progress Line */}
          <div className="absolute left-[19px] md:left-[31px] top-0 bottom-0 w-[2px] bg-slate-100"></div>
          
          <div className="space-y-12">
            {loading && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-slate-500 font-bold">
                Memuat tracking...
              </div>
            )}
            {!loading && pipeline.length === 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-slate-500 font-bold">
                Belum ada event tracking untuk ID ini.
              </div>
            )}
            {pipeline.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isActive = idx === activeStep;
              const isFuture = idx > activeStep;
              
              return (
                <div key={step.id} className={cn("relative", isFuture && "opacity-40 grayscale")}>
                  {/* Status Indicator */}
                  <div className={cn(
                    "absolute -left-[32px] md:-left-[44px] top-0 w-8 h-8 md:w-11 md:h-11 rounded-full border-4 flex items-center justify-center transition-all z-10",
                    isCompleted ? "bg-emerald-500 border-emerald-50" : 
                    isActive ? "bg-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : 
                    "bg-white border-slate-100"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-white" /> : 
                     isActive ? <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full animate-pulse"></div> :
                     <div className="w-2 h-2 bg-slate-200 rounded-full"></div>}
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                       <h3 className={cn("text-sm md:text-lg font-black tracking-tight", isActive ? "text-emerald-600" : "text-slate-900")}>
                         {step.label} {isActive && <span className="ml-2 text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase italic animate-bounce inline-block">Status Saat Ini</span>}
                       </h3>
                       {step.time && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.time}</span>}
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">{step.desc}</p>
                    
                    {step.link && (
                      <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest underline underline-offset-4 hover:text-emerald-700">
                        📎 {step.link}
                      </button>
                    )}

                    {/* Step-specific UI: Photo Gallery for confirmed animal */}
                    {step.photos && (
                      <div className="space-y-4">
                        <button 
                          onClick={() => setExpandedPhotos(expandedPhotos === 'animal' ? null : 'animal')}
                          className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest group"
                        >
                          <Camera className="w-4 h-4" /> 
                          {expandedPhotos === 'animal' ? 'Sembunyikan Foto' : 'Lihat Foto Hewan'} 
                          <ChevronDown className={cn("w-4 h-4 transition-transform", expandedPhotos === 'animal' && "rotate-180")} />
                        </button>
                        {expandedPhotos === 'animal' && (
                          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 grid grid-cols-3 gap-3">
                            {step.photos.map((p, i) => (
                              <div key={i} className="space-y-2">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white shadow-sm hover:scale-105 transition-transform">
                                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest">{p.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {step.sertifikat && (
                           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 w-fit">
                              <ShieldCheck className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Status: Layak Qurban</span>
                              <button className="text-[10px] font-black underline ml-2">Lihat Hasil Medis</button>
                           </div>
                        )}
                      </div>
                    )}

                    {/* Step-specific UI: Daily Updates */}
                    {step.dailyUpdates && (
                      <div className="space-y-4">
                        <button 
                          onClick={() => setExpandedPhotos(expandedPhotos === 'daily' ? null : 'daily')}
                          className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest group"
                        >
                          <Camera className="w-4 h-4" /> 
                          {expandedPhotos === 'daily' ? 'Sembunyikan Update' : 'Lihat Update Harian'} 
                          <ChevronDown className={cn("w-4 h-4 transition-transform", expandedPhotos === 'daily' && "rotate-180")} />
                        </button>
                        {expandedPhotos === 'daily' && (
                          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                             {step.dailyUpdates.map((update, i) => (
                               <div key={i} className="flex gap-4 items-start pb-4 border-b border-white last:border-0 last:pb-0">
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0 border-2 border-white">
                                    <img src={update.url} alt={update.date} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{update.date}</span>
                                       <span className="text-[10px] font-bold text-emerald-600 italic">{update.weight}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">{update.desc}</p>
                                  </div>
                                </div>
                             ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step-specific UI: Slaughter Queue */}
                    {step.queue && (
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urutan Penyembelihan</h4>
                           <span className="text-xs font-black text-emerald-600 uppercase">#7 dari {step.queue.total} Sapi</span>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                           {[1,2,3,4,5,6,7,8].map(n => (
                             <div key={n} className={cn(
                               "aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all",
                               n < step.queue.target ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                               n === step.queue.target ? "bg-white border-emerald-500 text-emerald-600 ring-4 ring-emerald-50" :
                               n === step.queue.current ? "bg-orange-500 border-orange-500 text-white" :
                               "bg-slate-50 border-slate-100 text-slate-300"
                             )}>
                               <span className="text-[8px] font-black uppercase mb-1">#{n}</span>
                               {n < step.queue.target ? <CheckCircle2 className="w-4 h-4" /> : 
                                n === step.queue.target ? <span className="text-xs font-black">ANDA</span> :
                                <span className="text-xs font-bold">{n === step.queue.current ? '🔄' : '⏳'}</span>}
                             </div>
                           ))}
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                           <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                           </div>
                           <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">{step.queue.eta} lagi</span>
                        </div>
                      </div>
                    )}

                    {/* Step-specific UI: Slaughter Photos */}
                    {step.slaughterPhotos && (
                      <div className="bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-lg shadow-emerald-500/5 space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                           {step.slaughterPhotos.map((p, i) => (
                             <div key={i} className="space-y-3">
                                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 relative group">
                                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[8px] font-black uppercase rounded backdrop-blur-sm">
                                    {p.time}
                                  </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-700 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {p.label}
                                </div>
                             </div>
                           ))}
                         </div>
                         <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                            <PlayCircle className="w-5 h-5 text-emerald-400" /> TONTON LIVE STREAMING
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Gallery Album */}
      <section className="mt-20 space-y-8">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-emerald-600" /> GALLERY LENGKAP SAPI ANDA
        </h2>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
           {[
             { title: 'Foto Awal (20 Mei)', count: 3 },
             { title: 'Update Harian (5-7 Jun)', count: 6 },
             { title: 'Hari Penyembelihan (8 Jun)', count: 5 },
           ].map((album, i) => (
             <div key={i} className="space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">📂 {album.title}</h3>
                   <span className="text-[10px] font-bold text-slate-400">{album.count} foto</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                   {[...Array(album.count)].map((_, j) => (
                     <div key={j} className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                        <img src={`https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=100&u=${i}${j}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </div>
           ))}
           <button className="w-full py-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> DOWNLOAD SEMUA FOTO (ZIP)
           </button>
        </div>
      </section>

      {/* Certificate Section */}
      <section className="mt-20 space-y-8">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" /> SERTIFIKAT QURBAN
        </h2>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
           <div className="max-w-sm mx-auto mb-8 border-4 border-slate-50 rounded-2xl p-4 grayscale opacity-60">
              <div className="aspect-[1/1.4] bg-slate-50 flex items-center justify-center italic text-xs text-slate-400 font-serif">Certificate Preview</div>
           </div>
           <p className="text-sm text-slate-500 font-medium mb-8">Sertifikat tersedia secara otomatis setelah seluruh proses distribusi selesai dilakukan oleh panitia.</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/shohibul/certificate/Q-12345" className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20">
                 <Download className="w-5 h-5" /> DOWNLOAD PDF
              </Link>
              <button className="py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                 <Share2 className="w-5 h-5" /> SHARE KE WHATSAPP
              </button>
           </div>
           <button className="w-full mt-4 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center gap-3">
              <Camera className="w-5 h-5" /> SHARE KE INSTAGRAM STORY
           </button>
        </div>
      </section>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
         <div className="bg-slate-900 text-white p-4 rounded-3xl flex items-center justify-between shadow-2xl">
            <button className="flex flex-col items-center gap-1 text-emerald-400">
               <LayoutDashboard className="w-6 h-6" />
               <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400">
               <MapPin className="w-6 h-6" />
               <span className="text-[9px] font-black uppercase tracking-tighter">Track</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400">
               <Share2 className="w-6 h-6" />
               <span className="text-[9px] font-black uppercase tracking-tighter">Share</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400">
               <Users className="w-6 h-6" />
               <span className="text-[9px] font-black uppercase tracking-tighter">Profil</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default LiveTracking;
