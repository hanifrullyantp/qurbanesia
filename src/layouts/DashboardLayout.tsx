import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Globe, 
  Server, 
  FileText, 
  Activity, 
  ShoppingCart, 
  Wallet,
  Package,
  Heart,
  UserPlus,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../auth/AuthProvider';
import { WithTenantDataPrompt } from '../components/tenant/WithTenantDataPrompt';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const adminMenu = [
    { title: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
    { title: 'Command Center', icon: <ClipboardList className="w-5 h-5" />, path: '/admin/kanban' },
    { title: 'Marketplace', icon: <ShoppingCart className="w-5 h-5" />, path: '/admin/marketplace' },
    { title: 'Finance', icon: <Wallet className="w-5 h-5" />, path: '/admin/finance' },
    { title: 'Shohibul', icon: <Users className="w-5 h-5" />, path: '/admin/shohibul' },
    { title: 'Mustahik', icon: <Heart className="w-5 h-5" />, path: '/admin/mustahik' },
    { title: 'Hewan Qurban', icon: <MapPin className="w-5 h-5" />, path: '/admin/hewan' },
    { title: 'Distribusi', icon: <Package className="w-5 h-5" />, path: '/admin/distribution' },
    { title: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/admin/notifications' },
    { title: 'Permintaan', icon: <UserPlus className="w-5 h-5" />, path: '/admin/join-requests' },
    { title: 'Live Monitoring', icon: <Activity className="w-5 h-5" />, path: '/admin/monitoring' },
    { title: 'Organisasi', icon: <ShieldCheck className="w-5 h-5" />, path: '/admin/organization' },
    { title: 'Manajemen SOP', icon: <FileText className="w-5 h-5" />, path: '/admin/sop' },
    { title: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
  ];

  const superAdminMenu = [
    { title: 'Platform Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/super-admin' },
    { title: 'Tenant Management', icon: <Building2 className="w-5 h-5" />, path: '/super-admin/tenants' },
    { title: 'Billing & Subscriptions', icon: <CreditCard className="w-5 h-5" />, path: '/super-admin/billing' },
    { title: 'Global Analytics', icon: <Globe className="w-5 h-5" />, path: '/super-admin/analytics' },
    { title: 'System Health', icon: <Server className="w-5 h-5" />, path: '/super-admin/system' },
  ];

  const shohibulMenu = [
    { title: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" />, path: '/shohibul' },
    { title: 'Live Tracking', icon: <MapPin className="w-5 h-5" />, path: '/shohibul/tracking/1' },
    { title: 'Profil Saya', icon: <Users className="w-5 h-5" />, path: '/shohibul/profile' },
  ];

  const menu =
    profile?.role === 'admin_masjid'
      ? adminMenu
      : profile?.role === 'super_admin'
        ? superAdminMenu
        : shohibulMenu;

  return (
    <WithTenantDataPrompt>
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Qurbanesia<span className="text-emerald-600">.id</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                  location.pathname === item.path 
                    ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 w-full transition-all"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">Masjid Al-Barkah</div>
                <div className="text-xs text-slate-500 capitalize">{(profile?.role ?? 'user').replace('_', ' ')} Account</div>
              </div>
              <img 
                src={`https://i.pravatar.cc/150?u=${profile?.role ?? 'user'}`} 
                className="w-10 h-10 rounded-xl border border-slate-200"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
    </WithTenantDataPrompt>
  );
};

export default DashboardLayout;
