import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, FeedCard } from '../../src/components';
import { COPY } from '../../src/constants/copy';
import { MOCK_PROS } from '../../src/data/mock';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function DescubreScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.fairChip}>
        <Text style={styles.fairChipText}>{COPY.fairnessChip}</Text>
      </View>
      <Text style={styles.fairBody}>{COPY.fairnessDescubre}</Text>
      <Button
        label="Buscar / Filtros"
        variant="secondary"
        onPress={() => router.push('/search')}
        style={{ marginBottom: spacing[3] }}
      />
      {MOCK_PROS.map((p) => (
        <FeedCard key={p.id} pro={p} onPress={() => router.push(`/pro/${p.id}`)} />
      ))}
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
    marginBottom: spacing[4],
  },
});
