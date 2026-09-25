import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, StubBanner } from '../../src/components';
import { BARRIOS } from '../../src/constants/barrios';
import { COPY } from '../../src/constants/copy';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function OnboardingSeeker() {
  const [barrio, setBarrio] = useState<string | null>(null);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Onboarding seeker — stub (sin auth aún)" />
      <Text style={styles.title}>¿En qué barrio estás?</Text>
      <Text style={styles.body}>{COPY.onboardingBarrios}</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip
            key={b.id}
            label={b.label}
            selected={barrio === b.id}
            onPress={() => setBarrio(b.id)}
          />
        ))}
      </View>
      <Button
        label="Ver Descubre"
        disabled={!barrio}
        fullWidth
        onPress={() => router.replace('/(seeker)/descubre')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: spacing[2] },
});
