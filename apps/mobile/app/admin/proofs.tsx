import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {r.pro}
              <Text style={styles.metaInline}> · {r.barrio}</Text>
            </Text>
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
          </View>
          <View style={styles.actions}>
            {r.status === 'en_revision' ? (
              <>
                <Button
                  label="Aprobar"
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
                  style={styles.actionBtn}
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
                  style={styles.actionBtn}
                />
              </>
            ) : null}
            <Button
              label="Ocultar"
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
              style={styles.actionBtn}
            />
            <Pressable
              accessibilityRole="button"
              disabled={busyKey === `ban-${r.id}`}
              onPress={() =>
                void run(
                  `ban-${r.id}`,
                  () => adminBan(r.proUserId, true),
                  undefined,
                  'Banear',
                  `Usuario baneado: ${r.pro}`,
                )
              }
              style={({ pressed }) => [
                styles.banBtn,
                pressed && styles.banPressed,
                busyKey === `ban-${r.id}` && styles.banDisabled,
              ]}
            >
              <Text style={styles.banText}>
                {busyKey === `ban-${r.id}` ? '…' : 'Banear'}
              </Text>
            </Pressable>
          </View>
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
    gap: spacing[3],
  },
  header: { gap: spacing[2] },
  title: { ...typography.title2, color: colors.text },
  metaInline: { ...typography.caption, color: colors.textMuted, fontWeight: '400' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  actionBtn: {
    flexGrow: 1,
    flexBasis: '46%',
    minHeight: 44,
  },
  banBtn: {
    flexGrow: 1,
    flexBasis: '46%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.sm,
  },
  banPressed: { backgroundColor: colors.surfaceMuted },
  banDisabled: { opacity: 0.45 },
  banText: { ...typography.bodyStrong, color: colors.danger },
});
