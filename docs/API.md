# CardWise API V1

Base: `/api/v1` (health: `GET /health`). Rate limit 60/min. Swagger: `/docs`.

## POST /recommendations

Request:

```json
{ "merchantId": "amazon", "amount": 2000, "cardIds": ["icici-apay"], "hasPrime": true }
```

Response:

```json
{
  "winner": {
    "cardId": "icici-apay", "cardLabel": "ICICI Bank Amazon Pay Credit Card",
    "totalBenefit": 100, "effectiveCost": 1900, "status": "verified",
    "explanation": "Earn approximately ₹100 cashback (5%) …",
    "eligible": true,
    "breakdown": { "cashback": 100, "rateAppliedPct": 5, "capApplied": 500, "validTill": "2027-03-31", "verified": true, "kind": "cashback" }
  },
  "ranked": []
}
```

Engine rules (deterministic, no AI):
- merchant-specific beats `all`; verified beats unverified; then highest rate.
- `minTxn` and `validTill < today` → ineligible with honest reason.
- `benefit = min(amount × rate, cap)`, rounded.
- sort: eligible → verified(0) < estimated(1) < needs_verification(2) → benefit desc.
- missing rule ≠ ₹0 — explicit `needs_verification` + “No verified reward rule…”.

Statuses: `verified` (instant/cashback, source on file, in validity) · `estimated` (reward-points math) · `needs_verification` (expired/unverified/missing).

Other endpoints: see root README table. History entries are estimates. Admin upsert requires `x-admin-key` and bumps `version`.
