import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Plus, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  LayoutDashboard, 
  ShieldCheck, 
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  ArrowRight,
  Activity,
  ChevronRight,
  Truck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* 🏛️ Masjid Account Header & Global Progress */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Masjid Al-Ikhlas Control Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">Ibadah Qurban<br/>1447H / 2026M</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
           <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="text-right">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Progress</div>
                 <div className="text-xl font-black text-slate-900">53.4%</div>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-slate-100 flex items-center justify-center text-[10px] font-black text-emerald-600">
                 Done
              </div>
           </div>
           <div className="bg-slate-900 text-white px-8 py-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
              <div className="space-y-1">
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Countdown to Hari-H</div>
                 <div className="flex gap-4 text-2xl font-black italic tabular-nums">
                    <span>15H</span>
                    <span className="text-slate-700">:</span>
                    <span>08J</span>
                    <span className="text-slate-700">:</span>
                    <span>23M</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 🚪 Role Portals (Quick Entry) */}
      <section className="space-y-6">
         <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4" /> Role Entrance Portals
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
               { title: 'Admin Command', desc: 'Global Control & Monitoring', path: '/admin/kanban', icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-slate-900' },
               { title: 'Panitia Lapangan', desc: 'Tasks & SOP Execution', path: '/panitia', icon: <Activity className="w-6 h-6" />, color: 'bg-emerald-600' },
               { title: 'Jagal / Sembelih', desc: 'Slaughter Queue & Sharia', path: '/jagal', icon: <Users className="w-6 h-6" />, color: 'bg-blue-600' },
               { title: 'Marketplace', desc: 'Animal Procurement', path: '/admin/marketplace', icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-orange-600' },
            ].map((portal, i) => (
               <button 
                  key={i} 
                  onClick={() => navigate(portal.path)}
                  className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-500 transition-all text-left relative overflow-hidden active:scale-95"
               >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", portal.color)}>
                     {portal.icon}
                  </div>
                  <h3 className="font-black text-lg text-slate-900 mb-1">{portal.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{portal.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                     Masuk Portal <ArrowRight className="w-3.5 h-3.5" />
                  </div>
               </button>
            ))}
         </div>
      </section>

      {/* 📊 Live Distribution & Operations Overview */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-emerald-600" /> Operational Metrics
                  </h2>
                  <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View Live Map</button>
               </div>
               
               <div className="grid sm:grid-cols-3 gap-10">
                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hewan Sembelih</div>
                     <div className="text-3xl font-black text-slate-900">42 / 80</div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '52%' }}></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kantong Terkemas</div>
                     <div className="text-3xl font-black text-slate-900">185 / 1,200</div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '15%' }}></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mustahik Terlayani</div>
                     <div className="text-3xl font-black text-slate-900">45 / 840</div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: '5%' }}></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest flex items-center gap-2">
                     <Users className="w-4 h-4 text-blue-600" /> Key Personnel Online
                  </h3>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase">12 Active</span>
               </div>
               <div className="p-8">
                  <div className="flex flex-wrap gap-4">
                     {['Hasan', 'Dedi', 'Yanto', 'Bu Sari', 'Rudi', 'Ust. Mahmud'].map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                           <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-400 relative">
                              {name.charAt(0)}
                              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-50"></div>
                           </div>
                           <div className="font-black text-xs text-slate-700">{name}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl space-y-8">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-emerald-400" /> Mustahik Registry
               </h3>
               <div className="space-y-4">
                  {[
                     { label: 'Fakir Miskin', count: 120, progress: 100, color: 'bg-emerald-500' },
                     { label: 'Yatim Piatu', count: 45, progress: 80, color: 'bg-blue-500' },
                     { label: 'Lansia & Janda', count: 85, progress: 40, color: 'bg-orange-500' },
                  ].map((cat, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                           <span className="text-slate-400">{cat.label}</span>
                           <span className="text-white">{cat.count} KK</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className={cn("h-full", cat.color)} style={{ width: `${cat.progress}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
               <button onClick={() => navigate('/admin/mustahik')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  Kelola Data Mustahik <ChevronRight className="w-4 h-4" />
               </button>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> Recent Distributions
               </h3>
               <div className="space-y-4">
                  {[1, 2].map(i => (
                     <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                           <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                           <div className="text-[10px] font-black text-slate-800 uppercase">Paket #PKT-084{i}</div>
                           <p className="text-[9px] text-slate-500 font-medium">Delivered to Ibu Siti (Zona Barat) • 08:45 WIB</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
