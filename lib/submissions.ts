import { z } from "zod";

export const submissionStatuses = ["pending", "in_review", "approved", "rejected"] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];

export const companySubmissionSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required").max(80),
  website: z.string().trim().url("Enter a complete website URL"),
  category: z.string().trim().min(2, "Select a category").max(80),
  stage: z.string().trim().min(2, "Select a company stage").max(40),
  country: z.string().trim().min(2, "Country is required").max(60),
  city: z.string().trim().min(2, "City is required").max(60),
  founded: z.coerce.number().int().min(1990).max(new Date().getFullYear()),
  employeeRange: z.string().trim().min(1, "Select a team size").max(30),
  description: z.string().trim().min(80, "Add at least 80 characters").max(700),
  products: z.array(z.string().trim().min(2).max(80)).min(1, "Add at least one product").max(5),
  submitterName: z.string().trim().min(2, "Your name is required").max(80),
  submitterEmail: z.string().trim().email("Enter a valid email"),
  submitterRole: z.string().trim().min(2, "Your role is required").max(80),
});

export type CompanySubmissionInput = z.infer<typeof companySubmissionSchema>;
export type CompanySubmission = CompanySubmissionInput & {
  id: string;
  trackingCode: string;
  status: SubmissionStatus;
  reviewerNotes: string;
  createdAt: string;
  updatedAt: string;
};

type DbRow = {
  id: string; tracking_code: string; company_name: string; website: string; category: string; stage: string;
  country: string; city: string; founded: number; employee_range: string; description: string; products: string[];
  submitter_name: string; submitter_email: string; submitter_role: string; status: SubmissionStatus;
  reviewer_notes: string | null; created_at: string; updated_at: string;
};

const globalSubmissionStore = globalThis as typeof globalThis & { __orbitSubmissionStore?: Map<string, CompanySubmission> };
const demoStore = globalSubmissionStore.__orbitSubmissionStore ?? new Map<string, CompanySubmission>();
globalSubmissionStore.__orbitSubmissionStore = demoStore;

function databaseKey() { return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""; }
function hasDatabase() { return Boolean(process.env.SUPABASE_URL && databaseKey()); }
function headers() {
  const key = databaseKey();
  return { apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }), "Content-Type": "application/json" };
}
function rowToSubmission(row: DbRow): CompanySubmission {
  return { id: row.id, trackingCode: row.tracking_code, companyName: row.company_name, website: row.website, category: row.category, stage: row.stage, country: row.country, city: row.city, founded: row.founded, employeeRange: row.employee_range, description: row.description, products: row.products || [], submitterName: row.submitter_name, submitterEmail: row.submitter_email, submitterRole: row.submitter_role, status: row.status, reviewerNotes: row.reviewer_notes || "", createdAt: row.created_at, updatedAt: row.updated_at };
}
function inputToRow(input: CompanySubmissionInput, trackingCode: string) {
  return { tracking_code: trackingCode, company_name: input.companyName, website: input.website, category: input.category, stage: input.stage, country: input.country, city: input.city, founded: input.founded, employee_range: input.employeeRange, description: input.description, products: input.products, submitter_name: input.submitterName, submitter_email: input.submitterEmail, submitter_role: input.submitterRole };
}
function makeTrackingCode() { return `ORB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; }

export function storageMode() { return hasDatabase() ? "supabase" : "demo"; }
export function isAdminKey(value: string | null) { const expected = process.env.ADMIN_ACCESS_KEY || "orbit-review-2026"; return Boolean(value && value === expected); }

export async function createSubmission(input: CompanySubmissionInput) {
  const trackingCode = makeTrackingCode();
  if (hasDatabase()) {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/company_submissions`, { method: "POST", headers: { ...headers(), Prefer: "return=representation" }, body: JSON.stringify(inputToRow(input, trackingCode)), cache: "no-store" });
    if (!response.ok) throw new Error(`Database rejected submission (${response.status})`);
    return rowToSubmission((await response.json())[0] as DbRow);
  }
  const now = new Date().toISOString();
  const submission: CompanySubmission = { ...input, id: crypto.randomUUID(), trackingCode, status: "pending", reviewerNotes: "", createdAt: now, updatedAt: now };
  demoStore.set(submission.id, submission);
  return submission;
}

export async function listSubmissions() {
  if (hasDatabase()) {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/company_submissions?select=*&order=created_at.desc`, { headers: headers(), cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load submissions (${response.status})`);
    return ((await response.json()) as DbRow[]).map(rowToSubmission);
  }
  return [...demoStore.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findByTracking(trackingCode: string) {
  if (hasDatabase()) {
    const code = encodeURIComponent(trackingCode.toUpperCase());
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/company_submissions?tracking_code=eq.${code}&select=*`, { headers: headers(), cache: "no-store" });
    if (!response.ok) throw new Error("Could not retrieve submission");
    const rows = (await response.json()) as DbRow[];
    return rows[0] ? rowToSubmission(rows[0]) : null;
  }
  return [...demoStore.values()].find((item) => item.trackingCode === trackingCode.toUpperCase()) || null;
}

export async function updateSubmission(id: string, status: SubmissionStatus, reviewerNotes: string) {
  if (hasDatabase()) {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/company_submissions?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { ...headers(), Prefer: "return=representation" }, body: JSON.stringify({ status, reviewer_notes: reviewerNotes, updated_at: new Date().toISOString() }), cache: "no-store" });
    if (!response.ok) throw new Error(`Could not update submission (${response.status})`);
    const rows = (await response.json()) as DbRow[];
    return rows[0] ? rowToSubmission(rows[0]) : null;
  }
  const item = demoStore.get(id);
  if (!item) return null;
  const updated = { ...item, status, reviewerNotes, updatedAt: new Date().toISOString() };
  demoStore.set(id, updated);
  return updated;
}

export function publicSubmission(item: CompanySubmission) {
  return { trackingCode: item.trackingCode, companyName: item.companyName, category: item.category, status: item.status, reviewerNotes: item.reviewerNotes, createdAt: item.createdAt, updatedAt: item.updatedAt };
}
