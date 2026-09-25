import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Input } from '../../src/components';
import { BARRIOS } from '../../src/constants/barrios';
import { barrioUuid } from '../../src/constants/ids';
import { COPY } from '../../src/constants/copy';
import { ApiError } from '../../src/lib/api';
import { roleHomePath, useAuth } from '../../src/lib/auth';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function OnboardingSeeker() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [barrio, setBarrio] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ready =
    email.trim().includes('@') &&
    password.length >= 6 &&
    displayName.trim().length >= 2 &&
    !!barrio;

  async function onSubmit() {
    if (!barrio || !ready) return;
    setBusy(true);
    try {
      const result = await signUp({
        email,
        password,
        role: 'seeker',
        displayName,
        homeBarrioId: barrioUuid(barrio),
        barrioSlugs: [barrio],
      });
      if (result.needsEmailConfirm) {
        Alert.alert(
          'Confirma tu correo',
          'Supabase pide confirmar el email antes de entrar. Manuel: desactiva “Confirm email” en Auth para smoke local, o confirma desde el correo.',
        );
        return;
      }
      router.replace(roleHomePath('seeker') as never);
    } catch (e) {
      Alert.alert('Error', e instanceof ApiError ? e.message : 'No se pudo registrar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Crea tu cuenta (hogar)</Text>
      <Text style={styles.body}>{COPY.onboardingBarrios}</Text>
      <Input
        label="Nombre"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Ana López"
      />
      <Input
        label="Correo"
        value={email}
        onChangeText={setEmail}
        placeholder="tu@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="mín. 6 caracteres"
        secureTextEntry
        autoCapitalize="none"
      />
      <Text style={styles.label}>¿En qué barrio estás?</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip
            key={b.id}
            label={b.label}
            selected={barrio === b.id}
            onPress={() => setBarrio(b.id)}
          />
        ))}
      </View>
      <Button
        label="Crear cuenta y ver Descubre"
        disabled={!ready}
        loading={busy}
        fullWidth
        onPress={() => void onSubmit()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  label: { ...typography.bodyStrong, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: spacing[2] },
});
