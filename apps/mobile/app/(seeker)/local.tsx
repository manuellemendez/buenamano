import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button, EmptyState, StubBanner } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function LocalTabSeeker() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Pestaña Local (seeker) — explicación + atajos" />
      <Text style={styles.title}>Qué es Local</Text>
      <Text style={styles.body}>
        Local significa que el maestro probó el barrio y tiene reseñas con texto de vecinos de acá.
        No se compra. Las estrellas solas no cuentan.
      </Text>
      <Button label="Pedir oficio" fullWidth onPress={() => router.push('/request')} />
      <EmptyState
        title="Todavía no hay plomeros Local en El Peñón — invita a uno"
        ctaLabel="Ver Descubre"
        onCta={() => router.push('/(seeker)/descubre')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
});
