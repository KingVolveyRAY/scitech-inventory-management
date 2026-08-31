import { LoanReviewTable } from "@/components/admin/loan-review-table";
import { LoanStatusTabs } from "@/components/admin/loan-status-tabs";
import { DeleteAllLoansButton } from "@/components/admin/delete-all-loans-button";
import { getAllLoans } from "@/lib/appwrite/queries";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = 'force-dynamic';

export default async function AdminLoansPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const status = Array.isArray(params.status) ? params.status[0] : params.status;
  const loans = await getAllLoans();
  const filtered = status ? loans.filter((loan) => loan.status === status) : loans;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            <Typewriter text="Loans." />
          </h1>
          <p className="mt-2 text-sm text-slate-500">Tinjau pengajuan masuk dan sinkronkan stok inventaris saat keputusan dibuat.</p>
        </div>
        <div className="w-fit">
          <DeleteAllLoansButton />
        </div>
      </div>
      <LoanStatusTabs />
      <LoanReviewTable initialData={filtered} />
    </div>
  );
}
