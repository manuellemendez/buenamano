import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { barrioLabel } from '../constants/barrios';
import { COPY } from '../constants/copy';
import { oficioLabel, type OficioId } from '../constants/oficios';
import type { MockPro } from '../data/mock';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { LocalBadge } from './LocalBadge';

type Props = { pro: MockPro };

/** Soft oficio tints — same residual palette as FeedCard */
const OFICIO_TINT: Record<
  OficioId,
  { bg: string; ink: string; icon: ComponentProps<typeof Ionicons>['name'] }
> = {
  plomeria: { bg: '#E8D0C0', ink: '#8A3E18', icon: 'water-outline' },
  electricidad: { bg: '#E8DFC8', ink: '#7A5A12', icon: 'flash-outline' },
  aseo: { bg: '#D4E4DE', ink: '#1A5546', icon: 'sparkles-outline' },
  cerrajeria: { bg: '#DDD6CE', ink: '#4A433C', icon: 'key-outline' },
};

const AVATAR = 80;

export function ProCard({ pro }: Props) {
  const barrio = barrioLabel(pro.barrio);
  const primaryOficio = (pro.oficios[0] ?? 'plomeria') as OficioId;
  const tint = OFICIO_TINT[primaryOficio] ?? OFICIO_TINT.plomeria;

  return (
    <View style={styles.card}>
      <View style={styles.cover} />
      <View style={styles.body}>
        <View style={[styles.avatar, { backgroundColor: tint.bg }]}>
          <Ionicons name={tint.icon} size={28} color={tint.ink} />
          <Text style={[styles.initial, { color: tint.ink }]}>{pro.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{pro.name}</Text>
        <Text style={styles.meta}>
          {pro.oficios.map(oficioLabel).join(' · ')} · {barrio}
        </Text>
        <View style={styles.badges}>
          {pro.local ? (
            <LocalBadge barrio={barrio} />
          ) : (
            <Text style={styles.sinLocal}>{COPY.sinLocal}</Text>
          )}
        </View>
        <Text style={styles.bio}>{pro.bio}</Text>
        <Text style={styles.rate}>{pro.rateHint}</Text>
        <Text style={styles.score}>
          ★ {pro.rating.toFixed(1)} · {pro.jobsCount} trabajos
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cover: {
    height: 120,
    backgroundColor: '#F3E4DA',
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[2],
    alignItems: 'flex-start',
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radius.md,
    marginTop: -(AVATAR / 2),
    borderWidth: 3,
    borderColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  initial: { ...typography.caption, fontWeight: '700' },
  name: { ...typography.title1, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  badges: { marginTop: spacing[1] },
  sinLocal: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  bio: { ...typography.body, color: colors.text, marginTop: spacing[1] },
  rate: { ...typography.callout, color: colors.secondary },
  score: { ...typography.caption, color: colors.textMuted },
});
