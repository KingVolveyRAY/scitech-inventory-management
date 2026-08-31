import { InventoryTable } from "@/components/admin/inventory-table";
import { ItemFormModal } from "@/components/admin/item-form-modal";
import { getCatalogItems } from "@/lib/appwrite/queries";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const items = await getCatalogItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            <Typewriter text="Inventory." />
          </h1>
          <p className="mt-2 text-sm text-slate-500">Kelola stok, kategori, dan gambar item yang tersedia untuk dipinjam.</p>
        </div>
        <ItemFormModal />
      </div>
      <InventoryTable initialData={items} />
    </div>
  );
}
