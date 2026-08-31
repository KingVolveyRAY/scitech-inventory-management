"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Info, ArrowRight } from "lucide-react";
import type { Item } from "@/types";

export function ItemDetailDialog({ item, open, onOpenChange }: { item: Item | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={item?.name ?? "Item detail"} 
      description={item?.category}
    >
      {item ? (
        <div className="space-y-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-300">
                <Package className="h-16 w-16 opacity-20" />
                <span className="text-xs uppercase tracking-[0.2em] font-black">No Preview Available</span>
              </div>
            )}
            
            <div className="absolute top-4 right-4">
              <Badge 
                tone={item.quantity_available > 0 ? "success" : "warning"}
                className="rounded-full px-4 py-1.5 font-bold shadow-lg"
              >
                {item.quantity_available} Tersedia
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[1.5rem] bg-slate-50 p-6 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Stok</p>
              <p className="text-xl font-bold text-slate-900">{item.quantity_total} Unit</p>
            </div>
            <div className="rounded-[1.5rem] bg-indigo-50/50 p-6 border border-indigo-100/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Kategori</p>
              <p className="text-xl font-bold text-indigo-600">{item.category}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Info className="h-4 w-4 text-indigo-600" />
              <h4 className="font-bold">Deskripsi Barang</h4>
            </div>
            <p className="text-base leading-relaxed font-medium text-slate-500 italic">
              "{item.description}"
            </p>
          </div>

          <div className="pt-4">
            <Button asChild className="h-16 w-full text-lg shadow-xl shadow-indigo-100">
              <Link href={`/borrow/${item.$id}`} className="flex items-center justify-center gap-3">
                <span>Ajukan Peminjaman Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
