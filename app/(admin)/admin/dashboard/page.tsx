import { LoanBarChart } from "@/components/admin/loan-bar-chart";
import { RecentLoansTable } from "@/components/admin/recent-loans-table";
import { ReturnsAreaChart } from "@/components/admin/returns-area-chart";
import { StatCard } from "@/components/admin/stat-card";
import { StatusPieChart } from "@/components/admin/status-pie-chart";
import { TopClientsChart } from "@/components/admin/top-clients-chart";
import { getAdminDashboardData } from "@/lib/appwrite/queries";
import { Typewriter } from "@/components/ui/typewriter";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          <Typewriter text="Dashboard." />
        </h1>
        <p className="mt-2 text-sm text-slate-500">Ringkasan operasional SIMS untuk peminjaman barang internal.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LoanBarChart data={data.monthlyLoans} />
        <StatusPieChart data={data.statusDistribution} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopClientsChart 
          title="Peminjam Teraktif" 
          data={data.topBorrowers} 
          color="#6366f1" 
          valueLabel="Peminjaman"
        />
        <TopClientsChart 
          title="Sering Terlambat" 
          data={data.frequentLateReturns} 
          color="#f43f5e" 
          valueLabel="Kasus"
        />
      </div>

      <ReturnsAreaChart data={data.returnTrend} />
      
      <RecentLoansTable loans={data.recentLoans} />
    </div>
  );
}
