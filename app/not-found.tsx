import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-xl px-6 py-20">
        <h1 className="text-4xl">Report not found</h1>
        <p className="mt-3 text-[#cfe7d6]">Check the tracking code, or file a new report.</p>
        <Link href="/report" className="sans mt-6 inline-block text-[#3ddc84]">
          Go to report desk
        </Link>
      </main>
    </>
  );
}
