import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, StatusChip, StubBanner } from '../../src/components';
import {
  adminBan,
  adminHide,
  ApiError,
  approveProof,
  describeEdgeResult,
  rejectProof,
} from '../../src/lib/api';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

type Row = {
  id: string;
  pro: string;
  /** Demo stand-in for pro/user uuid — live Edge needs real ids */
  proUserId: string;
  barrio: string;
  status: 'en_revision' | 'aprobado' | 'rechazado';
  reason?: string;
};

const INITIAL: Row[] = [
  {
    id: '1',
    pro: 'Diego Quintero',
    proUserId: '00000000-0000-4000-8000-000000000001',
    barrio: 'El Peñón',
    status: 'en_revision',
  },
  {
    id: '2',
    pro: 'María Fernanda Soto',
    proUserId: '00000000-0000-4000-8000-000000000002',
    barrio: 'San Fernando',
    status: 'en_revision',
  },
];

export default function AdminProofs() {
  const [rows, setRows] = useState(INITIAL);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function run(
    key: string,
    action: () => Promise<{ stub?: boolean; message?: string; error?: string }>,
    onOk?: () => void,
    okTitle = 'Admin',
    okFallback = 'Listo.',
  ) {
    if (busyKey) return;
    setBusyKey(key);
    try {
      const result = await action();
      onOk?.();
      Alert.alert(okTitle, describeEdgeResult(result, okFallback));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo completar la acción.';
      Alert.alert('Error', msg);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="approve_proof / reject_proof / admin_hide / admin_ban Edge" />
      {rows.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.title}>{r.pro}</Text>
          <Text style={styles.meta}>Barrio: {r.barrio}</Text>
          <StatusChip
            label={
              r.status === 'en_revision'
                ? 'En revisión'
                : r.status === 'aprobado'
                  ? 'Aprobado'
                  : `Rechazado${r.reason ? ` — ${r.reason}` : ''}`
            }
            tone={r.status === 'aprobado' ? 'success' : r.status === 'rechazado' ? 'danger' : 'warning'}
          />
          {r.status === 'en_revision' ? (
            <>
              <Button
                label="Aprobar Local"
                loading={busyKey === `approve-${r.id}`}
                onPress={() =>
                  void run(
                    `approve-${r.id}`,
                    () => approveProof(r.id),
                    () =>
                      setRows((prev) =>
                        prev.map((row) => (row.id === r.id ? { ...row, status: 'aprobado' } : row)),
                      ),
                    'Aprobar',
                    'Prueba Local aprobada.',
                  )
                }
                style={{ marginTop: 8 }}
              />
              <Button
                label="Rechazar"
                variant="danger"
                loading={busyKey === `reject-${r.id}`}
                onPress={() => {
                  const reason = 'Documento no legible';
                  void run(
                    `reject-${r.id}`,
                    () => rejectProof(r.id, reason),
                    () =>
                      setRows((prev) =>
                        prev.map((row) =>
                          row.id === r.id ? { ...row, status: 'rechazado', reason } : row,
                        ),
                      ),
                    'Rechazar',
                    `Rechazado: ${reason}`,
                  );
                }}
                style={{ marginTop: 8 }}
              />
            </>
          ) : null}
          <Button
            label="Ocultar listing"
            variant="secondary"
            loading={busyKey === `hide-${r.id}`}
            onPress={() =>
              void run(
                `hide-${r.id}`,
                () => adminHide(r.proUserId, true),
                undefined,
                'Ocultar',
                `Listing oculto: ${r.pro}`,
              )
            }
            style={{ marginTop: 8 }}
          />
          <Button
            label="Banear usuario"
            variant="ghost"
            loading={busyKey === `ban-${r.id}`}
            onPress={() =>
              void run(
                `ban-${r.id}`,
                () => adminBan(r.proUserId, true),
                undefined,
                'Banear',
                `Usuario baneado: ${r.pro}`,
              )
            }
          />
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
