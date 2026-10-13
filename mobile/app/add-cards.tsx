import { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CARD_CATALOG } from '../src/data/catalog';
import { useTheme } from '../src/theme/useTheme';
import { CardRow } from '../src/components/CardRow';
import { Button } from '../src/components/Button';
import { useCardStore } from '../src/store/useStore';

export default function AddCards() {
  const t = useTheme();
  const owned = useCardStore((s) => s.ownedCardIds);
  const toggle = useCardStore((s) => s.toggleCard);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return CARD_CATALOG;
    return CARD_CATALOG.filter((c) =>
      `${c.issuer} ${c.product} ${c.network} ${c.type}`.toLowerCase().includes(needle),
    );
  }, [q]);

  const popular = useMemo(() => CARD_CATALOG.filter((c) => c.popular), []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['bottom']}>
      <View style={styles.inner}>
        <Text style={[styles.count, { color: t.textSecondary }]}>
          {owned.length === 0 ? 'Select the cards you own' : `${owned.length} card${owned.length > 1 ? 's' : ''} selected`}
        </Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by bank, card or network (e.g. HDFC, RuPay)"
          placeholderTextColor={t.textMuted}
          style={[styles.search, { backgroundColor: t.surface, borderColor: t.border, color: t.text }]}
          accessibilityLabel="Search cards"
          returnKeyType="search"
        />
        {q.trim() === '' ? (
          <Text style={[styles.label, { color: t.textMuted }]}>POPULAR</Text>
        ) : (
          <Text style={[styles.label, { color: t.textMuted }]}>
            {filtered.length} RESULT{filtered.length === 1 ? '' : 'S'}
          </Text>
        )}
        <FlatList
          data={q.trim() === '' ? popular : filtered}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CardRow card={item} selected={owned.includes(item.id)} onToggle={() => toggle(item.id)} />
          )}
          ListEmptyComponent={
            <View style={[styles.fallback, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text style={[styles.fallbackTitle, { color: t.text }]}>Card not found?</Text>
              <Text style={[styles.fallbackMsg, { color: t.textSecondary }]}>
                We cover major Indian issuers in V1. Tell us which card you need and we’ll prioritise it.
              </Text>
              <Pressable accessibilityRole="button" onPress={() => setQ('')}>
                <Text style={[styles.link, { color: t.text }]}>Clear search</Text>
              </Pressable>
            </View>
          }
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
        <View style={[styles.footer, { backgroundColor: t.bg, borderTopColor: t.border }]}>
          <Button
            title={owned.length === 0 ? 'Skip for now' : `Continue with ${owned.length} card${owned.length > 1 ? 's' : ''}`}
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  count: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 48, marginTop: 12, fontSize: 15 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  list: { paddingBottom: 120 },
  fallback: { borderWidth: 1, borderRadius: 14, padding: 16 },
  fallbackTitle: { fontSize: 15, fontWeight: '600' },
  fallbackMsg: { fontSize: 13, lineHeight: 18, marginTop: 6 },
  link: { fontSize: 14, fontWeight: '600', marginTop: 10 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, borderTopWidth: 1 },
});
