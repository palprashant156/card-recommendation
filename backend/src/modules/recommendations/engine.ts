/**
 * Pure, deterministic rules-based recommendation engine.
 * Independent of NestJS + Prisma so it is unit-testable.
 * Mirrors mobile/src/engine/recommend.ts exactly.
 */

export interface EngineCard {
  id: string;
  issuer: string;
  product: string;
  network: string;
  type: string;
}

export interface EngineRule {
  id: string;
  cardId: string;
  merchantId: string;
  kind: 'instant_discount' | 'cashback' | 'reward_points';
  ratePct: number;
  primeRatePct?: number | null;
  capPerTxn?: number | null;
  minTxn?: number | null;
  validTill: string;
  verified: boolean;
  exclusionNote?: string | null;
}

export type VerificationStatus = 'verified' | 'estimated' | 'needs_verification';

export interface RecommendInput {
  merchantId: string;
  merchantName?: string;
  amount: number;
  cardIds: string[];
  cards: EngineCard[];
  rules: EngineRule[];
  hasPrime?: boolean;
  asOf?: string;
}

export interface RankedCard {
  cardId: string;
  cardLabel: string;
  totalBenefit: number;
  effectiveCost: number;
  status: VerificationStatus;
  explanation: string;
  eligible: boolean;
  ineligibleReason?: string;
  breakdown: {
    instantDiscount: number;
    cashback: number;
    rewardValue: number;
    rateAppliedPct: number;
    capApplied?: number | null;
    minTxn?: number | null;
    validTill: string;
    verified: boolean;
    kind: string;
    exclusionNote?: string | null;
  };
}

function statusFor(verified: boolean, kind: string): VerificationStatus {
  if (!verified) return 'needs_verification';
  if (kind === 'reward_points') return 'estimated';
  return 'verified';
}

export function recommend(input: RecommendInput): { winner: RankedCard | null; ranked: RankedCard[] } {
  const asOf = input.asOf ?? new Date().toISOString().slice(0, 10);
  const owned = new Set(input.cardIds);
  const candidates = input.cards.filter((c) => owned.has(c.id));
  const merchantName = input.merchantName ?? input.merchantId;

  const ranked: RankedCard[] = candidates.map((card) => {
    const rules = input.rules.filter(
      (r) => r.cardId === card.id && (r.merchantId === input.merchantId || r.merchantId === 'all'),
    );
    const base = {
      cardId: card.id,
      cardLabel: `${card.issuer} ${card.product}`,
    };
    if (rules.length === 0) {
      return {
        ...base,
        totalBenefit: 0,
        effectiveCost: input.amount,
        status: 'needs_verification' as VerificationStatus,
        explanation: `No verified reward rule for this merchant on ${card.product}. We can't confirm savings.`,
        eligible: false,
        ineligibleReason: 'No reward rule on file for this merchant.',
        breakdown: {
          instantDiscount: 0, cashback: 0, rewardValue: 0, rateAppliedPct: 0,
          validTill: '', verified: false, kind: 'none',
        },
      };
    }
    const sorted = [...rules].sort((a, b) => {
      const spec = (b.merchantId !== 'all' ? 1 : 0) - (a.merchantId !== 'all' ? 1 : 0);
      if (spec !== 0) return spec;
      const ver = Number(b.verified) - Number(a.verified);
      if (ver !== 0) return ver;
      const ra = input.hasPrime && a.primeRatePct ? a.primeRatePct : a.ratePct;
      const rb = input.hasPrime && b.primeRatePct ? b.primeRatePct : b.ratePct;
      return rb - ra;
    });
    const rule = sorted[0]!;
    const rate = input.hasPrime && rule.primeRatePct ? rule.primeRatePct : rule.ratePct;

    if (rule.minTxn != null && input.amount < rule.minTxn) {
      return {
        ...base,
        totalBenefit: 0,
        effectiveCost: input.amount,
        status: statusFor(rule.verified, rule.kind),
        explanation: `Needs a minimum purchase of ₹${Number(rule.minTxn).toLocaleString('en-IN')} for this offer.`,
        eligible: false,
        ineligibleReason: `Minimum ₹${Number(rule.minTxn).toLocaleString('en-IN')} required.`,
        breakdown: {
          instantDiscount: 0, cashback: 0, rewardValue: 0, rateAppliedPct: rate,
          minTxn: rule.minTxn, validTill: rule.validTill, verified: rule.verified,
          kind: rule.kind, exclusionNote: rule.exclusionNote,
        },
      };
    }
    if (rule.validTill < asOf) {
      return {
        ...base,
        totalBenefit: 0,
        effectiveCost: input.amount,
        status: 'needs_verification',
        explanation: `This offer expired on ${rule.validTill}. We can't recommend it until re-verified.`,
        eligible: false,
        ineligibleReason: `Offer expired ${rule.validTill}.`,
        breakdown: {
          instantDiscount: 0, cashback: 0, rewardValue: 0, rateAppliedPct: rate,
          validTill: rule.validTill, verified: false, kind: rule.kind,
        },
      };
    }
    let raw = (input.amount * rate) / 100;
    if (rule.capPerTxn != null) raw = Math.min(raw, rule.capPerTxn);
    const benefit = Math.round(raw);
    const rs = `₹${benefit.toLocaleString('en-IN')}`;
    const explanation =
      rule.kind === 'instant_discount'
        ? `Save approximately ${rs} with ${rate}% instant discount on this ${merchantName} purchase.`
        : rule.kind === 'cashback'
          ? `Earn approximately ${rs} cashback (${rate}%) on this eligible ${merchantName} purchase${input.hasPrime ? ' with Prime membership' : ''}.`
          : `You'll earn approximately ${rs} in rewards (${rate}% rate, value depends on redemption).`;
    return {
      ...base,
      totalBenefit: benefit,
      effectiveCost: Math.max(0, input.amount - benefit),
      status: statusFor(rule.verified, rule.kind),
      explanation,
      eligible: benefit > 0,
      ineligibleReason: benefit <= 0 ? 'No measurable benefit for this amount.' : undefined,
      breakdown: {
        instantDiscount: rule.kind === 'instant_discount' ? benefit : 0,
        cashback: rule.kind === 'cashback' ? benefit : 0,
        rewardValue: rule.kind === 'reward_points' ? benefit : 0,
        rateAppliedPct: rate,
        capApplied: rule.capPerTxn,
        minTxn: rule.minTxn,
        validTill: rule.validTill,
        verified: rule.verified,
        kind: rule.kind,
        exclusionNote: rule.exclusionNote,
      },
    };
  });

  const rank: Record<VerificationStatus, number> = { verified: 0, estimated: 1, needs_verification: 2 };
  ranked.sort((a, b) => {
    if (Number(b.eligible) !== Number(a.eligible)) return Number(b.eligible) - Number(a.eligible);
    if (a.eligible && b.eligible) {
      const s = rank[a.status] - rank[b.status];
      if (s !== 0) return s;
      return b.totalBenefit - a.totalBenefit;
    }
    return 0;
  });

  return { winner: ranked.find((r) => r.eligible) ?? null, ranked };
}
