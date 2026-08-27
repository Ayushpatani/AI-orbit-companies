import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Check, Globe2, MapPin, Users } from "lucide-react";
import { companies, getCompany } from "@/lib/companies";
import { Brand, CompanyMark, PrimaryNav } from "@/components/company-ui";

export function generateStaticParams() { return companies.map(({ slug }) => ({ slug })); }

export default async function CompanyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();
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

        <section className="detail-layout">
          <div className="detail-content">
            <div className="content-block"><span className="section-number">01</span><h2>About</h2><p>{company.description}</p></div>
            <div className="content-block"><span className="section-number">02</span><h2>Products</h2><div className="product-list">{company.products.map((product, index) => <div key={product}><span>0{index + 1}</span><strong>{product}</strong><ArrowUpRight size={16} /></div>)}</div></div>
            <div className="content-block"><span className="section-number">03</span><h2>Focus areas</h2><div className="focus-grid">{company.focus.map((item) => <span key={item}>{item}</span>)}</div></div>
          </div>
          <aside className="company-facts">
            <div className="facts-title">COMPANY DETAILS</div>
            <dl>
              <div><dt><MapPin size={15} /> Headquarters</dt><dd>{company.headquarters}</dd></div>
              <div><dt><CalendarDays size={15} /> Founded</dt><dd>{company.founded}</dd></div>
              <div><dt><Users size={15} /> Team size</dt><dd>{company.employees}</dd></div>
              <div><dt><Building2 size={15} /> Company stage</dt><dd>{company.stage}</dd></div>
              <div><dt><Globe2 size={15} /> Website</dt><dd>{company.website}</dd></div>
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
