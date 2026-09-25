import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { Button } from './Button';
import { StatusChip } from './StatusChip';

export type ProofStatus = 'idle' | 'en_revision' | 'aprobado' | 'rechazado';

type Props = {
  barrioLabel: string;
  initialStatus?: ProofStatus;
  rejectReason?: string;
  onSubmit?: () => void;
};

export function ProofUploader({
  barrioLabel,
  initialStatus = 'idle',
  rejectReason,
  onSubmit,
}: Props) {
  const [status, setStatus] = useState<ProofStatus>(initialStatus);
  const [slots, setSlots] = useState(0);

  function submit() {
    setStatus('en_revision');
    onSubmit?.();
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Prueba de barrio — {barrioLabel}</Text>
      <Text style={styles.body}>
        Sube al menos una prueba: recibo de servicios / arriendo / foto de sitio de trabajo en el
        barrio. La cédula sola no te hace Local.
      </Text>
      <View style={styles.checklist}>
        <Text style={styles.check}>☐ Recibo / arriendo en el barrio</Text>
        <Text style={styles.check}>☐ Foto del lugar de trabajo</Text>
        <Text style={styles.check}>☐ (Alt.) dos vouchers de vecinos</Text>
      </View>
      <Button
        label={slots === 0 ? 'Agregar foto (stub)' : `Fotos listas: ${slots}`}
        variant="secondary"
        onPress={() => setSlots((n) => n + 1)}
        fullWidth
      />
      {status === 'idle' ? (
        <Button
          label="Enviar prueba"
          disabled={slots < 1}
          onPress={submit}
          fullWidth
        />
      ) : null}
      {status === 'en_revision' ? (
        <StatusChip label="En revisión — te avisamos por push" tone="warning" />
      ) : null}
      {status === 'aprobado' ? (
        <StatusChip label="Aprobado" tone="success" />
      ) : null}
      {status === 'rechazado' ? (
        <View style={styles.reject}>
          <StatusChip label="Rechazado" tone="danger" />
          <Text style={styles.reason}>
            Razón: {rejectReason ?? 'Documento no legible / barrio no coincide'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[3],
  },
  title: { ...typography.title2, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  checklist: { gap: spacing[1] },
  check: { ...typography.body, color: colors.text },
  reject: { gap: spacing[2] },
  reason: { ...typography.caption, color: colors.danger },
});
