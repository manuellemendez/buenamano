# BuenaMano — mobile (Expo)

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

If missing, `getSupabase()` returns `null` and UI shows “not configured”. Client creation is lazy (skipped during Expo web Node SSR — no native WebSocket).

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

**Wired to Edge/RPC helpers (need signed-in session for live success)**  
- Quotes accept → `accept_quote`  
- Job confirm (seeker) → `confirm_job`; pro done → `markJobProDone` (active→pro_done only)  
- Admin proofs → `approve_proof` / `reject_proof` / `admin_hide` / `admin_ban`  
- Descubre → `descubre_feed` (falls back to mock if empty/stub/unauth)  
- Job contacts → RPC `get_job_participant_contacts`

**Still stubbed**  
- Auth / onboarding persistence  
- Search filters (client mock only)  
- Request job create / pro inbox / quote compose / profile save  
- Local proof upload bytes  
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

**Status: PASSED WITH CONDITIONS** (CEO greenlit). Live Edge/RPC wiring is allowed via `src/lib/api.ts`.

### Rules (do not violate)

1. **Contacts:** ONLY `supabase.rpc('get_job_participant_contacts', …)` — never `SELECT` from `job_participant_contacts` view.
2. **Hire / confirm / admin / Local mutations** ONLY via Edge `functions.invoke` helpers:
   `accept_quote`, `confirm_job`, `approve_proof`, `reject_proof`, `recompute_local`, `descubre_feed`, `admin_hide`, `admin_ban`.
3. **NEVER** client-update `jobs.status` to `confirmed`, `cancelled`, or `disputed` (seeker confirm → `confirm_job` Edge).
4. **Pro MAY** client-update job `active` → `pro_done` only (and only that transition) via `markJobProDone`.
5. **No service role** in the app. Use `src/lib/supabase.ts` + session Authorization (anon key only).

Screens wired: `app/quotes.tsx`, `app/job/[id].tsx`, `app/admin/proofs.tsx`, `app/(seeker)/descubre.tsx`.
