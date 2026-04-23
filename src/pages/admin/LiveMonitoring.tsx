import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Camera, 
  ArrowRight,
  CheckCircle2,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const LiveMonitoring = () => {
  const animals = [
    { type: 'Sapi', waiting: 22, process: 3, done: 17, total: 42 },
    { type: 'Kambing', waiting: 10, process: 0, done: 28, total: 38 },
  ];

  const pipeline = [
    { label: 'Menunggu', count: 22, active: false },
    { label: 'Sembelih', count: 3, active: true },
    { label: 'Kuliti', count: 5, active: false },
    { label: 'Potong', count: 7, active: false },
    { label: 'Kemas', count: 12, active: false },
    { label: 'Distribusi', count: 8, active: false },
    { label: 'Selesai', count: 23, active: false },
  ];

  const teams = [
    { name: 'Div. Sembelih', status: 'Aktif', count: '10/10', health: 'On Track', color: 'text-emerald-500' },
    { name: 'Div. Pengulitan', status: 'Aktif', count: '8/8', health: 'On Track', color: 'text-emerald-500' },
    { name: 'Div. Pemotongan', status: 'Aktif', count: '7/8', health: '-1 orang', color: 'text-orange-500' },
    { name: 'Div. Pengemasan', status: 'Standby', count: '6/6', health: 'Waiting', color: 'text-slate-400' },
    { name: 'Div. Distribusi', status: 'Standby', count: '10/12', health: '-2 orang', color: 'text-orange-500' },
  ];

  const recentPhotos = [
    { id: 'S-017', label: 'Sapi #S-017', time: '08:30', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=200' },
    { id: 'P-001', label: 'Proses Kulit', time: '08:35', url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=200' },
    { id: 'D-005', label: 'Daging Dipotong', time: '08:40', url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=200' },
    { id: 'K-012', label: 'Kemas Plastik', time: '08:42', url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=200' },
    { id: 'T-001', label: 'Tim Distribusi', time: '08:43', url: 'https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=200' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-[0.2em] mb-1">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
             LIVE MONITORING
           </div>
           <h1 className="text-3xl font-black text-slate-900">D-Day Operasional Qurban</h1>
           <p className="text-slate-500 font-medium">10 Dzulhijjah 1447H • 08:45 WIB</p>
        </div>
        <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="flex items-center gap-2 text-slate-400">
             <Clock className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-widest">Estimasi Selesai:</span>
           </div>
           <div className="text-xl font-black text-slate-900">12:30 WIB</div>
        </div>
      </div>

      {/* Real-time Status Counters */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
             <TrendingUp className="w-5 h-5 text-emerald-600" /> Status Real-Time
           </h2>
           
           <div className="grid sm:grid-cols-2 gap-8">
              {animals.map((item, i) => (
                <div key={i} className="space-y-4">
                   <div className="flex justify-between items-center">
                     <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">{item.type}</h3>
                     <span className="text-[10px] font-black text-slate-400">TOTAL: {item.total}</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 p-3 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Wait</div>
                        <div className="text-lg font-black text-slate-700">{item.waiting}</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-xl text-center border border-orange-100">
                        <div className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter mb-1">Proses</div>
                        <div className="text-lg font-black text-orange-600">{item.process}</div>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl text-center border border-emerald-100">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter mb-1">Done</div>
                        <div className="text-lg font-black text-emerald-600">{item.done}</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="space-y-3 pt-4">
              <div className="flex justify-between items-end text-xs font-black uppercase tracking-widest">
                <span className="text-slate-400">Total Progress</span>
                <span className="text-emerald-600">42/80 (53%)</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                 <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '53%' }}></div>
              </div>
           </div>
        </div>

        {/* Pipeline per Stage */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <h2 className="text-xl font-bold mb-8 flex items-center gap-2 uppercase tracking-tight">
             <MapPin className="w-5 h-5 text-emerald-400" /> Pipeline per Stage
           </h2>

           <div className="relative flex flex-wrap gap-4 items-center">
              {pipeline.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                    step.active ? "bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-white/5 border-white/10"
                  )}>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{step.label}</div>
                    <div className="text-xl font-black">{step.count}</div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-700 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Status Tim */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight">
             <Users className="w-5 h-5 text-emerald-600" /> Status Tim
           </h2>
           <div className="space-y-2">
              {teams.map((team, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                   <div>
                     <div className="text-xs font-black text-slate-800 uppercase tracking-widest">{team.name}</div>
                     <div className="flex items-center gap-2 mt-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", team.status === 'Aktif' ? "bg-emerald-500" : "bg-slate-300")}></div>
                        <span className="text-[10px] font-bold text-slate-400">{team.status} • {team.count} Hadir</span>
                     </div>
                   </div>
                   <div className={cn("text-[10px] font-black uppercase tracking-widest", team.color)}>
                     {team.health}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Live Feed & Activities */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <Camera className="w-5 h-5 text-emerald-600" /> Live Feed Panitia
                </h2>
                <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Lihat Semua</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {recentPhotos.map((photo, i) => (
                    <div key={i} className="shrink-0 w-32 space-y-2">
                       <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 relative group">
                          <img src={photo.url} alt={photo.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            {photo.time}
                          </div>
                       </div>
                       <div className="text-[9px] font-black text-slate-700 uppercase tracking-tighter text-center">{photo.label}</div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2 uppercase tracking-tight">
                 <AlertCircle className="w-5 h-5 text-emerald-400" /> Aktivitas Terbaru
              </h2>
              <div className="space-y-6 relative">
                 <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10"></div>
                 {[
                   { time: '08:45', user: 'Hasan', msg: 'Sapi #S-018 selesai disembelih', status: 'done' },
                   { time: '08:43', user: 'Yanto', msg: '50 paket batch 2 selesai dikemas', status: 'done' },
                   { time: '08:40', user: 'Rudi', msg: 'Tim distribusi zona Barat berangkat', status: 'info' },
                   { time: '08:38', user: 'Dedi', msg: 'Sapi #S-015 selesai dipotong → kemas', status: 'done' },
                 ].map((activity, i) => (
                   <div key={i} className="relative pl-6 flex items-start justify-between">
                      <div className={cn(
                        "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-slate-900 flex items-center justify-center",
                        activity.status === 'done' ? "bg-emerald-500" : "bg-blue-500"
                      )}></div>
                      <div>
                        <span className="text-[10px] font-black text-emerald-400 mr-2 uppercase">{activity.time}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.user}:</span>
                        <p className="text-xs font-medium text-slate-100 mt-1">{activity.msg}</p>
                      </div>
                      {activity.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs transition-all uppercase tracking-widest">
                 View Full Activity Log
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
