import { QueryClient, useQuery } from '@tanstack/react-query';
import { CARD_CATALOG, MERCHANTS, OFFERS } from '../data/catalog';

export const queryClient = new QueryClient();

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? '';

async function get<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function useCards() {
  return useQuery({ queryKey: ['cards'], queryFn: () => get('/v1/cards', CARD_CATALOG) });
}

export function useMerchants() {
  return useQuery({ queryKey: ['merchants'], queryFn: () => get('/v1/merchants', MERCHANTS) });
}

export function useOffers() {
  return useQuery({ queryKey: ['offers'], queryFn: () => get('/v1/offers', OFFERS) });
}
