import { NextResponse } from "next/server";
import { companies, getIntelligence } from "@/lib/companies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").toLowerCase();
  const category = searchParams.get("category");
  const stage = searchParams.get("stage");
  const country = searchParams.get("country");
  const sort = searchParams.get("sort") || "score";
  const minScore = Number(searchParams.get("minScore") || 0);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 12)));
  const filtered = companies.filter((company) => (!search || `${company.name} ${company.category} ${company.shortDescription} ${company.products.join(" ")}`.toLowerCase().includes(search)) && (!category || company.category === category) && (!stage || company.stage === stage) && (!country || company.location === country) && company.score >= minScore);
  const sorted = [...filtered].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "newest" ? b.founded - a.founded : b.score - a.score);
  const start = (page - 1) * limit;
  const data = sorted.slice(start, start + limit).map((company) => ({ ...company, intelligence: getIntelligence(company.slug) }));
  return NextResponse.json({ data, meta: { total: filtered.length, page, limit, pages: Math.ceil(filtered.length / limit), sort, filters: { search, category, stage, country, minScore } } });
}
