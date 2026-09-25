import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { Button } from './Button';

type Props = {
  title: string;
  body?: string;
  ctaLabel?: string;
  onCta?: () => void;
  /** Simple barrio/oficio mark — default location pin */
  icon?: ComponentProps<typeof Ionicons>['name'];
};

export function EmptyState({
  title,
  body,
  ctaLabel,
  onCta,
  icon = 'location-outline',
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {ctaLabel && onCta ? (
        <Button label={ctaLabel} onPress={onCta} style={{ marginTop: spacing[4] }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing[5],
    alignItems: 'center',
    gap: spacing[2],
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: '#F3E4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { ...typography.title2, color: colors.text, textAlign: 'center' },
  body: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
