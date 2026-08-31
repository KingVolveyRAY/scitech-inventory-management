import { HistoryFilters } from "@/components/admin/history-filters";
import { HistoryTable } from "@/components/admin/history-table";
import { getHistory, getCatalogItems, getProfiles } from "@/lib/appwrite/queries";
import { parseHistoryFilters } from "@/lib/utils/history-filters";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = parseHistoryFilters(params);
  const [loans, items, profiles] = await Promise.all([
    getHistory(filters),
    getCatalogItems(),
    getProfiles()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          <Typewriter text="History." />
        </h1>
        <p className="mt-2 text-sm text-slate-500">Lihat riwayat lengkap peminjaman dengan filter multi-parameter.</p>
      </div>
      <HistoryFilters items={items} profiles={profiles} />
      <HistoryTable loans={loans} />
    </div>
  );
}
