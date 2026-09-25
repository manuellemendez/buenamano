import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, FeedCard, StubBanner } from '../src/components';
import { BARRIOS } from '../src/constants/barrios';
import { OFICIOS } from '../src/constants/oficios';
import { MOCK_PROS } from '../src/data/mock';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function SearchFilters() {
  const [oficio, setOficio] = useState<string | null>(null);
  const [barrio, setBarrio] = useState<string | null>(null);
  const [soloLocal, setSoloLocal] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_PROS.filter((p) => {
      if (oficio && !p.oficios.includes(oficio as never)) return false;
      if (barrio && p.barrio !== barrio) return false;
      if (soloLocal && !p.local) return false;
      return true;
    });
  }, [oficio, barrio, soloLocal]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Search/Filters — mock filter client-side" />
      <Text style={styles.label}>Oficio</Text>
      <View style={styles.chips}>
        {OFICIOS.map((o) => (
          <Chip key={o.id} label={o.label} selected={oficio === o.id} onPress={() => setOficio(oficio === o.id ? null : o.id)} />
        ))}
      </View>
      <Text style={styles.label}>Barrio</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip key={b.id} label={b.label} selected={barrio === b.id} onPress={() => setBarrio(barrio === b.id ? null : b.id)} />
        ))}
      </View>
      <Chip label="Solo Local" selected={soloLocal} onPress={() => setSoloLocal((v) => !v)} />
      <Text style={styles.count}>{filtered.length} resultados</Text>
      {filtered.length === 0 ? (
        <Text style={styles.empty}>
          No encontramos oficios Local con ese filtro — quita ‘Solo Local’ o cambia el oficio.
        </Text>
      ) : (
        filtered.map((p) => (
          <FeedCard key={p.id} pro={p} onPress={() => router.push(`/pro/${p.id}`)} />
        ))
      )}
      <Button label="Aplicar (cerrar)" variant="secondary" onPress={() => router.back()} fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[2], paddingBottom: spacing[7] },
  label: { ...typography.bodyStrong, color: colors.text, marginTop: spacing[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  count: { ...typography.caption, color: colors.textMuted, marginVertical: spacing[2] },
  empty: { ...typography.body, color: colors.textMuted },
});
