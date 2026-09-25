# DeAcá

Colombia-only local-proof **home services** marketplace (Cali barrio wedge).  
Stack: Expo/RN + Supabase. Name locked **DeAcá**.

## Layout

| Path | What |
|------|------|
| `apps/mobile` | Expo app (expo-router) — run from here |
| `edge/` | Edge functions (backend) |
| `supabase/` | Migrations / schema |
| `SHIP-LIST-P0.md` | Designer-locked P0 UI checklist |

## Quick start (mobile)

```bash
cd apps/mobile
cp .env.example .env   # optional — boots without keys
npm install
npx expo start
```

See `apps/mobile/README.md` for ready vs stubbed screens.

## Product locks

- P0 oficios: plomería, electricidad, aseo, cerrajería (not restaurants)
- Fair feed: no pay-to-rank; LocalBadge; review text gate; Local per barrio
- Barrios (fixed): San Antonio, Granada, El Peñón, San Fernando / Parque del Perro
- Payments / chat: open decisions — not invented in this scaffold

## Design source of truth

`/workspace/local-proof-services/DESIGN-SYSTEM.md`
