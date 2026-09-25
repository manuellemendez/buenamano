import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ApiError, submitBarrioProofs } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { Button } from './Button';
import { StatusChip } from './StatusChip';

export type ProofStatus = 'idle' | 'en_revision' | 'aprobado' | 'rechazado';

type Props = {
  barrioLabel: string;
  /** UUID or slug — required for live insert */
  barrioId: string;
  initialStatus?: ProofStatus;
  rejectReason?: string;
  onSubmit?: () => void;
};

const THUMB_TINTS = ['#E8D0C0', '#E8DFC8', '#D4E4DE', '#DDD6CE', '#F3E4DA'] as const;

export function ProofUploader({
  barrioLabel,
  barrioId,
  initialStatus = 'idle',
  rejectReason,
  onSubmit,
}: Props) {
  const [status, setStatus] = useState<ProofStatus>(initialStatus);
  const [slots, setSlots] = useState(0);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (slots < 1 || busy) return;
    setBusy(true);
    try {
      // Slot placeholders → tiny JPEG smoke uploads (picker optional later)
      await submitBarrioProofs({ barrioId, slotCount: slots });
      setStatus('en_revision');
      onSubmit?.();
      Alert.alert('Enviado', 'Prueba en revisión. Te avisamos por push.');
    } catch (e) {
      Alert.alert('Error', e instanceof ApiError ? e.message : 'No se pudo enviar la prueba.');
    } finally {
      setBusy(false);
    }
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
        <View
          style={styles.thumbs}
          accessibilityLabel={`${slots} foto${slots === 1 ? '' : 's'} lista${slots === 1 ? '' : 's'}`}
        >
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
        label={
          slots === 0
            ? 'Agregar foto'
            : `Agregar otra · ${slots} lista${slots === 1 ? '' : 's'}`
        }
        variant="secondary"
        onPress={() => setSlots((n) => n + 1)}
        fullWidth
      />
      {status === 'idle' ? (
        <Button
          label="Enviar prueba"
          disabled={slots < 1}
          loading={busy}
          onPress={() => void submit()}
          fullWidth
        />
      ) : null}
      {status === 'en_revision' ? (
        <StatusChip label="En revisión — te avisamos por push" tone="warning" />
      ) : null}
      {status === 'aprobado' ? <StatusChip label="Aprobado" tone="success" /> : null}
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
