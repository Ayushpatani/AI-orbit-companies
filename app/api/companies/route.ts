import { NextResponse } from "next/server";
import { companies } from "@/lib/companies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").toLowerCase();
  const category = searchParams.get("category");
  const stage = searchParams.get("stage");
  const results = companies.filter((company) => (!search || `${company.name} ${company.category} ${company.shortDescription}`.toLowerCase().includes(search)) && (!category || company.category === category) && (!stage || company.stage === stage));
  return NextResponse.json({ data: results, total: results.length });
}
