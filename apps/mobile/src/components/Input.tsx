import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  multiline,
  numberOfLines = 1,
  editable = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        style={[
          styles.input,
          multiline && { minHeight: 96, textAlignVertical: 'top' },
          error ? styles.inputError : null,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

export function TextArea(props: Omit<Props, 'multiline'>) {
  return <Input {...props} multiline numberOfLines={4} />;
}

const styles = StyleSheet.create({
  wrap: { gap: spacing[1], marginBottom: spacing[3] },
  label: { ...typography.caption, color: colors.text, fontWeight: '600' },
  input: {
    ...typography.body,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    color: colors.text,
    minHeight: 44,
  },
  inputError: { borderColor: colors.danger },
  helper: { ...typography.caption, color: colors.textMuted },
  error: { ...typography.caption, color: colors.danger },
});
