"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdminLoansQuery } from "@/hooks/queries/use-admin-loans-query";
import { deleteLoan } from "@/lib/actions/loans";
import { useToast } from "@/components/ui/toast";
import type { Loan } from "@/types";
import { LoanDecisionDialog } from "@/components/admin/loan-decision-dialog";
import { ReturnLoanDialog } from "@/components/admin/return-loan-dialog";
import { ConfirmReturnDialog } from "@/components/admin/confirm-return-dialog";

export function LoanReviewTable({ initialData }: { initialData: Loan[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const statusFilter = searchParams.get("status") || "all";
  const { data } = useAdminLoansQuery(initialData, statusFilter);

  const handleDelete = (loanId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pinjaman ini?")) return;

    startTransition(async () => {
      const result = await deleteLoan(loanId);
      if (result.success) {
        notify("Berhasil", "Data pinjaman telah dihapus.");
        await queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
        router.refresh();
      } else {
        notify("Gagal", result.error);
      }
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-subtle">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-sm font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
          <tr>
            <th className="px-6 py-4">Peminjam</th>
            <th className="px-6 py-4">Barang</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4">Admin</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white whitespace-nowrap">
          {data.map((loan) => (
            <tr key={loan.$id} className="transition-colors hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">{loan.borrower?.full_name ?? loan.borrower_id}</span>
                  <span className="text-xs text-slate-500">{loan.borrower?.email}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">{loan.item?.name ?? loan.item_id}</span>
                  <span className="text-xs text-slate-500">{loan.quantity} unit</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge 
                  tone={
                    loan.status === "approved" || loan.status === "returned" ? "success" :
                    loan.status === "returning" ? "info" :
                    loan.status === "rejected" || loan.status === "overdue" ? "danger" :
                    "warning"
                  }
                >
                  {loan.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {loan.admin ? (
                  <span className="font-medium text-indigo-600">{loan.admin.full_name}</span>
                ) : (
                  <span className="text-slate-400 italic text-xs">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {loan.status === "pending" && (
                    <>
                      <LoanDecisionDialog loan={loan} decision="approve" />
                      <LoanDecisionDialog loan={loan} decision="reject" />
                    </>
                  )}
                  {(loan.status === "approved" || loan.status === "overdue") && (
                    <ReturnLoanDialog loan={loan} />
                  )}
                  {loan.status === "returning" && (
                    <ConfirmReturnDialog loan={loan} />
                  )}
                  {loan.status === "returned" && (
                    <span className="text-xs text-slate-400 italic">Selesai</span>
                  )}
                  {loan.status === "rejected" && (
                    <span className="text-xs text-slate-400 italic">Ditolak</span>
                  )}

                  <button 
                    onClick={() => handleDelete(loan.$id)}
                    disabled={isPending}
                    className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                    title="Hapus Data"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
