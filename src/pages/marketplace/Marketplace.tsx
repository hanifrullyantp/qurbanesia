import React from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  CheckCircle2, 
  MessageCircle, 
  ShoppingCart, 
  Heart, 
  PlayCircle,
  Truck,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { createOrder, listMarketplaceAnimals } from '../../services/marketplace';

const Marketplace = () => {
  const [animals, setAnimals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await listMarketplaceAnimals();
        if (cancelled) return;
        setAnimals(
          data.map((a) => {
            const price = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(a.price_idr);
            const image =
              (Array.isArray(a.photos) && a.photos[0]) ||
              'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400';
            return {
              id: a.id,
              supplierId: a.supplier_id,
              title: `${a.type.toUpperCase()} ${a.breed ?? ''} (${a.grade})`.trim(),
              supplier: 'Supplier',
              rating: 4.7,
              verified: true,
              location: '-',
              weight: a.weight_kg ? `±${a.weight_kg} Kg` : '-',
              age: a.age_years ? `${a.age_years} th` : '-',
              price,
              priceIdr: a.price_idr,
              tag: a.status === 'available' ? 'Ready' : a.status,
              image,
            };
          }),
        );
        setError(null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Gagal memuat marketplace');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Marketplace Hewan</h1>
          <p className="text-slate-500 font-medium italic">Temukan hewan qurban terbaik langsung dari peternak terverifikasi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button className="p-2 bg-slate-100 text-slate-900 rounded-lg"><LayoutGrid className="w-4 h-4" /></button>
             <button className="p-2 text-slate-400 hover:text-slate-600"><ListIcon className="w-4 h-4" /></button>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Keranjang
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari Limosin, Simental, Kambing Etawa..." className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
         </div>
         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
               📍 Jakarta <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
               🐄 Jenis <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
               💰 Harga <ChevronDown className="w-3 h-3" />
            </button>
            <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg">
               <Filter className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Animal Grid */}
      <div className="grid md:grid-cols-2 gap-8">
         {loading && (
           <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-10 text-center text-slate-500 font-bold">
             Memuat data marketplace...
           </div>
         )}
         {error && !loading && (
           <div className="md:col-span-2 bg-red-50 rounded-[2.5rem] border border-red-100 p-10 text-center text-red-700 font-bold">
             {error}
           </div>
         )}
         {animals.map((item) => (
           <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-emerald-600/5 transition-all group">
              <div className="aspect-video relative overflow-hidden">
                 <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                       <CheckCircle2 className="w-3 h-3" /> Sertifikat Sehat
                    </div>
                 </div>
                 <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="p-3 bg-white/90 backdrop-blur rounded-2xl text-slate-900 shadow-lg active:scale-90 transition-all">
                       <PlayCircle className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/90 backdrop-blur rounded-2xl text-red-500 shadow-lg active:scale-90 transition-all">
                       <Heart className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                       {item.tag}
                    </div>
                 </div>
              </div>

              <div className="p-8">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <span className="text-slate-900">{item.supplier}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <div className="flex items-center gap-1 text-orange-500">
                             <Star className="w-3 h-3 fill-orange-500" /> {item.rating}
                          </div>
                          {item.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest justify-end mb-1">
                          <MapPin className="w-3 h-3" /> {item.location}
                       </div>
                       <div className="text-2xl font-black text-slate-900">{item.price}</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Berat</div>
                       <div className="text-xs font-black text-slate-700">{item.weight}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Umur</div>
                       <div className="text-xs font-black text-slate-700">{item.age}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</div>
                       <div className="text-xs font-black text-slate-700">Jantan</div>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          await createOrder({
                            supplierId: item.supplierId,
                            items: [{ supplierAnimalId: item.id, priceIdr: item.priceIdr, quantity: 1 }],
                          });
                          alert('Order dibuat (submitted). Lanjutkan proses pembayaran di modul finance.');
                        } catch (e: any) {
                          alert(e?.message ?? 'Gagal membuat order');
                        }
                      }}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                       <ShoppingCart className="w-4 h-4" /> PESAN SEKARANG
                    </button>
                    <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all">
                       <MessageCircle className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Escrow Guarantee Banner */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="w-32 h-32" />
         </div>
         <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-emerald-600/20">
            <Truck className="w-10 h-10 text-white" />
         </div>
         <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tight">Escrow & Garansi Qurbanesia</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Dana Anda akan ditahan oleh Qurbanesia dan baru dicairkan ke Supplier 48 jam setelah hewan Anda konfirmasi diterima & sehat oleh Masjid.</p>
         </div>
         <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all shrink-0">PELAJARI ESCROW</button>
      </div>
    </div>
  );
};

export default Marketplace;
