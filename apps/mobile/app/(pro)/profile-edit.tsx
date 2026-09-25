import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Input, TextArea } from '../../src/components';
import { BARRIOS } from '../../src/constants/barrios';
import { OFICIOS } from '../../src/constants/oficios';
import { ApiError, updateOwnProfile } from '../../src/lib/api';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function ProfileEdit() {
  const { profile, refreshProfile, signOut } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState('');
  const [oficios, setOficios] = useState<string[]>(['plomeria']);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name ?? '');
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function onSave() {
    setBusy(true);
    try {
      const rateHint = rate.trim() ? Number(rate.replace(/\D/g, '')) : null;
      await updateOwnProfile({
        displayName: name,
        phone,
        bio,
        rateHintCop: Number.isFinite(rateHint as number) ? (rateHint as number) : null,
        oficioSlugs: oficios,
      });
      await refreshProfile();
      Alert.alert('Guardado', 'Perfil actualizado.');
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof ApiError ? e.message : 'No se pudo guardar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Editar perfil</Text>
      {profile ? (
        <Text style={styles.meta}>
          {profile.role} · {profile.id.slice(0, 8)}…
        </Text>
      ) : null}
      <Input label="Nombre" value={name} onChangeText={setName} />
      <Input label="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextArea label="Bio corta" value={bio} onChangeText={setBio} />
      <Input label="Precio desde (COP)" value={rate} onChangeText={setRate} keyboardType="numeric" />
      <Text style={styles.label}>Oficios</Text>
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
      <Text style={styles.label}>Barrios (UI)</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip key={b.id} label={b.label} selected={false} onPress={() => undefined} />
        ))}
      </View>
      <Button label="Guardar" loading={busy} fullWidth onPress={() => void onSave()} />
      <Button
        label="Cerrar sesión"
        variant="danger"
        fullWidth
        onPress={() => {
          void signOut().then(() => router.replace('/'));
        }}
      />
      <Button label="Volver al welcome" variant="ghost" fullWidth onPress={() => router.replace('/')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[2], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  label: { ...typography.bodyStrong, color: colors.text, marginTop: spacing[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
