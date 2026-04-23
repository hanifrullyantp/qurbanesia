import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Palette, 
  Bell, 
  Globe, 
  Save,
  Trash2,
  Plus,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import React from 'react';
import { createTenantBankAccount, deactivateTenantBankAccount, listTenantBankAccounts, setDefaultTenantBankAccount } from '../../services/tenantBankAccounts';

const Settings = () => {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = React.useState(true);
  const [accountsError, setAccountsError] = React.useState<string | null>(null);
  const [isAddBankOpen, setIsAddBankOpen] = React.useState(false);
  const [newAcc, setNewAcc] = React.useState({ bank_name: '', account_number: '', account_holder: '', is_default: true });

  const refreshAccounts = React.useCallback(async () => {
    const rows = await listTenantBankAccounts();
    setAccounts(rows);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingAccounts(true);
        await refreshAccounts();
        setAccountsError(null);
      } catch (e: any) {
        if (!cancelled) setAccountsError(e?.message ?? 'Gagal memuat rekening');
      } finally {
        if (!cancelled) setLoadingAccounts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshAccounts]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Pengaturan Event</h1>
          <p className="text-slate-500 font-medium">Konfigurasi operasional, harga, dan branding masjid.</p>
        </div>
        <button className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2">
          <Save className="w-4 h-4" /> Simpan Perubahan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Event Setup */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <Globe className="w-5 h-5 text-emerald-600" /> Informasi Dasar Event
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Event</label>
                    <input type="text" defaultValue="Qurban 1447H / 2026M" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun Hijriyah</label>
                    <input type="text" defaultValue="1447 H" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Mulai Daftar</label>
                    <input type="date" defaultValue="2026-03-01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Hari-H</label>
                    <input type="date" defaultValue="2026-06-10" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi Penyembelihan</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" defaultValue="Halaman Utama Masjid Al-Barkah, Bogor" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" />
                 </div>
              </div>
           </div>

           {/* Pricing Management */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                    <Palette className="w-5 h-5 text-blue-600" /> Paket & Harga Hewan
                 </h2>
                 <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+ Tambah Paket</button>
              </div>
              <div className="space-y-4">
                 {[
                   { type: 'Sapi Premium (1/7)', price: 'Rp 4.500.000', stock: 'Unlimited' },
                   { type: 'Kambing Premium', price: 'Rp 3.200.000', stock: '25 Ekor' },
                   { type: 'Domba Standar', price: 'Rp 2.800.000', stock: 'Unlimited' },
                 ].map((pkg, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group transition-all hover:border-emerald-200">
                      <div className="space-y-1">
                         <div className="text-sm font-black text-slate-900">{pkg.type}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuota: {pkg.stock}</div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <div className="text-sm font-black text-emerald-600">{pkg.price}</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase">Per Bagian</div>
                         </div>
                         <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Payment Configuration */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
                 <CreditCard className="w-5 h-5 text-emerald-400" /> Konfigurasi Pembayaran
              </h2>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transfer Manual</span>
                       <span className="px-2 py-0.5 bg-slate-700 text-white text-[8px] font-black uppercase rounded">Standard</span>
                    </div>
                    {loadingAccounts && <div className="text-xs font-bold text-slate-400">Memuat rekening...</div>}
                    {accountsError && !loadingAccounts && <div className="text-xs font-bold text-red-300">{accountsError}</div>}
                    {!loadingAccounts && !accountsError && accounts.length === 0 && (
                      <div className="text-xs font-bold text-slate-400">Belum ada rekening. Tambahkan rekening untuk pembayaran shohibul.</div>
                    )}
                    {!loadingAccounts && !accountsError && accounts.length > 0 && (
                      <div className="space-y-3">
                        {accounts.map((a: any) => (
                          <div key={a.id} className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="min-w-0">
                              <div className="text-xs font-black truncate">{a.bank_name}: {a.account_number}</div>
                              <div className="text-[10px] font-bold text-slate-300 truncate">a/n {a.account_holder}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {a.is_default ? (
                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Default
                                </span>
                              ) : (
                                <button
                                  onClick={async () => {
                                    await setDefaultTenantBankAccount(a.id);
                                    await refreshAccounts();
                                  }}
                                  className="text-[9px] font-black text-emerald-300 uppercase tracking-widest hover:underline"
                                >
                                  Jadikan Default
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  if (!confirm('Nonaktifkan rekening ini?')) return;
                                  await deactivateTenantBankAccount(a.id);
                                  await refreshAccounts();
                                }}
                                className="text-[9px] font-black text-red-300 uppercase tracking-widest hover:underline"
                              >
                                Nonaktifkan
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setIsAddBankOpen(true)}
                      className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-4 hover:underline"
                    >
                      + Tambah Rekening
                    </button>
                 </div>
              </div>
           </div>

           {isAddBankOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddBankOpen(false)} />
               <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                 <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                   <div className="font-black uppercase tracking-widest text-sm">Tambah Rekening</div>
                   <button onClick={() => setIsAddBankOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                     <X className="w-6 h-6" />
                   </button>
                 </div>
                 <div className="p-10 space-y-6">
                   <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank</label>
                       <input
                         value={newAcc.bank_name}
                         onChange={(e) => setNewAcc({ ...newAcc, bank_name: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Rekening</label>
                       <input
                         value={newAcc.account_number}
                         onChange={(e) => setNewAcc({ ...newAcc, account_number: e.target.value })}
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none"
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atas Nama</label>
                     <input
                       value={newAcc.account_holder}
                       onChange={(e) => setNewAcc({ ...newAcc, account_holder: e.target.value })}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none"
                     />
                   </div>
                   <label className="flex items-center gap-2 text-xs font-black text-slate-700">
                     <input
                       type="checkbox"
                       checked={newAcc.is_default}
                       onChange={(e) => setNewAcc({ ...newAcc, is_default: e.target.checked })}
                     />
                     Jadikan default
                   </label>
                   <button
                     onClick={async () => {
                       await createTenantBankAccount(newAcc);
                       if (newAcc.is_default) {
                         const rows = await listTenantBankAccounts();
                         const created = rows.find((r) => r.account_number === newAcc.account_number && r.bank_name === newAcc.bank_name);
                         if (created) await setDefaultTenantBankAccount(created.id);
                       }
                       await refreshAccounts();
                       setIsAddBankOpen(false);
                       setNewAcc({ bank_name: '', account_number: '', account_holder: '', is_default: true });
                     }}
                     className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30"
                   >
                     Simpan
                   </button>
                 </div>
               </div>
             </div>
           )}

           {/* Notification Settings */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <Bell className="w-5 h-5 text-orange-500" /> Notifikasi WhatsApp
              </h2>
              <div className="space-y-4">
                 {[
                   { label: 'Notif Pendaftaran', active: true },
                   { label: 'Reminder Pembayaran', active: true },
                   { label: 'Update Status Sembelih', active: true },
                   { label: 'Sertifikat Ready', active: false },
                 ].map((n, i) => (
                   <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-bold text-slate-600">{n.label}</span>
                      <button className={cn(
                        "w-10 h-5 rounded-full relative transition-all",
                        n.active ? "bg-emerald-500" : "bg-slate-200"
                      )}>
                         <div className={cn(
                           "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                           n.active ? "right-1" : "left-1"
                         )}></div>
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Branding Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                 <ShieldCheck className="w-5 h-5 text-emerald-600" /> Branding Masjid
              </h2>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-500 transition-all cursor-pointer">
                    <Plus className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase">Upload Logo</span>
                 </div>
                 <p className="text-[10px] text-slate-400 text-center font-medium">Gunakan logo masjid Anda untuk ditampilkan di Sertifikat dan Landing Page.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
