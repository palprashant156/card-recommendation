# CardWise V1 — Design System

> Premium, world-class fintech. Clarity over decoration.
> References for craft (Apple / Stripe / Linear) — not to copy.

## 1. Principles

1. **Clarity over complexity** — 5-second comprehension.
2. **One primary action per screen.**
3. **Answer first, details on demand** (expandable “How we calculated this”).
4. **Plain money language** — “Save ₹250”, never unexplained jargon.
5. **Trust is visual** — verified / estimated / needs-verification states are always distinct.
6. **Respect attention** — no banners, countdowns, or competing CTAs.

## 2. Colour (semantic, light + dark)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg` | `#FAF8F5` warm white | `#0C1220` midnight | app background |
| `surface` | `#FFFFFF` | `#151E30` | grouped content |
| `surfaceMuted` | `#F2EFE9` | `#1E2942` | input / muted well |
| `ink` | `#101B2D` midnight navy | `#F5F1E8` warm white | strong text / primary button bg (light) |
| `inkInverse` | `#FFFFFF` | `#101B2D` | text on primary button |
| `textSecondary` | `#5B6474` | `#A7B0BF` | body secondary |
| `textMuted` | `#8A93A5` | `#7C8698` | captions, placeholders |
| `border` | `#E7E2D8` | `#26314A` | hairline, card border |
| `borderStrong` | `#D5CFC1` | `#34415E` | focused / selected |
| `positive` | `#0F7A5A` jade | `#3ECF8E` | verified savings text + icon |
| `positiveBg` | `#E3F2E9` | `#123626` | verified pill / well |
| `caution` | `#8A5F00` | `#E8B84B` | needs-verification |
| `cautionBg` | `#FFF3D6` | `#3A2E0E` | caution well |
| `danger` | `#C0362C` | `#F0726A` | errors / destructive only |
| `dangerBg` | `#FDECEA` | `#3A1A18` | error well |
| `primaryBtn` | `#101B2D` | `#EFE9DC` | single primary CTA |
| `accentSoft` | `#EAF0FF` | — | selection wash (never gradient) |

Rules:
- One CTA colour per screen (midnight navy in light, warm white in dark).
- Emerald/jade reserved for **verified positive savings only**.
- Amber = incomplete / needs verification. Red = error / destructive only.
- No rainbow gradients, no neon, no glassmorphism, no decorative blobs.
- Contrast: body text ≥ 4.5:1 on both themes (verified pairs above).

## 3. Typography

System sans (SF Pro / Roboto). Tabular numerals for all money.

| Level | Size / Line | Weight | Use |
|---|---|---|---|
| display | 28 / 34 | 700 | Home heading, result amount (only when important) |
| title | 22 / 28 | 650 | Screen titles |
| heading | 17 / 22 | 600 | Section headings |
| body | 15 / 22 | 400 | Default reading |
| bodyStrong | 15 / 22 | 600 | Emphasis inline |
| label | 13 / 18 | 600 | Buttons, pills, status |
| caption | 12 / 16 | 400 | Hints, expiries, footnotes |
| amountLg | 34 / 40 | 700 tabular | Estimated reward (result only) |
| amount | 20 / 26 | 700 tabular | Effective cost, list amounts |

- Avoid oversized type elsewhere. Never uppercase paragraphs.
- INR: `en-IN` formatting — `₹2,000`, `₹1,00,000`. Always prefix ₹, no decimals unless paise matter.

## 4. Spacing / Layout

Base 4. Scale: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40`.
- Screen gutter: 20. Card padding: 16. Row padding: 14×16.
- Section gap: 24. Intra-group: 12. Tight: 8.
- Touch targets ≥ 44×44. One-handed: primary CTA within thumb reach (bottom-anchored on key flows).

## 5. Surfaces & Components

- Radius: row 10, card 14, sheet 20, pill full.
- Border: 1px `border` on white cards in light; no shadow except `elevation 1` for bottom CTA bar.
- Cards only for meaningful grouping (recommended card, offer). Otherwise flat rows with hairline dividers.
- States: selected = 1.5px `ink` border + soft wash + check; unselected = `border` + transparent check.
- Loading: skeleton blocks (shimmer respects reduced-motion → static grey).
- Empty: title + 1-line explanation + single action. No illustrations walls.
- Icons: 20px outline, 1.7 stroke, neutral ink. No brand-logo fabrication.

## 6. Status Language (trust)

| Status | Pill | Meaning |
|---|---|---|
| `verified` | emerald dot + “Verified offer” | merchant + bank source on file, in validity |
| `estimated` | neutral dot + “Estimated rewards” | point-value math, source on file |
| `needs_verification` | amber dot + “Needs verification” | expired / unverified / missing data |

Never show a large savings figure without expandable breakdown.

## 7. Motion

- 180–220ms ease-out for pushes, fades, selection.
- Button press: opacity 0.96 + scale 0.99, no bounce.
- Respect `prefers-reduced-motion` / `AccessibilityInfo.reduceMotion`: disable shimmer + transitions.
- No splash delay, no intro animation blocking content.

## 8. App Icon Concept

Two overlapping rounded rectangles (cards) offset 12°, top card midnight navy, bottom card warm white with emerald check-dot at intersection. Works at 29pt: silhouette + check remain legible. No $, no bank imitation.

See `mobile/src/theme/tokens.ts` for exact tokens.
