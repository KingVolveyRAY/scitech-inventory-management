"use client";

import { motion } from "framer-motion";
import { Laptop, Camera, Tv, Box, Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Item } from "@/types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Elektronik": <Tv className="h-5 w-5" />,
  "Multimedia": <Camera className="h-5 w-5" />,
  "Komputasi": <Laptop className="h-5 w-5" />,
  "Furniture": <Box className="h-5 w-5" />,
  "Stationery": <Package className="h-5 w-5" />
};

export function ItemCard({ item, onClick }: { item: Item; onClick: (item: Item) => void }) {
  const Icon = CATEGORY_ICONS[item.category] || <Package className="h-5 w-5" />;
  const isAvailable = item.quantity_available > 0;

  return (
    <div 
      className="group relative flex flex-col h-full rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 active:scale-[0.98]"
      onClick={() => onClick(item)}
    >
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-50 transition-colors group-hover:bg-slate-100">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-200">
            <Package className="h-16 w-12 opacity-10" />
          </div>
        )}
        
        {/* Top-left floating icon with faded background */}
        <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-brand-primary shadow-sm transition-transform duration-500 group-hover:scale-110">
          {Icon}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {item.category}
          </span>
          <Badge 
            tone={isAvailable ? "success" : "warning"}
            className="rounded-full px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider"
          >
            {item.quantity_available} Stok
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black leading-tight text-slate-900 group-hover:text-brand-primary transition-colors">
            {item.name}
          </h3>
          <p className="line-clamp-2 text-xs font-bold text-slate-400 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-6 mt-auto">
          <div className="flex h-11 w-full items-center justify-between rounded-xl bg-slate-50 px-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white">
            <span className="text-[11px] font-black uppercase tracking-widest">Pinjam Sekarang</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
