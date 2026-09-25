import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, EmptyState, StatusChip, StubBanner } from '../../src/components';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function TrabajosScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner />
      <View style={styles.card}>
        <Text style={styles.title}>Fuga en el baño</Text>
        <StatusChip label="Cotizaciones" tone="warning" />
        <Text style={styles.meta}>Plomería · Granada · hace 2 h</Text>
        <Button label="Ver cotizaciones" onPress={() => router.push('/quotes')} style={{ marginTop: 8 }} />
        <Button label="Ver trabajo activo" variant="secondary" onPress={() => router.push('/job/demo')} style={{ marginTop: 8 }} />
      </View>
      <EmptyState
        title="Todavía no hay más trabajos"
        body="Cuando pidas un oficio, aparece acá."
        ctaLabel="Pedir oficio"
        onCta={() => router.push('/request')}
        icon="construct-outline"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
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
