import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, EmptyState, StatusChip, StubBanner } from '../../src/components';
import {
  ApiError,
  adminTriageReport,
  describeEdgeResult,
  listAdminReports,
  type ReportRow,
  type ReportTriageStatus,
} from '../../src/lib/api';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

const FILTERS: { label: string; status: string | null }[] = [
  { label: 'Todos', status: null },
  { label: 'Abiertos', status: 'open' },
  { label: 'Triados', status: 'triaged' },
  { label: 'Cerrados', status: 'closed' },
];

function toneFor(status: string): 'warning' | 'success' | 'danger' | 'muted' {
  if (status === 'open') return 'warning';
  if (status === 'triaged') return 'muted';
  if (status === 'closed') return 'success';
  return 'muted';
}

export default function AdminReports() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [filter, setFilter] = useState<string | null>('open');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminReports({ status: filter, limit: 50, offset: 0 });
      setRows(data);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Error al cargar reportes';
      setError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function triage(id: string, status: ReportTriageStatus) {
    setBusyId(id);
    try {
      const res = await adminTriageReport(id, status);
      Alert.alert('Listo', describeEdgeResult(res, `Reporte marcado como ${status}`));
      await load();
    } catch (e) {
      Alert.alert('Error', e instanceof ApiError ? e.message : 'No se pudo actualizar');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {__DEV__ ? (
        <StubBanner label="list_admin_reports RPC + admin_triage_report Edge" />
      ) : null}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Button
            key={f.label}
            label={f.label}
            variant={filter === f.status ? 'primary' : 'secondary'}
            onPress={() => setFilter(f.status)}
          />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <Text style={styles.meta}>Cargando…</Text> : null}
      {!loading && rows.length === 0 ? (
        <EmptyState
          title="Sin reportes"
          body={
            filter
              ? `No hay reportes en estado “${filter}”.`
              : 'La cola admin está vacía por ahora.'
          }
        />
      ) : null}
      {rows.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.title}>{r.reason}</Text>
          <Text style={styles.meta}>
            {r.target_type} · {r.target_id.slice(0, 8)}… · {r.created_at.slice(0, 10)}
          </Text>
          {r.reporter_id ? (
            <Text style={styles.meta}>Reporter · {r.reporter_id.slice(0, 8)}…</Text>
          ) : null}
          <StatusChip label={r.status || 'open'} tone={toneFor(r.status)} />
          <View style={styles.actions}>
            <Button
              label="Triar"
              variant="secondary"
              disabled={busyId === r.id || r.status === 'triaged'}
              onPress={() => void triage(r.id, 'triaged')}
            />
            <Button
              label="Cerrar"
              disabled={busyId === r.id || r.status === 'closed'}
              onPress={() => void triage(r.id, 'closed')}
            />
            <Button
              label="Reabrir"
              variant="ghost"
              disabled={busyId === r.id || r.status === 'open'}
              onPress={() => void triage(r.id, 'open')}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  error: { ...typography.caption, color: colors.danger },
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[1] },
});
