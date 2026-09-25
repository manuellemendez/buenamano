import { ScrollView, StyleSheet, Text } from 'react-native';
import { ProofUploader, StubBanner } from '../../src/components';
import { LOCAL_THRESHOLD_N, colors, spacing, typography } from '../../src/theme/tokens';

export default function LocalProofFlow() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Local proof flow — stub upload" />
      <Text style={styles.title}>Ganar Local</Text>
      <Text style={styles.body}>
        Para ser Local en Granada necesitas: prueba de barrio + {LOCAL_THRESHOLD_N} trabajos
        terminados con reseña escrita. La cédula no te hace Local. La gente de Granada, sí.
      </Text>
      <ProofUploader barrioLabel="Granada" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
});
