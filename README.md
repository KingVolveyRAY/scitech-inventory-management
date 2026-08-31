# SIMS — Sistem Inventori Manajemen Scitech

Aplikasi web internal untuk sistem peminjaman barang perusahaan, dibangun dengan
Next.js 15 (App Router) dan Appwrite.

---

## Kebutuhan

| Alat     | Versi minimum | Catatan                                    |
| -------- | ------------- | ------------------------------------------ |
| Node.js  | 20.x          | Versi 20 disarankan (lihat `.nvmrc`)       |
| npm      | 10.x          | Ikut terpasang bersama Node 20             |
| Appwrite | Cloud / self-hosted | Butuh satu project aktif             |

Pengguna `nvm` cukup menjalankan `nvm use` di root proyek untuk memakai versi
Node yang benar secara otomatis.

---

## Cara Menjalankan

### 1. Clone dan pasang dependensi

```bash
git clone https://github.com/Alifferdiansyah334/Project-Helios.git
cd Project-Helios
npm ci
```

Gunakan `npm ci` (bukan `npm install`) agar versi dependensi persis mengikuti
`package-lock.json` — inilah yang membuat hasilnya identik di semua device.

### 2. Siapkan environment

```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi nilainya. Penjelasan tiap variabel beserta cara
mendapatkannya ada sebagai komentar di dalam `.env.example`. Minimal yang wajib
diisi agar aplikasi bisa berjalan:

- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`

> `.env.local` berisi kredensial rahasia dan sudah masuk `.gitignore`.
> Jangan pernah meng-commit file tersebut.

### 3. Siapkan struktur Appwrite

Sekali saja, untuk membuat database, collection, index, dan bucket:

```bash
npm run appwrite:setup
```

### 4. Jalankan

```bash
npm run dev
```

Aplikasi berjalan di <http://localhost:3000>.

---

## Perintah yang Tersedia

| Perintah                 | Fungsi                                      |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Menjalankan development server              |
| `npm run build`          | Membuat production build                    |
| `npm start`              | Menjalankan hasil production build          |
| `npm run lint`           | Menjalankan ESLint                          |
| `npm test`               | Menjalankan unit test (Vitest)              |
| `npm run test:watch`     | Unit test mode watch                        |
| `npm run test:e2e`       | Menjalankan end-to-end test (Playwright)    |
| `npm run appwrite:setup` | Membuat struktur database di Appwrite       |

Catatan: kerangka test sudah terpasang (Vitest + Playwright) tetapi **belum ada
berkas test yang ditulis** — `tests/` baru berisi `tests/setup.ts`. Karena itu
`npm test` akan lulus tanpa menjalankan apa pun, dan `npm run test:e2e` belum
bisa dipakai sampai folder `tests/e2e/` diisi. Sebelum menjalankan e2e pertama
kali, pasang browser-nya dengan `npx playwright install`.

---

## Struktur Proyek

```
app/          Route Next.js App Router — (admin), (auth), (client)
components/   Komponen React (admin, client, forms, ui)
lib/          Logika inti — server actions, klien Appwrite, validator
hooks/        Custom React hooks dan React Query
stores/       State global (Zustand)
types/        Definisi tipe TypeScript
scripts/      Skrip perawatan Appwrite (setup, seeding, migrasi)
tests/        Unit test dan end-to-end test
```

---

## Deployment

Proyek ini dikonfigurasi untuk Netlify melalui `netlify.toml`
(memakai `@netlify/plugin-nextjs`, Node 20).

Seluruh variabel di `.env.example` harus didaftarkan sebagai environment
variable di dashboard hosting — file `.env.local` tidak ikut ter-deploy.
