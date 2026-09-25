import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, EmptyState, FeedCard } from '../../src/components';
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
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [fairOpen, setFairOpen] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <Pressable
          onPress={() => setFairOpen(true)}
          style={styles.fairChip}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.fairnessChip}. Ver explicación.`}
        >
          <Text style={styles.fairChipText}>{COPY.fairnessChip}</Text>
        </Pressable>
        {__DEV__ && note ? <Text style={styles.note}>{note}</Text> : null}
        <Button
          label="Buscar / Filtros"
          variant="secondary"
          onPress={() => router.push('/search')}
          style={{ marginBottom: spacing[3] }}
        />
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />
        ) : pros.length === 0 ? (
          <EmptyState
            title="Sin oficios por ahora"
            body="Prueba quitar filtros o vuelve más tarde."
            ctaLabel="Buscar / Filtros"
            onCta={() => router.push('/search')}
            icon="search-outline"
          />
        ) : (
          pros.map((p) => (
            <FeedCard key={`${source}-${p.id}`} pro={p} onPress={() => router.push(`/pro/${p.id}`)} />
          ))
        )}
      </ScrollView>

      <Modal visible={fairOpen} transparent animationType="fade" onRequestClose={() => setFairOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setFairOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{COPY.fairnessChip}</Text>
            <Text style={styles.sheetBody}>{COPY.fairnessDescubre}</Text>
            <Pressable onPress={() => setFairOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Entendido</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
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
    marginBottom: spacing[3],
    minHeight: 36,
    justifyContent: 'center',
  },
  fairChipText: { ...typography.micro, color: colors.textOnPrimary },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceCard,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing[5],
    gap: spacing[3],
  },
  sheetTitle: { ...typography.title2, color: colors.text },
  sheetBody: { ...typography.body, color: colors.textMuted },
  closeBtn: {
    marginTop: spacing[2],
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    padding: spacing[3],
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  closeText: { ...typography.bodyStrong, color: colors.textOnPrimary },
});
