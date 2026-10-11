import Link from "next/link";
import { Nav } from "@/components/Nav";

const domains = [
  { k: "Air", d: "Smog, burning, industrial haze" },
  { k: "Water", d: "Leaks, flooding, contaminated runoff" },
  { k: "Waste", d: "Illegal dumps, overflowing bins" },
  { k: "Heat", d: "Bare-ground heat islands" },
];

const steps = [
  { n: "📸", t: "Citizen captures evidence", d: "A photo plus GPS — no long forms, no WhatsApp maze." },
  { n: "🤖", t: "AI names the issue", d: "Rekognition + Bedrock estimate type, severity, and confidence." },
  { n: "🏛️", t: "The right desk gets it", d: "Waste, water, fire, parks, drains, pollution, health." },
  { n: "📊", t: "The city ranks the queue", d: "Live dashboard. Citizens track the same ticket." },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-12 py-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
           <p className="sans text-xs uppercase tracking-[0.25em] text-[#3ddc84]">
🌍 AI Powered by AWS Bedrock • Rekognition • S3
</p>
            <h1 className="mt-4 max-w-3xl text-5xl leading-tight md:text-7xl">
              
            </h1><h1 className="mt-4 max-w-3xl bg-gradient-to-r from-[#3ddc84] via-white to-[#7be7b0] bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
  Cleaner Cities.
Powered by AI.
  
</h1>
            <p className="mt-6 max-w-xl text-lg text-[#cfe7d6]">
              Illegal dumping, leaks, smoke, heat, fallen trees, and drains land in scattered chats.
              EcoGuardian turns them into a ranked operations queue — Air, Water, Waste, and Heat on a
              single platform.
            </p>
            <div className="sans mt-8 flex flex-wrap gap-3">
              <Link
                href="/report"
                className="rounded-full bg-[#3ddc84] px-6 py-3 font-semibold text-[#07140f]"
              >
               🚨 Report Issue
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-[#3ddc84]/40 px-6 py-3 text-[#e7f4ea]"
              >
                📊 Authority Dashboard
              </Link>
            </div>
          </div>
          <div className="glass rounded-3xl p-8">
  <p className="sans text-xs uppercase tracking-widest text-[#9bb8a6]">
    Live Platform Stats
  </p>

  <div className="mt-6 grid grid-cols-2 gap-4">

    <div className="rounded-2xl 
    transition-all duration-300 hover:-translate-y-2 hover:border-[#3ddc84] bg-black/25 p-5">
      <h2 className="text-3xl font-bold text-[#3ddc84]">2431+</h2>
      <p className="text-sm text-[#cfe7d6]">Reports</p>
    </div>

    <div className="rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#3ddc84] bg-black/25 p-5">
      <h2 className="text-3xl font-bold text-green-400">91%</h2>
      <p className="text-sm text-[#cfe7d6]">Resolved</p>
    </div>

    <div className="rounded-2xl
    transition-all duration-300 hover:-translate-y-2 hover:border-[#3ddc84] 
     bg-black/25 p-5">
      <h2 className="text-3xl font-bold text-blue-400">18</h2>
      <p className="text-sm text-[#cfe7d6]">Departments</p>
    </div>

    <div className="rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#3ddc84] bg-black/25 p-5">
      <h2 className="text-3xl font-bold text-yellow-400">24/7</h2>
      <p className="text-sm text-[#cfe7d6]">Monitoring</p>
    </div>

  </div>
</div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {steps.map((s) => (
            <article key={s.n} className="glass rounded-3xl p-5">
              <p className="sans text-[#3ddc84]">{s.n}</p>
              <h2 className="mt-3 text-2xl">{s.t}</h2>
              <p className="mt-2 text-sm text-[#9bb8a6]">{s.d}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
