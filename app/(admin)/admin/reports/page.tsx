import { ReportsView } from "@/components/admin/reports-view";
import { getReports } from "@/lib/appwrite/queries";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const rows = await getReports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          <Typewriter text="Reports." />
        </h1>
        <p className="mt-2 text-sm text-slate-500">Buat laporan rentang tanggal dan ekspor ke CSV atau PDF.</p>
      </div>
      <ReportsView rows={rows} />
    </div>
  );
}
