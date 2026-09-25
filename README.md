# BuenaMano

Colombia-only local-proof **home services** marketplace (Cali barrio wedge).  
Stack: Expo/RN + Supabase. Name locked **BuenaMano** (was DeAcá).

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
cp .env.example .env   # fill EXPO_PUBLIC_SUPABASE_*
npm install
npx expo start
```

Never commit `.env` or the service role key.
