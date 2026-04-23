import React from 'react';
import { 
  Plus, 
  Clock, 
  List as ListIcon, 
  Layout, 
  MessageCircle, 
  X, 
  Send, 
  MoreHorizontal, 
  TrendingUp, 
  GanttChart, 
  User, 
  History 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Task, KanbanColumn } from '../../types';

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'todo', label: 'Belum Mulai', color: '#EF4444', bgLight: 'bg-red-50', textDark: 'text-red-700' },
  { id: 'in_progress', label: 'In Progress', color: '#EAB308', bgLight: 'bg-orange-50', textDark: 'text-orange-700' },
  { id: 'review', label: 'Review', color: '#3B82F6', bgLight: 'bg-blue-50', textDark: 'text-blue-700' },
  { id: 'done', label: 'Selesai', color: '#22C55E', bgLight: 'bg-emerald-50', textDark: 'text-emerald-700' },
];

const KanbanBoard = () => {
  const [viewMode, setViewMode] = React.useState<'kanban' | 'timeline' | 'list'>('kanban');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = React.useState(false);
  
  // Dummy Data - Integrated with Org Structure Logic
  const [tasks] = React.useState<Task[]>([
    {
      id: 'T-1',
      title: 'Beli plastik kemas 500 lembar',
      description: 'Plastik HD tebal ukuran 2kg untuk distribusi zona Barat.',
      status: 'todo',
      priority: 'high',
      divisionId: 'Kemas',
      assignedTo: ['Yanto', 'Div. Kemas'],
      dueDate: '2026-06-01',
      createdAt: '2026-05-15',
      subtasks: [{ id: 's1', title: 'Cek stok gudang', completed: true }, { id: 's2', title: 'Order vendor', completed: false }]
    },
    {
      id: 'T-2',
      title: 'Timbang sapi #S-003 s/d #S-007',
      description: 'Update berat aktual untuk data yield daging.',
      status: 'in_progress',
      priority: 'medium',
      divisionId: 'Proses',
      assignedTo: ['Dedi'],
      dueDate: '2026-06-05',
      createdAt: '2026-05-18',
      subtasks: []
    },
    {
      id: 'T-3',
      title: 'Follow-up pembayaran cicilan',
      description: 'Ada 5 shohibul yang jatuh tempo hari ini.',
      status: 'in_progress',
      priority: 'urgent',
      divisionId: 'Keuangan',
      assignedTo: ['Bu Sari'],
      dueDate: '2026-06-10',
      createdAt: '2026-05-20',
      subtasks: []
    },
    {
      id: 'T-4',
      title: 'Beli pisau sembelih',
      description: 'Pisau Victorinox 25cm (2 unit).',
      status: 'done',
      priority: 'urgent',
      divisionId: 'Sembelih',
      assignedTo: ['Ust. Hasan'],
      dueDate: '2026-05-20',
      createdAt: '2026-05-10',
      subtasks: []
    }
  ]);

  const getActivityFeed = () => [
    { user: 'Ust. Hasan', action: 'menyelesaikan', task: 'Beli pisau sembelih', time: '08:45 WIB', status: 'done' },
    { user: 'Dedi', action: 'memulai', task: 'Timbang sapi #S-003', time: '08:30 WIB', status: 'in_progress' },
    { user: 'Bu Sari', action: 'mengupdate', task: 'Follow-up pembayaran', time: '08:15 WIB', status: 'in_progress' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-600 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-10 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Command Center</h1>
          <p className="text-slate-500 font-medium">Manajemen Koordinasi & To-Do List Global</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn("p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest", viewMode === 'kanban' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
            >
              <Layout className="w-4 h-4" /> Kanban
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={cn("p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest", viewMode === 'timeline' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
            >
              <GanttChart className="w-4 h-4" /> Timeline
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest", viewMode === 'list' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
            >
              <ListIcon className="w-4 h-4" /> List
            </button>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Buat Task
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Content Area (Main Views) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Progress Overview Panel */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8">
            {KANBAN_COLUMNS.map(col => (
               <div key={col.id} className="space-y-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }}></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{col.label}</span>
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-900">{tasks.filter(t => t.status === col.id).length}</span>
                    <span className="text-xs font-bold text-slate-400 mb-1.5">Task</span>
                 </div>
               </div>
            ))}
          </div>

          {/* Render Active View */}
          <div className="min-h-[600px]">
            {viewMode === 'kanban' && (
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                 {KANBAN_COLUMNS.map((column) => (
                   <div key={column.id} className="w-[320px] shrink-0 flex flex-col gap-4">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: column.color }}></div>
                           <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">{column.label}</h3>
                        </div>
                        <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        {tasks.filter(t => t.status === column.id).map((task) => (
                          <div key={task.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group border-t-4" style={{ borderTopColor: column.color }}>
                             <div className="flex justify-between items-start mb-4">
                                <div className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase border", getPriorityColor(task.priority))}>
                                   {task.priority === 'urgent' && '🔥 '}{task.priority}
                                </div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">#{task.id}</div>
                             </div>
                             <h4 className="font-black text-slate-800 text-sm mb-2 leading-tight group-hover:text-emerald-600 transition-colors">{task.title}</h4>
                             <div className="flex flex-wrap gap-1.5 mb-4">
                                {task.assignedTo.map((tag, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-tighter border border-slate-100">@{tag}</span>
                                ))}
                             </div>
                             <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                      <User className="w-3 h-3 text-slate-400" />
                                   </div>
                                   <span className="text-[9px] font-black text-slate-400 uppercase">{task.divisionId}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400">
                                   <Clock className="w-3 h-3" /> {task.dueDate}
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {viewMode === 'timeline' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Gantt View - Juni 2026</h3>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase">Hari Ini</button>
                    </div>
                 </div>
                 <div className="space-y-6">
                    {tasks.map((task, i) => (
                      <div key={i} className="grid grid-cols-12 items-center gap-4 group">
                         <div className="col-span-3 text-xs font-black text-slate-700 truncate group-hover:text-emerald-600 transition-colors">{task.title}</div>
                         <div className="col-span-9 h-6 bg-slate-50 rounded-full relative">
                            <div 
                              className="absolute h-full rounded-full flex items-center px-4 text-[8px] font-black text-white uppercase shadow-lg"
                              style={{ 
                                left: `${i * 10}%`, 
                                width: '40%', 
                                backgroundColor: KANBAN_COLUMNS.find(c => c.id === task.status)?.color 
                              }}
                            >
                               {task.status}
                            </div>
                         </div>
                      </div>
                    ))}
                    {/* Vertical marker for Idul Adha */}
                    <div className="pt-10 border-t border-slate-100 relative">
                       <div className="absolute top-0 bottom-0 left-[70%] w-[2px] bg-red-500/20 flex flex-col items-center">
                          <div className="px-3 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded shadow-lg whitespace-nowrap">H-Day Idul Adha</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {viewMode === 'list' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-5 text-left">Task</th>
                          <th className="px-4 py-5 text-left">Assignee</th>
                          <th className="px-4 py-5 text-left">Status</th>
                          <th className="px-4 py-5 text-left">Priority</th>
                          <th className="px-8 py-5 text-right">Aksi</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {tasks.map(task => (
                         <tr key={task.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                            <td className="px-8 py-5 font-black text-slate-800 text-sm group-hover:text-emerald-600">{task.title}</td>
                            <td className="px-4 py-5">
                               <div className="flex gap-1">
                                  {task.assignedTo.slice(0, 2).map((a, j) => (
                                    <span key={j} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[8px] font-black uppercase">@{a}</span>
                                  ))}
                               </div>
                            </td>
                            <td className="px-4 py-5">
                               <span className={cn(
                                 "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                 KANBAN_COLUMNS.find(c => c.id === task.status)?.bgLight,
                                 KANBAN_COLUMNS.find(c => c.id === task.status)?.textDark
                               )}>
                                 {task.status}
                               </span>
                            </td>
                            <td className="px-4 py-5">
                               <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase", getPriorityColor(task.priority))}>{task.priority}</span>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <button className="p-2 text-slate-300 hover:text-slate-900"><MoreHorizontal className="w-4 h-4" /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Real-time Monitoring) */}
        <div className="space-y-6">
           {/* Division Progress */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-600" /> Division Progress
              </h3>
              <div className="space-y-6">
                 {[
                   { name: 'Div. Sembelih', progress: 100, color: 'bg-emerald-500' },
                   { name: 'Div. Proses', progress: 65, color: 'bg-blue-500' },
                   { name: 'Div. Kemas', progress: 30, color: 'bg-orange-500' },
                   { name: 'Div. Keuangan', progress: 85, color: 'bg-purple-500' },
                 ].map((div, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                         <span className="text-slate-500">{div.name}</span>
                         <span className="text-slate-900">{div.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full transition-all duration-1000", div.color)} style={{ width: `${div.progress}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Activity Feed */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
              <h3 className="text-sm font-black mb-6 uppercase tracking-widest flex items-center gap-2">
                 <History className="w-4 h-4 text-emerald-400" /> Activity Feed
              </h3>
              <div className="space-y-6 relative">
                 <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10"></div>
                 {getActivityFeed().map((feed, i) => (
                    <div key={i} className="relative pl-6 space-y-1">
                       <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-slate-900 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-400 uppercase">{feed.user}</span>
                          <span className="text-[8px] font-bold text-slate-500">{feed.time}</span>
                       </div>
                       <p className="text-[10px] font-medium text-slate-100 leading-tight">
                          <span className="text-slate-400">{feed.action}:</span> {feed.task}
                       </p>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">View All Activity</button>
           </div>

           {/* Quick Broadcast Widget */}
           <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <MessageCircle className="w-20 h-20" />
              </div>
              <h3 className="font-black text-lg mb-2 uppercase tracking-tight">Push Update</h3>
              <p className="text-emerald-100 text-[10px] font-medium mb-4 leading-relaxed italic">Kirim pesan WhatsApp broadcast ke seluruh panitia yang belum menyelesaikan task hari ini.</p>
              <button 
                onClick={() => setIsBroadcastModalOpen(true)}
                className="bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
              >
                 Broadcast WhatsApp
              </button>
           </div>
        </div>
      </div>

      {/* Broadcast Modal Reuse Logic */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBroadcastModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <MessageCircle className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="font-black text-lg uppercase tracking-tight">Broadcast WA</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Internal Coordination</p>
                   </div>
                </div>
                <button onClick={() => setIsBroadcastModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
             </div>
             <div className="p-10 space-y-8">
                <textarea 
                   className="w-full h-40 bg-slate-50 border-none rounded-[2rem] p-6 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-inner"
                   placeholder="Tulis instruksi atau pengingat untuk seluruh panitia..."
                   defaultValue={`Rekan-rekan panitia, mohon prioritaskan task yang masih berwarna MERAH di Kanban Board. Pastikan upload foto bukti penyelesaian. Semangat!`}
                ></textarea>
                <button className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-4">
                   <Send className="w-5 h-5" /> Kirim Sekarang (45 Panitia)
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
