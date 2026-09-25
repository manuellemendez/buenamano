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

const THUMB_TINTS = ['#E8D0C0', '#E8DFC8', '#D4E4DE', '#DDD6CE', '#F3E4DA'] as const;

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
        <Text style={styles.check}>{slots >= 1 ? '☑' : '☐'} Recibo / arriendo en el barrio</Text>
        <Text style={styles.check}>{slots >= 2 ? '☑' : '☐'} Foto del lugar de trabajo</Text>
        <Text style={styles.check}>{slots >= 3 ? '☑' : '☐'} (Alt.) dos vouchers de vecinos</Text>
      </View>
      {slots > 0 ? (
        <View style={styles.thumbs} accessibilityLabel={`${slots} fotos listas`}>
          {Array.from({ length: slots }, (_, i) => (
            <View
              key={i}
              style={[styles.thumb, { backgroundColor: THUMB_TINTS[i % THUMB_TINTS.length] }]}
            >
              <Text style={styles.thumbLabel}>Foto {i + 1}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Button
        label={slots === 0 ? 'Agregar foto (stub)' : `Agregar otra · ${slots} listas`}
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
  thumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbLabel: { ...typography.micro, color: colors.textMuted },
  reject: { gap: spacing[2] },
  reason: { ...typography.caption, color: colors.danger },
});
