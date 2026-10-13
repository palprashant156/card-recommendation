import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { VerificationStatus } from '../data/catalog';
import { useTheme } from '../theme/useTheme';

const LABEL: Record<VerificationStatus, string> = {
  verified: 'Verified offer',
  estimated: 'Estimated rewards',
  needs_verification: 'Needs verification',
};

export function StatusPill({ status }: { status: VerificationStatus }) {
  const t = useTheme();
  const bg = status === 'verified' ? t.positiveBg : status === 'estimated' ? t.surfaceMuted : t.cautionBg;
  const dot = status === 'verified' ? t.positive : status === 'estimated' ? t.textMuted : t.caution;
  const text = status === 'verified' ? t.positive : status === 'estimated' ? t.textSecondary : t.caution;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]} accessibilityRole="text" accessibilityLabel={LABEL[status]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.text, { color: text }]}>{LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
});
