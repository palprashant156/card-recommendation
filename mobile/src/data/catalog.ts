export type CardNetwork = 'Visa' | 'Mastercard' | 'RuPay' | 'Amex';
export type CardType = 'credit' | 'debit';

export interface CardProduct {
  id: string;
  issuer: string;
  product: string;
  network: CardNetwork;
  type: CardType;
  highlight?: string;
  popular?: boolean;
}

export const CARD_CATALOG: CardProduct[] = [
  { id: 'icici-apay', issuer: 'ICICI Bank', product: 'Amazon Pay Credit Card', network: 'Visa', type: 'credit', highlight: 'Up to 5% back on Amazon for Prime', popular: true },
  { id: 'axis-flipkart', issuer: 'Axis Bank', product: 'Flipkart Credit Card', network: 'Visa', type: 'credit', highlight: '5% cashback on Flipkart & Myntra', popular: true },
  { id: 'hdfc-millennia', issuer: 'HDFC Bank', product: 'Millennia Credit Card', network: 'Mastercard', type: 'credit', highlight: '5% back on Amazon, Swiggy, Zomato', popular: true },
  { id: 'sbi-cashback', issuer: 'SBI Card', product: 'Cashback Credit Card', network: 'Visa', type: 'credit', highlight: '5% cashback on online spends', popular: true },
  { id: 'icici-coral', issuer: 'ICICI Bank', product: 'Coral Credit Card', network: 'Mastercard', type: 'credit', highlight: 'Reward points on dining & groceries' },
  { id: 'hdfc-regalia', issuer: 'HDFC Bank', product: 'Regalia Credit Card', network: 'Visa', type: 'credit', highlight: 'Premium travel rewards' },
  { id: 'axis-myzone', issuer: 'Axis Bank', product: 'My Zone Credit Card', network: 'Mastercard', type: 'credit', highlight: 'Movie + shopping perks' },
  { id: 'idfc-wealth', issuer: 'IDFC First', product: 'Wealth Credit Card', network: 'Visa', type: 'credit', highlight: 'No annual fee, reward points' },
  { id: 'hdfc-rupay-debit', issuer: 'HDFC Bank', product: 'Millennia Debit Card', network: 'RuPay', type: 'debit', highlight: 'Cashback on online shopping' },
  { id: 'sbi-rupay-debit', issuer: 'SBI', product: 'Classic RuPay Debit Card', network: 'RuPay', type: 'debit', highlight: 'Everyday debit spends' },
];

export type MerchantId =
  | 'amazon'
  | 'flipkart'
  | 'myntra'
  | 'swiggy'
  | 'zomato'
  | 'uber'
  | 'bigbasket'
  | 'croma'
  | 'other';

export interface Merchant {
  id: MerchantId;
  name: string;
  category: string;
  supportsPrime?: boolean;
}

export const MERCHANTS: Merchant[] = [
  { id: 'amazon', name: 'Amazon India', category: 'Online shopping', supportsPrime: true },
  { id: 'flipkart', name: 'Flipkart', category: 'Online shopping' },
  { id: 'myntra', name: 'Myntra', category: 'Fashion' },
  { id: 'swiggy', name: 'Swiggy', category: 'Food delivery' },
  { id: 'zomato', name: 'Zomato', category: 'Food delivery' },
  { id: 'uber', name: 'Uber', category: 'Travel' },
  { id: 'bigbasket', name: 'BigBasket', category: 'Groceries' },
  { id: 'croma', name: 'Croma', category: 'Electronics' },
  { id: 'other', name: 'Other merchant', category: 'General' },
];

export type VerificationStatus = 'verified' | 'estimated' | 'needs_verification';

export interface RewardRule {
  id: string;
  cardId: string;
  merchantId: MerchantId | 'all';
  kind: 'instant_discount' | 'cashback' | 'reward_points';
  ratePct: number;
  /** Extra rate when membership flag (e.g. Prime) is true. */
  primeRatePct?: number;
  capPerTxn?: number;
  minTxn?: number;
  pointValueRs?: number;
  validTill: string;
  verified: boolean;
  sourceUrl?: string;
  lastVerified: string;
  exclusionNote?: string;
}

