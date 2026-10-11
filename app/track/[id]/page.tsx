import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ConfirmButton } from "@/components/ConfirmButton";
import { severityClass } from "@/lib/format";
import { getReport } from "@/lib/store";

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto grid max-w-5xl gap-8 px-6 pb-20 lg:grid-cols-2">
        <div>
          <p className="sans text-xs uppercase tracking-[0.25em] text-[#3ddc84]">{report.trackingCode}</p>
          <h1 className="mt-3 text-4xl">{report.classification.label}</h1>
          <p className="mt-3 text-[#cfe7d6]">{report.classification.summary}</p>
          <div className="sans mt-5 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs ${severityClass(report.classification.severityLevel)}`}>
              {report.classification.severityLevel} · {report.classification.severity}/10
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#cfe7d6]">
              {report.departmentName}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#cfe7d6]">
              {report.classification.engine}
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={report.photoUrl} alt="" className="mt-6 max-h-96 w-full rounded-3xl object-cover" />
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="sans text-sm text-[#9bb8a6]">Status · {report.status.replace("_", " ")}</p>
          <p className="mt-2 text-sm text-[#cfe7d6]">
            {report.address} · {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
          </p>
          <ol className="mt-6 space-y-4">
            {report.timeline.map((t, i) => (
              <li key={i} className="border-l border-[#3ddc84]/40 pl-4">
                <p className="sans text-xs text-[#9bb8a6]">{new Date(t.at).toLocaleString()}</p>
                <p className="text-[#e7f4ea]">{t.note}</p>
              </li>
            ))}
          </ol>
          <div className="sans mt-8 flex gap-3">
            <ConfirmButton id={report.id} count={report.confirmations} />
            <Link href="/dashboard" className="rounded-full border border-white/15 px-4 py-2 text-sm">
              View city queue
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
