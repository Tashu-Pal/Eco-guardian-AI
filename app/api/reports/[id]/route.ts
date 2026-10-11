import { NextResponse } from "next/server";
import { priorityScore } from "@/lib/departments";
import { getReport, saveReport } from "@/lib/store";
import type { ReportStatus } from "@/lib/types";

const STATUSES: ReportStatus[] = [
  "submitted",
  "triaged",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
];

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const report = await getReport(id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ report });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const report = await getReport(id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as { status?: ReportStatus; confirm?: boolean; note?: string };

  if (body.confirm) {
    report.confirmations += 1;
  }
  if (body.status && STATUSES.includes(body.status)) {
    report.status = body.status;
    report.timeline.push({
      at: new Date().toISOString(),
      status: body.status,
      note: body.note || `Status set to ${body.status.replace("_", " ")}.`,
    });
  }
  report.updatedAt = new Date().toISOString();
  report.priority = priorityScore(
    report.classification.severity,
    report.createdAt,
    report.confirmations,
  );
  await saveReport(report);
  return NextResponse.json({ report });
}
