import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button, JobStatusStepper, ReportSheet, StubBanner } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function ActiveJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(3); // En curso
  const [reportOpen, setReportOpen] = useState(false);
  const roleHint = 'seeker/pro demo';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label={`Active job ${id} — ${roleHint}`} />
      <Text style={styles.title}>Trabajo aceptado — coordina llegada</Text>
      <JobStatusStepper currentStep={step} nextActor={step < 4 ? 'El maestro marca hecho' : 'Tú confirmas'} />
      {step < 4 ? (
        <Button
          label="Marcar hecho (pro)"
          fullWidth
          onPress={() => setStep(4)}
        />
      ) : null}
      {step === 4 ? (
        <>
          <Text style={styles.body}>El maestro marcó hecho. ¿Confirmas?</Text>
          <Button
            label="Confirmar y dejar reseña"
            fullWidth
            onPress={() => {
              setStep(5);
              router.push('/review/demo');
            }}
          />
        </>
      ) : null}
      <Button label="Reportar" variant="danger" onPress={() => setReportOpen(true)} fullWidth />
      <ReportSheet visible={reportOpen} onClose={() => setReportOpen(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
});
