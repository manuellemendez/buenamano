import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { barrioLabel } from '../constants/barrios';
import { oficioLabel } from '../constants/oficios';
import type { MockPro } from '../data/mock';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { LocalBadge } from './LocalBadge';

type Props = { pro: MockPro };

export function ProCard({ pro }: Props) {
  const barrio = barrioLabel(pro.barrio);
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{pro.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{pro.name}</Text>
      <Text style={styles.meta}>
        {pro.oficios.map(oficioLabel).join(' · ')} · {barrio}
      </Text>
      {pro.local ? <LocalBadge barrio={barrio} /> : null}
      <Text style={styles.bio}>{pro.bio}</Text>
      <Text style={styles.rate}>{pro.rateHint}</Text>
      <Text style={styles.score}>
        ★ {pro.rating.toFixed(1)} · {pro.jobsCount} trabajos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[2],
    alignItems: 'flex-start',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { ...typography.display, color: colors.primary, fontSize: 28 },
  name: { ...typography.title1, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  bio: { ...typography.body, color: colors.text, marginTop: spacing[1] },
  rate: { ...typography.callout, color: colors.secondary },
  score: { ...typography.caption, color: colors.textMuted },
});
