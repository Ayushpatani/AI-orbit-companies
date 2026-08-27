# AI Orbit — Company Intelligence

A full-stack company discovery and intelligence module built in the visual language of AI Orbit. The experience is designed around a complete workflow: discover companies, shortlist them, compare market signals, inspect detailed profiles, and save promising companies.

## Features

- Responsive intelligence directory with search, category, stage, and country filters
- Featured, newest, and alphabetical sorting with grid/list views
- Shortlist up to three companies from the directory
- Side-by-side comparison workspace for company, funding, product, and market signals
- Intelligence profiles with products, capabilities, momentum, innovation, enterprise readiness, and related companies
- Device-local bookmarks and a dedicated saved-companies screen
- Loading, empty, error, and not-found states
- Filtered, paginated, and sortable REST endpoints backed by realistic dummy data
- Keyboard-accessible controls and mobile navigation

## Routes

- `/` — company directory
- `/companies/[slug]` — company details
- `/compare?companies=openai,anthropic` — comparison workspace
- `/bookmarks` — saved companies
- `/api/companies` — searchable/filterable company collection
- `/api/companies/[slug]` — individual company response
- `/api/companies/compare?ids=openai,anthropic` — comparison response

## API examples

```text
GET /api/companies
GET /api/companies?search=voice
GET /api/companies?category=Foundation%20Models&stage=Growth&minScore=90
GET /api/companies?country=United%20States&sort=score_desc&page=1&limit=6
GET /api/companies/openai
GET /api/companies/compare?ids=openai,anthropic,mistral-ai
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deploy on Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the detected framework as **Next.js**.
4. Click **Deploy**. No environment variables are required.

## Implementation notes

- Next.js App Router, React, TypeScript, and REST route handlers
- Server-rendered comparison and statically generated company profiles
- Local Storage for bookmarks so the demo works without authentication
- Responsive layouts and accessible, labelled interactive controls

The project uses dummy data as permitted in the hiring task. Company facts, funding figures, signals, and scores are demonstration content.
