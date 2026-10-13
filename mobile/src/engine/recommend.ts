import { CARD_CATALOG, REWARD_RULES, type CardProduct, type MerchantId, type VerificationStatus } from '../data/catalog';

export interface RecommendInput {
  merchantId: MerchantId;
  amount: number;
  cardIds: string[];
  hasPrime?: boolean;
  asOf?: string;
}

export interface CardBreakdown {
  instantDiscount: number;
  cashback: number;
  rewardValue: number;
  rateAppliedPct: number;
  capApplied?: number;
  minTxn?: number;
  validTill: string;
  verified: boolean;
  kind: string;
  exclusionNote?: string;
}

export interface RankedCard {
  card: CardProduct;
  totalBenefit: number;
  effectiveCost: number;
  status: VerificationStatus;
  explanation: string;
  breakdown: CardBreakdown;
  eligible: boolean;
  ineligibleReason?: string;
}

function statusFor(ruleVerified: boolean, kind: string): VerificationStatus {
  if (!ruleVerified) return 'needs_verification';
  if (kind === 'reward_points') return 'estimated';
  return 'verified';
}

function explain(card: CardProduct, merchantName: string, rate: number, benefit: number, kind: string, prime: boolean): string {
  const rs = `₹${Math.round(benefit).toLocaleString('en-IN')}`;
  if (kind === 'instant_discount') return `Save approximately ${rs} with ${rate}% instant discount on this ${merchantName} purchase.`;
  if (kind === 'cashback') {
    const primeBit = prime ? ' with Prime membership' : '';
    return `Earn approximately ${rs} cashback (${rate}%) on this eligible ${merchantName} purchase${primeBit}.`;
  }
  return `You'll earn approximately ${rs} in rewards (${rate}% rate, value depends on redemption).`;
}

/**
 * Deterministic rules-based recommendation engine.
 * Never invents rewards: missing rule => ineligible with honest reason.
 * Never ranks unverified above verified on missing data: unverified always
 * sorts below verified/estimated when benefits tie, and carries explicit status.
 */
export function recommend(input: RecommendInput): { winner: RankedCard | null; ranked: RankedCard[] } {
  const asOf = input.asOf ?? new Date().toISOString().slice(0, 10);
  const owned = new Set(input.cardIds);
  const candidates = CARD_CATALOG.filter((c) => owned.has(c.id));

  const ranked: RankedCard[] = candidates.map((card) => {
    const rules = REWARD_RULES.filter(
      (r) => r.cardId === card.id && (r.merchantId === input.merchantId || r.merchantId === 'all'),
    );
    if (rules.length === 0) {
      return {
        card,
        totalBenefit: 0,
        effectiveCost: input.amount,
        status: 'needs_verification' as VerificationStatus,
        explanation: `No verified reward rule for this merchant on ${card.product}. We can't confirm savings.`,
        breakdown: {
          instantDiscount: 0, cashback: 0, rewardValue: 0, rateAppliedPct: 0,
          validTill: '', verified: false, kind: 'none',
        },
        eligible: false,
        ineligibleReason: 'No reward rule on file for this merchant.',
      };
    }

    // Prefer merchant-specific over 'all', then verified over unverified, then highest rate.
    const sortedRules = [...rules].sort((a, b) => {
      const spec = (b.merchantId !== 'all' ? 1 : 0) - (a.merchantId !== 'all' ? 1 : 0);
      if (spec !== 0) return spec;
      const ver = Number(b.verified) - Number(a.verified);
      if (ver !== 0) return ver;
      const ra = (input.hasPrime && a.primeRatePct ? a.primeRatePct : a.ratePct);
      const rb = (input.hasPrime && b.primeRatePct ? b.primeRatePct : b.ratePct);
      return rb - ra;
    });
    const rule = sortedRules[0];
    const rate = input.hasPrime && rule.primeRatePct ? rule.primeRatePct : rule.ratePct;

    if (rule.minTxn && input.amount < rule.minTxn) {
      return {
        card,
        totalBenefit: 0,
        effectiveCost: input.amount,
        status: statusFor(rule.verified, rule.kind),
        explanation: `Needs a minimum purchase of ₹${rule.minTxn.toLocaleString('en-IN')} for this offer.`,
        breakdown: {
          instantDiscount: 0, cashback: 0, rewardValue: 0, rateAppliedPct: rate,
          minTxn: rule.minTxn, validTill: rule.validTill, verified: rule.verified,
          kind: rule.kind, exclusionNote: rule.exclusionNote,
        },
        eligible: false,
        ineligibleReason: `Minimum ₹${rule.minTxn.toLocaleString('en-IN')} required.`,
      };
    }

    if (rule.validTill < asOf) {
      return {
        card,
        totalBenefit: 0,
        effectiveCost: input.amount,
        status: 'needs_verification',
        explanation: `This offer expired on ${rule.validTill}. We can't recommend it until re-verified.`,
        breakdown: {
          instantDiscount: 0, cashback: 0, rewardValue: 0, rateAppliedPct: rate,
          validTill: rule.validTill, verified: false, kind: rule.kind,
        },
        eligible: false,
        ineligibleReason: `Offer expired ${rule.validTill}.`,
      };
    }

    let raw = (input.amount * rate) / 100;
    if (rule.capPerTxn !== undefined) raw = Math.min(raw, rule.capPerTxn);
    const benefit = Math.round(raw);

    const breakdown: CardBreakdown = {
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
    };

    const merchantName =
      input.merchantId === 'other' ? 'purchase' : input.merchantId.charAt(0).toUpperCase() + input.merchantId.slice(1);

    return {
      card,
      totalBenefit: benefit,
      effectiveCost: Math.max(0, input.amount - benefit),
      status: statusFor(rule.verified, rule.kind),
      explanation: explain(card, merchantName, rate, benefit, rule.kind, !!input.hasPrime),
      breakdown,
      eligible: benefit > 0,
      ineligibleReason: benefit <= 0 ? 'No measurable benefit for this amount.' : undefined,
    };
  });

  // Sort: eligible first, verified > estimated > needs_verification, then benefit desc.
  const statusRank: Record<VerificationStatus, number> = { verified: 0, estimated: 1, needs_verification: 2 };
  ranked.sort((a, b) => {
    if (Number(b.eligible) !== Number(a.eligible)) return Number(b.eligible) - Number(a.eligible);
    if (a.eligible && b.eligible) {
      const s = statusRank[a.status] - statusRank[b.status];
      if (s !== 0) return s;
      return b.totalBenefit - a.totalBenefit;
    }
    return 0;
  });

  const winner = ranked.find((r) => r.eligible) ?? null;
  return { winner, ranked };
}
