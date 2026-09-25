import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState, StatusChip, StubBanner } from '../../src/components';
import { listOwnReports, type ReportRow } from '../../src/lib/api';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function AdminReports() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [adminBlocked, setAdminBlocked] = useState(true);

  const load = useCallback(async () => {
    const result = await listOwnReports();
    setRows(result.rows);
    setAdminBlocked(result.adminBlocked);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Cola admin bloqueada por RLS — hace falta policy o Edge de Security" />
      {adminBlocked ? (
        <Text style={styles.note}>
          Solo ves tus propios reportes (reports_select_own). No hay policy admin SELECT. Back-end /
          Security deben añadir política o Edge antes de la cola real.
        </Text>
      ) : null}
      {rows.length === 0 ? (
        <EmptyState
          title="Sin reportes visibles"
          body="Con la RLS actual el admin no puede listar la cola completa."
        />
      ) : (
        rows.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.title}>{r.reason}</Text>
            <Text style={styles.meta}>
              {r.target_type} · {r.target_id.slice(0, 8)}… · {r.created_at.slice(0, 10)}
            </Text>
            <StatusChip label={r.status || 'open'} tone="warning" />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  note: { ...typography.caption, color: colors.textMuted },
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
