# Qurbanesia Integration Map (UI → Supabase)

Dokumen ini memetakan halaman UI yang saat ini dummy/hardcoded menjadi sumber data Supabase (tabel + query utama) agar implementasi konsisten antar role.

## Konvensi umum
- **Tenant isolation**: hampir semua data scoped oleh `tenant_id`.
- **Role**: diambil dari `profiles.role` (linked ke `auth.users.id`).
- **ID**: gunakan UUID untuk primary key; tampilkan kode human-readable lewat kolom `code` bila perlu.

## Routing → sumber data

### Auth
- **`/login`** (`src/pages/auth/Login.tsx`)
  - **Supabase**: `auth.signInWithPassword()` / `auth.signInWithOtp()` (dipilih saat implementasi)
  - **After login**: query `profiles` untuk `role` + `tenant_id`, lalu redirect.

### Admin (Masjid)
- **`/admin/hewan`** (`src/pages/admin/AnimalManagement.tsx`)
  - **Tables**: `animals`, `animal_participants`, `shohibuls`, `tracking_events` (status terbaru), `media_assets` (thumbnail)
  - **Queries**:
    - list animals by tenant + computed participant count
    - list participants for selected animal (join `animal_participants` → `shohibuls`)
    - update animal status / add daily update (insert `tracking_events` + upload `media_assets`)

- **`/admin/shohibul`** (`src/pages/admin/ShohibulManagement.tsx`)
  - **Tables**: `shohibuls`, `payments`, `animal_participants`, `animals`
  - **Queries**:
    - list shohibuls by tenant (with `paid_amount` computed via `payments`)
    - create shohibul + optional assignment ke animal (insert `animal_participants`)
    - add payment (insert `payments`) → trigger recalculation status (`dp/cicilan/lunas`)

- **`/admin/distribution`** (`src/pages/admin/DistributionManagement.tsx`)
  - **Tables**: `distribution_configs`, `animal_yields`, `distributions`, `mustahiks`, `animals`
  - **Queries**:
    - read config (bagWeight & jatah shohibul)
    - list yields per animal + distributed count
    - create distribution batch, scan/confirm handover (update `distributions.status`)

- **`/admin/mustahik`** (`src/pages/admin/MustahikManagement.tsx`)
  - **Tables**: `mustahiks`, `distributions`
  - **Queries**:
    - CRUD mustahik (anti-duplikasi via unique `nik` per tenant, atau global policy)
    - progress per zona (aggregate `distributions` by `zone` & status)

- **`/admin/finance`** (`src/pages/admin/FinancialManagement.tsx`)
  - **Tables**: `financial_records` (atau view dari `payments` + procurement + operational)
  - **Queries**:
    - income dari `payments`
    - expense dari procurement orders + operational records

- **`/admin/marketplace`** (`src/pages/marketplace/Marketplace.tsx`)
  - (Marketplace sebagai admin perspective)

### Shohibul
- **`/shohibul`** (`src/pages/shohibul/ShohibulDashboard.tsx`)
  - **Tables**: `qurban_cases`, `animals`, `tracking_events` (latest), `gratitude_messages`
  - **Queries**:
    - list qurban cases for current `auth.user.id` (or `shohibul_id` mapping)
    - show latest status per case + link tracking

- **`/shohibul/tracking/:id`** (`src/pages/shohibul/LiveTracking.tsx`)
  - **Tables**: `qurban_cases`, `tracking_events`, `media_assets`, `animals`, `animal_participants`
  - **Queries**:
    - timeline events ordered by `occurred_at`
    - media gallery per stage (storage signed URL)

- **`/shohibul/certificate/:id`** (`src/pages/shohibul/CertificateView.tsx`)
  - **Tables**: `certificates` (or `media_assets` with type `certificate`)
  - **Edge Function**: `generate-certificate` (PDF) → upload ke storage → row created

### Marketplace (Supplier)
- **`/admin/marketplace`** (`src/pages/marketplace/Marketplace.tsx`)
  - **Tables**: `supplier_animals`, `suppliers`, `orders`, `order_items`
  - **Queries**:
    - browse animals (`supplier_animals.status='available'`)
    - create order + order_items (buyer = tenant)

### Jagal
- **`/jagal/process/:id`** (`src/pages/jagal/SlaughterProcess.tsx`)
  - **Tables**: `animals`, `tracking_events`, `media_assets`
  - **Actions**:
    - update status `sedang_disembelih`/`post-sembelih` (insert `tracking_events`)
    - upload photo (storage) + link in `media_assets`

### Penerima (Mustahik)
- **`/penerima`** (`src/pages/penerima/PenerimaStatus.tsx`)
  - **Tables**: `distributions`
  - **Queries**:
    - lookup by `package_code` (via query param atau input) → show status & driver
    - confirm received → update distribution status + optional `gratitude_messages`

