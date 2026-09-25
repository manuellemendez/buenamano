import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, TextArea } from '../src/components';
import { OFICIOS } from '../src/constants/oficios';
import { ApiError, createJobRequest } from '../src/lib/api';
import { useAuth } from '../src/lib/auth';
import { colors, spacing, typography } from '../src/theme/tokens';

const URGENCY = ['Urgente (hoy)', 'Esta semana', 'Flexible'] as const;

export default function RequestJobScreen() {
  const { profile } = useAuth();
  const [oficio, setOficio] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [urgency, setUrgency] = useState<string>('Esta semana');
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function pickPhoto() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Permiso',
          Platform.OS === 'web'
            ? 'En web el picker puede fallar; se usará un JPEG de prueba al enviar si no hay fotos.'
            : 'Necesitamos acceso a fotos para adjuntar el daño.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUris((prev) => [...prev, result.assets[0].uri]);
      }
    } catch {
      Alert.alert(
        'Picker',
        'No se pudo abrir el selector. Al enviar usaremos un JPEG mínimo de smoke si no hay fotos.',
      );
    }
  }

  async function onSubmit() {
    if (!oficio || desc.trim().length < 8) return;
    setBusy(true);
    try {
      const { id } = await createJobRequest({
        oficioSlug: oficio,
        description: desc,
        urgencyLabel: urgency,
        barrioId: profile?.home_barrio_id ?? null,
        photoUris,
      });
      Alert.alert('Solicitud enviada', 'Los maestros de tu barrio pueden cotizar.');
      router.push({ pathname: '/quotes', params: { requestId: id } });
    } catch (e) {
      Alert.alert('Error', e instanceof ApiError ? e.message : 'No se pudo crear la solicitud.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿Qué hay que arreglar?</Text>
      <View style={styles.chips}>
        {OFICIOS.map((o) => (
          <Chip
            key={o.id}
            label={o.label}
            selected={oficio === o.id}
            onPress={() => setOficio(o.id)}
          />
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
        label={photoUris.length ? `Fotos: ${photoUris.length}` : 'Subir foto'}
        variant="secondary"
        onPress={() => void pickPhoto()}
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
  label: { ...typography.bodyStrong, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
