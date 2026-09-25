import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Button, ReportSheet } from '../../src/components';
import { COPY } from '../../src/constants/copy';
import { useAuth } from '../../src/lib/auth';
import { getSupabaseStatus } from '../../src/lib/supabase';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function CuentaScreen() {
  const { profile, user, signOut } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.meta}>Correo: {user?.email ?? '—'}</Text>
      <Text style={styles.meta}>Rol: {profile?.role ?? 'sin perfil'}</Text>
      <Text style={styles.meta}>Nombre: {profile?.display_name ?? '—'}</Text>
      <Text style={styles.meta}>
        Backend: {getSupabaseStatus() === 'ready' ? 'Supabase listo' : 'Supabase not configured'}
      </Text>
      <Button
        label={COPY.terminosDraft}
        variant="ghost"
        onPress={() => router.push('/legal/terminos')}
      />
      <Button
        label={COPY.privacidadDraft}
        variant="ghost"
        onPress={() => router.push('/legal/privacidad')}
      />
      <Text style={styles.meta}>{COPY.soporte}</Text>
      <Button
        label="Reportar un problema"
        variant="danger"
        onPress={() => {
          if (!profile?.id) {
            Alert.alert('Sesión', 'Inicia sesión para reportar.');
            return;
          }
          setReportOpen(true);
        }}
        fullWidth
      />
      <Button
        label="Cerrar sesión"
        variant="secondary"
        onPress={() => {
          void signOut().then(() => router.replace('/'));
        }}
        fullWidth
      />
      <Button label="Volver al inicio" variant="ghost" onPress={() => router.replace('/')} fullWidth />
      {profile?.id ? (
        <ReportSheet
          visible={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="profile"
          targetId={profile.id}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  meta: { ...typography.body, color: colors.textMuted },
});
