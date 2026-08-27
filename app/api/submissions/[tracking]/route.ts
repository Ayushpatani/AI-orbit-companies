import { NextResponse } from "next/server";
import { findByTracking, publicSubmission } from "@/lib/submissions";

export async function GET(_: Request, { params }: { params: Promise<{ tracking: string }> }) {
  try {
    const { tracking } = await params;
    const item = await findByTracking(decodeURIComponent(tracking));
    if (!item) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    return NextResponse.json({ data: publicSubmission(item) });
  } catch { return NextResponse.json({ error: "Could not retrieve submission" }, { status: 500 }); }
}
