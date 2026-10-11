"use client";

import { useState } from "react";

export function ConfirmButton({ id, count }: { id: string; count: number }) {
  const [n, setN] = useState(count);
  const [done, setDone] = useState(false);
  return (
    <button
      disabled={done}
      onClick={async () => {
        const res = await fetch(`/api/reports/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirm: true }),
        });
        const json = await res.json();
        setN(json.report.confirmations);
        setDone(true);
      }}
      className="rounded-full bg-[#3ddc84] px-4 py-2 text-sm font-semibold text-[#07140f] disabled:opacity-60"
    >
      {done ? `Confirmed (${n})` : `I see this too (${n})`}
    </button>
  );
}
