import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, FeedCard } from '../../src/components';
import { COPY } from '../../src/constants/copy';
import { MOCK_PROS, type MockPro } from '../../src/data/mock';
import type { BarrioId } from '../../src/constants/barrios';
import type { OficioId } from '../../src/constants/oficios';
import {
  ApiError,
  fetchDescubreFeed,
  type DescubreFeedCard,
} from '../../src/lib/api';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

const BARRIO_IDS = new Set<string>(['san-antonio', 'granada', 'el-penon', 'san-fernando']);

function mapFeedCard(card: DescubreFeedCard): MockPro {
  const barrio = (BARRIO_IDS.has(card.barrio_id ?? '')
    ? card.barrio_id
    : 'granada') as BarrioId;
  const oficios: OficioId[] = ['plomeria'];
  const rate =
    card.rate_hint_cop != null
      ? `Desde $${card.rate_hint_cop.toLocaleString('es-CO')}`
      : 'Consultar';
  return {
    id: card.user_id,
    name: card.display_name?.trim() || 'Pro BuenaMano',
    oficios,
    barrio,
    local: Boolean(card.is_local),
    pocoVisto: true,
    rating: 0,
    jobsCount: 0,
    bio: card.bio?.trim() || 'Perfil desde descubre_feed.',
    rateHint: rate,
  };
}

export default function DescubreScreen() {
  const [pros, setPros] = useState<MockPro[]>(MOCK_PROS);
  const [source, setSource] = useState<'mock' | 'edge' | 'stub'>('mock');
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setNote(null);
    try {
      const result = await fetchDescubreFeed({ limit: 20 });
      if (result.stub === true) {
        setPros(MOCK_PROS);
        setSource('stub');
        setNote('Edge descubre_feed respondió stub — mostrando mock. Ruta UI comprobada.');
        return;
      }
      const feed = result.feed ?? [];
      if (feed.length === 0) {
        setPros(MOCK_PROS);
        setSource('mock');
        setNote('Feed vacío — usando mock local.');
        return;
      }
      setPros(feed.map(mapFeedCard));
      setSource('edge');
      setNote(`Feed vivo · ${feed.length} perfiles`);
    } catch (e) {
      setPros(MOCK_PROS);
      setSource('mock');
      const msg =
        e instanceof ApiError
          ? e.message
          : 'No se pudo cargar descubre_feed';
      setNote(`${msg} — usando mock.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.fairChip}>
        <Text style={styles.fairChipText}>{COPY.fairnessChip}</Text>
      </View>
      <Text style={styles.fairBody}>{COPY.fairnessDescubre}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <Button
        label="Buscar / Filtros"
        variant="secondary"
        onPress={() => router.push('/search')}
        style={{ marginBottom: spacing[3] }}
      />
      <Button
        label={loading ? 'Cargando…' : 'Actualizar feed'}
        variant="ghost"
        disabled={loading}
        onPress={() => void load()}
        style={{ marginBottom: spacing[3] }}
      />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />
      ) : (
        pros.map((p) => (
          <FeedCard key={`${source}-${p.id}`} pro={p} onPress={() => router.push(`/pro/${p.id}`)} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], paddingBottom: spacing[7] },
  fairChip: {
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    alignSelf: 'flex-start',
    marginBottom: spacing[2],
  },
  fairChipText: { ...typography.micro, color: colors.textOnPrimary },
  fairBody: {
    ...typography.caption,
    color: colors.secondary,
    marginBottom: spacing[2],
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
  },
});
