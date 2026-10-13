import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MERCHANTS, CARD_CATALOG } from '../../src/data/catalog';
import { useTheme, } from '../../src/theme/useTheme';
import { formatINR } from '../../src/theme/tokens';
import { Button } from '../../src/components/Button';
import { Section } from '../../src/components/Section';
import { EmptyState } from '../../src/components/EmptyState';
import { useCardStore, useHistoryStore } from '../../src/store/useStore';

export default function Home() {
  const t = useTheme();
  const owned = useCardStore((s) => s.ownedCardIds);
  const history = useHistoryStore((s) => s.history);
  const recentMerchants = MERCHANTS.slice(0, 6);
  const totalEstimated = history.reduce((a, h) => a + h.benefit, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={[styles.greet, { color: t.textMuted }]}>Good day</Text>
        <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">Find your best card</Text>
        <Text style={[styles.sub, { color: t.textSecondary }]}>
          Tell us where you’re shopping and we’ll pick the card that saves most.
        </Text>

        {owned.length === 0 ? (
          <View style={[styles.hero, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.heroTitle, { color: t.text }]}>Add your cards to start saving</Text>
            <Text style={[styles.heroSub, { color: t.textSecondary }]}>
              We compare only the cards you already own. No card numbers needed.
            </Text>
            <View style={styles.heroBtn}>
              <Button title="Add your cards" onPress={() => router.push('/add-cards')} />
            </View>
          </View>
        ) : (
          <View style={[styles.hero, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.heroTitle, { color: t.text }]}>Where are you shopping?</Text>
            <View style={styles.chips}>
              {recentMerchants.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => router.push({ pathname: '/purchase', params: { merchantId: m.id } })}
                  accessibilityRole="button"
                  accessibilityLabel={`Shop at ${m.name}`}
                  style={({ pressed }) => [
                    styles.chip,
                    { backgroundColor: t.surfaceMuted, borderColor: t.border, opacity: pressed ? 0.9 : 1 },
                  ]}
                >
                  <Text style={[styles.chipText, { color: t.text }]}>{m.name}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.heroBtn}>
              <Button title="Find Best Card" onPress={() => router.push('/purchase')} />
            </View>
            <Text style={[styles.owned, { color: t.textMuted }]}>
              {owned.length} card{owned.length > 1 ? 's' : ''} saved ·{' '}
              {CARD_CATALOG.filter((c) => owned.includes(c.id)).slice(0, 2).map((c) => c.product).join(' · ')}
            </Text>
          </View>
        )}

        {history.length > 0 ? (
          <Section title="Recent recommendations" hint="Estimates, not realised savings.">
            {history.slice(0, 3).map((h) => (
              <View key={h.id} style={[styles.row, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={styles.rowMain}>
                  <Text style={[styles.rowTitle, { color: t.text }]}>{h.merchantName} · {formatINR(h.amount)}</Text>
                  <Text style={[styles.rowSub, { color: t.textSecondary }]}>{h.cardLabel}</Text>
                </View>
                <Text style={[styles.rowAmt, { color: t.positive }]}>+{formatINR(h.benefit)}</Text>
              </View>
            ))}
            <Pressable onPress={() => router.push('/history')} accessibilityRole="button">
              <Text style={[styles.link, { color: t.text }]}>View all history</Text>
            </Pressable>
            {totalEstimated > 0 ? (
              <Text style={[styles.total, { color: t.textSecondary }]}>
                Estimated total so far: {formatINR(totalEstimated)}
              </Text>
            ) : null}
          </Section>
        ) : owned.length > 0 ? (
          <EmptyState
            title="No recommendations yet"
            message="Enter a merchant and amount — we’ll show the best card instantly."
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, paddingBottom: 40 },
  greet: { fontSize: 13, fontWeight: '600' },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', marginTop: 4 },
  sub: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  hero: { borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 20 },
  heroTitle: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  heroSub: { fontSize: 14, lineHeight: 20, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, minHeight: 44, justifyContent: 'center' },
  chipText: { fontSize: 13, fontWeight: '600' },
  heroBtn: { marginTop: 16 },
  owned: { fontSize: 12, lineHeight: 16, marginTop: 12 },
  row: { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 2 },
  rowAmt: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  link: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  total: { fontSize: 12, marginTop: 8 },
});
