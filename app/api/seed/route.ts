import { NextResponse } from "next/server";
import { resetSeed } from "@/lib/store";

export async function POST() {
  const reports = await resetSeed();
  return NextResponse.json({ ok: true, count: reports.length });
}
