"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, Building2, ChevronDown, Grid2X2, List, Menu, Search, SlidersHorizontal, X } from "lucide-react";
import { companies, categories, stages, type Company } from "@/lib/companies";
import { Brand, CompanyMark, PrimaryNav } from "@/components/company-ui";

type ViewMode = "grid" | "list";

function CompanyCard({ company, view, saved, onSave }: { company: Company; view: ViewMode; saved: boolean; onSave: () => void }) {
  return (
    <article className={`company-card ${view === "list" ? "company-card-list" : ""}`}>
      <div className="card-top">
        <CompanyMark company={company} />
        <button className={`icon-button ${saved ? "is-saved" : ""}`} onClick={onSave} aria-label={saved ? `Remove ${company.name} from bookmarks` : `Bookmark ${company.name}`} title={saved ? "Remove bookmark" : "Bookmark company"}>
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-copy">
        <div className="company-title-row"><h2>{company.name}</h2>{company.verified && <span className="verified" title="Verified company">✓</span>}</div>
        <p>{company.shortDescription}</p>
      </div>
      <div className="tag-row"><span>{company.category}</span><span>{company.stage}</span></div>
      <div className="card-meta"><span>{company.location}</span><span className="dot" /><span>Founded {company.founded}</span></div>
      <Link className="card-link" href={`/companies/${company.slug}`}>View company <ArrowUpRight size={16} /></Link>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [stage, setStage] = useState("All stages");
  const [sort, setSort] = useState("Featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const value = localStorage.getItem("orbit-company-bookmarks");
      if (value) setSaved(JSON.parse(value));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = companies.filter((company) => {
      const matchesQuery = !normalized || company.name.toLowerCase().includes(normalized) || company.shortDescription.toLowerCase().includes(normalized) || company.category.toLowerCase().includes(normalized);
      return matchesQuery && (category === "All categories" || company.category === category) && (stage === "All stages" || company.stage === stage);
    });
    return [...result].sort((a, b) => sort === "A–Z" ? a.name.localeCompare(b.name) : sort === "Newest" ? b.founded - a.founded : Number(b.featured) - Number(a.featured) || b.score - a.score);
  }, [query, category, stage, sort]);

  function toggleSave(slug: string) {
    setSaved((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      localStorage.setItem("orbit-company-bookmarks", JSON.stringify(next));
      return next;
    });
  }

  function clearFilters() { setQuery(""); setCategory("All categories"); setStage("All stages"); setSort("Featured"); }
  const hasFilters = Boolean(query || category !== "All categories" || stage !== "All stages");

  return (
    <div className="site-shell">
      <header className="site-header">
        <Brand />
        <PrimaryNav mobileOpen={mobileOpen} />
        <div className="header-actions">
          <Link href="/bookmarks" className="saved-link"><Bookmark size={16} /> Saved <span>{saved.length}</span></Link>
          <a className="submit-button" href="https://aiorbit.club/submit" target="_blank" rel="noreferrer">Submit AI <ArrowUpRight size={15} /></a>
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="directory-intro">
          <div><div className="eyebrow"><Building2 size={14} /> AI COMPANY DIRECTORY</div><h1>Companies shaping<br />the future of AI.</h1></div>
          <p>Explore the labs, startups, and infrastructure companies building the next generation of intelligent technology.</p>
        </section>

        <section className="directory-panel">
          <div className="search-row">
            <label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, categories, or products..." aria-label="Search companies" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}</label>
            <button className={`filter-toggle ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={17} /> Filters <ChevronDown size={15} /></button>
          </div>

          <div className={`filter-row ${showFilters ? "show-mobile-filters" : ""}`}>
            <div className="filter-controls">
              <select className="orbit-select" aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              <select className="orbit-select" aria-label="Filter by stage" value={stage} onChange={(event) => setStage(event.target.value)}>{stages.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              {hasFilters && <button className="clear-button" onClick={clearFilters}>Clear all <X size={14} /></button>}
            </div>
            <div className="view-controls"><span>Sort</span><select className="sort-select" aria-label="Sort companies" value={sort} onChange={(event) => setSort(event.target.value)}>{["Featured", "Newest", "A–Z"].map((item) => <option key={item} value={item}>{item}</option>)}</select><div className="view-switch" aria-label="View mode"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={16} /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view"><List size={18} /></button></div></div>
          </div>

          <div className="results-heading"><div><strong>{filtered.length}</strong> companies</div>{hasFilters && <span>Filtered results</span>}</div>
          {filtered.length ? <div className={`company-grid ${view === "list" ? "list-view" : ""}`}>{filtered.map((company) => <CompanyCard key={company.slug} company={company} view={view} saved={saved.includes(company.slug)} onSave={() => toggleSave(company.slug)} />)}</div> : <div className="empty-state"><span><Search size={24} /></span><h2>No companies found</h2><p>Try a different search or remove some filters.</p><button onClick={clearFilters}>Clear all filters</button></div>}
        </section>
      </main>

      <footer><Brand /><p>The home of everything AI.</p><div><span>© 2026 AI Orbit</span><a href="https://aiorbit.club/privacy" target="_blank" rel="noreferrer">Privacy</a><a href="https://aiorbit.club/terms" target="_blank" rel="noreferrer">Terms</a></div></footer>
    </div>
  );
}
