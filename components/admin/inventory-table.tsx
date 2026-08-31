"use client";

import { useMemo, useState, useEffect } from "react";
import { Trash2, Edit2, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { useAdminItemsQuery } from "@/hooks/queries/use-admin-items-query";
import { toggleItemAvailability, deleteItem } from "@/lib/actions/items";
import type { Item } from "@/types";
import { ItemFormModal } from "@/components/admin/item-form-modal";
import { useToast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const ITEMS_PER_PAGE = 10;

export function InventoryTable({ initialData }: { initialData: Item[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const { notify } = useToast();
  const { data } = useAdminItemsQuery(initialData);
  const [page, setPage] = useState(1);
  
  // Filter States
  const [searchTemp, setSearchTemp] = useState("");
  const [categoryTemp, setCategoryTemp] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", category: "all" });

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) || 
                          (item.description?.toLowerCase().includes(appliedFilters.search.toLowerCase()) ?? false);
      const matchesCategory = appliedFilters.category === "all" || item.category === appliedFilters.category;
      return matchesSearch && matchesCategory;
    });
  }, [data, appliedFilters]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(data.map(item => item.category)));
    return ["all", ...cats];
  }, [data]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTemp,
      category: categoryTemp
    });
  };

  const handleToggle = (itemId: string, checked: boolean) => {
    startTransition(async () => {
      const result = await toggleItemAvailability(itemId, checked);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.adminItems });
        router.refresh();
      } else {
        notify("Gagal mengubah status", result.error);
      }
    });
  };

  const onConfirmDelete = () => {
    if (!deleteModal.itemId) return;
    
    startTransition(async () => {
      const result = await deleteItem(deleteModal.itemId!);
      if (result.success) {
        notify("Barang dihapus", "Data barang telah dihapus dari inventaris.", "success");
        await queryClient.invalidateQueries({ queryKey: queryKeys.adminItems });
        setDeleteModal({ isOpen: false, itemId: null });
        router.refresh();
      } else {
        notify("Gagal menghapus", result.error, "error");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search items..." 
            value={searchTemp}
            onChange={(e) => setSearchTemp(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryTemp} onValueChange={setCategoryTemp}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "Semua Kategori" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleApplyFilters} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200 bg-white shadow-subtle">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-sm font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 min-w-[280px]">Barang</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4 text-center">Availability</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white whitespace-nowrap">
            {paginatedData.map((item) => (
              <tr key={item.$id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/200x200/f1f5f9/94a3b8?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="text-[10px] font-bold text-slate-400 uppercase text-center p-1">No Image</div>
                      )}
                    </div>
                    <div className="max-w-[200px] sm:max-w-xs overflow-hidden">
                      <p className="truncate font-semibold text-slate-900">{item.name}</p>
                      <p className="truncate text-xs text-slate-500">{item.description || "Tanpa deskripsi"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{item.quantity_available} tersedia</span>
                    <span className="text-xs text-slate-500">dari {item.quantity_total} total</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Switch 
                    checked={item.is_available} 
                    disabled={isPending}
                    onCheckedChange={(checked) => handleToggle(item.$id, checked)} 
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ItemFormModal item={item} triggerLabel={<Edit2 className="h-4 w-4" />} />
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, itemId: item.$id })}
                      disabled={isPending}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      {/* Modern Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Barang"
        description="Apakah Anda yakin ingin menghapus barang ini dari inventaris? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isPending}
      />
    </div>
  );
}
