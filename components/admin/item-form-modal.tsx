"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { createItem, updateItem, uploadItemImage } from "@/lib/actions/items";
import { itemSchema } from "@/lib/validators/items";
import type { Item } from "@/types";
import type { z } from "zod";
import { ImageDropzone } from "@/components/admin/image-dropzone";

type ItemValues = z.infer<typeof itemSchema>;

export function ItemFormModal({ item, triggerLabel = "Tambah barang" }: { item?: Item; triggerLabel?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  const form = useForm<ItemValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      category: item?.category ?? "",
      quantity_total: item?.quantity_total ?? 0,
      quantity_available: item?.quantity_available ?? 0,
      is_available: item?.is_available ?? true
    }
  });

  const onSubmit = (values: ItemValues) => {
    startTransition(async () => {
      let imageId = item?.image_id;
      
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const upload = await uploadItemImage(formData);
        
        if (upload.success && upload.data) {
          imageId = upload.data.fileId;
        } else {
          notify("Gagal upload gambar", upload.error);
          return;
        }
      }

      const payload = { ...values, image_id: imageId };
      const result = item ? await updateItem(item.$id, payload) : await createItem(payload);

      if (!result.success) {
        notify("Gagal menyimpan item", result.error);
        return;
      }

      notify("Item tersimpan", item ? "Perubahan item telah disimpan." : "Item baru berhasil ditambahkan.");
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminItems });
      router.refresh();
      setOpen(false);
      if (!item) {
        form.reset();
        setFile(null);
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={item ? "ghost" : "primary"}>
        {triggerLabel}
      </Button>
      <Modal 
        open={open} 
        onOpenChange={setOpen} 
        title={item ? "Edit barang" : "Tambah barang"} 
        description="Lengkapi informasi barang untuk inventaris."
      >
        <form className="space-y-4 pt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nama Barang</label>
              <Input placeholder="MacBook Pro" {...form.register("name")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Kategori</label>
              <Input placeholder="Elektronik" {...form.register("category")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Deskripsi</label>
            <Textarea placeholder="Keterangan barang..." {...form.register("description")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Stok Total</label>
              <Input type="number" {...form.register("quantity_total")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Stok Tersedia</label>
              <Input type="number" {...form.register("quantity_available")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Foto Barang</label>
            <ImageDropzone onFileChange={setFile} onError={(message) => notify("Gambar tidak valid", message, "error")} />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Barang"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
