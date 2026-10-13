/**
 * CardWise Design Tokens — single source of truth (light + dark).
 * Semantic only. No decorative gradients. 4pt spacing base.
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const Radius = {
  row: 10,
  card: 14,
  sheet: 20,
  pill: 999,
} as const;

export const TypeScale = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '650' as const },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  amountLg: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums' as const],
  },
  amount: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums' as const],
  },
} as const;

export type ThemeName = 'light' | 'dark';

export interface CardWiseTheme {
  name: ThemeName;
  bg: string;
  surface: string;
  surfaceMuted: string;
  ink: string;
  inkInverse: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  positive: string;
  positiveBg: string;
  caution: string;
  cautionBg: string;
  danger: string;
  dangerBg: string;
  primaryBtn: string;
  primaryBtnText: string;
  selectionWash: string;
}

export const LightTheme: CardWiseTheme = {
  name: 'light',
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EFE9',
  ink: '#101B2D',
  inkInverse: '#FFFFFF',
  text: '#101B2D',
  textSecondary: '#5B6474',
  textMuted: '#8A93A5',
  border: '#E7E2D8',
  borderStrong: '#C9C2B2',
  positive: '#0F7A5A',
  positiveBg: '#E3F2E9',
  caution: '#8A5F00',
  cautionBg: '#FFF3D6',
  danger: '#C0362C',
  dangerBg: '#FDECEA',
  primaryBtn: '#101B2D',
  primaryBtnText: '#FFFFFF',
  selectionWash: '#EEF1FA',
};

export const DarkTheme: CardWiseTheme = {
  name: 'dark',
  bg: '#0C1220',
  surface: '#151E30',
  surfaceMuted: '#1E2942',
  ink: '#F5F1E8',
  inkInverse: '#101B2D',
  text: '#F5F1E8',
  textSecondary: '#A7B0BF',
  textMuted: '#7C8698',
  border: '#26314A',
  borderStrong: '#3B4A6B',
  positive: '#3ECF8E',
  positiveBg: '#123626',
  caution: '#E8B84B',
  cautionBg: '#3A2E0E',
  danger: '#F0726A',
  dangerBg: '#3A1A18',
  primaryBtn: '#EFE9DC',
  primaryBtnText: '#101B2D',
  selectionWash: '#1E2942',
};

export function formatINR(amount: number): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
}

export function formatINRCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return formatINR(amount);
}
