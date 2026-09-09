"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useCreateLoanMutation } from "@/hooks/queries/use-create-loan-mutation";
import { loanRequestSchema } from "@/lib/validators/loans";
import type { Item } from "@/types";
import type { z } from "zod";

type BorrowValues = z.infer<typeof loanRequestSchema>;

export function BorrowForm({ item, userId, userName }: { item: Item; userId: string; userName: string }) {
  const { notify } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mutation = useCreateLoanMutation(userId);
  const form = useForm<BorrowValues>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: {
      item_id: item.$id,
      quantity: 1,
      purpose: "",
      borrow_date: new Date().toISOString().slice(0, 10),
      return_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    }
  });

  const onSubmit = (values: BorrowValues) => {
    startTransition(async () => {
      const result = await mutation.mutateAsync(values);

      if (!result.success) {
        notify("Pengajuan gagal", result.error);
        return;
      }

      notify("Pengajuan dikirim", "Permintaan peminjaman Anda sudah tercatat.");
      
      // Menggunakan nomor dari .env atau nomor sementara untuk keperluan testing/demo
      const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "6285776418145";
      if (adminPhone) {
        const message = `Halo Admin, saya *${userName}* ingin meminjam barang *${item.name}* (Jumlah: ${values.quantity}).\n\nTujuan: ${values.purpose}\nTanggal Pinjam: ${values.borrow_date}\nTanggal Kembali: ${values.return_date}\n\nMohon untuk di-review pengajuannya di web. Terima kasih.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, "_blank");
      }

      router.push("/my-loans");
      router.refresh();
    });
  };

  return (
    <form className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-subtle" onSubmit={form.handleSubmit(onSubmit)}>
      <input type="hidden" {...form.register("item_id")} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Jumlah Barang</label>
        <Input type="number" min={1} max={item.quantity_available} {...form.register("quantity")} placeholder="Masukkan jumlah..." />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Tanggal pinjam</label>
        <Input type="date" {...form.register("borrow_date")} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Tanggal kembali</label>
        <Input type="date" {...form.register("return_date")} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Tujuan peminjaman</label>
        <Textarea placeholder="Jelaskan kebutuhan penggunaan barang ini." {...form.register("purpose")} className="min-h-[100px]" />
      </div>

      <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isPending}>
        {isPending ? "Mengirim..." : "Ajukan peminjaman"}
      </Button>
    </form>
  );
}
