import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Button, Input, TextArea } from '../../src/components';
import { ApiError, submitQuote } from '../../src/lib/api';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function QuoteCompose() {
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();
  const [price, setPrice] = useState('');
  const [etaHours, setEtaHours] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    const rid = typeof requestId === 'string' ? requestId : '';
    if (!rid) {
      Alert.alert(
        'Falta solicitud',
        'Abre cotizar desde el inbox con ?requestId=. Sin id no se inserta.',
      );
      return;
    }
    const priceCop = Number(price.replace(/\D/g, ''));
    const hours = Number(etaHours);
    if (!(priceCop >= 0) || !(hours > 0)) {
      Alert.alert('Datos', 'Precio (COP) y ETA en horas (> 0) son obligatorios.');
      return;
    }
    setBusy(true);
    try {
      await submitQuote({ requestId: rid, priceCop, etaHours: hours, notes: note });
      Alert.alert('Enviada', `$${priceCop.toLocaleString('es-CO')} · ${hours}h`);
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof ApiError ? e.message : 'No se pudo enviar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Enviar cotización</Text>
      <Text style={styles.meta}>
        {requestId
          ? `Solicitud: ${String(requestId).slice(0, 8)}…`
          : 'Sin requestId — pásalo desde inbox.'}
      </Text>
      <Input
        label="Precio (COP)"
        value={price}
        onChangeText={setPrice}
        placeholder="120000"
        keyboardType="numeric"
        helper="Se muestra como $120.000"
      />
      <Input
        label="ETA (horas)"
        value={etaHours}
        onChangeText={setEtaHours}
        placeholder="24"
        keyboardType="numeric"
      />
      <TextArea label="Nota" value={note} onChangeText={setNote} placeholder="Incluye materiales…" />
      <Button
        label="Enviar cotización"
        disabled={!price || !etaHours}
        loading={busy}
        fullWidth
        onPress={() => void onSubmit()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
});
