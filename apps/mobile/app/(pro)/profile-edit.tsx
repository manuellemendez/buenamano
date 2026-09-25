import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Input, StubBanner, TextArea } from '../../src/components';
import { BARRIOS } from '../../src/constants/barrios';
import { OFICIOS } from '../../src/constants/oficios';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function ProfileEdit() {
  const [name, setName] = useState('Carlos Restrepo');
  const [bio, setBio] = useState('Plomero de Granada.');
  const [rate, setRate] = useState('80000');
  const [oficios, setOficios] = useState<string[]>(['plomeria']);
  const [barrios, setBarrios] = useState<string[]>(['granada']);

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Profile edit — stub save" />
      <Text style={styles.title}>Editar perfil</Text>
      <Input label="Nombre" value={name} onChangeText={setName} />
      <TextArea label="Bio corta" value={bio} onChangeText={setBio} />
      <Input label="Precio desde (COP)" value={rate} onChangeText={setRate} />
      <Text style={styles.label}>Oficios</Text>
      <View style={styles.chips}>
        {OFICIOS.map((o) => (
          <Chip key={o.id} label={o.label} selected={oficios.includes(o.id)} onPress={() => toggle(oficios, o.id, setOficios)} />
        ))}
      </View>
      <Text style={styles.label}>Barrios</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip key={b.id} label={b.label} selected={barrios.includes(b.id)} onPress={() => toggle(barrios, b.id, setBarrios)} />
        ))}
      </View>
      <Button label="Guardar (stub)" fullWidth onPress={() => router.back()} />
      <Button label="Volver al welcome" variant="ghost" fullWidth onPress={() => router.replace('/')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[2], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  label: { ...typography.bodyStrong, color: colors.text, marginTop: spacing[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
