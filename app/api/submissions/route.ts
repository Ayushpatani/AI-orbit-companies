import { NextRequest, NextResponse } from "next/server";
import { companySubmissionSchema, createSubmission, isAdminKey, listSubmissions, storageMode } from "@/lib/submissions";

export async function POST(request: NextRequest) {
  try {
    const parsed = companySubmissionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Validation failed", fields: parsed.error.flatten().fieldErrors }, { status: 422 });
    const submission = await createSubmission(parsed.data);
    return NextResponse.json({ data: { id: submission.id, trackingCode: submission.trackingCode, status: submission.status, companyName: submission.companyName }, storage: storageMode() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Submission could not be created" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminKey(request.headers.get("x-admin-key"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const submissions = await listSubmissions();
    const counts = submissions.reduce((result, item) => ({ ...result, [item.status]: result[item.status] + 1 }), { pending: 0, in_review: 0, approved: 0, rejected: 0 });
    return NextResponse.json({ data: submissions, meta: { total: submissions.length, counts, storage: storageMode(), generatedAt: new Date().toISOString() } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load submissions" }, { status: 500 }); }
}
