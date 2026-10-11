"use client";

import { CATEGORIES } from "@/lib/departments";
import type { Report } from "@/lib/types";

export function IssueMap({
  reports,
  center,
}: {
  reports: Report[];
  center: { lat: number; lng: number };
}) {
  const lats = reports.map((r) => r.lat);
  const lngs = reports.map((r) => r.lng);
  const pad = 1.2;
  const minLat = Math.min(center.lat - pad, ...lats);
  const maxLat = Math.max(center.lat + pad, ...lats);
  const minLng = Math.min(center.lng - pad, ...lngs);
  const maxLng = Math.max(center.lng + pad, ...lngs);

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[rgba(167,243,188,0.14)] bg-[#0c241a]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #14532d 0, transparent 40%), radial-gradient(circle at 80% 80%, #1e3a5f 0, transparent 42%), repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.03) 28px), repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(255,255,255,0.03) 28px)",
        }}
      />
      <p className="sans absolute left-4 top-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs text-[#cfe7d6]">
        Live incident map
      </p>
      {reports.map((r) => {
        const left = ((r.lng - minLng) / (maxLng - minLng)) * 100;
        const top = (1 - (r.lat - minLat) / (maxLat - minLat)) * 100;
        const color = CATEGORIES[r.classification.category].color;
        const size = 10 + r.classification.severity;
        return (
          <a
            key={r.id}
            href={`/track/${r.trackingCode}`}
            title={`${r.classification.label} · ${r.address}`}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_16px_currentColor]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: color,
              color,
              opacity: r.status === "resolved" ? 0.35 : 0.95,
            }}
          />
        );
      })}
    </div>
  );
}
