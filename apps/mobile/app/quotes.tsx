import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { EmptyState, QuoteCompare, StubBanner } from '../src/components';
import { COPY } from '../src/constants/copy';
import { MOCK_QUOTES } from '../src/data/mock';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function QuotesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner />
      <Text style={styles.title}>Cotizaciones — ordenadas por confianza local</Text>
      <Text style={styles.legend}>{COPY.quoteSortLegend}</Text>
      {MOCK_QUOTES.length === 0 ? (
        <EmptyState
          title="Nadie cotizó todavía"
          body="Te avisamos. Si urge, prueba otro barrio vecino."
        />
      ) : (
        <QuoteCompare
          quotes={MOCK_QUOTES}
          onAccept={(id) => {
            Alert.alert('Aceptada (stub)', `Cotización ${id}`);
            router.push('/job/demo');
          }}
        />
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
