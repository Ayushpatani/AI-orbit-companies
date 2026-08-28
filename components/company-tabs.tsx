"use client";
import { useState } from "react";
import { ArrowUpRight,Boxes } from "lucide-react";
import type { Company,CompanyIntelligence } from "@/lib/companies";

const tabs=["Tools","Models","Devices","Repositories","News","Videos","Fundraises","Investments"];
export function CompanyTabs({company,intelligence}:{company:Company;intelligence:CompanyIntelligence}){
 const[tab,setTab]=useState("Tools");
 return <section className="orbit-detail-content"><div className="orbit-detail-tabs" role="tablist">{tabs.map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}>{item}<span>{item==="Tools"?company.products.length:item==="Models"?company.focus.length:0}</span></button>)}</div>
 <div className="orbit-tab-panel">{tab==="Tools"?company.products.map((product,i)=><article key={product}><div><Boxes size={17}/></div><span><strong>{product}</strong><small>{company.focus[i]||company.category}</small></span><ArrowUpRight size={16}/></article>):tab==="Models"?company.focus.map(item=><article key={item}><div><Boxes size={17}/></div><span><strong>{item}</strong><small>{intelligence.deployment}</small></span><ArrowUpRight size={16}/></article>):<div className="orbit-tab-empty"><Boxes size={25}/><h3>No {tab.toLowerCase()} indexed yet</h3><p>Verified ecosystem records will appear here.</p></div>}</div></section>;
}
