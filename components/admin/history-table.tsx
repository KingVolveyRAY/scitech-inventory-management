"use client";

import { useMemo, useState, useEffect, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Trash2 } from "lucide-react";
import { deleteLoan } from "@/lib/actions/loans";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { Loan } from "@/types";

const ITEMS_PER_PAGE = 10;

export function HistoryTable({ loans }: { loans: Loan[] }) {
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { notify } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const totalPages = Math.ceil(loans.length / ITEMS_PER_PAGE);
  const paginatedLoans = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return loans.slice(start, start + ITEMS_PER_PAGE);
  }, [loans, page]);

  // Reset page when data changes (filtering)
  useEffect(() => {
    setPage(1);
  }, [loans]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-subtle">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-sm text-slate-500 whitespace-nowrap">
            <tr>
              <th className="px-4 py-3">Barang</th>
              <th className="px-4 py-3">Peminjam</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 whitespace-nowrap">
            {paginatedLoans.map((loan) => (
              <tr key={loan.$id} className={loan.status === "overdue" ? "bg-red-50/50 hover:bg-red-100/30" : "hover:bg-slate-50/50"}>
                <td className="px-4 py-4 text-sm text-slate-700">{loan.item?.name ?? loan.item_id}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{loan.borrower?.full_name ?? loan.borrower_id}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{new Date(loan.borrow_date).toLocaleDateString("id-ID")} - {new Date(loan.return_date).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-4 text-sm">
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
                <td className="px-4 py-4 text-sm text-slate-600">
                  {loan.admin ? (
                    <span className="font-medium text-indigo-600">{loan.admin.full_name}</span>
                  ) : (
                    <span className="text-slate-400 italic text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <button 
                    onClick={() => {
                      if (confirm("Hapus data riwayat ini?")) {
                        startTransition(async () => {
                          const result = await deleteLoan(loan.$id);
                          if (result.success) {
                            notify("Berhasil", "Data riwayat telah dihapus.");
                            await queryClient.invalidateQueries({ queryKey: ["admin", "history"] });
                            router.refresh();
                          } else {
                            notify("Gagal", result.error);
                          }
                        });
                      }
                    }}
                    disabled={isPending}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                    title="Hapus Riwayat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
}
