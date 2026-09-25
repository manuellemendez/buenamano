import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COPY } from '../constants/copy';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Props = {
  barrio: string;
  /**
   * When false, render a non-button pill (for use inside an outer Pressable / card).
   * Avoids web `<button> cannot contain a nested button`.
   */
  interactive?: boolean;
};

/** Pill: pin + `Local · {barrio}` — tap opens fairness sheet when interactive */
export function LocalBadge({ barrio, interactive = true }: Props) {
  const [open, setOpen] = useState(false);
  const label = `Local · ${barrio}`;

  const pill = (
    <>
      <Text style={styles.icon}>⌂</Text>
      <Text style={styles.label}>{label}</Text>
    </>
  );

  return (
    <>
      {interactive ? (
        <Pressable
          onPress={() => setOpen(true)}
          style={styles.pill}
          accessibilityRole="button"
          accessibilityLabel={`Local en ${barrio}. Ver explicación.`}
        >
          {pill}
        </Pressable>
      ) : (
        <View
          style={styles.pill}
          accessibilityRole="text"
          accessibilityLabel={`Local en ${barrio}`}
        >
          {pill}
        </View>
      )}
      {interactive ? (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <Text style={styles.sheetBody}>{COPY.localSheet}</Text>
              <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>Entendido</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.local,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  icon: { color: colors.localInk, fontSize: 11 },
  label: { ...typography.micro, color: colors.localInk, letterSpacing: 0.3 },
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
  },
  sheetTitle: { ...typography.title2, color: colors.text },
  sheetBody: { ...typography.body, color: colors.textMuted },
  closeBtn: {
    marginTop: spacing[2],
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    padding: spacing[3],
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  closeText: { ...typography.bodyStrong, color: colors.textOnPrimary },
});
