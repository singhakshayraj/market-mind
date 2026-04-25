# MarketMind AI — Project Architecture

## What This Is
MarketMind AI is a Next.js 14 web app that takes a business idea as input and generates a comprehensive MBA-level market research report in under 3 minutes. It runs 10 AI analysis modules in parallel and presents results as a clean, plain-English report.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript strict mode)
- **Styling**: Tailwind CSS
- **AI**: Grok-3 (xAI) + Gemini 1.5 Pro (Google) — dual model system
- **Web Search**: Serper API (google.serper.dev)
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Hosting**: Vercel (main branch = production, auto-deploy)

---

## Dual AI Model Routing

Every module has a **primary** and **fallback** model. If primary fails/times out (15s), fallback is used automatically. The UI shows a badge indicating which model was used for each section.

| Module | Primary | Fallback |
|---|---|---|
| 01 Idea Decoder | Gemini 1.5 Pro | Grok-3 |
| 02 Market Sizing | Grok-3 | Gemini |
| 03 Customer Profiling | Gemini 1.5 Pro | Grok-3 |
| 04 Competitor Landscape | Grok-3 | Gemini |
| 05 Problem Validation | Gemini 1.5 Pro | Grok-3 |
| 06 Business Model | Grok-3 | Gemini |
| 07 Go-to-Market | Gemini 1.5 Pro | Grok-3 |
| 08 Risk Radar | Grok-3 | Gemini |
| 09 Trend & Timing | Gemini 1.5 Pro | Grok-3 |
| 10 Investor Lens | Grok-3 | Gemini |

Router: `lib/ai/router.ts` — `runAIModule(moduleId, systemPrompt, userPrompt, zodSchema)`

---

## Module Orchestration Flow

1. `POST /api/analyse` receives `{ ideaText, geography?, industry? }`
2. **Module 01** (Idea Decoder) runs first — its JSON output seeds all other modules
3. Web searches run in parallel for modules 02, 04, 09 (Serper API)
4. **Modules 02–10** run in parallel via `Promise.allSettled()` — one failure never kills the whole report
5. Progress streamed to frontend via **Server-Sent Events (SSE)**
6. Completed report saved to Supabase → returns `reportId`
7. Frontend redirects to `/report/[reportId]`

---

## Key Files

```
/app/page.tsx                    Landing page with idea input form
/app/analyse/page.tsx            Processing screen with live SSE progress
/app/report/[reportId]/page.tsx  Report page (loads from Supabase)
/app/api/analyse/route.ts        Main orchestration endpoint (SSE, maxDuration: 60s)

/lib/ai/router.ts                Unified AI router with fallback logic
/lib/ai/grok.ts                  Grok API client (OpenAI-compatible, xAI base URL)
/lib/ai/gemini.ts                Gemini API client (@google/generative-ai)
/lib/ai/prompts/                 System prompts — one file per module
/lib/schemas/index.ts            Zod schemas for all 10 module outputs
/lib/search/serper.ts            Serper web search client
/lib/supabase/client.ts          Browser Supabase client
/lib/supabase/server.ts          Service-role Supabase client (server-only)

/components/report/              One component per report section
/components/ui/SectionCard.tsx   Shared section wrapper with model badge + WhatThisMeansBox
```

---

## Environment Variables

| Variable | Where to Get It |
|---|---|
| `XAI_API_KEY` | https://console.x.ai |
| `GOOGLE_GEMINI_API_KEY` | https://aistudio.google.com/app/apikey |
| `SERPER_API_KEY` | https://serper.dev |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API |

Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

---

## Supabase Setup

Run `supabase-migration.sql` in the Supabase SQL editor once to create the `reports` table.

---

## Deployment

- **Git remote**: GitLab (main branch)
- **main = production** — Vercel auto-deploys every push to main
- **Never push broken code to main** — always run `npm run build` first
- `vercel.json` sets `maxDuration: 60` on `/api/analyse` (report generation can take up to 60s)

---

## Build & Commit Checklist

1. `npm run build` — must pass with zero errors
2. `npm run lint` — must pass
3. Never commit `.env.local` or `node_modules`
4. Commit message format: `feat: add X` / `fix: Y` / `chore: Z`
