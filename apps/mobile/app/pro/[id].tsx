import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, ProCard, ReportSheet, StubBanner } from '../../src/components';
import { MOCK_PROS } from '../../src/data/mock';
import { colors, spacing } from '../../src/theme/tokens';

export default function ProProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pro = MOCK_PROS.find((p) => p.id === id) ?? MOCK_PROS[0];
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StubBanner label="Pro profile — mock data" />
      <ProCard pro={pro} />
      <Button label="Pedir cotización" fullWidth onPress={() => router.push('/request')} />
      <Button label="Reportar" variant="ghost" onPress={() => setReportOpen(true)} fullWidth />
      <ReportSheet
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="profile"
        targetId={typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id) ? id : (pro?.id ?? id)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing[4], gap: spacing[3] },
});
