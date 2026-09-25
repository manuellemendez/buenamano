import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { ReviewScaffolds } from '../../src/components';
import { ApiError, submitReview } from '../../src/lib/api';
import { colors, spacing } from '../../src/theme/tokens';

export default function LeaveReviewScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [busy, setBusy] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ReviewScaffolds
        onSubmit={(payload) => {
          if (busy) return;
          const id = typeof jobId === 'string' ? jobId : '';
          if (!id || id === 'demo') {
            Alert.alert(
              'Falta job real',
              'Abre esta pantalla desde un trabajo confirmado (UUID). El demo no inserta reseña.',
            );
            return;
          }
          setBusy(true);
          void (async () => {
            try {
              await submitReview({
                jobId: id,
                rating: payload.stars,
                body: payload.text,
              });
              Alert.alert('Reseña publicada', `${payload.stars}★ · ${payload.text.length} caracteres`);
              router.replace('/(seeker)/trabajos');
            } catch (e) {
              Alert.alert(
                'Error',
                e instanceof ApiError ? e.message : 'No se pudo publicar la reseña.',
              );
            } finally {
              setBusy(false);
            }
          })();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3], paddingBottom: spacing[7] },
});
