import { Badge } from "@/components/ui/badge";
import type { Item } from "@/types";

export function BorrowSummary({ item }: { item: Item }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-subtle">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
          <p className="mt-1 text-base text-slate-500">{item.category}</p>
        </div>
        <Badge tone={item.quantity_available > 0 ? "success" : "warning"} className="px-3 py-1 text-sm">
          {item.quantity_available} tersedia
        </Badge>
      </div>
      <div className="mt-6 border-t border-slate-100 pt-6">
        <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
      </div>
    </div>
  );
}
