import { recommend } from './engine';

const cards = [
  { id: 'icici-apay', issuer: 'ICICI Bank', product: 'Amazon Pay Credit Card', network: 'Visa', type: 'credit' },
  { id: 'axis-flipkart', issuer: 'Axis Bank', product: 'Flipkart Credit Card', network: 'Visa', type: 'credit' },
  { id: 'icici-coral', issuer: 'ICICI Bank', product: 'Coral Credit Card', network: 'Mastercard', type: 'credit' },
];

const rules = [
  { id: 'r1', cardId: 'icici-apay', merchantId: 'amazon', kind: 'cashback' as const, ratePct: 3, primeRatePct: 5, capPerTxn: 500, minTxn: null, validTill: '2027-03-31', verified: true },
  { id: 'r2', cardId: 'axis-flipkart', merchantId: 'flipkart', kind: 'cashback' as const, ratePct: 5, capPerTxn: 500, minTxn: null, validTill: '2027-01-31', verified: true },
  { id: 'r8', cardId: 'icici-coral', merchantId: 'all', kind: 'reward_points' as const, ratePct: 1, capPerTxn: null, minTxn: null, validTill: '2027-03-31', verified: false },
];

describe('recommendation engine (deterministic)', () => {
  it('picks Prime 5% over base 3% on Amazon', () => {
    const { winner } = recommend({
      merchantId: 'amazon', merchantName: 'Amazon India', amount: 2000,
      cardIds: ['icici-apay'], cards, rules, hasPrime: true, asOf: '2026-10-11',
    });
    expect(winner?.cardId).toBe('icici-apay');
    expect(winner?.totalBenefit).toBe(100);
    expect(winner?.effectiveCost).toBe(1900);
    expect(winner?.status).toBe('verified');
  });

  it('uses base 3% without Prime', () => {
    const { winner } = recommend({
      merchantId: 'amazon', amount: 2000, cardIds: ['icici-apay'],
      cards, rules, hasPrime: false, asOf: '2026-10-11',
    });
    expect(winner?.totalBenefit).toBe(60);
  });

  it('applies per-transaction cap', () => {
    const { winner } = recommend({
      merchantId: 'amazon', amount: 50000, cardIds: ['icici-apay'],
      cards, rules, hasPrime: true, asOf: '2026-10-11',
    });
    expect(winner?.totalBenefit).toBe(500);
  });

  it('returns honest no-winner when no rule covers merchant', () => {
    const { winner, ranked } = recommend({
      merchantId: 'croma', amount: 2000, cardIds: ['axis-flipkart'],
      cards, rules, asOf: '2026-10-11',
    });
    expect(winner).toBeNull();
    expect(ranked[0]?.eligible).toBe(false);
    expect(ranked[0]?.ineligibleReason).toMatch(/No reward rule/);
  });

  it('never ranks unverified above verified on tie; labels unverified honestly', () => {
    const tieRules = [
      ...rules,
      { id: 'rx', cardId: 'icici-coral', merchantId: 'amazon', kind: 'reward_points' as const, ratePct: 5, capPerTxn: 500, minTxn: null, validTill: '2027-03-31', verified: false },
    ];
    const { ranked } = recommend({
      merchantId: 'amazon', amount: 2000, cardIds: ['icici-apay', 'icici-coral'],
      cards, rules: tieRules, hasPrime: true, asOf: '2026-10-11',
    });
    expect(ranked[0]?.cardId).toBe('icici-apay');
    expect(ranked[0]?.status).toBe('verified');
    expect(ranked.find((r) => r.cardId === 'icici-coral')?.status).toBe('needs_verification');
  });

  it('enforces minimum transaction and expiry', () => {
    const minRules = [
      { id: 'rm', cardId: 'icici-apay', merchantId: 'amazon', kind: 'instant_discount' as const, ratePct: 10, capPerTxn: 250, minTxn: 999, validTill: '2020-01-01', verified: true },
    ];
    const expired = recommend({
      merchantId: 'amazon', amount: 2000, cardIds: ['icici-apay'], cards, rules: minRules, asOf: '2026-10-11',
    });
    expect(expired.winner).toBeNull();
    expect(expired.ranked[0]?.ineligibleReason).toMatch(/expired/);
  });
});
