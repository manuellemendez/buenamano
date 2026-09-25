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
      <View
        style={styles.row}
        accessibilityRole="progressbar"
        accessibilityLabel={`Paso ${currentStep + 1} de ${JOB_STEPS.length}: ${JOB_STEPS[currentStep] ?? ''}`}
      >
        {JOB_STEPS.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          const state = active ? 'actual' : done ? 'completado' : 'pendiente';
          return (
            <View
              key={label}
              style={styles.segmentCol}
              accessible
              accessibilityLabel={`${label}, ${state}`}
            >
              <View
                style={[
                  styles.segment,
                  done && styles.segmentDone,
                  active && styles.segmentActive,
                ]}
              />
              <Text
                style={[
                  styles.label,
                  done && styles.labelDone,
                  active && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
      {nextActor ? (
        <Text style={styles.next}>Siguiente: {nextActor}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing[2] },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[1],
  },
  segmentCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  segment: {
    alignSelf: 'stretch',
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentDone: {
    backgroundColor: '#E8C4B0',
    borderColor: '#E8C4B0',
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.micro,
    color: colors.textMuted,
    textAlign: 'center',
  },
  labelDone: { color: colors.textMuted },
  labelActive: { color: colors.primary, fontWeight: '700' },
  next: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing[1],
  },
});
