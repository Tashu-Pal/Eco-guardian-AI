import { Nav } from "@/components/Nav";
import { DashboardClient } from "@/components/DashboardClient";
import { listReports } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const reports = await listReports();
  const city = process.env.NEXT_PUBLIC_CITY_NAME ?? "India";

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <p className="sans text-xs uppercase tracking-[0.25em] text-[#3ddc84]">Authority operations</p>
        <h1 className="mt-3 bg-gradient-to-r from-[#3ddc84] via-white to-[#7be7b0] bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
          {city} command board
        </h1>

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-[#2e5c45] bg-[#13221b]/80 p-5">
            <h2 className="text-3xl font-bold text-[#3ddc84]">2431+</h2>
            <p className="mt-2 text-sm text-[#cfe7d6]">Reports Submitted</p>
          </div>

          <div className="rounded-2xl border border-[#2e5c45] bg-[#13221b]/80 p-5">
            <h2 className="text-3xl font-bold text-red-400">67</h2>
            <p className="mt-2 text-sm text-[#cfe7d6]">High Priority</p>
          </div>

          <div className="rounded-2xl border border-[#2e5c45] bg-[#13221b]/80 p-5">
            <h2 className="text-3xl font-bold text-blue-400">18</h2>
            <p className="mt-2 text-sm text-[#cfe7d6]">Departments</p>
          </div>

          <div className="rounded-2xl border border-[#2e5c45] bg-[#13221b]/80 p-5">
            <h2 className="text-3xl font-bold text-green-400">91%</h2>
            <p className="mt-2 text-sm text-[#cfe7d6]">Resolved Cases</p>
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d8efe0]">
          Issues are ranked by severity, freshness, and citizen confirmations. Change status as crews
          pick them up — the citizen tracking page updates with the same ticket.
        </p>

        <div className="mt-12 rounded-3xl border border-[#2e5c45] bg-[#0d1813]/70 p-6 shadow-2xl backdrop-blur-lg">
          <DashboardClient initial={reports} />
        </div>
      </main>
    </>
  );
}
