import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, JobStatusStepper, ReportSheet, StubBanner } from '../../src/components';
import {
  ApiError,
  confirmJob,
  describeEdgeResult,
  getJobParticipantContactsSafe,
  markJobProDone,
  type JobParticipantContact,
} from '../../src/lib/api';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function ActiveJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = typeof id === 'string' ? id : 'demo';
  const [step, setStep] = useState(3); // En curso
  const [reportOpen, setReportOpen] = useState(false);
  const [busy, setBusy] = useState<'pro_done' | 'confirm' | null>(null);
  const [contacts, setContacts] = useState<JobParticipantContact[]>([]);

  const loadContacts = useCallback(async () => {
    const rows = await getJobParticipantContactsSafe(jobId);
    setContacts(rows);
  }, [jobId]);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  async function onProDone() {
    if (busy) return;
    setBusy('pro_done');
    try {
      await markJobProDone(jobId);
      setStep(4);
      Alert.alert('Listo', 'Marcaste el trabajo como hecho (active → pro_done).');
      void loadContacts();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo marcar como hecho.';
      Alert.alert('Error', msg);
      // Demo UX: still advance stepper when backend row missing so UI path is visible
      if (e instanceof ApiError && (e.code === 'not_found' || e.code === 'not_signed_in')) {
        setStep(4);
      }
    } finally {
      setBusy(null);
    }
  }

  async function onConfirm() {
    if (busy) return;
    setBusy('confirm');
    try {
      const result = await confirmJob(jobId);
      setStep(5);
      Alert.alert('Confirmado', describeEdgeResult(result, 'Trabajo confirmado.'), [
        { text: 'Dejar reseña', onPress: () => router.push(`/review/${jobId}`) },
      ]);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo confirmar el trabajo.';
      Alert.alert('Error', msg);
    } finally {
      setBusy(null);
    }
  }

  const contact = contacts[0];
  const phone = contact?.pro_phone ?? contact?.seeker_phone ?? null;
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '57')}`
    : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label={`Job ${jobId} — confirm_job Edge / markJobProDone`} />
      <Text style={styles.title}>Trabajo aceptado — coordina llegada</Text>
      <JobStatusStepper
        currentStep={step}
        nextActor={step < 4 ? 'El maestro marca hecho' : 'Tú confirmas'}
      />

      {contact ? (
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contacto (RPC)</Text>
          {contact.pro_display_name ? (
            <Text style={styles.contactLine}>Pro: {contact.pro_display_name}</Text>
          ) : null}
          {contact.seeker_display_name ? (
            <Text style={styles.contactLine}>Cliente: {contact.seeker_display_name}</Text>
          ) : null}
          {phone ? (
            <>
              <Text style={styles.contactLine}>Tel: {phone}</Text>
              <Button
                label="Llamar"
                variant="secondary"
                onPress={() => void Linking.openURL(`tel:${phone}`)}
                style={{ marginTop: 8 }}
              />
              {whatsappUrl ? (
                <Button
                  label="WhatsApp"
                  variant="secondary"
                  onPress={() => void Linking.openURL(whatsappUrl)}
                  style={{ marginTop: 8 }}
                />
              ) : null}
            </>
          ) : (
            <Text style={styles.contactMuted}>Sin teléfono disponible aún.</Text>
          )}
          {contact.exact_address ? (
            <Text style={styles.contactLine}>Dir: {contact.exact_address}</Text>
          ) : null}
          {contact.gate_notes ? (
            <Text style={styles.contactLine}>Notas: {contact.gate_notes}</Text>
          ) : null}
        </View>
      ) : (
        <Text style={styles.contactMuted}>
          Contactos vía get_job_participant_contacts — vacío si no hay sesión o el job no existe.
        </Text>
      )}

      {step < 4 ? (
        <Button
          label="Marcar hecho (pro)"
          fullWidth
          loading={busy === 'pro_done'}
          onPress={() => void onProDone()}
        />
      ) : null}
      {step === 4 ? (
        <>
          <Text style={styles.body}>El maestro marcó hecho. ¿Confirmas?</Text>
          <Button
            label="Confirmar y dejar reseña"
            fullWidth
            loading={busy === 'confirm'}
            onPress={() => void onConfirm()}
          />
        </>
      ) : null}
      <Button label="Reportar" variant="danger" onPress={() => setReportOpen(true)} fullWidth />
      <ReportSheet
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="job"
        targetId={jobId}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  contactCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    gap: spacing[1],
  },
  contactTitle: { ...typography.bodyStrong, color: colors.text },
  contactLine: { ...typography.caption, color: colors.text },
  contactMuted: { ...typography.caption, color: colors.textMuted },
});
