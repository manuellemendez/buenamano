import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

const SELECTED_FILL = '#F3E4DA';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing[2],
    marginBottom: spacing[2],
    minHeight: 36,
    justifyContent: 'center',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: SELECTED_FILL,
  },
  text: { ...typography.caption, color: colors.text },
  textSelected: { ...typography.bodyStrong, color: colors.primary, fontSize: 13, lineHeight: 18 },
});
