import { UsersTable } from "@/components/admin/users-table";
import { getProfiles } from "@/lib/appwrite/queries";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getProfiles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          <Typewriter text="Users." />
        </h1>
        <p className="mt-2 text-sm text-slate-500">Kelola role dan status aktif pengguna internal perusahaan.</p>
      </div>
      <UsersTable initialData={users} />
    </div>
  );
}
