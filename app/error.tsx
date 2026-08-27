"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorState({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="not-found"><span><AlertTriangle size={27} /></span><div className="eyebrow">SOMETHING WENT WRONG</div><h1>Lost connection.</h1><p>We couldn’t load this part of the company directory. Your saved companies are still safe.</p><button className="retry-button" onClick={reset}><RotateCcw size={15} /> Try again</button></main>;
}