export const REWARD_RULES: RewardRule[] = [
  { id: 'r1', cardId: 'icici-apay', merchantId: 'amazon', kind: 'cashback', ratePct: 3, primeRatePct: 5, capPerTxn: 500, minTxn: 0, validTill: '2027-03-31', verified: true, sourceUrl: 'https://www.icicibank.com', lastVerified: '2026-09-20' },
  { id: 'r2', cardId: 'axis-flipkart', merchantId: 'flipkart', kind: 'cashback', ratePct: 5, capPerTxn: 500, minTxn: 0, validTill: '2027-01-31', verified: true, sourceUrl: 'https://www.axisbank.com', lastVerified: '2026-09-18' },
  { id: 'r3', cardId: 'axis-flipkart', merchantId: 'myntra', kind: 'cashback', ratePct: 5, capPerTxn: 500, minTxn: 0, validTill: '2027-01-31', verified: true, sourceUrl: 'https://www.axisbank.com', lastVerified: '2026-09-18' },
  { id: 'r4', cardId: 'hdfc-millennia', merchantId: 'amazon', kind: 'cashback', ratePct: 5, capPerTxn: 1000, minTxn: 0, validTill: '2026-12-31', verified: true, sourceUrl: 'https://www.hdfcbank.com', lastVerified: '2026-09-10' },
  { id: 'r5', cardId: 'hdfc-millennia', merchantId: 'swiggy', kind: 'cashback', ratePct: 5, capPerTxn: 1000, minTxn: 0, validTill: '2026-12-31', verified: true, sourceUrl: 'https://www.hdfcbank.com', lastVerified: '2026-09-10' },
  { id: 'r6', cardId: 'hdfc-millennia', merchantId: 'zomato', kind: 'cashback', ratePct: 5, capPerTxn: 1000, minTxn: 0, validTill: '2026-12-31', verified: true, sourceUrl: 'https://www.hdfcbank.com', lastVerified: '2026-09-10' },
  { id: 'r7', cardId: 'sbi-cashback', merchantId: 'all', kind: 'cashback', ratePct: 5, capPerTxn: 5000, minTxn: 0, validTill: '2027-06-30', verified: true, sourceUrl: 'https://www.sbicard.com', lastVerified: '2026-09-15', exclusionNote: 'Excludes wallet loads & rent.' },
  { id: 'r8', cardId: 'icici-coral', merchantId: 'all', kind: 'reward_points', ratePct: 1, pointValueRs: 0.25, validTill: '2027-03-31', verified: false, lastVerified: '2026-06-01', exclusionNote: 'Point value varies by redemption.' },
  { id: 'r9', cardId: 'hdfc-regalia', merchantId: 'all', kind: 'reward_points', ratePct: 1.33, pointValueRs: 0.5, validTill: '2027-03-31', verified: false, lastVerified: '2026-06-01' },
  { id: 'r10', cardId: 'axis-myzone', merchantId: 'swiggy', kind: 'instant_discount', ratePct: 10, capPerTxn: 250, minTxn: 999, validTill: '2026-10-30', verified: true, sourceUrl: 'https://www.axisbank.com', lastVerified: '2026-09-25' },
  { id: 'r11', cardId: 'idfc-wealth', merchantId: 'all', kind: 'reward_points', ratePct: 2, pointValueRs: 0.25, validTill: '2027-03-31', verified: false, lastVerified: '2026-08-01' },
  { id: 'r12', cardId: 'hdfc-millennia', merchantId: 'bigbasket', kind: 'cashback', ratePct: 2.5, capPerTxn: 1000, minTxn: 0, validTill: '2026-12-31', verified: true, sourceUrl: 'https://www.hdfcbank.com', lastVerified: '2026-09-10' },
];

export interface CuratedOffer {
  id: string;
  merchantId: MerchantId;
  cardId: string;
  title: string;
  benefit: string;
  minTxn?: number;
  maxDiscount?: number;
  expiry: string;
  status: VerificationStatus;
  exclusions?: string;
}

export const OFFERS: CuratedOffer[] = [
  { id: 'o1', merchantId: 'amazon', cardId: 'icici-apay', title: '5% back with Prime', benefit: '5% cashback as Amazon Pay balance', maxDiscount: 500, expiry: '2027-03-31', status: 'verified' },
  { id: 'o2', merchantId: 'flipkart', cardId: 'axis-flipkart', title: '5% cashback', benefit: '5% cashback on Flipkart', maxDiscount: 500, expiry: '2027-01-31', status: 'verified' },
  { id: 'o3', merchantId: 'swiggy', cardId: 'axis-myzone', title: '10% instant off', benefit: '10% off up to ₹250 on ₹999+', minTxn: 999, maxDiscount: 250, expiry: '2026-10-30', status: 'verified', exclusions: 'Weekends only. One use per day.' },
  { id: 'o4', merchantId: 'zomato', cardId: 'hdfc-millennia', title: '5% cashback', benefit: '5% cashback credited next cycle', maxDiscount: 1000, expiry: '2026-12-31', status: 'verified' },
  { id: 'o5', merchantId: 'myntra', cardId: 'axis-flipkart', title: '5% cashback', benefit: '5% cashback on Myntra', maxDiscount: 500, expiry: '2027-01-31', status: 'verified' },
  { id: 'o6', merchantId: 'bigbasket', cardId: 'hdfc-millennia', title: '2.5% cashback', benefit: 'Estimated 2.5% back in points', expiry: '2026-12-31', status: 'estimated' },
  { id: 'o7', merchantId: 'croma', cardId: 'sbi-cashback', title: '5% online cashback', benefit: '5% cashback, statement credit', maxDiscount: 5000, expiry: '2027-06-30', status: 'verified' },
  { id: 'o8', merchantId: 'uber', cardId: 'hdfc-regalia', title: 'Rewards on travel', benefit: 'Reward points, value varies', expiry: '2027-03-31', status: 'needs_verification', exclusions: 'Redemption value not confirmed.' },
];
