"use client";

import Link from "next/link";

export function Nav() {
  return (
    <header className="sans mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#3ddc84] text-[#07140f] text-lg font-bold">
          EG
        </span>
        <span>
          <strong className="block text-sm tracking-wide">EcoGuardian AI</strong>
          <span className="text-xs text-[#9bb8a6]">India civic intelligence</span>
        </span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link className="rounded-full px-4 py-2 text-[#cfe7d6] hover:bg-white/5" href="/report">
          Report
        </Link>
        <Link className="rounded-full px-4 py-2 text-[#cfe7d6] hover:bg-white/5" href="/track">
          Track
        </Link>
        <Link
          className="rounded-full bg-[#e7f4ea] px-4 py-2 font-semibold text-[#07140f]"
          href="/dashboard"
        >
          Authority dashboard
        </Link>
      </nav>
    </header>
  );
}
