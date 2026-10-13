# CardWise V1 — The right card. The best deal. Every time.

Premium cross-platform fintech (React Native + Expo) + deterministic NestJS reward API.
Indian conventions throughout (INR, Indian merchants, bank terminology).

## Monorepo

```
card-recommendation/
  mobile/    Expo Router + TS strict + RHF/Zod + TanStack Query + Zustand
  backend/   NestJS + Prisma + PostgreSQL + Swagger + Jest
  docs/      DESIGN_SYSTEM.md, API.md, VERSION_STRATEGY.md
```

## Quick start

### 1. Backend (API + DB)

```bash
cd backend
cp .env.example .env          # set DATABASE_URL, ADMIN_API_KEY
npm install
npx prisma generate
npx prisma migrate dev        # creates tables (needs PostgreSQL running)
npm run prisma:seed           # 10 cards, 10 merchants, 12 rules, 8 offers
npm run start:dev             # :3000 — Swagger at /docs, health at /health
npm test                      # deterministic engine tests (6 cases)
```

PostgreSQL via Docker:

```bash
docker run --name cardwise-pg -e POSTGRES_USER=cardwise -e POSTGRES_PASSWORD=cardwise \
  -e POSTGRES_DB=cardwise -p 5432:5432 -d postgres:16
```

Versioned REST (all under `/api/v1` except health):

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness |
| GET | `/api/v1/cards?q=` | search bank/product/network |
| GET | `/api/v1/merchants` | 9 supported + `all` rule scope |
| GET | `/api/v1/offers?merchantId=&cardId=&status=` | verified/estimated/needs_verification |
| POST | `/api/v1/recommendations` | `{merchantId, amount, cardIds[], hasPrime?}` → `{winner, ranked}` |
| GET/POST/DELETE | `/api/v1/history` | estimates only |
| GET/PUT | `/api/v1/users` | device profile (cardIds + prime, no PAN/CVV) |
| POST | `/api/v1/feedback` | missing card / wrong rule |
| POST | `/api/v1/admin/rules/upsert` | `x-admin-key` required, versioned rules |

Full contract: `docs/API.md` + live Swagger `/docs`.

### 2. Mobile (Expo)

```bash
cd mobile
npm install
npx expo start                # scan QR in Expo Go
# optional: point at API
echo 'EXPO_PUBLIC_API_BASE=http://<your-lan-ip>:3000/api' > .env
npx tsc --noEmit              # strict typecheck
npm test                      # engine test (Prime ₹100 case)
```

Tabs (exactly 4): **Home · My Cards · Offers · Profile**.
Stack: onboarding → add-cards → (tabs) → purchase → result → history.

Privacy: never collects card numbers, CVV, PIN, OTP, passwords. No bank linking, no payments, no SMS reading.

## Design system

See `docs/DESIGN_SYSTEM.md` + `mobile/src/theme/tokens.ts`.
Midnight navy `#101B2D`, warm white `#FAF8F5`, jade `#0F7A5A` (verified only),
amber (needs verification), red (errors only). System sans + tabular INR.
One primary CTA per screen. Answer-first result with expandable “How we calculated this”.

## What works / tested / needs config

- ✅ Works offline in demo mode: mobile embeds curated catalogue + identical deterministic engine; API is progressive enhancement via TanStack Query fallback.
- ✅ Tested: backend `engine.spec.ts` (6 cases: Prime rate, cap, min-txn, expiry, tie-break verified-first, honest no-winner); mobile `recommend.test.ts` (₹2000→₹100 case); `tsc --noEmit` both projects.
- ⚠️ Needs external config: `DATABASE_URL` (Postgres), `ADMIN_API_KEY`, `EXPO_PUBLIC_API_BASE` for live API; EAS (`eas build -p ios/android`) + store credentials for binaries; re-verify bank URLs/expiries before production (see `lastVerified` in seed).
- 🔜 V2/V3 (documented only, not implemented): product-link sharing, cap tracking, savings insights, browser extension — see `docs/VERSION_STRATEGY.md`.
