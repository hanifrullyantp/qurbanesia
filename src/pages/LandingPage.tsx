import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, MapPin, Smartphone, Users, BarChart3, ArrowRight, Camera, MessageCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Qurbanesia<span className="text-emerald-600">.id</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Fitur</a>
          <a href="#solutions" className="hover:text-emerald-600 transition-colors">Solusi</a>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">Harga</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 font-semibold px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">Masuk</Link>
          <Link to="/signup" className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">Daftar Sekarang</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Platform SaaS Qurban #1 di Indonesia
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Kelola Qurban <br />
              <span className="text-emerald-600">Lebih Amanah</span> <br />
              & Transparan.
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Transformasi digital untuk Masjid & Lembaga. Tracking real-time untuk Shohibul, koordinasi tanpa chaos untuk Panitia.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto bg-emerald-600 text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 group">
                Mulai Kelola Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto bg-white text-slate-900 text-lg font-bold px-8 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Lihat Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="User" />
                ))}
              </div>
              <div>
                <div className="font-bold text-slate-900">1.200+ Masjid</div>
                <div className="text-sm text-slate-500">Telah bergabung mengelola qurban digital</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-400/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=800" 
                className="rounded-[2rem] w-full h-[500px] object-cover" 
                alt="Qurban tracking app preview" 
              />
              <div className="absolute top-1/2 -right-12 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block animate-bounce">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Status Terbaru</div>
                    <div className="font-bold text-slate-900">Sapi sedang disembelih</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Flagships Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Fitur Unggulan</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Solusi End-to-End untuk Ekosistem Qurban</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Flagship #1: Live Tracking */}
            <div className="group p-8 lg:p-12 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-2xl hover:shadow-emerald-600/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Smartphone className="w-40 h-40" />
              </div>
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-3xl font-extrabold text-slate-900 mb-4">Shohibul Live Tracking</h4>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Pantau setiap tahapan ibadah qurban Anda. Dari pembayaran, konfirmasi hewan di kandang, hingga proses penyembelihan dengan dokumentasi foto real-time.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Notifikasi Real-time via WhatsApp",
                  "Galeri Foto per Tahapan",
                  "Sertifikat Digital QR-Verified",
                  "Tracking Lokasi Hewan"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Flagship #2: Admin Command Center */}
            <div className="group p-8 lg:p-12 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-emerald-600/30 transition-all hover:shadow-2xl hover:shadow-emerald-600/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                <BarChart3 className="w-40 h-40" />
              </div>
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-3xl font-extrabold text-white mb-4">Admin Command Center</h4>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Ubah chaos panitia menjadi operasional terstruktur. Manajemen tugas berbasis Kanban, SOP digital, dan monitoring beban kerja panitia dalam satu dashboard.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Kanban Board Drag & Drop",
                  "Otomatisasi Milestone (H-90 s/d D-Day)",
                  "Management SOP & Checklist",
                  "Monitoring Kapasitas Tim"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8">Siap Mendigitalisasi <br /> Qurban di Masjid Anda?</h2>
          <p className="text-emerald-50 text-xl mb-12 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan masjid lainnya dan berikan pengalaman ibadah yang lebih baik untuk para shohibul.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="bg-white text-emerald-600 text-xl font-bold px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-2xl active:scale-95">
              Daftar Sekarang
            </Link>
            <button className="bg-emerald-700 text-white text-xl font-bold px-10 py-5 rounded-2xl border border-emerald-500 hover:bg-emerald-800 transition-all">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-bold tracking-tight">Qurbanesia<span className="text-emerald-500">.id</span></span>
            </div>
            <p className="max-w-sm mb-8">
              Pusat manajemen qurban digital terlengkap di Indonesia. Amanah, transparan, dan profesional.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Camera className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Produk</h5>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Dashboard Admin</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Tracking Shohibul</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Aplikasi Panitia</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Marketplace Hewan</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Bantuan</h5>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Panduan Penggunaan</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Fikih Qurban</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Kontak CS</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-800 text-center text-sm">
          &copy; 2026 Qurbanesia.id. Terdaftar di Kominfo sebagai Penyelenggara Sistem Elektronik.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
