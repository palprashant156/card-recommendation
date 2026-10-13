import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryEntry {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  cardId: string;
  cardLabel: string;
  benefit: number;
  date: string;
}

interface CardState {
  ownedCardIds: string[];
  toggleCard: (id: string) => void;
  setCards: (ids: string[]) => void;
  removeCard: (id: string) => void;
  hasOnboarded: boolean;
  setOnboarded: (v: boolean) => void;
}

interface HistoryState {
  history: HistoryEntry[];
  addEntry: (e: Omit<HistoryEntry, 'id' | 'date'>) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
}

interface SettingsState {
  appearance: 'system' | 'light' | 'dark';
  setAppearance: (a: 'system' | 'light' | 'dark') => void;
  primeMember: boolean;
  setPrimeMember: (v: boolean) => void;
}

export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      ownedCardIds: [],
      toggleCard: (id) =>
        set((s) => ({
          ownedCardIds: s.ownedCardIds.includes(id)
            ? s.ownedCardIds.filter((c) => c !== id)
            : [...s.ownedCardIds, id],
        })),
      setCards: (ids) => set({ ownedCardIds: ids }),
      removeCard: (id) => set((s) => ({ ownedCardIds: s.ownedCardIds.filter((c) => c !== id) })),
      hasOnboarded: false,
      setOnboarded: (v) => set({ hasOnboarded: v }),
    }),
    { name: 'cardwise-cards', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addEntry: (e) =>
        set((s) => ({
          history: [{ ...e, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, date: new Date().toISOString() }, ...s.history].slice(0, 50),
        })),
      removeEntry: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'cardwise-history', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appearance: 'system',
      setAppearance: (appearance) => set({ appearance }),
      primeMember: false,
      setPrimeMember: (primeMember) => set({ primeMember }),
    }),
    { name: 'cardwise-settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
