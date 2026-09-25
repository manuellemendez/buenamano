import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, StatusChip, StubBanner } from '../../src/components';
import { LOCAL_THRESHOLD_N, colors, radius, spacing, typography } from '../../src/theme/tokens';

const PROGRESS = 2; // mock N text reviews

export default function LocalStatus() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Local status — per barrio, N=5" />
      <Text style={styles.title}>Tu progreso Local</Text>
      <View style={styles.card}>
        <Text style={styles.barrio}>Granada</Text>
        <StatusChip label="Prueba: En revisión" tone="warning" />
        <Text style={styles.progress}>
          Reseñas con texto: {PROGRESS}/{LOCAL_THRESHOLD_N}
        </Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${(PROGRESS / LOCAL_THRESHOLD_N) * 100}%` }]} />
        </View>
        <Text style={styles.hint}>
          Las estrellas solas no cuentan. Solo trabajos confirmados con texto ≥40 caracteres.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.barrio}>El Peñón</Text>
        <StatusChip label="Sin prueba aún" tone="muted" />
        <Text style={styles.progress}>Reseñas con texto: 0/{LOCAL_THRESHOLD_N}</Text>
      </View>
      <Button label="Enviar prueba de barrio" fullWidth onPress={() => router.push('/(pro)/local-proof')} />
      <Button label="Ver trabajos" variant="secondary" fullWidth onPress={() => router.push('/(pro)/inbox')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[2],
  },
  barrio: { ...typography.title2, color: colors.text },
  progress: { ...typography.callout, color: colors.text },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: { height: 8, backgroundColor: colors.primary },
  hint: { ...typography.caption, color: colors.textMuted },
});
