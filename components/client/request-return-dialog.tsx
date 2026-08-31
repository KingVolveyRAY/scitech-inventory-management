"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import { requestReturn, uploadReturnImage } from "@/lib/actions/loans";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { useToast } from "@/components/ui/toast";
import type { Loan } from "@/types";

export function RequestReturnDialog({ loan, trigger }: { loan: Loan; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const { notify } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleRequest = async () => {
    if (!file) {
      notify("Gagal", "Silakan unggah foto bukti pengembalian.");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadResult = await uploadReturnImage(formData);
        
        if (!uploadResult.success) {
          notify("Gagal", uploadResult.error);
          return;
        }

        const result = await requestReturn({
          loanId: loan.$id,
          return_image_id: uploadResult.data,
          user_note: note
        });

        if (result.success) {
          notify("Berhasil", "Permintaan pengembalian telah dikirim. Menunggu konfirmasi admin.");
          await queryClient.invalidateQueries({ queryKey: queryKeys.activeLoans });
          await queryClient.invalidateQueries({ queryKey: ["loans"] });
          setOpen(false);
          router.refresh();
        } else {
          notify("Gagal", result.error);
        }
      } catch (error) {
        notify("Gagal", error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah.");
      }
    });
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger || <Button variant="secondary" size="sm">Kembalikan</Button>}
      </div>
      
      <Modal 
        open={open} 
        onOpenChange={setOpen} 
        title="Ajukan Pengembalian" 
        description={`Silakan unggah foto bukti barang ${loan.item?.name} sudah dikembalikan.`}
      >
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bukti Foto</label>
            <ImageDropzone onFileChange={setFile} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Catatan (Opsional)</label>
            <Textarea 
              placeholder="Tambahkan catatan jika diperlukan..." 
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleRequest} 
            disabled={isPending}
          >
            {isPending ? "Mengirim..." : "Kirim Pengembalian"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
