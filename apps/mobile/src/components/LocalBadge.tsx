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
};

/** Pill: pin + `Local · {barrio}` — tap opens fairness sheet */
export function LocalBadge({ barrio }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.pill}
        accessibilityRole="button"
        accessibilityLabel={`Local en ${barrio}. Ver explicación.`}
      >
        <Text style={styles.icon}>⌂</Text>
        <Text style={styles.label}>{`Local · ${barrio}`}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{`Local · ${barrio}`}</Text>
            <Text style={styles.sheetBody}>{COPY.localSheet}</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Entendido</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
