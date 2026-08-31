"use client";

import { useActiveLoansQuery } from "@/hooks/queries/use-active-loans-query";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { Loan } from "@/types";

export function ActiveLoansList({ initialData }: { initialData: Loan[] }) {
  const { data: loans } = useActiveLoansQuery(initialData);

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center">
        <p className="text-slate-500">Tidak ada peminjaman aktif saat ini.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-subtle">
      <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Peminjam</th>
              <th className="px-6 py-4">Barang</th>
              <th className="px-6 py-4">Waktu Dipinjam </th>
              <th className="px-6 py-4">Waktu Dikembalikan </th>
              <th className="px-6 py-4">Approver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loans.map((loan) => (
              <tr key={loan.$id} className="transition-colors hover:bg-slate-50/50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={loan.borrower?.full_name || "User"} />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {loan.borrower?.full_name || "Unknown"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {loan.borrower?.department || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {loan.item?.name || "Unknown Item"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {loan.quantity} Unit
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-900">
                    {new Date(loan.borrow_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-900">
                    {new Date(loan.return_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                  {new Date(loan.return_date) < new Date() && loan.status !== "returned" && (
                    <div className="text-xs font-medium text-red-500">
                      Terlambat
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                  {loan.admin?.full_name ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
