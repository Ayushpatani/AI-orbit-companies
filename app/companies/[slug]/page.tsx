import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight,Check } from "lucide-react";
import { companies,getCompany,getIntelligence } from "@/lib/companies";
import { CompanyMark,OrbitFooter,OrbitHeader } from "@/components/company-ui";
import { CompanyTabs } from "@/components/company-tabs";
import { CompanyProfileActions } from "@/components/company-profile-actions";

export function generateStaticParams(){return companies.map(({slug})=>({slug}));}
export default async function CompanyDetail({params}:{params:Promise<{slug:string}>}){
 const{slug}=await params;const company=getCompany(slug);if(!company)notFound();const intel=getIntelligence(slug);const related=companies.filter(x=>x.category===company.category&&x.slug!==slug).slice(0,3);
 return <div className="reference-home"><OrbitHeader/><main className="orbit-detail-main">
  <div className="orbit-breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/">Companies</Link><span>›</span><CompanyMark company={company}/><strong>{company.name}</strong><small>{company.products.length} tools</small></div>
  <section className="orbit-profile-card"><div className="orbit-profile-tags"><span>{company.category}</span><small>{company.products.length} AI Tools</small></div><div className="orbit-profile-main"><div className="orbit-profile-identity"><CompanyMark company={company} large/><div><h1>{company.name}{company.verified&&<b><Check size={12}/></b>}</h1><span>{company.headquarters}</span></div></div><CompanyProfileActions slug={company.slug} name={company.name}/></div><p className="orbit-profile-description">{company.description}</p><a className="orbit-profile-website" href={`https://${company.website}`} target="_blank" rel="noreferrer">{company.website}<ArrowUpRight size={13}/></a>
   <div className="orbit-profile-stats"><div><span>AI NATIVE</span><strong className="green">YES</strong></div><div><span>PROFITABLE</span><strong>—</strong></div><div><span>VALUATION</span><strong>{company.score>95?"$60B+":"$5B+"}</strong></div><div><span>$ RAISED</span><strong>{intel.funding}</strong></div><div><span>EMPLOYEES</span><strong>{company.employees}</strong></div><div><span>TOTAL TOOLS</span><strong>{company.products.length}</strong></div><div><span>TOTAL MODELS</span><strong>{Math.max(1,company.focus.length)}</strong></div><div><span>FLAGSHIP TOOL</span><strong>{company.products[0]}</strong></div></div>
  </section>
  <CompanyTabs company={company} intelligence={intel}/>
  <section className="orbit-related"><div><span>RELATED COMPANIES</span><h2>Explore similar companies</h2></div><div>{related.map(item=><Link href={`/companies/${item.slug}`} key={item.slug}><CompanyMark company={item}/><span><strong>{item.name}</strong><small>{item.category}</small></span><ArrowUpRight size={15}/></Link>)}</div></section>
 </main><OrbitFooter/></div>;
}
