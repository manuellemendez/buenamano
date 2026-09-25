import { ScrollView, StyleSheet, Text } from 'react-native';
import { StubBanner } from '../../src/components';
import { COPY } from '../../src/constants/copy';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function TerminosScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="DRAFT — needs App Legal Advisor" />
      <Text style={styles.title}>{COPY.terminosDraft}</Text>
      <Text style={styles.body}>
        Placeholder. No publicar en tiendas sin revisión legal. Ver pack LEGAL-OPTIONS-P0.md.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
});
