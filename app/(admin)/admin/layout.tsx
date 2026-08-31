import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getLoggedInUser();

  if (!user || user.profile.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <AdminSidebar profile={user.profile} />
      
      <main className="flex-1 overflow-x-hidden p-4 pt-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
