"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Loader2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Brand, PrimaryNav } from "@/components/company-ui";

type Result = { trackingCode: string; companyName: string; category: string; status: "pending" | "in_review" | "approved" | "rejected"; reviewerNotes: string; createdAt: string; updatedAt: string };
const statusIndex = { pending: 0, in_review: 1, approved: 2, rejected: 2 };

export default function TrackPage() {
  return <Suspense fallback={<div className="site-shell"><header className="site-header"><Brand /></header><main className="track-main"><div className="tracking-placeholder"><Loader2 className="spin" size={24} /><h2>Loading tracking workspace</h2></div></main></div>}><TrackContent /></Suspense>;
}

function TrackContent() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code") || "");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function search(event: FormEvent) { event.preventDefault(); if (!code.trim()) return; setLoading(true); setError(""); setResult(null); try { const response = await fetch(`/api/submissions/${encodeURIComponent(code.trim())}`); const payload = await response.json(); if (!response.ok) setError(payload.error || "Submission not found"); else setResult(payload.data); } catch { setError("Could not connect to the tracking service"); } finally { setLoading(false); } }
  const current = result ? statusIndex[result.status] : 0;
  return <div className="site-shell"><header className="site-header"><Brand /><PrimaryNav /><Link href="/" className="back-link"><ArrowLeft size={16} /> Directory</Link></header><main className="track-main"><section><div className="eyebrow"><Search size={14} /> SUBMISSION TRACKING</div><h1>Follow every<br />review decision.</h1><p>Enter the private tracking code created when the company was submitted.</p><form onSubmit={search} className="tracking-search"><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ORB-2026-XXXXXX" aria-label="Tracking code" /><button disabled={loading}>{loading ? <Loader2 className="spin" size={17} /> : <ArrowRight size={17} />}</button></form>{error && <div className="track-error"><CircleAlert size={16} /> {error}</div>}</section><section className="tracking-result">{!result ? <div className="tracking-placeholder"><Clock3 size={26} /><h2>Review progress appears here</h2><p>Your tracking code does not expose private submitter information.</p></div> : <div className="status-card"><div className="status-heading"><div><span>TRACKING CODE</span><strong>{result.trackingCode}</strong></div><StatusPill status={result.status} /></div><h2>{result.companyName}</h2><p>{result.category} · Submitted {new Date(result.createdAt).toLocaleDateString()}</p><div className="status-timeline">{["Submitted", "Editorial review", result.status === "rejected" ? "Changes requested" : "Decision"].map((label, index) => <div className={index <= current ? "complete" : ""} key={label}><i>{index < current || (index === 2 && result.status === "approved") ? <Check size={12} /> : index + 1}</i><span>{label}</span></div>)}</div><div className="review-note"><span>LATEST REVIEW NOTE</span><p>{result.reviewerNotes || (result.status === "pending" ? "The submission is waiting for an editor to begin verification." : "The research team is reviewing the company profile and market claims.")}</p></div></div>}</section></main></div>;
}
function StatusPill({ status }: { status: Result["status"] }) { return <span className={`status-pill status-${status}`}>{status.replace("_", " ")}</span>; }
