import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme, type CardWiseTheme } from './tokens';
import { useSettingsStore } from '../store/useStore';

/** Resolves light/dark per system + user override (system/light/dark). */
export function useTheme(): CardWiseTheme {
  const system = useColorScheme();
  const override = useSettingsStore((s) => s.appearance);
  if (override === 'light') return LightTheme;
  if (override === 'dark') return DarkTheme;
  return system === 'dark' ? DarkTheme : LightTheme;
}
