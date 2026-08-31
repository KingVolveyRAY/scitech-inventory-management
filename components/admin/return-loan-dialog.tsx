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

export function ReturnLoanDialog({ loan }: { loan: Loan }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleReturn = () => {
    startTransition(async () => {
      const result = await markLoanReturned({ 
        loanId: loan.$id, 
        admin_note: note, 
        actual_return_date: new Date().toISOString() 
      });

      if (result.success) {
        notify("Berhasil", "Barang telah ditandai sebagai dikembalikan.");
        await queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
        router.refresh();
        setOpen(false);
        setNote("");
      } else {
        notify("Gagal", result.error);
      }
    });
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Konfirmasi return
      </Button>
      <Modal open={open} onOpenChange={setOpen} title="Konfirmasi pengembalian" description={loan.item?.name ?? loan.item_id}>
        <div className="space-y-4">
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Catatan pengembalian" />
          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleReturn}
          >
            {isPending ? "Memproses..." : "Tandai returned"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
