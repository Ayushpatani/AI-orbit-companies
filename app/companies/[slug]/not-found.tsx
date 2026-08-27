import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><span><Building2 size={27} /></span><div className="eyebrow">404 — LOST IN ORBIT</div><h1>Company not found.</h1><p>The company may have moved, changed its name, or left our directory.</p><Link href="/"><ArrowLeft size={16} /> Back to companies</Link></main>;
}
