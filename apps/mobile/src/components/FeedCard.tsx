import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { barrioLabel } from '../constants/barrios';
import { COPY } from '../constants/copy';
import { oficioLabel } from '../constants/oficios';
import type { MockPro } from '../data/mock';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { LocalBadge } from './LocalBadge';

type Props = {
  pro: MockPro;
  onPress?: () => void;
};

/** Descubre card — NO patrocinado slot */
export function FeedCard({ pro, onPress }: Props) {
  const oficios = pro.oficios.map(oficioLabel).join(' · ');
  const barrio = barrioLabel(pro.barrio);
  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
      <View style={styles.photo}>
        <Text style={styles.photoInitial}>{pro.name.charAt(0)}</Text>
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
        <Text style={styles.meta}>{oficios}</Text>
        <Text style={styles.meta}>{barrio}</Text>
        <View style={styles.badges}>
          {pro.local ? (
            <LocalBadge barrio={barrio} />
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
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitial: { ...typography.title2, color: colors.primary },
  body: { flex: 1, gap: 2 },
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
