import React from 'react';
import { 
  Building2, 
  Users, 
  Truck, 
  Store, 
  TrendingUp, 
  AlertTriangle, 
  Globe, 
  CheckCircle2,
  MoreVertical,
  ShieldCheck,
  Server
} from 'lucide-react';
import { cn } from '../../utils/cn';

const SuperAdminDashboard = () => {
  const stats = [
    { label: 'Tenant Aktif', value: '1,242', icon: <Building2 />, color: 'emerald' },
    { label: 'Shohibul Qurban', value: '45,820', icon: <Users />, color: 'blue' },
    { label: 'Hewan Qurban', value: '8,504', icon: <Truck />, color: 'orange' },
    { label: 'Supplier Aktif', value: '320', icon: <Store />, color: 'purple' },
  ];

  const tenants = [
    { name: 'Masjid Al-Barkah', plan: 'pro', status: 'active', health: 98, revenue: 'Rp 12.5M' },
    { name: 'Yayasan Insan Kamil', plan: 'basic', status: 'active', health: 85, revenue: 'Rp 4.2M' },
    { name: 'Masjid Agung Bogor', plan: 'enterprise', status: 'active', health: 100, revenue: 'Rp 45.0M' },
    { name: 'Komunitas Hijrah', plan: 'free', status: 'pending', health: 40, revenue: 'Rp 0' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Dashboard Super Admin</h1>
        <p className="text-slate-500">Monitoring ekosistem Qurbanesia.id secara global</p>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'orange' ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
            )}>
              {stat.icon}
            </div>
            <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> 
                Revenue & Subscription
              </h2>
              <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none">
                <option>Tahun Ini (2026)</option>
                <option>Tahun Lalu</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">MRR</div>
                <div className="text-lg font-black text-emerald-900">Rp 125.000.000</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">ARR</div>
                <div className="text-lg font-black text-blue-900">Rp 1.500.000.000</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Churn Rate</div>
                <div className="text-lg font-black text-orange-900">2.3%</div>
              </div>
            </div>

            {/* Simulated Chart Area */}
            <div className="h-64 bg-slate-50 rounded-2xl flex items-end justify-between px-8 py-4 gap-2">
              {[40, 60, 45, 70, 85, 90, 65, 80, 95, 100, 85, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-lg relative group transition-all hover:bg-emerald-500/40" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Rp {h}M
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
              <span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
            </div>
          </div>

          {/* National Stats & Map Placeholder */}
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden">
            <Globe className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5" />
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              Statistik Nasional
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-8 relative z-10">
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">Total Transaksi</div>
                <div className="text-3xl font-black text-emerald-400">Rp 85 Miliar</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">Total Hewan</div>
                <div className="text-3xl font-black text-white">52,000 ekor</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">Total Penerima</div>
                <div className="text-3xl font-black text-white">1.2 Juta KK</div>
              </div>
            </div>

            <div className="mt-12 h-40 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center border-dashed">
              <span className="text-slate-500 font-bold italic">Interactive National Heatmap Area</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Alerts & Tenants List */}
        <div className="space-y-8">
          {/* System Alerts */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              System Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <Building2 className="w-4 h-4 text-blue-600 mt-1" />
                <p className="text-xs text-blue-800 font-medium">3 tenant baru menunggu approval pendaftaran.</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                <p className="text-xs text-red-800 font-medium">Supplier "CV XYZ" dilaporkan oleh 2 tenant berbeda.</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                <Server className="w-4 h-4 text-orange-600 mt-1" />
                <p className="text-xs text-orange-800 font-medium">Server load mencapai 78%. Pertimbangkan scaling.</p>
              </div>
            </div>
          </div>

          {/* Top Tenants */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Monitor Tenant</h3>
              <button className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {tenants.map((tenant, i) => (
                <div key={i} className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{tenant.name}</div>
                    <button className="text-slate-400"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded border",
                      tenant.plan === 'enterprise' ? "bg-purple-50 text-purple-600 border-purple-100" :
                      tenant.plan === 'pro' ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      {tenant.plan}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{tenant.revenue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${tenant.health}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-600">{tenant.health}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-[2rem] text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Compliance Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100 border-b border-emerald-500 pb-2">
                <span>UU PDP Readiness</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100 border-b border-emerald-500 pb-2">
                <span>Data Encryption</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                <span>Security Audit Log</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
