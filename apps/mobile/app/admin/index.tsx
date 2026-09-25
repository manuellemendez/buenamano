import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button, StubBanner } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme/tokens';

/** Simple admin hub — works on Expo web */
export default function AdminHome() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Admin web P0 stubs — wire to edge functions later" />
      <Text style={styles.body}>
        Aprobar/rechazar Local, ocultar listings, banear, ver reportes. Sin pay-to-rank tools.
      </Text>
      <Button label="Pruebas Local" fullWidth onPress={() => router.push('/admin/proofs')} />
      <Button label="Reportes" variant="secondary" fullWidth onPress={() => router.push('/admin/reports')} />
      <Button label="Volver" variant="ghost" fullWidth onPress={() => router.replace('/')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  body: { ...typography.body, color: colors.textMuted },
});
