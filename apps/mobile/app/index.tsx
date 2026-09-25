import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components';
import { COPY } from '../src/constants/copy';
import { getSupabaseStatus } from '../src/lib/supabase';
import { colors, radius, spacing, typography } from '../src/theme/tokens';

export default function WelcomeScreen() {
  const sb = getSupabaseStatus();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.column}>
          <View style={styles.pin}>
            <Ionicons name="location" size={18} color={colors.primary} />
          </View>
          <Text style={styles.brand}>BuenaMano</Text>
          <Text style={styles.tagline}>Oficios de tu barrio. La confianza no se compra.</Text>
          <Text style={styles.body}>{COPY.onboardingBarrios}</Text>
          <View style={styles.fairCard}>
            <Text style={styles.fair}>{COPY.fairnessDescubre}</Text>
          </View>

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
            <Pressable
              onPress={() => router.replace('/(seeker)/descubre')}
              accessibilityRole="link"
              style={styles.demoLink}
            >
              <Text style={styles.demoText}>Saltar a Descubre (demo)</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/admin')}
              accessibilityRole="link"
              style={styles.demoLink}
            >
              <Text style={styles.demoText}>Admin (stub web)</Text>
            </Pressable>
          </View>

          {__DEV__ ? (
            <Text style={styles.env}>
              Supabase: {sb === 'ready' ? 'configurado' : 'not configured (placeholders OK)'}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: {
    flexGrow: 1,
    padding: spacing[5],
    paddingBottom: spacing[7],
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: 390,
    gap: spacing[3],
  },
  pin: {
    alignSelf: 'flex-start',
    marginTop: spacing[6],
    marginBottom: -spacing[2],
  },
  brand: { ...typography.display, color: colors.primary },
  tagline: { ...typography.title2, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  fairCard: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing[3],
    borderRadius: radius.md,
  },
  fair: {
    ...typography.body,
    color: colors.secondary,
  },
  actions: { gap: spacing[3], marginTop: spacing[4] },
  roleLabel: { ...typography.bodyStrong, color: colors.text },
  demoLink: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[1],
  },
  demoText: { ...typography.caption, color: colors.textMuted, textDecorationLine: 'underline' },
  env: { ...typography.caption, color: colors.textMuted, marginTop: spacing[5] },
});
