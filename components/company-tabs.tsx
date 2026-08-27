"use client";

import { useState } from "react";
import { Activity, Boxes, CheckCircle2, TrendingUp } from "lucide-react";
import type { Company, CompanyIntelligence } from "@/lib/companies";

export function CompanyTabs({ company, intelligence }: { company: Company; intelligence: CompanyIntelligence }) {
  const [tab, setTab] = useState<"overview" | "products" | "signals">("overview");
  return (
    <section className="intelligence-panel">
      <div className="intelligence-tabs" role="tablist" aria-label="Company intelligence">
        {(["overview", "products", "signals"] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}
      </div>
      {tab === "overview" && <div className="tab-overview">
        <p>{company.description}</p>
        <div className="metric-cards">
          <Metric icon={<TrendingUp size={15} />} label="Momentum" value={intelligence.momentum} />
          <Metric icon={<Activity size={15} />} label="Innovation" value={intelligence.innovation} />
          <Metric icon={<CheckCircle2 size={15} />} label="Enterprise" value={intelligence.enterprise} />
        </div>
      </div>}
      {tab === "products" && <div className="tab-products">{company.products.map((product, index) => <div key={product}><span>0{index + 1}</span><Boxes size={16} /><strong>{product}</strong><small>{company.focus[index] || company.category}</small></div>)}</div>}
      {tab === "signals" && <div className="tab-signals">{intelligence.signals.map((signal, index) => <div key={signal}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{signal}</strong><p>Active ecosystem signal tracked in the AI Orbit company index.</p></div><TrendingUp size={16} /></div>)}</div>}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="metric-card"><div>{icon}<span>{label}</span><strong>{value}</strong></div><div className="metric-track"><span style={{ width: `${value}%` }} /></div></div>;
}
