import type { Report, SeverityLevel } from "./types";

export function severityClass(level: SeverityLevel) {
  if (level === "critical") return "bg-[#ff6b4a]/20 text-[#ffb4a2] border-[#ff6b4a]/40";
  if (level === "high") return "bg-[#f0b429]/15 text-[#f6d889] border-[#f0b429]/35";
  if (level === "medium") return "bg-sky-500/15 text-sky-200 border-sky-400/30";
  return "bg-white/5 text-[#9bb8a6] border-white/10";
}

export function categoryCounts(reports: Report[]) {
  return reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.classification.category] = (acc[r.classification.category] ?? 0) + 1;
    return acc;
  }, {});
}
