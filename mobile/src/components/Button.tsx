import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, accessibilityLabel }: Props) {
  const t = useTheme();
  const bg =
    variant === 'primary' ? t.primaryBtn : variant === 'danger' ? t.danger : 'transparent';
  const color =
    variant === 'primary' ? t.primaryBtnText : variant === 'danger' ? '#fff' : t.text;
  const borderColor = variant === 'secondary' ? t.borderStrong : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? t.surfaceMuted : bg,
          borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        } as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text style={[styles.text, { color: disabled ? t.textMuted : color } as TextStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
});
