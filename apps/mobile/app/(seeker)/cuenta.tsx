import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button, ReportSheet, StubBanner } from '../../src/components';
import { COPY } from '../../src/constants/copy';
import { getSupabaseStatus } from '../../src/lib/supabase';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function CuentaScreen() {
  const [reportOpen, setReportOpen] = useState(false);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner />
      <Text style={styles.title}>Cuenta</Text>
      <Text style={styles.meta}>Rol: Seeker (demo)</Text>
      <Text style={styles.meta}>
        Backend: {getSupabaseStatus() === 'ready' ? 'Supabase listo' : 'Supabase not configured'}
      </Text>
      <Button label={COPY.terminosDraft} variant="ghost" onPress={() => router.push('/legal/terminos')} />
      <Button label={COPY.privacidadDraft} variant="ghost" onPress={() => router.push('/legal/privacidad')} />
      <Text style={styles.meta}>{COPY.soporte}</Text>
      <Button label="Reportar un problema" variant="danger" onPress={() => setReportOpen(true)} fullWidth />
      <Button label="Volver al inicio" variant="secondary" onPress={() => router.replace('/')} fullWidth />
      <ReportSheet visible={reportOpen} onClose={() => setReportOpen(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  meta: { ...typography.body, color: colors.textMuted },
});
