import { redirect } from "next/navigation";
import { ClientNavbar } from "@/components/client/client-navbar";
import { PageTransition } from "@/components/ui/page-transition";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { RealtimeProvider } from "@/components/providers/realtime-provider";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  if (user.profile.role !== "client") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtimeProvider>
        <ClientNavbar profile={user.profile} />
        <PageTransition>
          <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 md:px-6">{children}</div>
        </PageTransition>
      </RealtimeProvider>
    </div>
  );
}
