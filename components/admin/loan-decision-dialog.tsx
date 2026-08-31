"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { approveLoan, rejectLoan } from "@/lib/actions/loans";
import { uploadItemImage } from "@/lib/actions/items";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import type { Loan } from "@/types";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function LoanDecisionDialog({ loan, decision }: { loan: Loan; decision: "approve" | "reject" }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const isApprove = decision === "approve";

  const handleAction = () => {
    startTransition(async () => {
      let adminImageId = undefined;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const upload = await uploadItemImage(formData);
        if (upload.success && upload.data) {
          adminImageId = upload.data.fileId;
        } else {
          notify("Gagal upload gambar", upload.error);
          return;
        }
      }

      const action = isApprove ? approveLoan : rejectLoan;
      const result = await action({ 
        loanId: loan.$id, 
        admin_note: note,
        admin_image_id: adminImageId
      });

      if (result.success) {
        notify("Berhasil", `Peminjaman telah ${isApprove ? "disetujui" : "ditolak"}.`);
        await queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
        router.refresh();
        setOpen(false);
        setNote("");
        setFile(null);
      } else {
        notify("Gagal", result.error);
      }
    });
  };

  return (
    <>
      <Button 
        variant={isApprove ? "secondary" : "destructive"} 
        size="sm"
        onClick={() => setOpen(true)}
        className="rounded-full font-bold shadow-sm"
      >
        {isApprove ? "Approve" : "Reject"}
      </Button>

      <Modal 
        open={open} 
        onOpenChange={setOpen} 
        title={`${isApprove ? "Setujui" : "Tolak"} Pinjaman`} 
        description={loan.item?.name ?? loan.item_id}
      >
        <div className="space-y-6">
          <div 
            className={`p-6 rounded-3xl border-2 ${isApprove ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${isApprove ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isApprove ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Konfirmasi Tindakan</h4>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {isApprove 
                    ? "Menyetujui akan mengurangi stok tersedia secara otomatis." 
                    : "Menolak akan membatalkan reservasi barang ini."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 px-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Catatan Admin</label>
            <Textarea 
              placeholder="Berikan alasan atau instruksi pengambilan..." 
              value={note} 
              onChange={(event) => setNote(event.target.value)} 
              className="bg-slate-50 border-slate-100 rounded-2xl focus:ring-brand-primary min-h-[100px]"
            />
          </div>

          <div className="space-y-2 px-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Lampiran Gambar (Opsional)</label>
            <ImageDropzone onFileChange={setFile} />
          </div>

          <div className="pt-4">
            <Button
              className={`w-full h-14 text-lg ${isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              disabled={isPending}
              onClick={handleAction}
            >
              {isPending ? "Memproses..." : isApprove ? "Konfirmasi Approve" : "Konfirmasi Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
