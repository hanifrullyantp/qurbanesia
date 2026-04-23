## Qurbanesia.id (React + Vite + Supabase)

### Setup lokal
- **Install**:

```bash
npm install
```

- **Env**: copy `.env.example` → `.env` lalu isi:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

- **Run**:

```bash
npm run dev
```

### Supabase (schema + storage + functions)
- **Migrations** ada di `supabase/migrations/`.
- Jalankan migrations via Supabase CLI atau Dashboard SQL editor.
- **Buckets** dibuat oleh migration `202604230002_storage.sql`.
- **Storage policies** ada di `202604230003_storage_policies.sql` dengan konvensi path: `${tenant_id}/...`.

### Edge Functions
- `supabase/functions/send-email`: kirim email via Resend, log ke `notification_logs`.
  - Secrets yang dibutuhkan:
    - `RESEND_API_KEY`
    - `RESEND_FROM` (opsional)
- `supabase/functions/generate-certificate`: generate PDF sederhana, upload ke bucket `certificates`, insert ke `media_assets`.

### Deploy (GitHub → Vercel)
- Import repo ke Vercel.
- Set **Environment Variables** di Vercel sesuai `.env.example`.
- `vercel.json` sudah disiapkan untuk SPA rewrite (React Router).

