import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography } from '../src/theme/tokens';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: typography.title1.fontWeight,
            fontSize: typography.title1.fontSize,
            color: colors.text,
          },
          contentStyle: { backgroundColor: colors.surface },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/seeker" options={{ title: 'Tu barrio' }} />
        <Stack.Screen name="onboarding/pro" options={{ title: 'Tu oficio' }} />
        <Stack.Screen name="(seeker)" options={{ headerShown: false }} />
        <Stack.Screen name="(pro)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ title: 'Buscar / Filtros' }} />
        <Stack.Screen name="pro/[id]" options={{ title: 'Perfil' }} />
        <Stack.Screen name="request" options={{ title: 'Pedir oficio' }} />
        <Stack.Screen name="quotes" options={{ title: 'Cotizaciones' }} />
        <Stack.Screen name="job/[id]" options={{ title: 'Trabajo' }} />
        <Stack.Screen name="review/[jobId]" options={{ title: 'Dejar reseña' }} />
        <Stack.Screen name="legal/terminos" options={{ title: 'Términos' }} />
        <Stack.Screen name="legal/privacidad" options={{ title: 'Privacidad' }} />
        <Stack.Screen name="admin/index" options={{ title: 'Admin BuenaMano' }} />
        <Stack.Screen name="admin/proofs" options={{ title: 'Pruebas Local' }} />
        <Stack.Screen name="admin/reports" options={{ title: 'Reportes' }} />
      </Stack>
    </>
  );
}
