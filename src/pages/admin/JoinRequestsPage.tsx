import React from 'react';
import { useAuth } from '../../auth/AuthProvider';
import {
  listPendingForMyTenant,
  listAllPendingJoinRequests,
  approveJoinRequestRpc,
  rejectJoinRequestRpc,
  type JoinRequestRow,
} from '../../services/joinRequests';
import { ShieldCheck, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JoinRequestsPage() {
  const { profile, refreshProfile } = useAuth();
  const [rows, setRows] = React.useState<JoinRequestRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionId, setActionId] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      if (profile?.role === 'super_admin') {
        const data = await listAllPendingJoinRequests();
        setRows(data);
        return;
      }
      if (!profile?.tenant_id) {
        setRows([]);
        return;
      }
      const data = await listPendingForMyTenant(profile.tenant_id);
      setRows(data);
    } catch (e) {
      setErr((e as Error)?.message || 'Gagal memuat permintaan');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.tenant_id, profile?.role]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onApprove = async (id: string) => {
    setActionId(id);
    setErr(null);
    try {
      await approveJoinRequestRpc(id);
      await refreshProfile();
      await load();
    } catch (e) {
      setErr((e as Error)?.message || 'Gagal menyetujui');
    } finally {
      setActionId(null);
    }
  };

  const onReject = async (id: string) => {
    setActionId(id);
    setErr(null);
    try {
      await rejectJoinRequestRpc(id);
      await load();
    } catch (e) {
      setErr((e as Error)?.message || 'Gagal menolak');
    } finally {
      setActionId(null);
    }
  };

  if (profile?.role !== 'admin_masjid' && profile?.role !== 'super_admin') {
    return (
      <div className="p-6 text-sm font-bold text-slate-500">Hanya admin masjid / super admin.</div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Permintaan bergabung</h1>
          <p className="text-sm text-slate-500">Setujui atau tolak — profil user akan disesuaikan otomatis.</p>
        </div>
        <Link to="/admin" className="ml-auto text-sm font-bold text-emerald-600">
          ← Admin
        </Link>
      </div>

      {err && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{err}</div>}

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Tidak ada permintaan pending.</div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-black uppercase text-slate-400">User ID</div>
                <div className="font-mono text-sm text-slate-800">{r.user_id}</div>
                <div className="mt-1 text-sm font-bold text-slate-700">Peran: {r.requested_role}</div>
                <div className="text-xs text-slate-400">
                  {new Date(r.created_at).toLocaleString('id-ID')}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(r.id)}
                  disabled={actionId === r.id}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase text-white"
                >
                  {actionId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Setujui
                </button>
                <button
                  type="button"
                  onClick={() => onReject(r.id)}
                  disabled={actionId === r.id}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase"
                >
                  <X className="h-4 w-4" />
                  Tolak
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
