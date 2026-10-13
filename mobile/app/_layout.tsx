import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../src/store/useStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
});

export default function RootLayout() {
  const system = useColorScheme();
  const override = useSettingsStore((s) => s.appearance);
  const effective = override === 'system' ? system : override;
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={effective === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 200,
            contentStyle: { backgroundColor: effective === 'dark' ? '#0C1220' : '#FAF8F5' },
          }}
        >
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="add-cards" options={{ presentation: 'modal', headerShown: true, title: 'Add your cards' }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="purchase" options={{ headerShown: true, title: 'Purchase details' }} />
          <Stack.Screen name="result" options={{ headerShown: true, title: 'Best card' }} />
          <Stack.Screen name="history" options={{ headerShown: true, title: 'History' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
