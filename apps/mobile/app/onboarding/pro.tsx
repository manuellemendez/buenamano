import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, StubBanner } from '../../src/components';
import { BARRIOS } from '../../src/constants/barrios';
import { OFICIOS } from '../../src/constants/oficios';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function OnboardingPro() {
  const [oficios, setOficios] = useState<string[]>([]);
  const [barrios, setBarrios] = useState<string[]>([]);

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  const ready = oficios.length > 0 && barrios.length > 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Onboarding pro — stub (sin auth aún)" />
      <Text style={styles.title}>¿Qué oficios haces?</Text>
      <View style={styles.chips}>
        {OFICIOS.map((o) => (
          <Chip
            key={o.id}
            label={o.label}
            selected={oficios.includes(o.id)}
            onPress={() => toggle(oficios, o.id, setOficios)}
          />
        ))}
      </View>
      <Text style={styles.title}>¿En qué barrios cubres?</Text>
      <View style={styles.chips}>
        {BARRIOS.map((b) => (
          <Chip
            key={b.id}
            label={b.label}
            selected={barrios.includes(b.id)}
            onPress={() => toggle(barrios, b.id, setBarrios)}
          />
        ))}
      </View>
      <Button
        label="Crear perfil"
        disabled={!ready}
        fullWidth
        onPress={() => router.replace('/(pro)/inbox')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { ...typography.title1, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
});
