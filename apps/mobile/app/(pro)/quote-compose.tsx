import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Button, Input, StubBanner, TextArea } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function QuoteCompose() {
  const [price, setPrice] = useState('');
  const [eta, setEta] = useState('');
  const [note, setNote] = useState('');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Quote compose — stub" />
      <Text style={styles.title}>Enviar cotización</Text>
      <Input label="Precio (COP)" value={price} onChangeText={setPrice} placeholder="120000" helper="Se muestra como $120.000" />
      <Input label="ETA" value={eta} onChangeText={setEta} placeholder="mañana 9–11 a.m." />
      <TextArea label="Nota" value={note} onChangeText={setNote} placeholder="Incluye materiales…" />
      <Button
        label="Enviar cotización"
        disabled={!price || !eta}
        fullWidth
        onPress={() => {
          Alert.alert('Enviada (stub)', `$${price} · ${eta}`);
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
});
