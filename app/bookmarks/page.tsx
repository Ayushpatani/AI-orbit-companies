"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, Trash2 } from "lucide-react";
import { Brand, CompanyMark } from "@/components/company-ui";
import { companies } from "@/lib/companies";

export default function BookmarksPage() {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSaved(JSON.parse(localStorage.getItem("orbit-company-bookmarks") || "[]"));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const items = companies.filter((company) => saved.includes(company.slug));
  function remove(slug: string) { const next = saved.filter((item) => item !== slug); setSaved(next); localStorage.setItem("orbit-company-bookmarks", JSON.stringify(next)); }
  return <div className="site-shell"><header className="site-header"><Brand /><Link href="/" className="back-link"><ArrowLeft size={16} /> Company directory</Link></header><main className="saved-main"><div className="eyebrow"><Bookmark size={14} /> YOUR COLLECTION</div><h1>Saved companies.</h1><p>Keep interesting AI companies in one place and return to them anytime.</p><div className="saved-summary"><strong>{ready ? items.length : "—"}</strong><span>companies saved</span></div>{!ready ? <div className="saved-loading" aria-label="Loading saved companies"><div /><div /><div /></div> : items.length ? <div className="saved-companies">{items.map((company) => <article key={company.slug}><CompanyMark company={company} /><div><span>{company.category}</span><h2>{company.name}</h2><p>{company.shortDescription}</p></div><Link href={`/companies/${company.slug}`}>View <ArrowUpRight size={16} /></Link><button onClick={() => remove(company.slug)} aria-label={`Remove ${company.name}`}><Trash2 size={16} /></button></article>)}</div> : <div className="empty-state saved-empty"><span><Bookmark size={24} /></span><h2>No saved companies yet</h2><p>Bookmark companies from the directory to find them here.</p><Link href="/">Explore companies</Link></div>}</main></div>;
}
