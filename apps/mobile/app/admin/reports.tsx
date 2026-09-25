import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusChip, StubBanner } from '../../src/components';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

const REPORTS = [
  { id: 'r1', reason: 'No llegó', target: 'Trabajo demo', when: 'hoy 10:12' },
  { id: 'r2', reason: 'Cobro distinto', target: 'Carlos Restrepo', when: 'ayer' },
];

export default function AdminReports() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="View reports — stub queue" />
      {REPORTS.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.title}>{r.reason}</Text>
          <Text style={styles.meta}>{r.target} · {r.when}</Text>
          <StatusChip label="Abierto" tone="warning" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[2],
  },
  title: { ...typography.title2, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
});
