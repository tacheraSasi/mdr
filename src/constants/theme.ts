import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1F2B',
    textSecondary: '#5C6470',
    background: '#F5F6F8',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E9ECF1',
    tint: '#208AEF',
    tintText: '#FFFFFF',
    border: '#E3E6EB',
  },
  dark: {
    text: '#F2F4F8',
    textSecondary: '#9AA3B2',
    background: '#0E1116',
    backgroundElement: '#171B21',
    backgroundSelected: '#232C38',
    tint: '#3D93F5',
    tintText: '#FFFFFF',
    border: '#232A33',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
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
export const MaxContentWidth = 800;