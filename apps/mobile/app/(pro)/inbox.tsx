import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, EmptyState, StatusChip, StubBanner } from '../../src/components';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function ProInbox() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Pro requests inbox — stub" />
      <View style={styles.card}>
        <Text style={styles.title}>Fuga en el baño</Text>
        <StatusChip label="Nueva solicitud" tone="warning" />
        <Text style={styles.meta}>Granada · Urgente (hoy) · hace 1 h</Text>
        <Text style={styles.body}>Se dañó el flexible de la ducha. Hay foto.</Text>
        <Button label="Enviar cotización" onPress={() => router.push('/(pro)/quote-compose')} style={{ marginTop: 8 }} />
        <Button label="Ver trabajo activo" variant="secondary" onPress={() => router.push('/job/demo')} style={{ marginTop: 8 }} />
      </View>
      <EmptyState title="Sin más solicitudes" body="Cuando un hogar pida tu oficio en tus barrios, aparece acá." />
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
  body: { ...typography.body, color: colors.text },
});
