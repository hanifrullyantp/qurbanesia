import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Camera, 
  QrCode, 
  ChevronRight,
  LayoutDashboard,
  CheckSquare,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { WithTenantDataPrompt } from '../../components/tenant/WithTenantDataPrompt';

const KANBAN_COLUMNS = [
  { id: 'todo', label: 'Belum Mulai', color: '#EF4444', icon: '🔴' },
  { id: 'in_progress', label: 'In Progress', color: '#EAB308', icon: '🟡' },
  { id: 'review', label: 'Review', color: '#3B82F6', icon: '🔵' },
  { id: 'done', label: 'Selesai', color: '#22C55E', icon: '🟢' },
];

const PanitiaDashboard = () => {
  const [tasks, setTasks] = React.useState([
    { id: 'T-101', title: 'Briefing pagi', status: 'done', time: '06:00', priority: 'low', division: 'Umum' },
    { id: 'T-102', title: 'Siapkan peralatan', status: 'done', time: '06:30', priority: 'medium', division: 'Proses' },
    { id: 'T-103', title: 'Timbang sapi #S-001', status: 'done', time: '07:30', priority: 'high', division: 'Proses' },
    { id: 'T-104', title: 'Timbang sapi #S-002', status: 'done', time: '08:00', priority: 'high', division: 'Proses' },
    { id: 'T-105', title: 'Timbang sapi #S-003', status: 'in_progress', time: '08:15', priority: 'high', division: 'Proses' },
    { id: 'T-106', title: 'Timbang sapi #S-004', status: 'todo', time: '09:00', priority: 'high', division: 'Proses' },
    { id: 'T-107', title: 'Potong daging sapi #S-001', status: 'todo', time: '10:00', priority: 'medium', division: 'Proses' },
  ]);

  const [activeFilter, setActiveFilter] = React.useState('all');

  const handleStatusCycle = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const currentIndex = KANBAN_COLUMNS.findIndex(c => c.id === t.status);
        const nextIndex = (currentIndex + 1) % KANBAN_COLUMNS.length;
        
        if (KANBAN_COLUMNS[nextIndex].id === 'done') {
          if (!confirm('Tandai sebagai [Selesai]?')) return t;
        }
        
        return { ...t, status: KANBAN_COLUMNS[nextIndex].id };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => {
     if (activeFilter === 'all') return true;
     if (activeFilter === 'todo') return t.status === 'todo';
     if (activeFilter === 'in_progress') return t.status === 'in_progress';
     if (activeFilter === 'done') return t.status === 'done';
     if (activeFilter === 'urgent') return t.priority === 'high' || t.priority === 'urgent';
     return true;
  });

  return (
    <WithTenantDataPrompt>
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Header Panitia */}
      <header className="bg-emerald-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=dedi" alt="Dedi" />
             </div>
             <div>
                <div className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Panitia Lapangan</div>
                <div className="font-black text-lg">Dedi Kurnia</div>
             </div>
          </div>
          <button className="relative p-2 bg-white/10 rounded-xl">
             <MessageCircle className="w-6 h-6" />
             <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></span>
          </button>
        </div>
        
        <div className="flex justify-between items-end">
           <div>
              <div className="text-xs font-bold text-emerald-100 uppercase tracking-widest opacity-80">Masjid Al-Ikhlas</div>
              <div className="text-sm font-black italic">10 Dzulhijjah 1447H</div>
           </div>
           <div className="text-right">
              <div className="text-2xl font-black tabular-nums">08:15</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">WIB</div>
           </div>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* SOP Quick Access */}
        <section>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">SOP Divisi Anda</div>
          <Link to="/admin/sop/1" className="block bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all group">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                   <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <div className="text-sm font-black text-slate-800">SOP Divisi Proses Daging</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase">Versi 2.0 • Published</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
             </div>
          </Link>
        </section>

        {/* My Tasks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tugas Saya Hari Ini</div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">4/13 Selesai</div>
          </div>
          
        {/* Quick Filter */}
        <section className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {[
             { id: 'all', label: 'Semua', color: 'bg-slate-900 text-white' },
             { id: 'todo', label: '🔴 Belum', color: 'bg-white text-slate-600 border-slate-200' },
             { id: 'in_progress', label: '🟡 Proses', color: 'bg-white text-slate-600 border-slate-200' },
             { id: 'done', label: '🟢 Selesai', color: 'bg-white text-slate-600 border-slate-200' },
             { id: 'urgent', label: '⚡ Urgent', color: 'bg-white text-slate-600 border-slate-200' },
           ].map(f => (
             <button 
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                activeFilter === f.id ? "bg-slate-900 text-white shadow-lg border-slate-900" : "bg-white text-slate-500 border-slate-200"
              )}
             >
                {f.label}
             </button>
           ))}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tugas Saya Hari Ini</div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{tasks.filter(t => t.status === 'done').length}/{tasks.length} Selesai</div>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="divide-y divide-slate-50">
                {filteredTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors group"
                  >
                    <button 
                      onClick={() => handleStatusCycle(task.id)}
                      className={cn(
                        "w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all active:scale-90 shadow-sm",
                        task.status === 'done' ? "bg-emerald-500 border-emerald-500 text-white" : 
                        task.status === 'in_progress' ? "bg-orange-400 border-orange-400 text-white animate-pulse" : 
                        task.status === 'review' ? "bg-blue-400 border-blue-400 text-white" :
                        "bg-white border-red-500"
                      )}
                      style={{ borderColor: KANBAN_COLUMNS.find(c => c.id === task.status)?.color }}
                    >
                      {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : 
                       task.status === 'in_progress' ? <Clock className="w-5 h-5" /> : 
                       <span className="text-[10px] font-black">{KANBAN_COLUMNS.find(c => c.id === task.status)?.icon}</span>}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                       <Link to={`/panitia/task/${task.id}`}>
                          <div className={cn(
                            "text-sm font-black transition-all",
                            task.status === 'done' ? "text-slate-400 line-through" : "text-slate-800 group-hover:text-emerald-600"
                          )}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{task.time} WIB</span>
                             <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                             <span className={cn(
                                "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                                task.priority === 'high' ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"
                             )}>{task.priority}</span>
                          </div>
                       </Link>
                    </div>

                    <button className="p-2 text-slate-300 hover:text-slate-600">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </section>
        </section>

        {/* Progress Bar */}
        <section className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-end mb-3">
              <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Progress Saya</div>
              <div className="text-xs font-black text-emerald-600">31%</div>
           </div>
           <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: '31%' }}></div>
           </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
           <button className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all flex flex-col items-center gap-3 active:scale-95">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                 <Camera className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-center">Foto Bukti</span>
           </button>
           <button className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all flex flex-col items-center gap-3 active:scale-95">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-center">Scan QR Code</span>
           </button>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 max-w-md mx-auto">
         <button className="flex flex-col items-center gap-1 text-emerald-600">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 transition-colors">
            <CheckSquare className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Task</span>
         </button>
         <div className="relative -top-8">
            <button className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/30 active:scale-90 transition-transform">
               <Camera className="w-7 h-7" />
            </button>
         </div>
         <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Chat</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 transition-colors">
            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-100 overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=dedi" alt="Profile" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
         </button>
      </nav>
    </div>
    </WithTenantDataPrompt>
  );
};

export default PanitiaDashboard;
