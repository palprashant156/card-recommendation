import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/useTheme';
import { formatINR } from '../src/theme/tokens';
import { Button } from '../src/components/Button';
import { EmptyState } from '../src/components/EmptyState';
import { useHistoryStore } from '../src/store/useStore';

export default function History() {
  const t = useTheme();
  const history = useHistoryStore((s) => s.history);
  const remove = useHistoryStore((s) => s.removeEntry);
  const clear = useHistoryStore((s) => s.clearHistory);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['bottom']}>
      <View style={styles.inner}>
        <Text style={[styles.note, { color: t.textMuted }]}>
          Calculated estimates — not realised savings.
        </Text>
        {history.length === 0 ? (
          <EmptyState title="No history yet" message="Your recent recommendation calculations will appear here." />
        ) : (
          <>
            <FlatList
              data={history}
              keyExtractor={(h) => h.id}
              renderItem={({ item }) => (
                <View style={[styles.row, { backgroundColor: t.surface, borderColor: t.border }]}>
                  <View style={styles.main}>
                    <Text style={[styles.title, { color: t.text }]}>{item.merchantName} · {formatINR(item.amount)}</Text>
                    <Text style={[styles.sub, { color: t.textSecondary }]}>{item.cardLabel} · +{formatINR(item.benefit)} est.</Text>
                    <Text style={[styles.date, { color: t.textMuted }]}>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
                  </View>
                  <Text
                    onPress={() => remove(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Remove entry"
                    style={[styles.rm, { color: t.textMuted }]}
                  >
                    Remove
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.list}
            />
            <Button
              title="Clear history"
              variant="secondary"
              onPress={() => Alert.alert('Clear history?', 'Remove all entries?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => clear() },
              ])}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20 },
  note: { fontSize: 12, marginBottom: 12 },
  list: { paddingBottom: 20 },
  row: { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', marginBottom: 10 },
  main: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600' },
  sub: { fontSize: 12, marginTop: 2 },
  date: { fontSize: 11, marginTop: 4 },
  rm: { fontSize: 12, fontWeight: '600', paddingLeft: 12, paddingTop: 4 },
});
