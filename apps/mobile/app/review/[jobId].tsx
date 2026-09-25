import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { ReviewScaffolds, StubBanner } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function LeaveReviewScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label={`Leave review — job ${jobId}`} />
      <Text style={styles.title}>Dejar reseña</Text>
      <ReviewScaffolds
        onSubmit={(payload) => {
          Alert.alert(
            'Reseña publicada (stub)',
            `${payload.stars}★ · ${payload.text.length} chars · scaffolds: ${payload.scaffolds.join(', ') || 'ninguno'}`,
          );
          router.replace('/(seeker)/trabajos');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
  title: { ...typography.title1, color: colors.text },
});
