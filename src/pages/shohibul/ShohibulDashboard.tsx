import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Award, MessageCircle, MapPin } from 'lucide-react';
import { listMyQurbanCases } from '../../services/tracking';

export default function ShohibulDashboard() {
  const [qurbanData, setQurbanData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const cases = await listMyQurbanCases();
        if (cancelled) return;
        setQurbanData(
          cases.map((c) => ({
            id: c.id,
            status: c.status,
            statusLabel: c.status.replaceAll('_', ' '),
            date: new Date(c.last_updated_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            animalId: c.animal_id ?? '-',
          })),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-600/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assalamu&apos;alaikum!</h1>
            <p className="text-emerald-50 text-lg opacity-90">Pantau proses qurban Anda secara amanah.</p>
          </div>
          <Link
            to="/shohibul/payments"
            className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
          >
            Konfirmasi Pembayaran <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Qurban Aktif</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {loading && (
              <div className="sm:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 text-slate-500 font-bold text-center">
                Memuat data qurban...
              </div>
            )}
            {!loading && qurbanData.length === 0 && (
              <div className="sm:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 text-slate-500 font-bold text-center">
                Belum ada data qurban untuk akun ini.
              </div>
            )}

            {qurbanData.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-700">
                    {q.statusLabel}
                  </div>
                  <span className="text-slate-400 text-xs font-medium">{q.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                  <MapPin className="w-4 h-4" />
                  ID Hewan: {q.animalId}
                </div>
                <Link
                  to={`/shohibul/tracking/${q.id}`}
                  className="w-full py-3 rounded-xl border border-slate-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all font-bold text-slate-600 flex items-center justify-center gap-2"
                >
                  Detail Tracking <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/shohibul/payments" className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">Bayar</span>
            </Link>
            <Link to="/shohibul/certificate/demo" className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">Sertifikat</span>
            </Link>
            <button className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">Bantuan</span>
            </button>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 opacity-60">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">Jadwal</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="font-bold text-slate-900 text-lg">Info Masjid</div>
            <div className="text-sm text-slate-500">Tampil sesuai tenant Anda</div>
          </div>
        </div>
      </div>
    </div>
  );
}

