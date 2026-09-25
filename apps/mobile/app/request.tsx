import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Input, StubBanner, TextArea } from '../src/components';
import { OFICIOS } from '../src/constants/oficios';
import { colors, spacing, typography } from '../src/theme/tokens';

const URGENCY = ['Urgente (hoy)', 'Esta semana', 'Flexible'] as const;

export default function RequestJobScreen() {
  const [oficio, setOficio] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [urgency, setUrgency] = useState<string>('Esta semana');
  const [photos, setPhotos] = useState(0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Request job — stub (no upload/backend)" />
      <Text style={styles.title}>¿Qué hay que arreglar?</Text>
      <View style={styles.chips}>
        {OFICIOS.map((o) => (
          <Chip key={o.id} label={o.label} selected={oficio === o.id} onPress={() => setOficio(o.id)} />
        ))}
      </View>
      <TextArea
        label="Descripción"
        value={desc}
        onChangeText={setDesc}
        placeholder="Ej. se dañó el flexible de la ducha"
        helper="Sube una foto del daño si puedes — el maestro cotiza mejor"
      />
      <Button
        label={photos ? `Fotos: ${photos} (stub)` : 'Subir foto (stub)'}
        variant="secondary"
        onPress={() => setPhotos((n) => n + 1)}
        fullWidth
      />
      <Text style={styles.label}>Urgencia</Text>
      <View style={styles.chips}>
        {URGENCY.map((u) => (
          <Chip key={u} label={u} selected={urgency === u} onPress={() => setUrgency(u)} />
        ))}
      </View>
      <Button
        label="Enviar solicitud"
        disabled={!oficio || desc.trim().length < 8}
        fullWidth
        onPress={() => router.push('/quotes')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  label: { ...typography.bodyStrong, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
