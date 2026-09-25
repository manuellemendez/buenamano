import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, StatusChip, StubBanner } from '../../src/components';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

type Row = {
  id: string;
  pro: string;
  barrio: string;
  status: 'en_revision' | 'aprobado' | 'rechazado';
  reason?: string;
};

const INITIAL: Row[] = [
  { id: '1', pro: 'Diego Quintero', barrio: 'El Peñón', status: 'en_revision' },
  { id: '2', pro: 'María Fernanda Soto', barrio: 'San Fernando', status: 'en_revision' },
];

export default function AdminProofs() {
  const [rows, setRows] = useState(INITIAL);

  function setStatus(id: string, status: Row['status'], reason?: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status, reason } : r)));
    Alert.alert('Admin (stub)', `${status}${reason ? `: ${reason}` : ''}`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="approve_proof / reject_proof edge stubs" />
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
              <Button label="Aprobar Local" onPress={() => setStatus(r.id, 'aprobado')} style={{ marginTop: 8 }} />
              <Button
                label="Rechazar"
                variant="danger"
                onPress={() => setStatus(r.id, 'rechazado', 'Documento no legible')}
                style={{ marginTop: 8 }}
              />
            </>
          ) : null}
          <Button
            label="Ocultar listing (stub)"
            variant="secondary"
            onPress={() => Alert.alert('admin_hide', r.pro)}
            style={{ marginTop: 8 }}
          />
          <Button
            label="Banear usuario (stub)"
            variant="ghost"
            onPress={() => Alert.alert('admin_ban', r.pro)}
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
