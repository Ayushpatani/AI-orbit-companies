import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, GitCompareArrows, Minus } from "lucide-react";
import { companies, getIntelligence } from "@/lib/companies";
import { Brand, CompanyMark, PrimaryNav } from "@/components/company-ui";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ companies?: string }> }) {
  const query = await searchParams;
  const slugs = (query.companies || "").split(",").filter(Boolean).slice(0, 3);
  const selected = slugs.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean) as typeof companies;
  return <div className="site-shell">
    <header className="site-header"><Brand /><PrimaryNav /><Link href="/" className="back-link"><ArrowLeft size={16} /> Directory</Link></header>
    <main className="compare-main">
      <div className="compare-heading"><div className="eyebrow"><GitCompareArrows size={14} /> DECISION WORKSPACE</div><h1>Compare AI<br />companies.</h1><p>Evaluate market position, product focus, operating model, and ecosystem signals side by side.</p></div>
      {selected.length >= 2 ? <CompareTable selected={selected} /> : <div className="compare-empty"><span><GitCompareArrows size={28} /></span><h2>Select at least two companies</h2><p>Return to the directory and add companies to your comparison shortlist.</p><Link href="/">Explore companies <ArrowUpRight size={15} /></Link></div>}
    </main>
  </div>;
}

function CompareTable({ selected }: { selected: typeof companies }) {
  const rows = [
    ["Category", ...selected.map((item) => item.category)],
    ["Stage", ...selected.map((item) => item.stage)],
    ["Headquarters", ...selected.map((item) => item.headquarters)],
    ["Founded", ...selected.map((item) => String(item.founded))],
    ["Team", ...selected.map((item) => item.employees)],
    ["Funding signal", ...selected.map((item) => getIntelligence(item.slug).funding)],
    ["Business model", ...selected.map((item) => getIntelligence(item.slug).businessModel)],
    ["Deployment", ...selected.map((item) => getIntelligence(item.slug).deployment)],
  ];
  return <div className="compare-workspace">
    <div className={`compare-company-heads cols-${selected.length}`}>{selected.map((company) => <div key={company.slug}><CompanyMark company={company} /><div><span>{company.category}</span><h2>{company.name} {company.verified && <small><Check size={10} /></small>}</h2></div><strong>{company.score}<span>/100</span></strong></div>)}</div>
    <div className="comparison-scores">{["momentum", "innovation", "enterprise"].map((metric) => <div key={metric}><span>{metric}</span>{selected.map((company) => { const value = getIntelligence(company.slug)[metric as "momentum" | "innovation" | "enterprise"]; return <div key={company.slug}><div><span style={{ width: `${value}%`, background: company.color }} /></div><strong>{value}</strong></div>; })}</div>)}</div>
    <div className="compare-rows">{rows.map(([label, ...values]) => <div className={`compare-row cols-${selected.length}`} key={label}><span>{label}</span>{values.map((value, index) => <strong key={`${label}-${index}`}>{value || <Minus size={14} />}</strong>)}</div>)}</div>
    <div className={`compare-actions cols-${selected.length}`}>{selected.map((company) => <Link key={company.slug} href={`/companies/${company.slug}`}>Open {company.name} <ArrowUpRight size={15} /></Link>)}</div>
  </div>;
}
