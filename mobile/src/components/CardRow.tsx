import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import type { CardProduct } from '../data/catalog';
import { useTheme } from '../theme/useTheme';

export function CardRow({
  card,
  selected,
  onToggle,
  onRemove,
  showRemove,
}: {
  card: CardProduct;
  selected: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${card.issuer} ${card.product}`}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? t.selectionWash : t.surface,
          borderColor: selected ? t.ink : t.border,
          opacity: pressed ? 0.97 : 1,
        },
      ]}
    >
      <View style={[styles.check, { borderColor: selected ? t.ink : t.borderStrong, backgroundColor: selected ? t.ink : 'transparent' }]}>
        {selected ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      <View style={styles.main}>
        <Text style={[styles.issuer, { color: t.textSecondary }]}>{card.issuer} · {card.type === 'credit' ? 'Credit' : 'Debit'} · {card.network}</Text>
        <Text style={[styles.product, { color: t.text }]}>{card.product}</Text>
        {card.highlight ? <Text style={[styles.hl, { color: t.textSecondary }]}>{card.highlight}</Text> : null}
      </View>
      {showRemove && onRemove ? (
        <Pressable onPress={onRemove} hitSlop={12} accessibilityRole="button" accessibilityLabel={`Remove ${card.product}`}>
          <Text style={[styles.remove, { color: t.textMuted }]}>Remove</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 14, gap: 12, marginBottom: 10 },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  tick: { color: '#fff', fontSize: 14, fontWeight: '700', lineHeight: 16 },
  main: { flex: 1 },
  issuer: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  product: { fontSize: 15, lineHeight: 20, fontWeight: '600', marginTop: 2 },
  hl: { fontSize: 12, lineHeight: 16, marginTop: 4 },
  remove: { fontSize: 13, fontWeight: '600' },
});
