import React from 'react';
import { 
  Bell, 
  MessageCircle, 
  Settings, 
  History, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Mail,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { NotificationTemplate, NotificationLog, NotificationChannel } from '../../types';

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = React.useState<'templates' | 'logs' | 'settings'>('templates');

  const templates: NotificationTemplate[] = [
    { 
      id: 'T-001', 
      trigger: 'Registrasi Shohibul', 
      channels: ['whatsapp', 'push'], 
      message: "Assalamu'alaikum {{nama}}, pendaftaran qurban Anda di {{masjid}} telah kami terima. Kode Booking: {{kode}}",
      isActive: true,
      variables: ['nama', 'masjid', 'kode']
    },
    { 
      id: 'T-002', 
      trigger: 'Proses Penyembelihan', 
      channels: ['whatsapp'], 
      message: "Bismillah, {{nama}}. Hewan qurban Anda ({{kode}}) sedang dalam proses penyembelihan di {{masjid}}. Mohon doanya.",
      isActive: true,
      variables: ['nama', 'kode', 'masjid']
    },
    { 
      id: 'T-003', 
      trigger: 'Daging Siap Diambil', 
      channels: ['whatsapp', 'push'], 
      message: "Alhamdulillah, {{nama}}. Daging qurban Anda sudah siap diambil di {{lokasi}}. No Antrian: {{antrian}}",
      isActive: false,
      variables: ['nama', 'lokasi', 'antrian']
    }
  ];

  const logs: NotificationLog[] = [
    { id: 'L-1', recipient: 'Bpk. Ahmad', channel: 'whatsapp', status: 'read', timestamp: '08:45 WIB', message: 'Sapi sedang disembelih...' },
    { id: 'L-2', recipient: 'Ibu Ratna', channel: 'whatsapp', status: 'delivered', timestamp: '08:40 WIB', message: 'Invoice pembayaran...' },
    { id: 'L-3', recipient: 'Bpk. Heru', channel: 'push', status: 'sent', timestamp: '08:30 WIB', message: 'Update harian hewan...' },
    { id: 'L-4', recipient: 'CV Ternak', channel: 'whatsapp', status: 'failed', timestamp: '08:15 WIB', message: 'PO #ORD-445 diterima...' },
  ];

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-emerald-600" />;
      case 'push': return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'email': return <Mail className="w-4 h-4 text-orange-600" />;
      default: return <Zap className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Notification Engine</h1>
          <p className="text-slate-500 font-medium italic">Kelola otomasi pesan WhatsApp, Push, dan Email dalam satu sistem.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
           <button 
            onClick={() => setActiveTab('templates')}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'templates' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
           >
              Templates
           </button>
           <button 
            onClick={() => setActiveTab('logs')}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'logs' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
           >
              Logs
           </button>
           <button 
            onClick={() => setActiveTab('settings')}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'settings' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
           >
              Integration
           </button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Otomasi Trigger</h2>
                 <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Template Baru
                 </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 {templates.map((t) => (
                    <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t.id}</div>
                             <h3 className="text-lg font-black text-slate-900">{t.trigger}</h3>
                          </div>
                          <button className={cn(
                            "w-12 h-6 rounded-full relative transition-all",
                            t.isActive ? "bg-emerald-500" : "bg-slate-200"
                          )}>
                             <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", t.isActive ? "right-1" : "left-1")}></div>
                          </button>
                       </div>
                       
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                          <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{t.message}"</p>
                       </div>

                       <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                             {t.channels.map(c => (
                               <div key={c} className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm" title={c}>
                                  {getChannelIcon(c)}
                               </div>
                             ))}
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="flex -space-x-1.5">
                                {t.variables.map(v => (
                                  <div key={v} className="px-2 py-0.5 bg-slate-200 text-slate-500 border border-white rounded text-[8px] font-black uppercase tracking-tighter" title={`Variable: ${v}`}>
                                     {v}
                                  </div>
                                ))}
                             </div>
                             <button className="text-slate-300 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                 <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> WhatsApp Health
                 </h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">API Connection</span>
                       <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded">Connected ✅</span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-slate-400">Monthly Credit</span>
                          <span className="text-emerald-400">4,250 / 5,000</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all">Top Up Credit</button>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/10">
                    <Smartphone className="w-8 h-8" />
                 </div>
                 <h4 className="font-black text-slate-900 mb-2 uppercase text-sm">Mobile Push Notification</h4>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-6">Integrasikan sistem dengan Firebase Cloud Messaging untuk notifikasi app real-time.</p>
                 <button className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1 mx-auto hover:underline">Setup Firebase <ExternalLink className="w-3.5 h-3.5" /></button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
           <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
              <div className="relative flex-1 w-full md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Cari log penerima..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all shadow-inner" />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100">
                 <Filter className="w-4 h-4" /> All Channels
              </button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                       <th className="px-8 py-5">Recipient</th>
                       <th className="px-4 py-5">Channel</th>
                       <th className="px-4 py-5">Status</th>
                       <th className="px-4 py-5">Timestamp</th>
                       <th className="px-4 py-5">Message Snippet</th>
                       <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                         <td className="px-8 py-5">
                            <div className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{log.recipient}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{log.id}</div>
                         </td>
                         <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                               {getChannelIcon(log.channel)}
                               <span className="text-[10px] font-black uppercase text-slate-600">{log.channel}</span>
                            </div>
                         </td>
                         <td className="px-4 py-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                              log.status === 'read' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              log.status === 'delivered' ? "bg-blue-50 text-blue-600 border-blue-100" :
                              log.status === 'failed' ? "bg-red-50 text-red-600 border-red-100" :
                              "bg-slate-50 text-slate-400 border-slate-100"
                            )}>
                               {log.status}
                            </span>
                         </td>
                         <td className="px-4 py-5 text-xs font-bold text-slate-400 uppercase">{log.timestamp}</td>
                         <td className="px-4 py-5 max-w-[200px]">
                            <p className="text-[10px] font-medium text-slate-600 truncate">{log.message}</p>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><ArrowRight className="w-4 h-4" /></button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom duration-300">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-12 space-y-10">
              <div className="text-center">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/10">
                    <MessageCircle className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">WhatsApp API Integration</h2>
                 <p className="text-sm text-slate-500 font-medium italic mt-2">Pilih provider WhatsApp Gateway yang ingin Anda gunakan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['Fonnte', 'Wablas', 'Official Meta API'].map(prov => (
                   <button key={prov} className={cn(
                     "p-6 rounded-[2rem] border-2 transition-all text-center space-y-3",
                     prov === 'Fonnte' ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-lg" : "border-slate-100 text-slate-400 hover:border-slate-200"
                   )}>
                      <div className="font-black text-xs uppercase tracking-widest">{prov}</div>
                      <div className="text-[8px] font-bold opacity-60 uppercase">{prov === 'Official Meta API' ? 'Enterprise' : 'Recommended'}</div>
                   </button>
                 ))}
              </div>

              <div className="space-y-6 pt-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Key / Token</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input type="password" value="••••••••••••••••••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Device ID</label>
                    <input type="text" defaultValue="DEV-77812-QX" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-700 outline-none" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-4 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">Save Integration</button>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Test Connection</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;

function ExternalLink(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
