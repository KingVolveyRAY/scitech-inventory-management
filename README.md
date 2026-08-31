# 📦 Scitech Inventory Management System (SIMS)

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-17.0.0-FD366E?style=flat-square&logo=appwrite)](https://appwrite.io/)

**SIMS (Scitech Inventory Management System)** adalah platform manajemen dan peminjaman inventaris berbasis web modern untuk kebutuhan internal organisasi/perusahaan. Aplikasi ini dirancang untuk mempermudah alur peminjaman aset, pemantauan status ketersediaan barang secara real-time, approval peminjaman oleh admin, hingga pembuatan laporan analitik inventaris.

---

## 🚀 Fitur Utama

### 👥 Portal Client / Peminjam
- **Katalog Inventaris Real-Time**: Pencarian cepat, filter berdasarkan kategori barang, dan indikator status stok terkini.
- **Pengajuan Peminjaman Interaktif**: Form peminjaman dengan penentuan jumlah unit, durasi waktu pinjam, dan keperluan peminjaman.
- **Pelacakan Peminjaman ("My Loans")**: Monitor status permohonan pinjaman secara berkala (`Pending`, `Approved`, `Borrowed`, `Returned`, `Rejected`).
- **Permintaan Pengembalian Barang**: Mengajukan pengembalian aset yang telah selesai digunakan langsung dari dasbor pengguna.

### 🛡️ Panel Admin
- **Dasbor Analitik & Statistik**: Visualisasi data performa peminjaman dengan chart interaktif (Loans Bar Chart, Returns Area Chart, Status Distribution, Top Borrowers).
- **Manajemen Inventaris**: Tambah, ubah, hapus aset inventaris, kelola stok, dan unggah foto aset dengan Image Dropzone.
- **Verifikasi & Approval Pinjaman**: Peninjauan pengajuan pinjaman, persetujuan/penolakan, dan konfirmasi pengembalian barang.
- **Riwayat & Filter Lengkap**: Log riwayat transaksi peminjaman aset dengan filter tanggal, status, dan pengguna.
- **Manajemen Pengguna**: Manajemen data profil peminjam dan hak akses peran (*roles*).
- **Laporan & Ekspor Data**: Ekspor rekapitulasi data peminjaman ke format **PDF** dan **CSV** sesuai filter yang dipilih.

### 🔐 Autentikasi & Keamanan
- Autentikasi berbasis Appwrite Session & Server Actions.
- Verifikasi Email OTP & Reset Password terintegrasi dengan **Brevo API**.
- Proteksi route berbasis peran (*Role-Based Access Control* / RBAC).

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
| --- | --- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router), React 19 |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **Animasi & Grafis** | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/), [OGL](https://github.com/oframe/ogl), [Lottie React](https://github.com/Gamote/lottie-react) |
| **Backend as a Service** | [Appwrite](https://appwrite.io/) (Database, Storage, Auth, Realtime) |
| **Email Service** | [Brevo](https://www.brevo.com/) (Transactional Email & OTP) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand), [TanStack React Query v5](https://tanstack.com/query) |
| **Form & Validasi** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Export Utilities** | [jsPDF](https://github.com/parallax/jsPDF), `jspdf-autotable`, [PapaParse](https://www.papaparse.com/) |
| **Testing** | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/), Testing Library |
| **Deployment** | [Netlify](https://www.netlify.com/) (`@netlify/plugin-nextjs`) |

---

## 📁 Struktur Direktori

```text
├── app/                  # Next.js App Router
│   ├── (admin)/          # Rute & halaman panel Admin (dashboard, inventory, loans, reports, users)
│   ├── (auth)/           # Rute autentikasi (login, register, forgot-password)
│   ├── (client)/         # Rute peminjam (catalog, borrow, my-loans)
│   └── api/              # Route handlers / REST API endpoints
├── components/           # Komponen UI modular
│   ├── admin/            # Komponen khusus panel Admin (tabel, dialog approval, chart)
│   ├── client/           # Komponen katalog & peminjaman client
│   ├── forms/            # Form login, register, borrow, item management
│   ├── providers/        # QueryProvider, RealtimeProvider
│   └── ui/               # Reusable atomic UI components (Button, Dialog, Modal, dll.)
├── hooks/                # Custom React hooks & React Query hooks
├── lib/                  # Server actions, klien Appwrite SDK, validator Zod, utilities
├── scripts/              # Skrip otomasi Appwrite (setup schema, seeding, migrasi)
├── stores/               # Global state stores (Zustand)
├── types/                # Definisi TypeScript interfaces & types
└── tests/                # Unit test (Vitest) & E2E test (Playwright)
```

---

## ⚡ Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
- **Node.js**: Versi `20.x` (LTS direkomendasikan, cek `.nvmrc`)
- **npm**: Versi `10.x`
- Akun / Instans **Appwrite** (Cloud atau Self-hosted)

### 2. Clone Repositori
```bash
git clone https://github.com/Alifferdiansyah334/Scitech-Inventory-Management.git
cd Scitech-Inventory-Management
```

### 3. Pasang Dependensi
Gunakan `npm ci` untuk menginstal dependensi yang terkunci di `package-lock.json`:
```bash
npm ci
```

### 4. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Buka `.env.local` dan sesuaikan nilainya:
```env
# Appwrite Client
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id

# Appwrite Server Secret Key
APPWRITE_API_KEY=your_appwrite_api_key_with_appropriate_scopes

# Appwrite Database & Collection IDs (Dibuat otomatis oleh setup script)
APPWRITE_DATABASE_ID=helios-db
APPWRITE_PROFILES_COLLECTION_ID=profiles
APPWRITE_ITEMS_COLLECTION_ID=items
APPWRITE_LOANS_COLLECTION_ID=loans
APPWRITE_ITEM_IMAGES_BUCKET_ID=item-images

# Session
SESSION_COOKIE_NAME=sims-session

# Brevo (Opsional untuk OTP & Email)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@domain.com
BREVO_SENDER_NAME=SIMS Scitech
```

### 5. Inisialisasi Database Appwrite
Jalankan skrip otomatis untuk membuat database, collections, attribute, index, dan storage bucket di Appwrite:
```bash
npm run appwrite:setup
```

*(Opsional)* Anda juga dapat mengisi data awal inventaris menggunakan skrip seeding jika tersedia di folder `scripts/`:
```bash
npx tsx scripts/seed-items.ts
```

### 6. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses `http://localhost:3000`.

---

## 📜 Skrip NPM yang Tersedia

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan Next.js development server di port 3000 |
| `npm run build` | Membuat production build aplikasi |
| `npm start` | Menjalankan aplikasi hasil production build |
| `npm run lint` | Melakukan linting kode dengan ESLint |
| `npm test` | Menjalankan unit test dengan Vitest |
| `npm run test:watch` | Menjalankan Vitest dalam mode watch |
| `npm run test:e2e` | Menjalankan end-to-end testing dengan Playwright |
| `npm run appwrite:setup` | Menginisialisasi schema database & storage di Appwrite |

---

## 🌐 Deployment

Proyek ini telah siap di-deploy ke **Netlify** menggunakan konfigurasi yang ada di `netlify.toml` dan `@netlify/plugin-nextjs`.

Pastikan seluruh variabel lingkungan pada `.env.example` telah ditambahkan pada menu **Site configuration > Environment variables** di dashboard penyedia hosting Anda.

---

## 📄 Lisensi

Proyek ini dikembangkan untuk kebutuhan internal **Scitech**. Hak cipta dilindungi.
