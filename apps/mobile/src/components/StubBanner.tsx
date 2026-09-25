import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

export function StubBanner({ label = 'Flujo stub — UI lista, backend pendiente' }: { label?: string }) {
  if (!__DEV__) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF4D6',
    borderRadius: radius.sm,
    padding: spacing[2],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.warning,
  },
  text: { ...typography.caption, color: '#8A6500' },
});
