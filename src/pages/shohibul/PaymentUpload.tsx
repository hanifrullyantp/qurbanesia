import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDefaultTenantBankAccount } from '../../services/tenantBankAccounts';
import { createPayment, getSignedProofUrl, listMyPayments, uploadPaymentProof } from '../../services/payments';
import { supabase } from '../../lib/supabaseClient';

export default function PaymentUpload() {
  const [bank, setBank] = React.useState<any | null>(null);
  const [shohibulId, setShohibulId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<number>(0);
  const [payerName, setPayerName] = React.useState('');
  const [method, setMethod] = React.useState('Transfer');
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [payments, setPayments] = React.useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const b = await getDefaultTenantBankAccount();
        if (!cancelled) setBank(b);

        // Resolve shohibul id for current user
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('Belum login');

        const { data: profile, error: pErr } = await supabase.from('profiles').select('tenant_id').eq('user_id', userId).maybeSingle();
        if (pErr) throw pErr;
        if (!profile?.tenant_id) throw new Error('Tenant belum terpasang di profile');

        const { data: sh, error: sErr } = await supabase
          .from('shohibuls')
          .select('id')
          .eq('tenant_id', profile.tenant_id)
          .eq('user_id', userId)
          .maybeSingle();
        if (sErr) throw sErr;
        if (!sh?.id) throw new Error('Akun shohibul belum terhubung (shohibuls.user_id kosong)');
        if (!cancelled) setShohibulId(sh.id);

        const rows = await listMyPayments(sh.id);
        if (cancelled) return;
        const enriched = await Promise.all(
          rows.map(async (r) => {
            const proofUrl = r.proof_path ? await getSignedProofUrl(r.proof_path) : null;
            return { ...r, proofUrl };
          }),
        );
        setPayments(enriched);
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Gagal memuat');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async () => {
    if (!shohibulId) return;
    if (!file) {
      setError('Mohon upload bukti pembayaran.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Nominal wajib diisi.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const paymentId = await createPayment({
        shohibulId,
        amountIdr: amount,
        method,
        payerName,
        transferAt: new Date().toISOString(),
        tenantBankAccountId: bank?.id ?? null,
      });
      await uploadPaymentProof({ paymentId, file });
      window.location.reload();
    } catch (e: any) {
      setError(e?.message ?? 'Gagal submit pembayaran');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link to="/shohibul" className="p-2 hover:bg-white rounded-xl border border-slate-200 bg-white">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Konfirmasi Pembayaran</h1>
      </div>

      {loading && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-500 font-bold">Memuat...</div>
      )}

      {error && !loading && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-700 font-bold">{error}</div>
      )}

      {!loading && (
        <>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rekening Tujuan Masjid</div>
                <div className="text-lg font-black text-slate-900">
                  {bank ? `${bank.bank_name} • ${bank.account_number}` : 'Belum diset (hubungi admin masjid)'}
                </div>
                {bank && <div className="text-xs font-bold text-slate-500">a/n {bank.account_holder}</div>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal (IDR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Pengirim</label>
                <input
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Nama sesuai rekening pengirim"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode</label>
                <input
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Bukti</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  if (f) setPreviewUrl(URL.createObjectURL(f));
                }}
              />
              {previewUrl && (
                <img src={previewUrl} className="max-h-64 rounded-2xl border border-slate-200" />
              )}
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 disabled:bg-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Submit Bukti Bayar
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h2 className="font-black text-slate-900 uppercase tracking-tight">Riwayat Pembayaran</h2>
              <p className="text-slate-500 text-sm">Status dihitung dari verifikasi finance.</p>
            </div>
            <div className="divide-y divide-slate-50">
              {payments.length === 0 ? (
                <div className="p-8 text-slate-500 font-bold">Belum ada pembayaran.</div>
              ) : (
                payments.map((p) => (
                  <div key={p.id} className="p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-black text-slate-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.amount_idr)}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.method ?? '-'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.status === 'verified' ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                          <CheckCircle2 className="w-4 h-4" /> verified
                        </div>
                      ) : p.status === 'rejected' ? (
                        <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase">
                          <AlertCircle className="w-4 h-4" /> rejected
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase">
                          <AlertCircle className="w-4 h-4" /> submitted
                        </div>
                      )}
                      {p.proofUrl && (
                        <a className="text-blue-600 font-black text-[10px] uppercase underline" href={p.proofUrl} target="_blank" rel="noreferrer">
                          Lihat Bukti
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

