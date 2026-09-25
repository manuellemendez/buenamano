# DeAcá — mobile (Expo)

Colombia-only home-services marketplace (plomero, electricista, aseo, cerrajería).  
Spanish-first. Fair-feed DNA. **No pay-to-rank.**

Scaffold lives here so repo-root `edge/` + `supabase/` (backend) stay untouched.

## Run

```bash
cd apps/mobile
npm install
npx expo start
```

Web (admin stubs too): `npx expo start --web`  
Typecheck: `npm run typecheck` (or `npx tsc --noEmit`)

## Env

Copy `.env.example` → `.env`. App **boots without keys**.

| Var | Required to start? | Notes |
|-----|-------------------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | No | Placeholder OK |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | No | Placeholder OK |
| Sentry / Maps / EAS | No | Documented for later |

If missing, `src/lib/supabase.ts` stays `null` and UI shows “not configured”.

## Ready vs stubbed

**UI ready (interactive with mock data)**  
- Design tokens (`src/theme/tokens.ts`)  
- LocalBadge (+ tap sheet)  
- Descubre fairness chip/copy + FeedCard (`poco visto`, no Patrocinado)  
- QuoteCompare sort legend  
- ReviewScaffolds (40-char text gate; stars alone don’t enable Local)  
- ProofUploader statuses  
- ReportSheet  
- StatusChip / EmptyState / Button / Chip / Input

**Stubbed (screens navigable, backend not wired)**  
- Auth / onboarding persistence  
- Search filters (client mock only)  
- Request job / quotes accept / job status transitions  
- Pro inbox / quote compose / profile save  
- Local proof upload bytes + admin approve API  
- Legal pages (draft banners)  
- Push, Maps, payments (explicitly out of P0)

## Screen map

| Route | Role | State |
|-------|------|-------|
| `/` | Welcome role pick | ready |
| `/onboarding/seeker` | Seeker | stub |
| `/onboarding/pro` | Pro | stub |
| `/(seeker)/descubre` | Seeker tab | ready + mock |
| `/(seeker)/trabajos` | Seeker tab | stub |
| `/(seeker)/local` | Seeker tab | stub/explainer |
| `/(seeker)/cuenta` | Seeker tab | stub + legal |
| `/search` | Seeker | stub/mock |
| `/pro/[id]` | Seeker | stub |
| `/request` | Seeker | stub |
| `/quotes` | Seeker | stub |
| `/job/[id]` | Shared | stub |
| `/review/[jobId]` | Seeker | ready (gate) |
| `/(pro)/inbox` | Pro | stub |
| `/(pro)/quote-compose` | Pro | stub |
| `/(pro)/local-proof` | Pro | ready UI |
| `/(pro)/local-status` | Pro | stub N=5 |
| `/(pro)/profile-edit` | Pro | stub |
| `/admin/*` | Admin web | stub |
| `/legal/*` | All | draft placeholders |

## Pack / design source

`/workspace/local-proof-services/` — `DESIGN-SYSTEM.md`, `PLAN.md`, `CEO-BRIEF.md`, `STATUS.md`  
Repo ship list: `/workspace/deaca/SHIP-LIST-P0.md`

## Do not invent

Wompi, chat product, multi-city, restaurants, Patrocinado/boost SKUs.

## Source of truth (product pack)

- `/workspace/local-proof-services/DESIGN-SYSTEM.md`
- `/workspace/local-proof-services/PLAN.md`
- `/workspace/local-proof-services/STATUS.md`
- `/workspace/local-proof-services/CEO-BRIEF.md`
- `/workspace/deaca/SHIP-LIST-P0.md`

## Security gate (CEO / Security 2026-09-24)

Live Supabase keys (`EXPO_PUBLIC_*`) are OK for **auth + read scaffolding only**.

Do **not** wire client mutations for hire / accept quote / confirm job / admin / Local proof approve until Back-end lands Security’s three P0s. Keep those flows on mocks (`Alert` / local state).

Never put the service role key in the app.
