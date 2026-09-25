import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COPY, REVIEW_MIN_CHARS, REVIEW_SCAFFOLDS } from '../constants/copy';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { Button } from './Button';
import { TextArea } from './Input';

type Props = {
  onSubmit?: (payload: { stars: number; text: string; scaffolds: string[] }) => void;
};

export function ReviewScaffolds({ onSubmit }: Props) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const textOk = text.trim().length >= REVIEW_MIN_CHARS;
  const canSubmit = stars > 0 && textOk;

  const helper = useMemo(() => {
    const n = text.trim().length;
    if (n === 0) return `Mínimo ${REVIEW_MIN_CHARS} caracteres. Las estrellas solas no cuentan para Local.`;
    if (!textOk) return `${n}/${REVIEW_MIN_CHARS} — sigue escribiendo`;
    return `${n} caracteres · listo para Local`;
  }, [text, textOk]);

  function toggleScaffold(s: string) {
    setPicked((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.gate}>{COPY.reviewGate}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= stars;
          return (
            <Pressable
              key={n}
              onPress={() => setStars(n)}
              accessibilityRole="button"
              accessibilityLabel={`${n} estrellas`}
              style={[styles.starBtn, on && styles.starBtnOn]}
            >
              <Text style={[styles.star, on && styles.starOn]}>
                {on ? '★' : '☆'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <TextArea
        label="Tu reseña (obligatoria)"
        value={text}
        onChangeText={setText}
        placeholder={COPY.reviewPlaceholder}
        helper={helper}
        error={text.length > 0 && !textOk ? 'Falta un poco más de texto' : undefined}
      />
      <Text style={styles.scaffoldLabel}>Opcional — toca lo que aplique</Text>
      <View style={styles.scaffolds}>
        {REVIEW_SCAFFOLDS.map((s) => {
          const on = picked.includes(s);
          return (
            <Pressable
              key={s}
              onPress={() => toggleScaffold(s)}
              style={[styles.scaffold, on && styles.scaffoldOn]}
            >
              <Text style={[styles.scaffoldText, on && styles.scaffoldTextOn]}>{s}</Text>
            </Pressable>
          );
        })}
      </View>
      <Button
        label="Publicar reseña"
        disabled={!canSubmit}
        fullWidth
        onPress={() => onSubmit?.({ stars, text: text.trim(), scaffolds: picked })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing[3] },
  gate: { ...typography.body, color: colors.textMuted },
  stars: { flexDirection: 'row', gap: spacing[1] },
  starBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtnOn: {
    transform: [{ scale: 1.08 }],
  },
  star: { fontSize: 28, color: colors.border },
  starOn: { color: colors.warning },
  scaffoldLabel: { ...typography.caption, color: colors.textMuted },
  scaffolds: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  scaffold: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scaffoldOn: { borderColor: colors.primary, backgroundColor: '#F3E4DA' },
  scaffoldText: { ...typography.caption, color: colors.text },
  scaffoldTextOn: { color: colors.primary, fontWeight: '600' },
});
