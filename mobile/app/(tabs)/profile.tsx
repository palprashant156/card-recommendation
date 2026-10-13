import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';
import { useCardStore, useHistoryStore, useSettingsStore } from '../../src/store/useStore';
import { Button } from '../../src/components/Button';

export default function Profile() {
  const t = useTheme();
  const owned = useCardStore((s) => s.ownedCardIds);
  const appearance = useSettingsStore((s) => s.appearance);
  const setAppearance = useSettingsStore((s) => s.setAppearance);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const setCards = useCardStore((s) => s.setCards);

  const confirmClear = () =>
    Alert.alert('Clear history?', 'This removes your recommendation history from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearHistory() },
    ]);

  const confirmReset = () =>
    Alert.alert('Delete local data?', 'Removes saved cards and history from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setCards([]); clearHistory(); } },
    ]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">Profile</Text>
        <Text style={[styles.sub, { color: t.textSecondary }]}>{owned.length} card{owned.length === 1 ? '' : 's'} saved · V1</Text>

        <Text style={[styles.h, { color: t.text }]}>Account</Text>
        <Row label="My cards" hint={`${owned.length} saved`} onPress={() => router.push('/(tabs)/cards')} />
        <Row label="Recommendation history" hint="Estimates" onPress={() => router.push('/history')} />

        <Text style={[styles.h, { color: t.text }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          {(['system', 'light', 'dark'] as const).map((a) => (
            <Pressable key={a} onPress={() => setAppearance(a)} accessibilityRole="radio" accessibilityState={{ checked: appearance === a }} style={styles.apRow}>
              <Text style={[styles.apLabel, { color: t.text }]}>{a === 'system' ? 'System' : a === 'light' ? 'Light' : 'Dark'}</Text>
              <View style={[styles.radio, { borderColor: appearance === a ? t.ink : t.borderStrong, backgroundColor: appearance === a ? t.ink : 'transparent' }]}>
                {appearance === a ? <Text style={styles.tick}>✓</Text> : null}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.h, { color: t.text }]}>Privacy</Text>
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Text style={[styles.privacy, { color: t.textSecondary }]}>
            CardWise recommends a card — it never processes payments. We never collect card numbers, CVVs, PINs, OTPs or passwords. Data stays on your device in V1 unless you connect the optional API.
          </Text>
          <View style={styles.gap}><Button title="Clear history" variant="secondary" onPress={confirmClear} /></View>
        </View>

        <Text style={[styles.h, { color: t.text }]}>Support</Text>
        <Row label="Terms & privacy" hint="V1 summary" onPress={() => Alert.alert('Terms', 'V1: estimates only. Verify offers with your bank before purchase.')} />
        <Row label="Send feedback" hint="Helps V2" onPress={() => Alert.alert('Thanks', 'Feedback endpoint: POST /v1/feedback (see backend docs).')} />

        <View style={styles.danger}>
          <Button title="Delete local data" variant="secondary" onPress={confirmReset} />
        </View>
        <Text style={[styles.foot, { color: t.textMuted }]}>CardWise V1 · Made for India · INR throughout</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, hint, onPress }: { label: string; hint: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={[styles.row, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text style={[styles.rowLabel, { color: t.text }]}>{label}</Text>
      <Text style={[styles.rowHint, { color: t.textMuted }]}>{hint} ›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 4 },
  h: { fontSize: 15, fontWeight: '700', marginTop: 24, marginBottom: 8 },
  row: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { fontSize: 14, fontWeight: '600' },
  rowHint: { fontSize: 13 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14 },
  apRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  apLabel: { fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  tick: { color: '#fff', fontSize: 13, fontWeight: '700' },
  privacy: { fontSize: 13, lineHeight: 18 },
  gap: { marginTop: 12 },
  danger: { marginTop: 24 },
  foot: { fontSize: 12, textAlign: 'center', marginTop: 20 },
});
