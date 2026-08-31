import { Badge } from "@/components/ui/badge";
import type { Loan } from "@/types";

export function RecentLoansTable({ loans }: { loans: Loan[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-subtle">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Peminjaman terbaru</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-sm text-slate-500 text-nowrap">
            <tr>
              <th className="px-4 py-3">Peminjam</th>
              <th className="px-4 py-3">Barang</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-nowrap">
            {loans.map((loan) => (
              <tr key={loan.$id}>
                <td className="px-4 py-4 text-sm text-slate-700">{loan.borrower?.full_name ?? loan.borrower_id}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{loan.item?.name ?? loan.item_id}</td>
                <td className="px-4 py-4 text-sm"><Badge>{loan.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
