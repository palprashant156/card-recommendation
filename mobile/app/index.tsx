import { Redirect } from 'expo-router';
import { useCardStore } from '../src/store/useStore';

export default function Index() {
  const onboarded = useCardStore((s) => s.hasOnboarded);
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
