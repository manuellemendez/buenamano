import { ScrollView, StyleSheet, Text } from 'react-native';
import { ProofUploader } from '../../src/components';
import { DEFAULT_BARRIO_UUID } from '../../src/constants/ids';
import { useAuth } from '../../src/lib/auth';
import { LOCAL_THRESHOLD_N, colors, spacing, typography } from '../../src/theme/tokens';

export default function LocalProofFlow() {
  const { profile } = useAuth();
  const barrioId = profile?.home_barrio_id ?? DEFAULT_BARRIO_UUID;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ganar Local</Text>
      <Text style={styles.body}>
        Para ser Local en Granada necesitas: prueba de barrio + {LOCAL_THRESHOLD_N} trabajos
        terminados con reseña escrita. La cédula no te hace Local. La gente de Granada, sí.
      </Text>
      <ProofUploader barrioLabel="Granada" barrioId={barrioId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
});
