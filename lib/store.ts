import { seedReports } from "./seed";
import type { Report } from "./types";

let reports: Report[] = seedReports();

export async function listReports(): Promise<Report[]> {
  return reports.sort((a, b) => b.priority - a.priority);
}

export async function getReport(id: string) {
  return reports.find(
    (r) => r.id === id || r.trackingCode === id.toUpperCase()
  );
}

export async function saveReport(report: Report) {
  const idx = reports.findIndex((r) => r.id === report.id);

  if (idx >= 0) reports[idx] = report;
  else reports.unshift(report);

  return report;
}

export async function resetSeed() {
  reports = seedReports();
  return reports;
}