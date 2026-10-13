import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Button } from './Button';

export function EmptyState({ title, message, actionLabel, onAction }: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  const t = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      <Text style={[styles.msg, { color: t.textSecondary }]}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={styles.btn}><Button title={actionLabel} onPress={onAction} variant="secondary" /></View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 12 },
  title: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  msg: { fontSize: 14, lineHeight: 20, marginTop: 6 },
  btn: { marginTop: 12 },
});
