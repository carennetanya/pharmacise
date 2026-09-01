# 💊 Pharmacise

Aplikasi manajemen apotek berbasis web, dibuat pakai Vue 3 + Vite dan Supabase sebagai backend-nya.

## Tim

**Nama Tim:** CImoy Molly Bersatu

**Anggota:**
- Netanya Caren Hilary
- Rafael Julio Suseno
- Carolus Bramantyo Seno Mahesworo

## Tentang Pharmacise

Awalnya kita lihat banyak apotek kecil-menengah yang masih catat stok, transaksi, sampai pesanan ke supplier secara manual — entah di buku catatan atau spreadsheet yang gampang berantakan dan rawan human error. Dari situ kepikiran bikin **Pharmacise**, aplikasi yang bisa bantu apotek ngatur operasional harian mereka dari satu tempat, tanpa perlu ribet pindah-pindah tools atau catat ulang manual.

Aplikasi ini dibangun dengan konsep **multi-role**, jadi setiap orang yang kerja di apotek punya tampilan dan akses yang sesuai sama tugasnya masing-masing — bukan satu dashboard generik buat semua orang:

- **Owner (Pemilik Apotek)** — akses paling lengkap. Bisa lihat dashboard ringkasan, kelola inventory, orders, supplier, analytics, sampai pengaturan info apotek dan data staf/kasir.
- **Cashier (Kasir)** — dashboard-nya disederhanakan, fokus ke transaksi penjualan (POS) dan cek stok cepat pas lagi layani pembeli.
- **Pharmacy Technician / Staff** — bantu urus sisi operasional: kelola inventory dan pantau pesanan yang masuk.

Pembagian role ini penting karena di apotek beneran, nggak semua orang seharusnya bisa lihat atau ubah semua data — kasir nggak perlu (dan nggak seharusnya) bisa ubah data supplier misalnya. Jadi selain soal kenyamanan, ini juga soal keamanan data operasional.

### Fitur-fitur yang ada

- **Autentikasi & role selection** — login pakai Supabase Auth, terus milih peran (Owner/Cashier/Staff), dengan sistem PIN 4 digit khusus buat kasir dan staf biar login-nya cepat pas lagi jam sibuk.
- **Manajemen inventory** — tambah produk baru, edit data obat, dan lakukan penyesuaian stok (stock adjustment) kalau ada selisih fisik vs sistem.
- **Transaksi kasir (POS)** — pencatatan penjualan langsung dari dashboard kasir, jadi nggak perlu aplikasi kasir terpisah.
- **Import data lewat CSV** — buat yang punya data produk banyak, tinggal import file CSV daripada input satu-satu manual.
- **Scan faktur otomatis (OCR)** — ini salah satu fitur favorit kita: tinggal foto atau upload gambar faktur pembelian dari supplier, sistem bakal baca datanya otomatis pakai OCR, jadi nggak perlu ketik ulang isi faktur.
- **Manajemen supplier & orders** — simpan data supplier dan bikin/lacak status pesanan pembelian ke mereka.
- **Analytics** — halaman ringkasan buat owner pantau performa apotek dari data yang udah tercatat.
- **Settings / Info Apotek** — atur profil apotek (nama, alamat, kontak, logo) dan kelola akun staf serta kasir dari satu tempat.

### Tech stack

- **Frontend:** Vue 3 dengan `<script setup>`, di-bundle pakai Vite
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage) — jadi nggak perlu bikin backend dari nol
- **Bahasa:** JavaScript

---

## Cara Menjalankan di Lokal

Sebelum mulai, pastiin udah siap:

- **Node.js** versi 18 ke atas — cek dengan `node -v`
- **npm** (biasanya udah otomatis ke-install bareng Node.js)
- **Akun Supabase** — daftar gratis di [supabase.com](https://supabase.com/) kalau belum punya, terus bikin project baru

Kalau semua udah siap, ikutin langkah-langkah ini:

**1. Clone repository-nya**
```bash
git clone <url-repo-ini>
cd pharmacise/pharma-app
```

**2. Install semua dependency**
```bash
npm install
```
Proses ini bakal download semua package yang dibutuhin (Vue, Vite, Supabase client, dll), tunggu sampai selesai.

**3. Setup environment variable**

Bikin file baru bernama `.env` di dalam folder `pharma-app` (sejajar sama `package.json`), terus isi kayak gini:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Dua nilai ini bisa kalian ambil dari Supabase Dashboard project masing-masing, di menu **Project Settings → API**. Tanpa ini, aplikasinya nggak bakal bisa konek ke database.

**4. Jalankan migrasi database**

Buka **SQL Editor** di dashboard Supabase kalian, terus copy-paste isi file `migration/0001_settings_info_apotek.sql`, lalu run. File ini bakal otomatis bikin tabel `pharmacies` dan `pharmacy_staff`, sekalian pasang security policy (RLS) dan storage bucket buat nyimpen logo apotek. Cukup dijalankan sekali aja di awal.

**5. Jalankan aplikasinya**
```bash
npm run dev
```
Kalau berhasil, aplikasi bakal jalan di `http://localhost:5173` (cek terminal ya, kadang port-nya bisa beda kalau 5173 lagi kepakai).

**6. (Opsional) Build buat production**
```bash
npm run build
```
Hasil build-nya bakal ada di folder `dist/`, siap buat di-deploy.

**7. (Opsional) Preview hasil build**
```bash
npm run preview
```
Ini buat ngetes hasil build production-nya sebelum beneran di-deploy.

---

## Struktur Folder

```
pharma-app/
├── src/
│   ├── components/   → halaman & dashboard tiap role (Admin, Cashier, Staff)
│   ├── modals/        → modal-modal (import CSV, scan OCR, form order, dll)
│   ├── services/       → fungsi-fungsi service, misalnya pengaturan apotek
│   ├── store/           → state management (ownerStore, cashierStore)
│   ├── lib/               → konfigurasi koneksi ke Supabase
│   └── App.vue
├── migration/            → file SQL buat setup database di Supabase
└── package.json
```
