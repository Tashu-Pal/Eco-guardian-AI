"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const DEFAULT_LAT = Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 22.9734);
const DEFAULT_LNG = Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? 78.6569);

export function ReportForm() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [located, setLocated] = useState(false);

  const geoLabel = useMemo(
    () => `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
    [coords],
  );

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function locate() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocated(true);
      },
      () => setError("Location permission denied — drop a pin using the defaults or type an address."),
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("lat", String(coords.lat));
    data.set("lng", String(coords.lng));
    try {
      const res = await fetch("/api/reports", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not submit");
      router.push(`/track/${json.report.trackingCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass sans grid gap-5 rounded-3xl p-6 md:grid-cols-2">
      <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#3ddc84]/40 bg-black/20 p-4 text-center transition-all duration-300 hover:border-[#3ddc84] hover:bg-[#3ddc84]/10">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
  src={preview}
  alt="Preview"
  style={{
    width: "100%",
    height: "280px",
    objectFit: "contain",
    background: "#111",
    borderRadius: "16px"
  }}
/>
        ) : (
          <>
            <span className="text-4xl">📸</span>
            <p className="mt-3 text-sm text-[#cfe7d6]">Upload a photo of the issue</p>
            <p className="text-xs text-[#9bb8a6]">JPG or PNG · GPS will be attached</p>
          </>
        )}
        <input
          required
          className="sr-only"
          type="file"
          name="photo"
          accept="image/*"
          capture="environment"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>

      <div className="flex flex-col gap-4">
        <label className="block text-sm">
          What do you see?
          <textarea
            name="notes"
            rows={3}
            placeholder="Overflowing dump, leaking pipe, smoke…"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-[#e7f4ea] outline-none focus:border-[#3ddc84]"
          />
        </label>
        <label className="block text-sm">
          Your name (optional)
          <input
            name="reporterName"
            placeholder="Citizen"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none focus:border-[#3ddc84]"
          />
        </label>
        <label className="block text-sm">
          Landmark / address
          <input
            name="address"
            placeholder="Near metro station, Connaught Place, New Delhi…"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none focus:border-[#3ddc84]"
          />
        </label>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm">
          <span>
            📍 {geoLabel}
            <span className="ml-2 text-xs text-[#9bb8a6]">{located ? "from device" : "city default"}</span>
          </span>
          <button type="button" onClick={locate} className="text-[#3ddc84]">
            Use my location
          </button>
        </div>
        {error ? <p className="text-sm text-[#ff6b4a]">{error}</p> : null}
        <button
          disabled={busy}
          className="rounded-full bg-[#3ddc84] py-3 font-semibold text-[#07140f] disabled:opacity-60"
        >
          {busy ? "🤖 AWS AI is analyzing your report..." : "🚨 Submit to EcoGuardian"}
        </button>
      </div>
    </form>
  );
}
