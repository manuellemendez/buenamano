import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JOB_STEPS } from '../constants/copy';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Props = {
  /** 0-based index into JOB_STEPS */
  currentStep: number;
  nextActor?: string;
};

export function JobStatusStepper({ currentStep, nextActor }: Props) {
  return (
    <View style={styles.wrap}>
      {JOB_STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <View key={label} style={styles.stepRow}>
            <View
              style={[
                styles.dot,
                done && styles.dotDone,
                active && styles.dotActive,
              ]}
            >
              <Text style={styles.dotText}>{done ? '✓' : i + 1}</Text>
            </View>
            <Text
              style={[
                styles.label,
                (done || active) && styles.labelActive,
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
      {nextActor ? (
        <Text style={styles.next}>Siguiente: {nextActor}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing[2] },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  dot: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { ...typography.micro, color: colors.text },
  label: { ...typography.body, color: colors.textMuted },
  labelActive: { color: colors.text, fontWeight: '600' },
  next: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing[2],
  },
});
