"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyLoansQuery } from "@/hooks/queries/use-my-loans-query";
import { RequestReturnDialog } from "@/components/client/request-return-dialog";
import { LoanDetailDialog } from "@/components/client/loan-detail-dialog";
import { Pagination } from "@/components/ui/pagination";
import { Eye, Calendar, User, Package } from "lucide-react";
import type { Loan } from "@/types";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

function tone(status: Loan["status"]) {
  if (status === "approved" || status === "returned") return "success";
  if (status === "rejected" || status === "overdue") return "danger";
  if (status === "returning") return "info";
  return "warning";
}

export function MyLoansTable({ initialData, userId }: { initialData: Loan[]; userId: string }) {
  const { data } = useMyLoansQuery(userId, initialData);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, page]);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto overflow-y-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sophisticated">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-6 py-5">Barang</th>
              <th className="px-6 py-5">Tanggal Pinjam</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5">Admin</th>
              <th className="px-6 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedData.map((loan, idx) => (
              <motion.tr 
                key={loan.$id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{loan.item?.name ?? loan.item_id}</div>
                      <div className="text-xs font-medium text-slate-500">{loan.quantity} Unit Terpinjam</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(loan.borrow_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <Badge 
                    tone={tone(loan.status)}
                    className="rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider"
                  >
                    {loan.status}
                  </Badge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {loan.admin?.full_name ?? "-"}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedLoan(loan)}
                      className="rounded-full h-9 w-9 p-0 hover:bg-white hover:shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {(loan.status === "approved" || loan.status === "overdue") ? (
                      <RequestReturnDialog loan={loan} />
                    ) : loan.status === "returning" ? (
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Wait Conf...</span>
                    ) : null}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      <LoanDetailDialog 
        loan={selectedLoan} 
        open={!!selectedLoan} 
        onOpenChange={(open) => !open && setSelectedLoan(null)} 
      />
    </div>
  );
}
