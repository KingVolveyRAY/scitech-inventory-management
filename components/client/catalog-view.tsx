"use client";

import { useMemo, useState, useEffect } from "react";
import { CategoryTabs } from "@/components/client/category-tabs";
import { CatalogSearch } from "@/components/client/catalog-search";
import { ItemCard } from "@/components/client/item-card";
import { Pagination } from "@/components/ui/pagination";
import { ItemDetailDialog } from "@/components/client/item-detail-dialog";
import { ListStagger, ListStaggerItem } from "@/components/ui/list-stagger";
import { useItemsQuery } from "@/hooks/queries/use-items-query";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/ui/typewriter";

const ITEMS_PER_PAGE = 8;

export function CatalogView({ items: initialItems }: { items: any[] }) {
  const { data: items = initialItems } = useItemsQuery(initialItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const titleText = "SIMS Catalog.";
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "Semua" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            <Typewriter text="SIMS Catalog." />
          </h1>
          <p className="mt-6 text-lg font-medium text-slate-500 leading-relaxed">
            Peralatan berkualitas untuk mendukung produktivitas tim Anda. 
            Cari, pilih, dan ajukan peminjaman dengan satu klik.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <CategoryTabs 
          activeCategory={category} 
          onCategoryChange={setCategory} 
          categories={["Semua", ...Array.from(new Set(items.map(i => i.category)))]}
        />
        <CatalogSearch value={search} onChange={setSearch} />
      </div>

      {paginatedItems.length > 0 ? (
        <ListStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedItems.map((item) => (
            <ListStaggerItem key={item.$id}>
              <ItemCard 
                item={item} 
                onClick={() => setSelectedItem(item)} 
              />
            </ListStaggerItem>
          ))}
        </ListStagger>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-slate-500 font-bold">Tidak ada barang yang ditemukan.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      )}

      <ItemDetailDialog 
        item={selectedItem} 
        open={Boolean(selectedItem)} 
        onOpenChange={(open) => !open && setSelectedItem(null)} 
      />
    </div>
  );
}
