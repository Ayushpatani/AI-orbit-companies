import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Check, Globe2, MapPin, Users } from "lucide-react";
import { companies, getCompany, getIntelligence } from "@/lib/companies";
import { Brand, CompanyMark, PrimaryNav } from "@/components/company-ui";
import { CompanyTabs } from "@/components/company-tabs";

export function generateStaticParams() { return companies.map(({ slug }) => ({ slug })); }

export default async function CompanyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();
  const intelligence = getIntelligence(slug);
  const related = companies.filter((item) => item.category === company.category && item.slug !== company.slug).slice(0, 3);

  return (
    <div className="site-shell">
      <header className="site-header"><Brand /><PrimaryNav /><Link href="/" className="back-link"><ArrowLeft size={16} /> Directory</Link></header>
      <main className="detail-main">
        <div className="breadcrumbs"><Link href="/">Companies</Link><span>/</span><span>{company.name}</span></div>
        <section className="detail-hero">
          <div className="detail-identity"><CompanyMark company={company} large /><div><div className="detail-label">{company.category}</div><h1>{company.name} <span className="verified detail-verified"><Check size={11} /></span></h1><p>{company.shortDescription}</p></div></div>
          <a className="website-button" href={`https://${company.website}`} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16} /></a>
        </section>

        <section className="detail-signal-bar"><div><span>ORBIT SCORE</span><strong>{company.score}<small>/100</small></strong></div><div><span>FUNDING SIGNAL</span><strong>{intelligence.funding}</strong></div><div><span>BUSINESS MODEL</span><strong>{intelligence.businessModel}</strong></div><div><span>DEPLOYMENT</span><strong>{intelligence.deployment}</strong></div></section>

        <section className="detail-layout">
          <div className="detail-content">
            <CompanyTabs company={company} intelligence={intelligence} />
            <div className="focus-section"><div><span>CAPABILITY MAP</span><h2>Core focus areas</h2></div><div className="focus-grid">{company.focus.map((item, index) => <span key={item}><small>0{index + 1}</small>{item}</span>)}</div></div>
          </div>
          <aside className="company-facts">
            <div className="facts-title">COMPANY DETAILS</div>
            <dl>
              <div><dt><MapPin size={15} /> Headquarters</dt><dd>{company.headquarters}</dd></div>
              <div><dt><CalendarDays size={15} /> Founded</dt><dd>{company.founded}</dd></div>
              <div><dt><Users size={15} /> Team size</dt><dd>{company.employees}</dd></div>
              <div><dt><Building2 size={15} /> Company stage</dt><dd>{company.stage}</dd></div>
              <div><dt><Globe2 size={15} /> Website</dt><dd>{company.website}</dd></div>
              <div><dt><TrendingUpIcon /> Funding signal</dt><dd>{intelligence.funding}</dd></div>
            </dl>
            <div className="orbit-score"><div><span>ORBIT SCORE</span><strong>{company.score}</strong></div><div className="score-track"><span style={{ width: `${company.score}%` }} /></div><p>Based on product impact, innovation, and ecosystem presence.</p></div>
          </aside>
        </section>

        <section className="related-section"><div><span>DISCOVER MORE</span><h2>Related companies</h2></div><div className="related-grid">{related.length ? related.map((item) => <Link href={`/companies/${item.slug}`} key={item.slug}><CompanyMark company={item} /><div><strong>{item.name}</strong><span>{item.shortDescription}</span></div><ArrowUpRight size={16} /></Link>) : <p>No related companies yet.</p>}</div></section>
      </main>
      <footer><Brand /><p>The home of everything AI.</p><div><span>© 2026 AI Orbit</span><a href="https://aiorbit.club/privacy" target="_blank" rel="noreferrer">Privacy</a><a href="https://aiorbit.club/terms" target="_blank" rel="noreferrer">Terms</a></div></footer>
    </div>
  );
}

function TrendingUpIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>; }
