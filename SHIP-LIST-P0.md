# BuenaMano — P0 UI Ship List (Designer-locked)
**Date:** 2026-09-24 · **Updated:** 2026-09-24 (BuenaMano display rename)  
**Display name:** **BuenaMano** (was DeAcá)  
**Tagline (required):** Oficios de tu barrio. La confianza no se compra.  
**Source:** `/workspace/local-proof-services/DESIGN-SYSTEM.md` + PLAN §G P0  
**App path:** `apps/mobile` (local box checkout may still be `/workspace/deaca`)  
**Admin:** `apps/mobile/app/admin` (Expo web–friendly stubs)  
**Backend preserved:** `edge/`, `supabase/`  
**GitHub:** `manuellemendez/buenamano`

## Brand (locked)
- Wordmark / splash / admin titles: **BuenaMano**
- Welcome tagline + Descubre fairness body must carry Local DNA (name teaches skill, not barrio)
- LocalBadge sheet + “vecinos de acá” / “No se compra” strings **unchanged**
- Terracotta tokens + five hard gates **unchanged**

## Hard gates (do not ship without)
1. **No Patrocinado / pay-to-rank / boost chrome** anywhere in Descubre or quotes. ✅
2. **LocalBadge** pill: icon + text `Local · {barrio}`; tap sheet: “Probó barrio + reseñas con texto de vecinos de acá. No se compra.” ✅
3. **Descubre fairness:** underseen cupo cue + “poco visto” soft tags; QuoteCompare legend “Ordenado por confianza local, no por quien pagó.” ✅
4. **Reviews:** stars + required ~40 char text; scaffolds optional; stars alone don’t count for Local. ✅
5. **Local proof:** ProofUploader + StatusChip `En revisión` / `Aprobado` / `Rechazado` + razón; Local is **per barrio**. ✅

## Must-ship — Seeker
- [x] Welcome / role pick (Seeker vs Pro) — UI ready, auth stub
- [x] Onboarding Seeker (barrio) — stub
- [x] Descubre (fairness chrome + FeedCards) — UI ready, mock data
- [x] Search / Filters (oficio + barrio + Solo Local) — stub/mock filter
- [x] Pro profile (ProCard) — stub
- [x] Request job — stub
- [x] Quotes inbox (QuoteCompare) — stub
- [x] Active job (JobStatusStepper) — stub
- [x] Leave review (ReviewScaffolds) — UI ready (gate wired)
- [x] Account / Settings + legal placeholders — drafts
- [x] ReportSheet — UI ready

## Must-ship — Pro
- [x] Onboarding Pro (oficios + barrios) — stub
- [x] Requests inbox — stub
- [x] Quote compose — stub
- [x] Active job — Marcar hecho — stub
- [x] Local proof flow (ProofUploader) — UI ready
- [x] Local status N/N (N=5 default) — stub
- [x] Profile edit — stub

## Must-ship — Admin (web OK)
- [x] Approve / reject Local proof — stub
- [x] Hide listing — stub
- [x] Ban user — stub
- [x] View reports — stub

## Core components
Button · Input/TextArea · Chips · LocalBadge · FeedCard · ProCard · QuoteCompare · JobStatusStepper · ReviewScaffolds · ProofUploader · StatusChip · EmptyState · ReportSheet ✅

## Explicit non-goals P0
Wompi · in-app chat product · multi-city · restaurants · pay-to-rank SKU
