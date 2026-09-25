import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components';
import { COPY } from '../src/constants/copy';
import { getSupabaseStatus } from '../src/lib/supabase';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function WelcomeScreen() {
  const sb = getSupabaseStatus();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>DeAcá</Text>
        <Text style={styles.tagline}>Oficios de tu barrio. La confianza no se compra.</Text>
        <Text style={styles.body}>{COPY.onboardingBarrios}</Text>
        <Text style={styles.fair}>{COPY.fairnessDescubre}</Text>

        <View style={styles.actions}>
          <Text style={styles.roleLabel}>¿Cómo entras?</Text>
          <Button
            label="Busco un oficio (hogar)"
            fullWidth
            onPress={() => router.push('/onboarding/seeker')}
          />
          <Button
            label="Ofrezco un oficio (pro)"
            variant="secondary"
            fullWidth
            onPress={() => router.push('/onboarding/pro')}
          />
          <Button
            label="Saltar a Descubre (demo)"
            variant="ghost"
            fullWidth
            onPress={() => router.replace('/(seeker)/descubre')}
          />
          <Button
            label="Admin (stub web)"
            variant="ghost"
            fullWidth
            onPress={() => router.push('/admin')}
          />
        </View>

        <Text style={styles.env}>
          Supabase: {sb === 'ready' ? 'configurado' : 'not configured (placeholders OK)'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  container: { padding: spacing[5], gap: spacing[3], paddingBottom: spacing[7] },
  brand: { ...typography.display, color: colors.primary, marginTop: spacing[6] },
  tagline: { ...typography.title2, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  fair: {
    ...typography.body,
    color: colors.secondary,
    backgroundColor: colors.surfaceMuted,
    padding: spacing[3],
    borderRadius: 12,
  },
  actions: { gap: spacing[3], marginTop: spacing[4] },
  roleLabel: { ...typography.bodyStrong, color: colors.text },
  env: { ...typography.caption, color: colors.textMuted, marginTop: spacing[5] },
});
