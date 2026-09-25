import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { barrioLabel } from '../constants/barrios';
import { COPY } from '../constants/copy';
import type { MockQuote } from '../data/mock';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { Button } from './Button';
import { LocalBadge } from './LocalBadge';

type Props = {
  quotes: MockQuote[];
  onAccept?: (quoteId: string) => void;
};

export function QuoteCompare({ quotes, onAccept }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.legend}>
        <Text style={styles.legendText}>{COPY.quoteSortLegend}</Text>
      </View>
      {quotes.map((q) => (
        <View key={q.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.name}>{q.proName}</Text>
            {q.local ? <LocalBadge barrio={barrioLabel(q.barrio)} /> : null}
          </View>
          <Text style={styles.price}>
            {q.priceLabel} · puede ir {q.eta}
          </Text>
          <Text style={styles.note}>{q.note}</Text>
          <Button
            label={`Aceptar a ${q.proName.split(' ')[0]}`}
            onPress={() => onAccept?.(q.id)}
            fullWidth
            style={{ marginTop: spacing[2] }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing[3] },
  legend: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    padding: spacing[3],
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  legendText: { ...typography.caption, color: colors.secondary, fontWeight: '600' },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[2],
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' },
  name: { ...typography.title2, color: colors.text },
  price: { ...typography.callout, color: colors.text },
  note: { ...typography.body, color: colors.textMuted },
});
