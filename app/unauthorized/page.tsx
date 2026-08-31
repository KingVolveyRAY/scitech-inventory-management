import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";

export default function UnauthorizedPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-subtle">
          <p className="text-sm font-medium text-indigo-600">Unauthorized</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Anda tidak memiliki akses ke halaman ini.</h1>
          <p className="mt-2 text-sm text-slate-500">Periksa role akun Anda atau kembali ke halaman yang sesuai.</p>
          <Button asChild className="mt-6 w-full">
            <Link href="/">Kembali ke SIMS</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
