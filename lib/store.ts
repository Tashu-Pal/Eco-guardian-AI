import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Report } from "./types";
import { seedReports } from "./seed";

const dataDir = path.join(process.cwd(), "data");
const file = path.join(dataDir, "reports.json");

async function ensure() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(file, "utf8");
  } catch {
    await writeFile(file, JSON.stringify(seedReports(), null, 2), "utf8");
  }
}

export async function listReports(): Promise<Report[]> {
  await ensure();
  const raw = await readFile(file, "utf8");
  const reports = JSON.parse(raw) as Report[];
  return reports.sort((a, b) => b.priority - a.priority);
}

export async function getReport(id: string): Promise<Report | undefined> {
  const reports = await listReports();
  return reports.find((r) => r.id === id || r.trackingCode === id.toUpperCase());
}

export async function saveReport(report: Report) {
  const reports = await listReports();
  const idx = reports.findIndex((r) => r.id === report.id);
  if (idx >= 0) reports[idx] = report;
  else reports.unshift(report);
  await writeFile(file, JSON.stringify(reports, null, 2), "utf8");
  return report;
}

export async function resetSeed() {
  await mkdir(dataDir, { recursive: true });
  const reports = seedReports();
  await writeFile(file, JSON.stringify(reports, null, 2), "utf8");
  return reports;
}
