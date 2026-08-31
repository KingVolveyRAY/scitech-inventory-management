"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteAllLoans } from "@/lib/actions/loans";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function DeleteAllLoansButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAll = () => {
    startTransition(async () => {
      const result = await deleteAllLoans();
      if (result.success) {
        notify("Berhasil", "Semua data pinjaman telah dihapus.", "success");
        await queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
        setIsModalOpen(false);
        router.refresh();
      } else {
        notify("Gagal", result.error, "error");
      }
    });
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsModalOpen(true)} 
        disabled={isPending}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Menghapus..." : "Delete All"}
      </Button>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAll}
        title="Hapus Semua Data Pinjaman"
        description="PERINGATAN KRITIS: Apakah Anda yakin ingin menghapus SEMUA data pinjaman? Tindakan ini akan membersihkan seluruh riwayat dan pengajuan. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus Semua"
        isLoading={isPending}
      />
    </>
  );
}
