"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, DEPARTMENTS } from "@/lib/departments";
import { severityClass } from "@/lib/format";
import type { Report, ReportStatus } from "@/lib/types";
import { IssueMap } from "./IssueMap";

const CENTER = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 22.9734),
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? 78.6569),
};

export function DashboardClient({ initial }: { initial: Report[] }) {
  const [reports, setReports] = useState(initial);
  const [dept, setDept] = useState("all");
  const [openOnly, setOpenOnly] = useState(true);

  useEffect(() => {
    const t = setInterval(async () => {
      const res = await fetch("/api/reports");
      const json = await res.json();
      setReports(json.reports);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (openOnly && r.status === "resolved") return false;
      if (dept !== "all" && r.departmentId !== dept) return false;
      return true;
    });
  }, [reports, dept, openOnly]);

  const open = reports.filter((r) => r.status !== "resolved" && r.status !== "rejected");
  const critical = open.filter((r) => r.classification.severityLevel === "critical").length;

  async function setStatus(id: string, status: ReportStatus) {
    const res = await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    setReports((prev) => prev.map((r) => (r.id === json.report.id ? json.report : r)));
  }

  return (
    <div className="space-y-6">
      <div className="sans grid gap-4 sm:grid-cols-4">
        <Stat label="Open issues" value={String(open.length)} />
        <Stat label="Critical now" value={String(critical)} hot />
        <Stat label="Departments live" value="7" />
        <Stat
          label="Avg severity"
          value={(
            open.reduce((n, r) => n + r.classification.severity, 0) / Math.max(open.length, 1)
          ).toFixed(1)}
        />
      </div>

      <IssueMap reports={filtered} center={CENTER} />

      <div className="sans flex flex-wrap gap-2">
        <button
          onClick={() => setDept("all")}
          className={`rounded-full px-3 py-1 text-sm ${dept === "all" ? "bg-[#3ddc84] text-[#07140f]" : "bg-white/5"}`}
        >
          All domains
        </button>
        {Object.entries(DEPARTMENTS).map(([id, d]) => (
          <button
            key={id}
            onClick={() => setDept(id)}
            className={`rounded-full px-3 py-1 text-sm ${dept === id ? "bg-[#3ddc84] text-[#07140f]" : "bg-white/5"}`}
          >
            {d.short}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-[#9bb8a6]">
          <input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} />
          Hide resolved
        </label>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[rgba(167,243,188,0.14)]">
        <table className="sans w-full min-w-[880px] text-left text-sm">
          <thead className="bg-black/30 text-[#9bb8a6]">
            <tr>
              <th className="px-4 py-3">Priority</th>
              <th>Issue</th>
              <th>Department</th>
              <th>Severity</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-[#3ddc84]">{r.priority}</td>
                <td className="py-3 pr-4">
                  <a href={`/track/${r.trackingCode}`} className="block font-semibold">
                    {CATEGORIES[r.classification.category].label}
                  </a>
                  <span className="text-xs text-[#9bb8a6]">{r.trackingCode}</span>
                </td>
                <td className="pr-4 text-[#cfe7d6]">{r.departmentName}</td>
                <td className="pr-4">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${severityClass(r.classification.severityLevel)}`}
                  >
                    {r.classification.severityLevel} · {r.classification.severity}/10
                  </span>
                </td>
                <td className="pr-4 text-[#cfe7d6]">{r.address}</td>
                <td className="pr-4">
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value as ReportStatus)}
                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1"
                  >
                    {["submitted", "triaged", "assigned", "in_progress", "resolved", "rejected"].map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-[#9bb8a6]">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${hot ? "text-[#ff6b4a]" : "text-[#e7f4ea]"}`}>{value}</p>
    </div>
  );
}
