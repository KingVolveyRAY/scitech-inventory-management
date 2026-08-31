import { MyLoansTable } from "@/components/client/my-loans-table";
import { ActiveLoansList } from "@/components/client/active-loans-list";
import { getMyLoans, getActiveLoans } from "@/lib/appwrite/queries";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = 'force-dynamic';

export default async function MyLoansPage() {
  const user = await getLoggedInUser();

  if (!user) {
    return null;
  }

  const [myLoans, activeLoans] = await Promise.all([
    getMyLoans(user.profile.userId),
    getActiveLoans()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          <Typewriter text="Loans Activity." />
        </h1>
        <p className="mt-2 text-sm text-slate-500">Kelola pinjaman Anda dan pantau ketersediaan barang di tim.</p>
      </div>

      <Tabs defaultValue="my-loans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-loans">Pinjaman Saya</TabsTrigger>
          <TabsTrigger value="active-loans">Status Pinjaman</TabsTrigger>
        </TabsList>

        <TabsContent value="my-loans">
          <MyLoansTable initialData={myLoans} userId={user.profile.userId} />
        </TabsContent>

        <TabsContent value="active-loans">
          <ActiveLoansList initialData={activeLoans} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
