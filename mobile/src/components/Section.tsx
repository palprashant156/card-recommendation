import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">{title}</Text>
      {hint ? <Text style={[styles.hint, { color: t.textSecondary }]}>{hint}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  title: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  hint: { fontSize: 13, lineHeight: 18, marginTop: 4 },
  body: { marginTop: 12 },
});
