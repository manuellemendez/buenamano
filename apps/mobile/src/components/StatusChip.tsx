import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Tone = 'success' | 'warning' | 'danger' | 'muted';

type Props = {
  label: string;
  tone?: Tone;
};

const toneBg: Record<Tone, string> = {
  success: '#E6F6EA',
  warning: '#FFF4D6',
  danger: '#FCE8E7',
  muted: colors.surfaceMuted,
};

const toneFg: Record<Tone, string> = {
  success: colors.success,
  warning: '#8A6500',
  danger: colors.danger,
  muted: colors.textMuted,
};

export function StatusChip({ label, tone = 'muted' }: Props) {
  return (
    <View style={[styles.chip, { backgroundColor: toneBg[tone] }]}>
      <Text style={[styles.text, { color: toneFg[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { ...typography.micro },
});
