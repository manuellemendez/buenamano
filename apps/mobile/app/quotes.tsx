import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { EmptyState, QuoteCompare, StubBanner } from '../src/components';
import { COPY } from '../src/constants/copy';
import { MOCK_QUOTES } from '../src/data/mock';
import { acceptQuote, ApiError, describeEdgeResult } from '../src/lib/api';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function QuotesScreen() {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function onAccept(quoteId: string) {
    if (busyId) return;
    setBusyId(quoteId);
    try {
      const result = await acceptQuote(quoteId);
      Alert.alert('Cotización', describeEdgeResult(result, 'Cotización aceptada.'), [
        { text: 'OK', onPress: () => router.push('/job/demo') },
      ]);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo aceptar la cotización.';
      Alert.alert('Error', msg);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label={busyId ? 'Aceptando vía accept_quote…' : 'accept_quote Edge'} />
      <Text style={styles.title}>Cotizaciones — ordenadas por confianza local</Text>
      <Text style={styles.legend}>{COPY.quoteSortLegend}</Text>
      {MOCK_QUOTES.length === 0 ? (
        <EmptyState
          title="Nadie cotizó todavía"
          body="Te avisamos. Si urge, prueba otro barrio vecino."
        />
      ) : (
        <QuoteCompare quotes={MOCK_QUOTES} onAccept={onAccept} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
  legend: { ...typography.caption, color: colors.secondary },
});
