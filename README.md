# AI Orbit Companies

A complete AI company discovery module inspired by the dark, premium and minimal design language of AI Orbit.

## Live Links

- Live Demo: Add your Vercel link
- Demo Video: Add your Loom link

## Features

- Responsive AI companies listing
- Search companies by name, category or description
- Filter by company category and stage
- Sort by featured, newest and alphabetical order
- Grid and list views
- Detailed company profiles
- Bookmark companies
- Saved Companies page
- Related company recommendations
- Loading, empty, error and 404 states
- REST API endpoints
- Responsive mobile navigation

## Tech Stack

- Next.js
- React
- TypeScript
- CSS
- REST APIs
- Local Storage
- Vercel

## Routes

| Route | Description |
|---|---|
| `/` | Companies listing |
| `/companies/[slug]` | Company details |
| `/bookmarks` | Saved companies |
| `/api/companies` | All company data |
| `/api/companies/[slug]` | Individual company data |

## API Examples

```text
GET /api/companies
GET /api/companies?search=voice
GET /api/companies?category=Foundation%20Models
GET /api/companies/openai
