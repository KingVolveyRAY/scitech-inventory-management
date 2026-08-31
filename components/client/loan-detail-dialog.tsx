"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { appConfig, buildPreviewUrl } from "@/lib/appwrite/config";
import type { Loan } from "@/types";

function tone(status: Loan["status"]) {
  if (status === "approved" || status === "returned") return "success";
  if (status === "rejected" || status === "overdue") return "danger";
  if (status === "returning") return "info";
  return "warning";
}

export function LoanDetailDialog({ loan, open, onOpenChange }: { loan: Loan | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!loan) return null;

  const returnImageUrl = loan.return_image_url || (loan.return_image_id ? buildPreviewUrl(loan.return_image_id) : null);
  const adminImageUrl = loan.admin_image_id ? buildPreviewUrl(loan.admin_image_id) : null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Detail Pinjaman" description={loan.item?.name ?? "Barang tidak ditemukan"}>
      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Periode</p>
            <p>{new Date(loan.borrow_date).toLocaleDateString("id-ID")} - {new Date(loan.return_date).toLocaleDateString("id-ID")}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Status</p>
            <Badge tone={tone(loan.status)}>{loan.status}</Badge>
          </div>
          <div className="col-span-2">
            <p className="font-semibold text-slate-900">Tujuan Peminjaman</p>
            <p className="mt-1 italic text-slate-500">"{loan.purpose}"</p>
          </div>
        </div>

        {/* Seksi Admin (Approve/Reject) */}
        {(loan.admin_note || adminImageUrl || loan.admin) && (
          <div className="rounded-xl bg-brand-surface-alt p-4 ring-1 ring-brand-border">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary">Informasi dari Admin</h3>
              {loan.admin && (
                <span className="text-[10px] font-medium text-brand-muted">Oleh: {loan.admin.full_name}</span>
              )}
            </div>
            
            {loan.admin_note && (
              <p className="text-sm leading-relaxed text-slate-700 mb-3">{loan.admin_note}</p>
            )}

            {adminImageUrl && (
              <div className="mt-2">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                  <img 
                    src={adminImageUrl} 
                    alt="Lampiran Admin" 
                    className="h-full w-full object-contain"
                    onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/400x200/f1f5f9/94a3b8?text=Gambar+tidak+dapat+dimuat"}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seksi User (Saat Return) */}
        {(loan.user_note || returnImageUrl) && (
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Bukti Pengembalian Anda</h3>
            
            {loan.user_note && (
              <p className="text-sm leading-relaxed text-slate-700 mb-3 italic">"{loan.user_note}"</p>
            )}

            {returnImageUrl && (
              <div className="mt-2">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                  <img 
                    src={returnImageUrl} 
                    alt="Bukti Pengembalian" 
                    className="h-full w-full object-contain"
                    onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/400x200/f1f5f9/94a3b8?text=Gambar+tidak+dapat+dimuat"}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {loan.status === "returned" && loan.actual_return_date && (
          <div className="text-[10px] text-slate-400 text-right italic">
            Selesai pada: {new Date(loan.actual_return_date).toLocaleString("id-ID")}
          </div>
        )}
      </div>
    </Modal>
  );
}
