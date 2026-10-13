# Version Strategy (V1 built; V2/V3 documented only)

## V1 (this release) — complete, useful, trustworthy
Onboarding → wallet → Home → purchase → explainable recommendation; My Cards, Offers (verified/estimated/needs_verification), lightweight History (estimates), Profile (appearance/privacy/support). Deterministic engine + curated seed + admin upsert workflow. No payments, no credentials, no scraping.

## V2 (planned, not implemented)
- Product-link sharing (merchant deep links, no checkout automation).
- Broader merchant coverage via same `RewardRule` schema (no migration: add rows).
- Offer discovery + freshness job (`lastVerified` reminders, admin re-verify queue).
- Reward-cap tracking per user/month (new `CapLedger` table; engine takes `spentThisCycle`).
- Savings insights + optional notifications (opt-in only, no urgency patterns).
- API extension is additive: `GET /v1/offers/updates?since=`, `spentThisCycle` field on recommend.

## V3 (planned, not implemented)
- Browser extension + permitted checkout integrations (separate `extension/` app, same engine via API).
- Validated premium features (receipt import with explicit consent — never SMS reading).
- Additional integrations behind feature flags.

## Extensibility notes
- Engine stays pure (`engine.ts` has zero framework imports) — V2 cap logic plugs in as an extra input, not a rewrite.
- `merchantId: 'all'` is the wildcard scope; new merchants = new `Merchant` + rules, no code change.
- Mobile works offline on embedded seed; backend is enhancement, so V2 sync/conflict work is additive.
- No placeholder screens, dead buttons, or speculative infra shipped in V1.
