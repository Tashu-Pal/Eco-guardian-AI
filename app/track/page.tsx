"use client";

import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";

export default function TrackIndex() {
  const router = useRouter();
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-4xl">Track a report</h1>
        <p className="mt-3 text-[#cfe7d6]">Enter the code from your confirmation, like EG-AB12CD.</p>
        <form
          className="sans mt-8 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const code = String(new FormData(e.currentTarget).get("code") || "").trim();
            if (code) router.push(`/track/${code}`);
          }}
        >
          <input
            name="code"
            placeholder="EG-XXXXXX"
            className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 uppercase"
          />
          <button className="rounded-full bg-[#3ddc84] px-6 font-semibold text-[#07140f]">Look up</button>
        </form>
      </main>
    </>
  );
}
