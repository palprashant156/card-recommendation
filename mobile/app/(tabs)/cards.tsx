import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CARD_CATALOG } from '../../src/data/catalog';
import { useTheme } from '../../src/theme/useTheme';
import { CardRow } from '../../src/components/CardRow';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { useCardStore } from '../../src/store/useStore';

export default function MyCards() {
  const t = useTheme();
  const owned = useCardStore((s) => s.ownedCardIds);
  const remove = useCardStore((s) => s.removeCard);
  const saved = CARD_CATALOG.filter((c) => owned.includes(c.id));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">My Cards</Text>
        <Text style={[styles.sub, { color: t.textSecondary }]}>
          {saved.length === 0 ? 'Your wallet is empty.' : `${saved.length} card${saved.length > 1 ? 's' : ''} in your wallet`}
        </Text>
        {saved.length === 0 ? (
          <EmptyState
            title="No cards saved"
            message="Add the cards you already own. We never ask for numbers or PINs."
            actionLabel="Add your cards"
            onAction={() => router.push('/add-cards')}
          />
        ) : (
          <FlatList
            data={saved}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <CardRow card={item} selected onToggle={() => {}} showRemove onRemove={() => remove(item.id)} />
            )}
            contentContainerStyle={styles.list}
          />
        )}
        {saved.length > 0 ? (
          <View style={styles.footer}>
            <Button title="Add another card" variant="secondary" onPress={() => router.push('/add-cards')} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  sub: { fontSize: 13, marginTop: 4 },
  list: { paddingTop: 16, paddingBottom: 100 },
  footer: { position: 'absolute', left: 20, right: 20, bottom: 20 },
});
