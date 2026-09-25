import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Input } from '../../src/components';
import { BARRIOS } from '../../src/constants/barrios';
import { OFICIOS } from '../../src/constants/oficios';
import { ApiError } from '../../src/lib/api';
import { roleHomePath, useAuth } from '../../src/lib/auth';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function OnboardingPro() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [oficios, setOficios] = useState<string[]>([]);
  const [barrios, setBarrios] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  const formReady =
    email.trim().includes('@') &&
    password.length >= 6 &&
    displayName.trim().length >= 2 &&
    oficios.length > 0 &&
    barrios.length > 0;

  async function onSubmit() {
    if (!formReady) return;
    setBusy(true);
    try {
      const result = await signUp({
        email,
        password,
        role: 'pro',
        displayName,
        homeBarrioId: barrios[0],
        oficioSlugs: oficios,
        barrioSlugs: barrios,
      });
      if (result.needsEmailConfirm) {
        Alert.alert(
          'Confirma tu correo',
          'Supabase pide confirmar el email antes de entrar. Manuel: desactiva “Confirm email” en Auth para smoke local.',
        );
        return;
      }
      router.replace(roleHomePath('pro') as never);
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
      <Text style={styles.title}>Crea tu perfil pro</Text>
      <Input
        label="Nombre"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Carlos Restrepo"
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
      <Text style={styles.title}>¿Qué oficios haces?</Text>
      <View style={styles.chips}>
        {OFICIOS.map((o) => (
          <Chip
            key={o.id}
            label={o.label}
            selected={oficios.includes(o.id)}
            onPress={() => toggle(oficios, o.id, setOficios)}
          />
        ))}
      </View>
      <Text style={styles.title}>¿En qué barrios cubres?</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip
            key={b.id}
            label={b.label}
            selected={barrios.includes(b.id)}
            onPress={() => toggle(barrios, b.id, setBarrios)}
          />
        ))}
      </View>
      <Button
        label="Crear perfil"
        disabled={!formReady}
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
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
