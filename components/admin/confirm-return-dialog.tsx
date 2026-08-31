"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import { markLoanReturned } from "@/lib/actions/loans";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import type { Loan } from "@/types";
import Image from "next/image";

export function ConfirmReturnDialog({ loan }: { loan: Loan }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await markLoanReturned({ 
        loanId: loan.$id, 
        admin_note: note, 
        actual_return_date: new Date().toISOString() 
      });

      if (result.success) {
        notify("Berhasil", "Pengembalian barang telah dikonfirmasi.");
        await queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
        router.refresh();
        setOpen(false);
      } else {
        notify("Gagal", result.error);
      }
    });
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Review Return
      </Button>
      <Modal 
        open={open} 
        onOpenChange={setOpen} 
        title="Konfirmasi Pengembalian" 
        description={`${loan.borrower?.full_name} mengembalikan ${loan.item?.name}`}
      >
        <div className="space-y-6 pt-4">
          {(loan.return_image_url || loan.return_image_id) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Bukti Foto dari User</label>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {loan.return_image_url ? (
                  <Image 
                    src={loan.return_image_url} 
                    alt="Bukti Pengembalian" 
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400">
                    <p className="text-xs">Gambar tidak dapat dimuat</p>
                    <p className="text-[10px]">(ID: {loan.return_image_id})</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {loan.user_note && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Catatan User</label>
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 border border-slate-100 italic">
                "{loan.user_note}"
              </p>
            </div>
          )}

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-sm font-medium text-slate-700">Catatan Admin (Opsional)</label>
            <Textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Tambahkan catatan jika diperlukan..." 
            />
          </div>

          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Memproses..." : "Konfirmasi & Selesai"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
