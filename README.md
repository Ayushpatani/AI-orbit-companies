# AI Orbit — Company Intelligence

A database-backed Companies module closely aligned with AI Orbit's live product structure. It combines the reference directory and profile experience with a complete discovery, comparison, submission, tracking, verification, and moderation workflow.

## Features

- Reference-aligned hero, global search, discovery chips, module rail, category rail, dense company table, pagination, and ecosystem footer
- Responsive company directory with keyboard search, category filtering, trend filtering, and newest, valuation, and alphabetical sorting
- Company table fields for country, valuation, funding signal, AI-native status, profitability, sector, models, tools, sharing, and bookmarks
- Shortlist up to three companies from the directory
- Side-by-side comparison workspace for company, funding, product, and market signals
- Reference-aligned profiles with breadcrumb, identity card, follow/bookmark/share actions, company stat strip, ecosystem tabs, and related companies
- Device-local bookmarks and a dedicated saved-companies screen
- Three-step company submission flow with client and server validation
- Permanent Supabase PostgreSQL storage with private server-only credentials
- Unique tracking codes and a privacy-safe public review tracker
- Protected research dashboard with queue search, status filters, analytics, reviewer notes, approval, and rejection
- Submission lifecycle: pending → in review → approved or changes requested
- Loading, empty, error, and not-found states
- Filtered, paginated, sortable, and mutable REST endpoints
- Keyboard-accessible controls, Ctrl/Cmd+K search shortcut, responsive tables, and mobile navigation

## Routes

- `/` — company directory
- `/companies/[slug]` — company details
- `/compare?companies=openai,anthropic` — comparison workspace
- `/bookmarks` — saved companies
- `/submit` — multi-step company submission
- `/track?code=ORB-2026-XXXXXX` — privacy-safe status tracking
- `/admin` — protected research and moderation console
- `/api/companies` — searchable/filterable company collection
- `/api/companies/[slug]` — individual company response
- `/api/companies/compare?ids=openai,anthropic` — comparison response
- `POST /api/submissions` — validated submission creation
- `GET /api/submissions/[tracking]` — public status response
- `GET /api/submissions` — protected moderation collection
- `PATCH /api/admin/submissions/[id]` — protected moderation update

## API examples

```text
GET /api/companies
GET /api/companies?search=voice
GET /api/companies?category=Foundation%20Models&stage=Growth&minScore=90
GET /api/companies?country=United%20States&sort=score_desc&page=1&limit=6
GET /api/companies/openai
GET /api/companies/compare?ids=openai,anthropic,mistral-ai
POST /api/submissions
GET /api/submissions/ORB-2026-XXXXXX
GET /api/submissions                 x-admin-key: your-admin-key
PATCH /api/admin/submissions/:id    x-admin-key: your-admin-key
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

Without environment variables, the workflow uses a process-local demo store and the admin key `orbit-review-2026`. This is useful for interface testing only; configure Supabase for permanent Vercel storage.

## Supabase setup

1. Create a free Supabase project.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it once.
3. Open **Project Settings → API** and copy the Project URL and service role key.
4. Copy `.env.example` to `.env.local` and fill in the three values.
5. Restart `npm run dev`.

The table has Row Level Security enabled and is accessed only from Next.js server routes with the service role. Never prefix the service role key with `NEXT_PUBLIC_`.

## Deploy on Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the detected framework as **Next.js**.
4. Add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `ADMIN_ACCESS_KEY` under **Project Settings → Environment Variables**.
5. Deploy or redeploy the latest commit.

## Implementation notes

- Next.js App Router, React, TypeScript, and REST route handlers
- Zod schemas shared by server-side validation and typed domain models
- Supabase PostgREST adapter with a development fallback
- Protected write APIs with explicit authorization, validation, and status codes
- Server-rendered comparison and statically generated company profiles
- Local Storage for bookmarks so the demo works without authentication
- Responsive layouts and accessible, labelled interactive controls

The curated company directory uses realistic dummy data as permitted in the hiring task. Company facts, funding figures, signals, and scores are demonstration content; user submissions are stored separately and moderated through the editorial workflow.
