import Link from "next/link";
import type { Company } from "@/lib/companies";

export function Brand() {
  return <Link href="/" className="brand" aria-label="AI Orbit Companies home"><span className="brand-symbol"><span /></span><span>AI ORBIT</span></Link>;
}

export function CompanyMark({ company, large = false }: { company: Company; large?: boolean }) {
  return <div className={`company-mark ${large ? "company-mark-large" : ""}`} style={{ "--mark": company.color } as React.CSSProperties} aria-hidden="true">{company.initials}</div>;
}

export function PrimaryNav({ mobileOpen = false }: { mobileOpen?: boolean }) {
  return (
    <nav className={`main-nav ${mobileOpen ? "nav-open" : ""}`} aria-label="Main navigation">
      <Link href="/">Discover</Link>
      <Link href="/compare">Compare</Link>
      <Link href="/submit">Submit</Link>
      <Link href="/track">Track</Link>
    </nav>
  );
}
