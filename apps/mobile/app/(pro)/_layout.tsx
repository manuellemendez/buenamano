import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme/tokens';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 11, color: focused ? colors.primary : colors.textMuted, fontWeight: focused ? '700' : '400' }}>
      {label}
    </Text>
  );
}

export default function ProTabs() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surfaceCard, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="inbox" options={{ title: 'Solicitudes', tabBarIcon: ({ focused }) => <TabIcon label="☰" focused={focused} /> }} />
      <Tabs.Screen name="local-status" options={{ title: 'Local', tabBarIcon: ({ focused }) => <TabIcon label="★" focused={focused} /> }} />
      <Tabs.Screen name="profile-edit" options={{ title: 'Perfil', tabBarIcon: ({ focused }) => <TabIcon label="☺" focused={focused} /> }} />
      <Tabs.Screen name="quote-compose" options={{ href: null, title: 'Cotizar' }} />
      <Tabs.Screen name="local-proof" options={{ href: null, title: 'Prueba Local' }} />
    </Tabs>
  );
}
