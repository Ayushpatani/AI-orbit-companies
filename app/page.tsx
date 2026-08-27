"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, ChevronDown, GitCompareArrows, Grid2X2, List, Menu, Plus, Search, SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react";
import { companies, categories, countries, getIntelligence, stages, type Company } from "@/lib/companies";
import { Brand, CompanyMark, PrimaryNav } from "@/components/company-ui";

type ViewMode = "grid" | "list";

function CompanyCard({ company, view, saved, onSave, comparing, onCompare }: { company: Company; view: ViewMode; saved: boolean; onSave: () => void; comparing: boolean; onCompare: () => void }) {
  const intelligence = getIntelligence(company.slug);
  return (
    <article className={`company-card ${view === "list" ? "company-card-list" : ""}`}>
      <div className="card-top">
        <CompanyMark company={company} />
        <div className="card-actions"><button className={`compare-icon ${comparing ? "is-comparing" : ""}`} onClick={onCompare} aria-label={`${comparing ? "Remove" : "Add"} ${company.name} ${comparing ? "from" : "to"} comparison`}><GitCompareArrows size={16} /></button><button className={`icon-button ${saved ? "is-saved" : ""}`} onClick={onSave} aria-label={saved ? `Remove ${company.name} from bookmarks` : `Bookmark ${company.name}`} title={saved ? "Remove bookmark" : "Bookmark company"}><Bookmark size={17} fill={saved ? "currentColor" : "none"} /></button></div>
      </div>
      <div className="card-copy">
        <div className="company-title-row"><h2>{company.name}</h2>{company.verified && <span className="verified" title="Verified company">✓</span>}</div>
        <p>{company.shortDescription}</p>
      </div>
      <div className="tag-row"><span>{company.category}</span><span>{company.stage}</span><span className="momentum-tag"><TrendingUp size={10} /> {intelligence.momentum}</span></div>
      <div className="card-meta"><span>{company.location}</span><span className="dot" /><span>Founded {company.founded}</span></div>
      <Link className="card-link" href={`/companies/${company.slug}`}>View company <ArrowUpRight size={16} /></Link>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [stage, setStage] = useState("All stages");
  const [country, setCountry] = useState("All countries");
  const [sort, setSort] = useState("Featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);

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
      return matchesQuery && (category === "All categories" || company.category === category) && (stage === "All stages" || company.stage === stage) && (country === "All countries" || company.location === country);
    });
    return [...result].sort((a, b) => sort === "A–Z" ? a.name.localeCompare(b.name) : sort === "Newest" ? b.founded - a.founded : Number(b.featured) - Number(a.featured) || b.score - a.score);
  }, [query, category, stage, country, sort]);

  function toggleSave(slug: string) {
    setSaved((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      localStorage.setItem("orbit-company-bookmarks", JSON.stringify(next));
      return next;
    });
  }

  function toggleCompare(slug: string) { setCompare((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : current); }
  function clearFilters() { setQuery(""); setCategory("All categories"); setStage("All stages"); setCountry("All countries"); setSort("Featured"); }
  const hasFilters = Boolean(query || category !== "All categories" || stage !== "All stages" || country !== "All countries");
  const averageScore = Math.round(companies.reduce((total, company) => total + company.score, 0) / companies.length);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Brand />
        <PrimaryNav mobileOpen={mobileOpen} />
        <div className="header-actions">
          <Link href="/bookmarks" className="saved-link"><Bookmark size={16} /> Saved <span>{saved.length}</span></Link>
          <Link className="submit-button" href="/submit">Submit company <Plus size={15} /></Link>
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="directory-intro">
          <div><div className="eyebrow"><Sparkles size={14} /> AI MARKET INTELLIGENCE</div><h1>Discover who is<br />shaping AI next.</h1></div>
          <p>Research, shortlist, and compare the companies defining the global AI market—all in one decision workspace.</p>
        </section>

        <section className="market-strip" aria-label="Directory overview">
          <div><span>INDEXED COMPANIES</span><strong>{companies.length}</strong><small>Curated market leaders</small></div>
          <div><span>MARKET CATEGORIES</span><strong>{categories.length - 1}</strong><small>Across the AI stack</small></div>
          <div><span>COUNTRIES</span><strong>{countries.length - 1}</strong><small>Global ecosystem coverage</small></div>
          <div><span>AVERAGE ORBIT SCORE</span><strong>{averageScore}</strong><small>Quality-weighted index</small></div>
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
              <select className="orbit-select" aria-label="Filter by country" value={country} onChange={(event) => setCountry(event.target.value)}>{countries.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              {hasFilters && <button className="clear-button" onClick={clearFilters}>Clear all <X size={14} /></button>}
            </div>
            <div className="view-controls"><span>Sort</span><select className="sort-select" aria-label="Sort companies" value={sort} onChange={(event) => setSort(event.target.value)}>{["Featured", "Newest", "A–Z"].map((item) => <option key={item} value={item}>{item}</option>)}</select><div className="view-switch" aria-label="View mode"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={16} /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view"><List size={18} /></button></div></div>
          </div>

          <div className="results-heading"><div><strong>{filtered.length}</strong> companies</div>{hasFilters && <span>Filtered results</span>}</div>
          {filtered.length ? <div className={`company-grid ${view === "list" ? "list-view" : ""}`}>{filtered.map((company) => <CompanyCard key={company.slug} company={company} view={view} saved={saved.includes(company.slug)} onSave={() => toggleSave(company.slug)} comparing={compare.includes(company.slug)} onCompare={() => toggleCompare(company.slug)} />)}</div> : <div className="empty-state"><span><Search size={24} /></span><h2>No companies found</h2><p>Try a different search or remove some filters.</p><button onClick={clearFilters}>Clear all filters</button></div>}
        </section>
      </main>

      {compare.length > 0 && <aside className="compare-tray" aria-label="Comparison shortlist"><div><span><GitCompareArrows size={16} /> COMPARISON SHORTLIST</span><div className="tray-companies">{compare.map((slug) => { const company = companies.find((item) => item.slug === slug)!; return <button key={slug} onClick={() => toggleCompare(slug)}><CompanyMark company={company} /><span>{company.name}</span><X size={13} /></button>; })}{Array.from({ length: 3 - compare.length }).map((_, index) => <div className="empty-slot" key={index}>Add company</div>)}</div></div><div><button onClick={() => setCompare([])} className="tray-clear">Clear</button>{compare.length >= 2 ? <Link href={`/compare?companies=${compare.join(",")}`}>Compare now <ArrowUpRight size={15} /></Link> : <span className="tray-hint">Select one more</span>}</div></aside>}

      <footer><Brand /><p>The home of everything AI.</p><div><span>© 2026 AI Orbit</span><Link href="/admin">Research admin</Link><a href="/api/companies" target="_blank" rel="noreferrer">API</a></div></footer>
    </div>
  );
}
