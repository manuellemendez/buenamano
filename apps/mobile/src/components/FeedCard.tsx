import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { barrioLabel } from '../constants/barrios';
import { COPY } from '../constants/copy';
import { oficioLabel, type OficioId } from '../constants/oficios';
import type { MockPro } from '../data/mock';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { LocalBadge } from './LocalBadge';

type Props = {
  pro: MockPro;
  onPress?: () => void;
};

/** Soft oficio tints for photo placeholders (not brand hex changes) */
const OFICIO_TINT: Record<OficioId, { bg: string; ink: string; icon: ComponentProps<typeof Ionicons>['name'] }> = {
  plomeria: { bg: '#E8D0C0', ink: '#8A3E18', icon: 'water-outline' },
  electricidad: { bg: '#E8DFC8', ink: '#7A5A12', icon: 'flash-outline' },
  aseo: { bg: '#D4E4DE', ink: '#1A5546', icon: 'sparkles-outline' },
  cerrajeria: { bg: '#DDD6CE', ink: '#4A433C', icon: 'key-outline' },
};

const CARD_RADIUS = 14;

/** Descubre card — NO patrocinado slot */
export function FeedCard({ pro, onPress }: Props) {
  const oficios = pro.oficios.map(oficioLabel).join(' · ');
  const barrio = barrioLabel(pro.barrio);
  const primaryOficio = (pro.oficios[0] ?? 'plomeria') as OficioId;
  const tint = OFICIO_TINT[primaryOficio] ?? OFICIO_TINT.plomeria;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
    >
      <View style={[styles.photo, { backgroundColor: tint.bg }]}>
        <Ionicons name={tint.icon} size={32} color={tint.ink} />
        <Text style={[styles.photoInitial, { color: tint.ink }]}>{pro.name.charAt(0)}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {pro.name}
          </Text>
          {pro.pocoVisto ? (
            <View style={styles.pocoTag}>
              <Text style={styles.pocoText}>{COPY.pocoVisto}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {oficios} · {barrio}
        </Text>
        <View style={styles.badges}>
          {pro.local ? (
            <LocalBadge barrio={barrio} interactive={false} />
          ) : (
            <Text style={styles.sinLocal}>{COPY.sinLocal}</Text>
          )}
        </View>
        <Text style={styles.score}>
          ★ {pro.rating.toFixed(1)} · {pro.jobsCount} trabajos
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceCard,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ translateY: -1 }],
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  photoInitial: { ...typography.caption, fontWeight: '700' },
  body: { flex: 1, gap: 2, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  name: { ...typography.title2, color: colors.text, flexShrink: 1 },
  meta: { ...typography.caption, color: colors.textMuted },
  badges: { marginTop: spacing[1] },
  sinLocal: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  score: { ...typography.caption, color: colors.text, marginTop: spacing[1] },
  pocoTag: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  pocoText: { ...typography.micro, color: colors.secondary },
});
