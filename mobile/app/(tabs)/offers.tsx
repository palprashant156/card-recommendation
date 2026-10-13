import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OFFERS, MERCHANTS, CARD_CATALOG } from '../../src/data/catalog';
import { useTheme } from '../../src/theme/useTheme';
import { formatINR } from '../../src/theme/tokens';
import { StatusPill } from '../../src/components/StatusPill';
import { EmptyState } from '../../src/components/EmptyState';

type Filter = 'all' | 'verified' | 'estimated' | 'needs_verification';

export default function Offers() {
  const t = useTheme();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(() => {
    return OFFERS.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q.trim()) return true;
      const card = CARD_CATALOG.find((c) => c.id === o.cardId);
      const merch = MERCHANTS.find((m) => m.id === o.merchantId);
      const hay = `${o.title} ${o.benefit} ${card?.issuer ?? ''} ${card?.product ?? ''} ${merch?.name ?? ''}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [q, filter]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">Offers</Text>
        <Text style={[styles.sub, { color: t.textSecondary }]}>Curated, dated and labelled. No countdowns.</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Filter by merchant or card"
          placeholderTextColor={t.textMuted}
          style={[styles.search, { backgroundColor: t.surface, borderColor: t.border, color: t.text }]}
          accessibilityLabel="Filter offers"
        />
        <View style={styles.filters}>
          {(['all', 'verified', 'estimated', 'needs_verification'] as Filter[]).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              accessibilityRole="button"
              style={[styles.pill, { backgroundColor: filter === f ? t.ink : t.surface, borderColor: t.border }]}
            >
              <Text style={[styles.pillText, { color: filter === f ? t.inkInverse : t.textSecondary }]}>
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </Text>
            </Pressable>
          ))}
        </View>
        <FlatList
          data={list}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => {
            const card = CARD_CATALOG.find((c) => c.id === item.cardId);
            const merch = MERCHANTS.find((m) => m.id === item.merchantId);
            return (
              <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
                <StatusPill status={item.status} />
                <Text style={[styles.otitle, { color: t.text }]}>{item.title}</Text>
                <Text style={[styles.oben, { color: t.textSecondary }]}>{item.benefit}</Text>
                <Text style={[styles.meta, { color: t.textSecondary }]}>
                  {merch?.name} · {card?.issuer} {card?.product}
                </Text>
                <Text style={[styles.meta, { color: t.textMuted }]}>
                  {item.minTxn ? `Min ${formatINR(item.minTxn)} · ` : ''}{item.maxDiscount ? `Up to ${formatINR(item.maxDiscount)} · ` : ''}Expires {item.expiry}
                </Text>
                {item.exclusions ? <Text style={[styles.excl, { color: t.caution }]}>{item.exclusions}</Text> : null}
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState title="No offers match" message="Try a different merchant, card or filter." />
          }
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 4 },
  search: { borderWidth: 1, borderRadius: 12, height: 46, paddingHorizontal: 14, marginTop: 14, fontSize: 15 },
  filters: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, minHeight: 36, justifyContent: 'center' },
  pillText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  list: { paddingTop: 14, paddingBottom: 40 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10, gap: 6 },
  otitle: { fontSize: 15, fontWeight: '700' },
  oben: { fontSize: 13, lineHeight: 18 },
  meta: { fontSize: 12, lineHeight: 16 },
  excl: { fontSize: 12, lineHeight: 16, marginTop: 2 },
});
