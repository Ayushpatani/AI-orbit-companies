"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleAlert, Loader2, Plus, Send, X } from "lucide-react";
import { Brand, PrimaryNav } from "@/components/company-ui";

const categories = ["Foundation Models", "AI Search", "Developer Tools", "AI Infrastructure", "Voice & Audio", "Video Generation", "Data & Training", "Enterprise AI", "Creative AI"];
const stages = ["Early stage", "Growth", "Scale-up", "Enterprise", "Public"];
const teamSizes = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"];
const initial = { companyName: "", website: "", category: "", stage: "", country: "", city: "", founded: String(new Date().getFullYear()), employeeRange: "", description: "", submitterName: "", submitterEmail: "", submitterRole: "" };
type FormData = typeof initial;

export default function SubmitCompanyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initial);
  const [products, setProducts] = useState<string[]>([]);
  const [productInput, setProductInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ trackingCode: string; companyName: string; storage: string } | null>(null);

  const completion = useMemo(() => Math.round(((step - 1) / 3) * 100), [step]);
  function update(name: keyof FormData, value: string) { setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: "" })); }
  function addProduct() { const value = productInput.trim(); if (value && !products.includes(value) && products.length < 5) { setProducts((current) => [...current, value]); setProductInput(""); setErrors((current) => ({ ...current, products: "" })); } }
  function validate(currentStep: number) {
    const next: Record<string, string> = {};
    if (currentStep === 1) {
      if (form.companyName.trim().length < 2) next.companyName = "Enter the company name";
      if (!/^https?:\/\/.+\..+/.test(form.website)) next.website = "Use a complete URL such as https://company.ai";
      if (!form.category) next.category = "Select a category";
      if (!form.stage) next.stage = "Select a stage";
      if (!form.country.trim()) next.country = "Enter the country";
      if (!form.city.trim()) next.city = "Enter the city";
      if (!form.employeeRange) next.employeeRange = "Select a team size";
    }
    if (currentStep === 2) {
      if (form.description.trim().length < 80) next.description = "Write at least 80 characters";
      if (!products.length) next.products = "Add at least one product";
    }
    if (currentStep === 3) {
      if (form.submitterName.trim().length < 2) next.submitterName = "Enter your name";
      if (!/^\S+@\S+\.\S+$/.test(form.submitterEmail)) next.submitterEmail = "Enter a valid email";
      if (form.submitterRole.trim().length < 2) next.submitterRole = "Enter your role";
    }
    setErrors(next); return Object.keys(next).length === 0;
  }
  function nextStep() { if (validate(step)) setStep((value) => Math.min(3, value + 1)); }
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!validate(3)) return; setSubmitting(true); setErrors({});
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, founded: Number(form.founded), products }) });
      const payload = await response.json();
      if (!response.ok) { setErrors({ form: payload.error || "Submission failed. Please try again." }); return; }
      setResult({ ...payload.data, storage: payload.storage });
    } catch { setErrors({ form: "Network error. Check your connection and try again." }); }
    finally { setSubmitting(false); }
  }

  if (result) return <div className="site-shell"><header className="site-header"><Brand /><PrimaryNav /><Link href="/" className="back-link"><ArrowLeft size={16} /> Directory</Link></header><main className="submission-success"><div className="success-orbit"><CheckCircle2 size={32} /></div><div className="eyebrow">SUBMISSION RECEIVED</div><h1>{result.companyName}<br />is in review.</h1><p>Your company has entered the AI Orbit verification queue. Save the tracking code below to follow its progress.</p><div className="tracking-ticket"><span>TRACKING CODE</span><strong>{result.trackingCode}</strong><small>{result.storage === "demo" ? "Demo storage active — connect Supabase for permanent production records." : "Stored securely in the review database."}</small></div><div className="success-actions"><Link href={`/track?code=${result.trackingCode}`}>Track submission <ArrowRight size={16} /></Link><Link href="/">Return to directory</Link></div></main></div>;

  return <div className="site-shell"><header className="site-header"><Brand /><PrimaryNav /><Link href="/" className="back-link"><ArrowLeft size={16} /> Directory</Link></header><main className="submit-main"><section className="submit-intro"><div className="eyebrow"><Send size={14} /> ECOSYSTEM CONTRIBUTION</div><h1>Put your company<br />on the AI map.</h1><p>Submit an AI company for research and verification. Complete profiles are reviewed faster.</p><div className="review-promise"><span><Check size={14} /> Structured verification</span><span><Check size={14} /> Transparent tracking</span><span><Check size={14} /> Editorial review</span></div></section><section className="submission-workspace"><div className="form-progress"><div><span>STEP {step} OF 3</span><strong>{step === 1 ? "Company basics" : step === 2 ? "Product intelligence" : "Submitter & review"}</strong></div><span>{completion}% prepared</span><div><i style={{ width: `${step / 3 * 100}%` }} /></div></div><form onSubmit={submit}>
    {step === 1 && <div className="form-step"><div className="step-heading"><span>01</span><div><h2>Company basics</h2><p>Tell our research team who the company is.</p></div></div><div className="field-grid"><Field label="Company name" error={errors.companyName}><input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="e.g. Acme AI" /></Field><Field label="Website" error={errors.website}><input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://company.ai" /></Field><Field label="Primary category" error={errors.category}><select value={form.category} onChange={(e) => update("category", e.target.value)}><option value="">Select category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Company stage" error={errors.stage}><select value={form.stage} onChange={(e) => update("stage", e.target.value)}><option value="">Select stage</option>{stages.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Country" error={errors.country}><input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="United States" /></Field><Field label="City" error={errors.city}><input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="San Francisco" /></Field><Field label="Founded" error={errors.founded}><input type="number" min="1990" max={new Date().getFullYear()} value={form.founded} onChange={(e) => update("founded", e.target.value)} /></Field><Field label="Team size" error={errors.employeeRange}><select value={form.employeeRange} onChange={(e) => update("employeeRange", e.target.value)}><option value="">Select range</option>{teamSizes.map((item) => <option key={item}>{item}</option>)}</select></Field></div></div>}
    {step === 2 && <div className="form-step"><div className="step-heading"><span>02</span><div><h2>Product intelligence</h2><p>Help reviewers understand the company&apos;s market position.</p></div></div><Field label="Company description" error={errors.description} hint={`${form.description.length}/700`}><textarea maxLength={700} rows={7} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the problem, product, customers, and what makes the company distinct..." /></Field><Field label="Products or platforms" error={errors.products} hint={`${products.length}/5`}><div className="product-entry"><input value={productInput} onChange={(e) => setProductInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addProduct(); } }} placeholder="Add a product and press Enter" /><button type="button" onClick={addProduct}><Plus size={16} /> Add</button></div><div className="product-chips">{products.map((item) => <button type="button" key={item} onClick={() => setProducts((current) => current.filter((value) => value !== item))}>{item}<X size={12} /></button>)}</div></Field></div>}
    {step === 3 && <div className="form-step"><div className="step-heading"><span>03</span><div><h2>Submitter & review</h2><p>We use these details only to verify the listing.</p></div></div><div className="field-grid"><Field label="Your name" error={errors.submitterName}><input value={form.submitterName} onChange={(e) => update("submitterName", e.target.value)} placeholder="Full name" /></Field><Field label="Work email" error={errors.submitterEmail}><input type="email" value={form.submitterEmail} onChange={(e) => update("submitterEmail", e.target.value)} placeholder="you@company.ai" /></Field><Field label="Your role" error={errors.submitterRole}><input value={form.submitterRole} onChange={(e) => update("submitterRole", e.target.value)} placeholder="Founder, employee, community member..." /></Field></div><div className="review-card"><span>READY FOR REVIEW</span><h3>{form.companyName}</h3><p>{form.category} · {form.stage} · {form.city}, {form.country}</p><div>{products.map((item) => <span key={item}>{item}</span>)}</div></div>{errors.form && <div className="form-error"><CircleAlert size={16} /> {errors.form}</div>}</div>}
    <div className="form-actions">{step > 1 ? <button type="button" className="secondary-action" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={15} /> Back</button> : <span />}{step < 3 ? <button type="button" className="primary-action" onClick={nextStep}>Continue <ArrowRight size={15} /></button> : <button type="submit" className="primary-action" disabled={submitting}>{submitting ? <><Loader2 className="spin" size={15} /> Submitting</> : <>Submit for review <Send size={15} /></>}</button>}</div>
  </form></section></main></div>;
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) { return <label className={`form-field ${error ? "has-error" : ""}`}><span>{label}{hint && <small>{hint}</small>}</span>{children}{error && <em>{error}</em>}</label>; }
