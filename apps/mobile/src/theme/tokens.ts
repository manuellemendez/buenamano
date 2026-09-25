/** DeAcá design tokens — contract: DESIGN-SYSTEM.md 2026-09-24 */

export const colors = {
  primary: '#C45C26',
  primaryPressed: '#9A451C',
  secondary: '#1F6F5B',
  success: '#2F9E44',
  warning: '#E8A317',
  danger: '#D94841',
  surface: '#F7F1EA',
  surfaceCard: '#FFFFFF',
  surfaceMuted: '#EDE4D8',
  text: '#1A1A1A',
  textMuted: '#5C564E',
  textOnPrimary: '#FFFFFF',
  border: '#D9D0C4',
  local: '#C45C26',
  localInk: '#FFFFFF',
  overlay: '#1A1A1ACC',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
  title1: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  title2: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  callout: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const },
} as const;

export const elevation = {
  floating: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const LOCAL_THRESHOLD_N = 5;

export const tokens = { colors, spacing, radius, typography, elevation, LOCAL_THRESHOLD_N };
export default tokens;
