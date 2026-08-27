import { NextRequest, NextResponse } from "next/server";
import { isAdminKey, submissionStatuses, updateSubmission } from "@/lib/submissions";
import { z } from "zod";

const updateSchema = z.object({ status: z.enum(submissionStatuses), reviewerNotes: z.string().trim().max(500).default("") });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminKey(request.headers.get("x-admin-key"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid moderation update", fields: parsed.error.flatten().fieldErrors }, { status: 422 });
    const { id } = await params;
    const updated = await updateSubmission(id, parsed.data.status, parsed.data.reviewerNotes);
    if (!updated) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update submission" }, { status: 500 }); }
}
