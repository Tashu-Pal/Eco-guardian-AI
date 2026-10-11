import { Nav } from "@/components/Nav";
import { ReportForm } from "@/components/ReportForm";

export default function ReportPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pb-20">
        <p className="sans text-xs uppercase tracking-[0.25em] text-[#3ddc84]">Citizen desk</p>
        <h1 className="mt-3 bg-gradient-to-r from-[#3ddc84] via-white to-[#7be7b0] bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
  Report an Environmental Issue
</h1>
        <p className="mt-4 max-w-2xl text-[#cfe7d6]">
          Upload a photo, let AWS AI analyze the issue, automatically route it to the correct department, and receive a trackable ticket in seconds.
        </p>
        <div className="mt-12 rounded-3xl border border-[#2e5c45] bg-[#0d1813]/70 p-6 shadow-2xl backdrop-blur-lg">
  <ReportForm />
</div>
      </main>
    </>
  );
}
