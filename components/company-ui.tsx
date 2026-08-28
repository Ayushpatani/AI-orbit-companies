"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Company } from "@/lib/companies";

export function Brand() {
  return <Link href="/" className="brand" aria-label="AI Orbit Companies home"><span className="brand-symbol"><span /></span><span>AIORBIT</span></Link>;
}

export function OrbitHeader({ onBusiness, onLeaderboard, onResources, onNewsletter }: { onBusiness?: () => void; onLeaderboard?: () => void; onResources?: () => void; onNewsletter?: () => void } = {}) {
  return (
    <header className="orbit-topbar">
      <div className="orbit-topbar-inner">
        <Brand />
        <nav className="orbit-top-links" aria-label="AI Orbit navigation">
          {onBusiness ? <button onClick={onBusiness}>Business AI</button> : <Link href="/?view=business#directory">Business AI</Link>}
          {onLeaderboard ? <button onClick={onLeaderboard}>Leaderboard</button> : <Link href="/?view=top#directory">Leaderboard</Link>}
          {onResources ? <button onClick={onResources}>Resources</button> : <Link href="/#directory">Resources</Link>}
          {onNewsletter ? <button onClick={onNewsletter}>Newsletter</button> : <Link href="/#newsletter">Newsletter</Link>}
        </nav>
        <div className="orbit-top-actions">
          <Link href="/submit" className="orbit-submit"><Plus size={15} /> Submit Tool</Link>
          <Link href="/admin" className="orbit-login">Log In</Link>
        </div>
      </div>
    </header>
  );
}

export function OrbitFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  function subscribe(event: React.FormEvent) { event.preventDefault(); if (!email.trim()) return; setSubscribed(true); }
  return (
    <footer className="orbit-footer">
      <div className="orbit-footer-intro"><Brand /><p>The Home of Everything AI.</p><small>Discover the tools, companies, and technologies shaping the global AI ecosystem.</small></div>
      <div className="orbit-newsletter" id="newsletter"><h3>Stay in the Orbit</h3><p>Get the most important AI updates, trends, and launches.</p>{subscribed?<strong className="orbit-subscribed">You&apos;re in the Orbit.</strong>:<form onSubmit={subscribe}><label><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" aria-label="Newsletter email" /><button type="submit">Subscribe</button></label></form>}</div>
      <FooterColumn title="EXPLORE" links={[["AI Tools","/tools"],["AI Agents","/agents"],["AI Models","/models"],["AI Companies","/companies"],["AI Devices","/devices"],["AI Robots","/robots"]]} />
      <FooterColumn title="DISCOVER" links={[["AI News","/news"],["AI Videos","/videos"],["AI Trends","/trends"],["AI Comparisons","/tools/compare"],["Leaderboard","/leaderboard"]]} />
      <FooterColumn title="ECOSYSTEM" links={[["Repositories","/repositories"],["MCP","/mcp"],["Tasks","/tasks"],["Submit AI","/submit"],["Update AI","/update"]]} />
      <FooterColumn title="AI ORBIT" links={[["About","/about"],["Contact","/contact"],["Privacy","/privacy"],["Terms","/terms"]]} />
      <div className="orbit-copyright">© 2026 AI Orbit. All rights reserved.</div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return <div className="orbit-footer-column"><h4>{title}</h4>{links.map(([label, path]) => <a key={label} href={`https://aiorbit.club${path}`}>{label}</a>)}</div>;
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
