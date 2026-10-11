import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { classifyIssue } from "@/lib/aws/classify";
import { notifyDepartment } from "@/lib/aws/sns";
import { storePhoto } from "@/lib/aws/s3";
import { priorityScore, routeDepartment } from "@/lib/departments";
import { listReports, saveReport } from "@/lib/store";
import type { Report } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const reports = await listReports();
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const photo = form.get("photo");
  const notes = String(form.get("notes") ?? "");
  const reporterName = String(form.get("reporterName") ?? "Citizen").slice(0, 80);
  const address = String(form.get("address") ?? "GPS pin");
  const lat = Number(form.get("lat"));
  const lng = Number(form.get("lng"));

  if (!(photo instanceof File) || photo.size < 100) {
    return NextResponse.json({ error: "A photo is required." }, { status: 400 });
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Location is required." }, { status: 400 });
  }

  const buffer = Buffer.from(await photo.arrayBuffer());
  const mime = photo.type || "image/jpeg";
  const stored = await storePhoto(buffer, mime, photo.name || "report.jpg");
  const classification = await classifyIssue({ buffer, mime, notes });
  const routed = routeDepartment(classification.category);
  const now = new Date().toISOString();
  const id = nanoid(10);

  const report: Report = {
    id,
    trackingCode: `EG-${id.slice(0, 6).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
    photoUrl: stored.url,
    notes,
    lat,
    lng,
    address,
    reporterName,
    classification,
    departmentId: routed.departmentId,
    departmentName: routed.departmentName,
    status: "triaged",
    priority: priorityScore(classification.severity, now, 0),
    confirmations: 0,
    timeline: [
      { at: now, status: "submitted", note: "Photo received." },
      {
        at: now,
        status: "triaged",
        note: `${classification.engine} classified as ${classification.label} (severity ${classification.severity}/10). Routed to ${routed.departmentName}.`,
      },
    ],
  };

  await saveReport(report);
  await notifyDepartment(report).catch(() => null);
  return NextResponse.json({ report });
}
