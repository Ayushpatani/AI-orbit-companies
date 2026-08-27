import { NextResponse } from "next/server";
import { companies, getIntelligence } from "@/lib/companies";

export async function GET(request: Request) {
  const ids = new URL(request.url).searchParams.get("ids")?.split(",").filter(Boolean).slice(0, 3) || [];
  if (ids.length < 2) return NextResponse.json({ error: "Select at least two company slugs" }, { status: 400 });
  const data = ids.map((slug) => companies.find((company) => company.slug === slug)).filter(Boolean).map((company) => ({ ...company, intelligence: getIntelligence(company!.slug) }));
  return NextResponse.json({ data, total: data.length, generatedAt: new Date().toISOString() });
}
