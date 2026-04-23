import React from 'react';
import { 
  Users, 
  UserPlus, 
  GitBranch, 
  X, 
  Edit2, 
  Trash2, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Phone, 
  LayoutGrid, 
  Plus, 
  AlertCircle,
  MoreVertical,
  Lock,
  ListTodo,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Division, CommitteeMember, Permission } from '../../types';

const ALL_PERMISSIONS: { id: Permission; label: string }[] = [
  { id: 'manage_tasks', label: 'Kelola Tugas' },
  { id: 'manage_finance', label: 'Kelola Keuangan' },
  { id: 'manage_animals', label: 'Kelola Hewan' },
  { id: 'manage_shohibul', label: 'Kelola Shohibul' },
  { id: 'view_reports', label: 'Lihat Laporan' },
  { id: 'broadcast_wa', label: 'WhatsApp Broadcast' },
  { id: 'manage_organization', label: 'Kelola Organisasi' },
  { id: 'manage_sop', label: 'Kelola SOP' },
  { id: 'manage_marketplace', label: 'Marketplace Access' },
  { id: 'view_monitoring', label: 'Live Monitoring' },
];

const OrganizationStructure = () => {
  const [selectedMember, setSelectedMember] = React.useState<CommitteeMember | null>(null);
  const [editingMember, setEditingMember] = React.useState<CommitteeMember | null>(null);

  // 5-Tier Structure Mock Data
  const [members, setMembers] = React.useState<CommitteeMember[]>([
    // Level 0: Penasehat (Multiple)
    { id: 'p0-1', name: 'K.H. Syarifuddin', phone: '0811', role: 'Penasehat Utama', level: 0, isCoordinator: false, avatar: '', hasReadSop: true, permissions: ['view_reports'] },
    { id: 'p0-2', name: 'Ust. Mansyur Ali', phone: '0811', role: 'Dewan Syariah', level: 0, isCoordinator: false, avatar: '', hasReadSop: true, permissions: ['view_reports'] },
    
    // Level 1: Ketua Umum
    { id: 'p1', name: 'Ust. Ahmad Mansyur', phone: '0812', role: 'Ketua Umum', level: 1, isCoordinator: true, avatar: '', hasReadSop: true, permissions: ['manage_organization', 'manage_tasks', 'view_reports', 'broadcast_wa'] },
    
    // Level 2: Pengurus Inti
    { id: 'p2-1', name: 'Pak Budi', phone: '0813', role: 'Ketua 1', level: 2, parentId: 'p1', isCoordinator: false, avatar: '', hasReadSop: true, permissions: ['manage_tasks'] },
    { id: 'p2-2', name: 'Pak Roni', phone: '0814', role: 'Sekretaris', level: 2, parentId: 'p1', isCoordinator: false, avatar: '', hasReadSop: true, permissions: ['manage_sop'] },
    { id: 'p2-3', name: 'Bu Sari', phone: '0815', role: 'Bendahara', level: 2, parentId: 'p1', isCoordinator: false, avatar: '', hasReadSop: true, permissions: ['manage_finance'] },
    
    // Level 3: Ketua Divisi
    { id: 'p3-1', name: 'Ust. Hasan', phone: '0816', role: 'Ketua Div. Sembelih', level: 3, divisionId: 'div-1', parentId: 'p2-1', isCoordinator: true, avatar: '', hasReadSop: true, permissions: ['manage_animals'] },
    { id: 'p3-2', name: 'Dedi Kurnia', phone: '0817', role: 'Ketua Div. Proses', level: 3, divisionId: 'div-2', parentId: 'p2-1', isCoordinator: true, avatar: '', hasReadSop: true, permissions: ['manage_tasks'] },
    
    // Level 4: Anggota
    { id: 'p4-1', name: 'Ust. Mahmud', phone: '0818', role: 'Jagal Utama', level: 4, divisionId: 'div-1', parentId: 'p3-1', isCoordinator: false, avatar: '', hasReadSop: true, permissions: [] },
    { id: 'p4-2', name: 'Beni', phone: '0819', role: 'Petugas Kebersihan', level: 4, divisionId: 'div-1', parentId: 'p3-1', isCoordinator: false, avatar: '', hasReadSop: false, permissions: [] },
  ]);

  const [divisions] = React.useState<Division[]>([
    { id: 'div-1', name: 'Div. Sembelih', color: 'bg-red-500', members: [], tasks: [
      { id: 't1', title: 'Asah Pisau Sembelih', description: '', status: 'done', priority: 'high', divisionId: 'div-1', assignedTo: ['p4-1'], createdAt: '', subtasks: [] }
    ]},
    { id: 'div-2', name: 'Div. Proses Daging', color: 'bg-blue-500', members: [], tasks: [] },
  ]);

  const getSubordinates = (parentId: string) => members.filter(m => m.parentId === parentId);
  const getPenasehat = () => members.filter(m => m.level === 0);
  const getKetuaUmum = () => members.find(m => m.level === 1);

  const togglePermission = (memberId: string, permission: Permission) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const has = m.permissions.includes(permission);
        const updated = has ? m.permissions.filter(p => p !== permission) : [...m.permissions, permission];
        return { ...m, permissions: updated };
      }
      return m;
    }));
  };

  const handleEditMember = (m: CommitteeMember) => {
    const newName = prompt("Edit Nama:", m.name);
    const newRole = prompt("Edit Jabatan:", m.role);
    if (!newName || !newRole) return;
    setMembers(prev => prev.map(item => item.id === m.id ? { ...item, name: newName, role: newRole } : item));
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Hapus personel ini dari struktur?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
      setSelectedMember(null);
    }
  };

  const handleAddMember = (divId: string) => {
    const name = prompt("Nama Anggota Baru:");
    if (!name) return;
    setMembers(prev => [
      ...prev,
      { 
        id: Math.random().toString(), 
        name, 
        phone: '08xx', 
        role: 'Anggota', 
        divisionId: divId, 
        isCoordinator: false, 
        avatar: '', 
        hasReadSop: false,
        permissions: [],
        level: 4,
        parentId: divId
      }
    ]);
  };

  const renderMemberCard = (m: CommitteeMember, isShadow: boolean = false) => (
    <div 
      key={m.id}
      onClick={() => setSelectedMember(m)}
      className={cn(
        "relative p-5 rounded-[2rem] w-64 text-center transition-all group cursor-pointer border-2",
        isShadow 
          ? "bg-slate-50/50 border-dashed border-slate-200 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:bg-white" 
          : "bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 hover:scale-105",
        m.level === 1 ? "bg-slate-900 text-white border-slate-900 w-72 p-8 shadow-2xl" : ""
      )}
    >
      {/* Role Indicator */}
      <div className={cn(
        "text-[9px] font-black uppercase tracking-widest mb-1",
        m.level === 1 ? "text-emerald-400" : "text-slate-400"
      )}>
        {m.role}
      </div>
      <div className={cn("font-black truncate", m.level === 1 ? "text-xl" : "text-sm")}>{m.name}</div>
      
      {m.level > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
           <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase">
              LVL {m.level}
           </div>
           {m.permissions.length > 0 && (
             <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <Lock className="w-2.5 h-2.5 text-blue-600" />
             </div>
           )}
           {m.hasReadSop ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-orange-400" />}
        </div>
      )}

      {/* Quick Actions Overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
         <button onClick={(e) => { e.stopPropagation(); handleEditMember(m); }} className="p-1.5 bg-white/90 rounded-lg text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100"><Edit2 className="w-3 h-3" /></button>
         <button onClick={(e) => { e.stopPropagation(); handleDeleteMember(m.id); }} className="p-1.5 bg-white/90 rounded-lg text-slate-400 hover:text-red-500 shadow-sm border border-slate-100"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
  );

  const ketuaUmum = getKetuaUmum();

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Panitia', value: members.length, icon: <Users className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Penasehat', value: getPenasehat().length, icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
          { label: 'SOP Read Rate', value: '82%', icon: <UserCheck className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Invite', value: '3', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4">
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>{stat.icon}</div>
             <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                <div className="text-xl font-black text-slate-900">{stat.value}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Organizational Tree */}
      <div className="bg-white p-20 rounded-[4rem] border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-max flex flex-col items-center">
          
          {/* LVL 0: Penasehat (Ghost/Shadow Style) */}
          <div className="flex gap-8 mb-12">
             {getPenasehat().map(p => renderMemberCard(p, true))}
          </div>

          {/* LVL 1: Ketua Umum */}
          {ketuaUmum && (
            <div className="relative flex flex-col items-center">
              <div className="absolute -top-12 left-1/2 w-[2px] h-12 bg-slate-100 -translate-x-1/2"></div>
              {renderMemberCard(ketuaUmum)}
              <div className="w-[2px] h-20 bg-slate-200"></div>
            </div>
          )}

          {/* LVL 2: Core Officers Row */}
          <div className="relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-slate-200"></div>
             <div className="flex gap-12 pt-10">
                {ketuaUmum && getSubordinates(ketuaUmum.id).map(c => (
                  <div key={c.id} className="flex flex-col items-center relative">
                    <div className="absolute top-0 left-1/2 w-[2px] h-10 bg-slate-200 -translate-x-1/2"></div>
                    {renderMemberCard(c)}
                    
                    {/* Render LVL 3: Divisions under LVL 2 */}
                    <div className="w-[2px] h-20 bg-slate-200"></div>
                    <div className="relative">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-slate-100"></div>
                       <div className="flex gap-8 pt-8">
                          {getSubordinates(c.id).map(divHead => (
                            <div key={divHead.id} className="flex flex-col items-center relative">
                               <div className="absolute top-0 left-1/2 w-[2px] h-8 bg-slate-100 -translate-x-1/2"></div>
                               {renderMemberCard(divHead)}
                               
                               {/* LVL 4: Members under Div Head */}
                               <div className="w-[2px] h-12 bg-slate-50"></div>
                               <div className="flex flex-col gap-3">
                                  {getSubordinates(divHead.id).map(member => renderMemberCard(member))}
                                  <button 
                                    onClick={() => handleAddMember(divHead.id)}
                                    className="p-3 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-300 hover:text-emerald-500 transition-all uppercase"
                                  >
                                    + Add Member
                                  </button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Member/Node Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[200] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}></div>
           <div className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className={cn(
                "p-10 text-white relative overflow-hidden",
                selectedMember.level === 0 ? "bg-slate-400" : selectedMember.level === 1 ? "bg-slate-900" : "bg-emerald-600"
              )}>
                 <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-2">
                       <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{selectedMember.role}</div>
                       <h2 className="text-3xl font-black">{selectedMember.name}</h2>
                       <div className="flex items-center gap-3 pt-2">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase">Level {selectedMember.level}</span>
                          <span className="text-xs font-medium text-emerald-100">{selectedMember.phone}</span>
                       </div>
                    </div>
                    <button onClick={() => setSelectedMember(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                 </div>
                 <Users className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10" />
              </div>

              <div className="p-10 space-y-10">
                 {/* Roles & Permissions Section */}
                 <section className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <Lock className="w-4 h-4 text-blue-600" /> Hak Akses Fitur
                       </h3>
                       <button onClick={() => setEditingMember(selectedMember)} className="text-[10px] font-black text-emerald-600 uppercase underline">Ubah Role</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {selectedMember.permissions.length === 0 ? (
                         <div className="text-xs text-slate-400 italic">Personel ini tidak memiliki akses fitur admin (Hanya App Panitia).</div>
                       ) : (
                         selectedMember.permissions.map(p => (
                           <span key={p} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[9px] font-black uppercase border border-blue-100">{p.replace('_', ' ')}</span>
                         ))
                       )}
                    </div>
                 </section>

                 {/* Personal To-Do List (Hierarchy Based) */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <ListTodo className="w-4 h-4 text-orange-500" /> 
                       {selectedMember.level < 4 ? `Tugas Tim & Bawahan` : `Tugas Personal`}
                    </h3>
                    
                    <div className="space-y-3">
                       {/* Filtered tasks based on hierarchy */}
                       <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-xs font-black text-slate-700">Timbang Sapi #S-005</span>
                             </div>
                             <span className="text-[8px] font-black uppercase text-slate-400">In Progress</span>
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-bold">
                             <span className="text-slate-400">Assigned to: <span className="text-slate-900">Ahmad (Member)</span></span>
                             <button className="text-emerald-600 uppercase">View Detail</button>
                          </div>
                       </div>
                       
                       <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 hover:text-emerald-500 hover:border-emerald-200 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Delegasikan Tugas Baru
                       </button>
                    </div>
                 </section>

                 {/* SOP Readiness */}
                 <section className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Kesiapan SOP</h3>
                       {selectedMember.hasReadSop ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-orange-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                       {selectedMember.hasReadSop 
                         ? `Personel telah mengonfirmasi pembacaan SOP Divisi.` 
                         : `Personel belum membaca SOP. Kirim pengingat via WhatsApp untuk memastikan standar kerja dipahami.`}
                    </p>
                    {!selectedMember.hasReadSop && (
                      <button className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700">
                         Kirim Reminder WA
                      </button>
                    )}
                 </section>

                 <div className="pt-10 border-t border-slate-100 flex gap-4">
                    <button className="flex-1 py-4 bg-slate-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50" onClick={() => handleDeleteMember(selectedMember.id)}>Pecat dari Panitia</button>
                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100"><MoreVertical className="w-5 h-5" /></button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Editing Permissions Modal (RBAC) */}
      {editingMember && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingMember(null)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-8 bg-slate-900 text-white border-b border-white/5 flex justify-between items-center">
                 <div>
                    <h3 className="font-black text-lg uppercase tracking-tight">Access Control (RBAC)</h3>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{editingMember.name} • {editingMember.role}</p>
                 </div>
                 <button onClick={() => setEditingMember(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-10 space-y-6">
                 <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                    {ALL_PERMISSIONS.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => togglePermission(editingMember.id, p.id)}
                        className={cn(
                          "flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left",
                          editingMember.permissions.includes(p.id) 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900" 
                            : "bg-white border-slate-100 text-slate-400 grayscale"
                        )}
                      >
                         <div className="space-y-0.5">
                            <div className="text-[10px] font-black uppercase tracking-widest">{p.label}</div>
                            <div className="text-[8px] font-medium opacity-60">Izin untuk {p.label.toLowerCase()} di dashboard.</div>
                         </div>
                         {editingMember.permissions.includes(p.id) && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      </button>
                    ))}
                 </div>
                 <button onClick={() => setEditingMember(null)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all">Update Access Privileges</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationStructure;
