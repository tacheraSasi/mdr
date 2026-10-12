import '@/global.css';

import { Platform } from 'react-native';

const pastelLight = {
  blue: '#CFE3F8',
  green: '#CFF5DE',
  yellow: '#FDF3B5',
  red: '#FDD5D5',
  purple: '#EBDDFB',
} as const;

const pastelDark = {
  blue: '#1F3550',
  green: '#1B3D2E',
  yellow: '#4A4220',
  red: '#4A2626',
  purple: '#3A2D52',
} as const;

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#5F6670',
    textMuted: '#8A9199',
    background: '#F7F8FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#ECEEF1',
    border: '#E3E6EA',
    codeBg: '#F3F4F6',
    ink: '#1E2733',
    inkText: '#F7F8FA',
    link: '#2F6FBF',
    tint: '#1E2733',
    tintText: '#F7F8FA',
    pastel: pastelLight,
  },
  dark: {
    text: '#EDEDED',
    textSecondary: '#9AA0A6',
    textMuted: '#6E757C',
    background: '#0F1113',
    backgroundElement: '#181B1F',
    backgroundSelected: '#23282E',
    border: '#2A2F35',
    codeBg: '#1E2327',
    ink: '#E6EDF7',
    inkText: '#0F1113',
    link: '#8AB8F0',
    tint: '#E6EDF7',
    tintText: '#0F1113',
    pastel: pastelDark,
  },
} as const;

export type ThemeColor = Exclude<
  keyof typeof Colors.light & keyof typeof Colors.dark,
  'pastel'
>;

export type PastelRole = keyof typeof pastelLight;

export const Radius = {
  chip: 8,
  card: 16,
  panel: 24,
  code: 10,
  pill: 999,
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Type = {
  hero: { fontSize: 40, lineHeight: 44, fontWeight: '800', letterSpacing: -1.2 },
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '500', letterSpacing: -0.2 },
  subtitle: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 26, fontWeight: '400' },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  smallBold: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
  label: { fontSize: 11, lineHeight: 16, fontWeight: '600', letterSpacing: 1.4 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  mono: { fontSize: 13, lineHeight: 20, fontWeight: '400' },
} as const;

export const Shadow = {
  panel: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'Menlo',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 680;

const PASTEL_ORDER: readonly PastelRole[] = ['blue', 'green', 'yellow', 'red', 'purple'];

export function pastelFor(name: string): PastelRole {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PASTEL_ORDER[h % PASTEL_ORDER.length];
}
