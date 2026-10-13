import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../src/theme/useTheme';
import { Button } from '../src/components/Button';
import { useCardStore } from '../src/store/useStore';

export default function Onboarding() {
  const t = useTheme();
  const setOnboarded = useCardStore((s) => s.setOnboarded);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.iconRow} accessible={false} importantForAccessibility="no-hide-descendants">
          <View style={[styles.cardA, { backgroundColor: t.surface, borderColor: t.border }]} />
          <View style={[styles.cardB, { backgroundColor: t.ink }]}>
            <View style={[styles.check, { backgroundColor: t.positive }]}><Text style={styles.tick}>✓</Text></View>
          </View>
        </View>
        <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">
          Stop guessing.{'\n'}Start saving.
        </Text>
        <Text style={[styles.sub, { color: t.textSecondary }]}>
          Find the best card for your next purchase using the cards you already own.
        </Text>
        <Text style={[styles.privacy, { color: t.textMuted }]}>
          Private by design — we never ask for card numbers, CVVs, PINs or OTPs.
        </Text>
        <View style={styles.cta}>
          <Button
            title="Get Started"
            onPress={() => {
              setOnboarded(true);
              router.replace('/add-cards');
            }}
          />
          <View style={styles.gap} />
          <Button
            title="Explore Demo"
            variant="secondary"
            onPress={() => {
              setOnboarded(true);
              router.replace('/(tabs)');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  iconRow: { flexDirection: 'row', marginBottom: 28, height: 72 },
  cardA: { width: 104, height: 66, borderRadius: 12, borderWidth: 1, transform: [{ rotate: '-8deg' }] },
  cardB: { width: 104, height: 66, borderRadius: 12, marginLeft: -48, marginTop: 10, transform: [{ rotate: '8deg' }], alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 },
  check: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  tick: { color: '#fff', fontWeight: '700', fontSize: 15 },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  sub: { fontSize: 15, lineHeight: 22, marginTop: 12 },
  privacy: { fontSize: 12, lineHeight: 16, marginTop: 16 },
  cta: { marginTop: 32 },
  gap: { height: 12 },
});
