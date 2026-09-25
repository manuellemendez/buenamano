import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { REPORT_REASONS } from '../constants/copy';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { Button } from './Button';
import { TextArea } from './Input';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (payload: { reasonId: string; detail: string }) => void;
};

export function ReportSheet({ visible, onClose, onSubmit }: Props) {
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [detail, setDetail] = useState('');

  function submit() {
    if (!reasonId) return;
    onSubmit?.({ reasonId, detail });
    setReasonId(null);
    setDetail('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Reportar</Text>
          <Text style={styles.sub}>Cuéntanos qué pasó. Revisamos en &lt;24h en smoke.</Text>
          <View style={styles.reasons} accessibilityRole="radiogroup">
            {REPORT_REASONS.map((r) => {
              const on = reasonId === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setReasonId(r.id)}
                  style={[styles.reasonRow, on && styles.reasonRowOn]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={r.label}
                >
                  <View style={[styles.radio, on && styles.radioOn]}>
                    {on ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Text style={[styles.reasonText, on && styles.reasonTextOn]}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <TextArea
            label="Detalle (opcional)"
            value={detail}
            onChangeText={setDetail}
            placeholder="Ej. no llegó a la hora acordada"
          />
          <Button label="Enviar reporte" disabled={!reasonId} onPress={submit} fullWidth />
          <Button label="Cancelar" variant="ghost" onPress={onClose} fullWidth />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceCard,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing[5],
    gap: spacing[3],
    maxHeight: '90%',
  },
  title: { ...typography.title1, color: colors.text },
  sub: { ...typography.caption, color: colors.textMuted },
  reasons: { gap: spacing[2] },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    minHeight: 48,
    width: '100%',
  },
  reasonRowOn: { borderColor: colors.danger, backgroundColor: '#FCE8E7' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.danger },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
  },
  reasonText: { ...typography.body, color: colors.text, flex: 1 },
  reasonTextOn: { color: colors.danger, fontWeight: '600' },
});
