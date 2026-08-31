import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-6xl font-black text-slate-900">404</h1>
      <h2 className="mt-4 text-xl font-bold text-slate-700">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
      </p>
      <Link
        href="/catalog"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}
