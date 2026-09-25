import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { colors } from '../../src/theme/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(outline: IconName, filled: IconName) {
  return ({ focused, color }: { focused: boolean; color: ColorValue }) => (
    <Ionicons name={focused ? filled : outline} size={24} color={color as string} />
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
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Solicitudes',
          tabBarIcon: tabIcon('mail-outline', 'mail'),
        }}
      />
      <Tabs.Screen
        name="local-status"
        options={{
          title: 'Local',
          tabBarIcon: tabIcon('star-outline', 'star'),
        }}
      />
      <Tabs.Screen
        name="profile-edit"
        options={{
          title: 'Perfil',
          tabBarIcon: tabIcon('person-outline', 'person'),
        }}
      />
      <Tabs.Screen name="quote-compose" options={{ href: null, title: 'Cotizar' }} />
      <Tabs.Screen name="local-proof" options={{ href: null, title: 'Prueba Local' }} />
    </Tabs>
  );
}
