import { NextResponse } from "next/server";
import { getCompany } from "@/lib/companies";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  return company ? NextResponse.json({ data: company }) : NextResponse.json({ error: "Company not found" }, { status: 404 });
}
