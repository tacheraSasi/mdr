import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ReaderTextSize = 'small' | 'default' | 'large' | 'xlarge';

export type AppSettings = {
  theme: ThemePreference;
  readerTextSize: ReaderTextSize;
  showReadingStats: boolean;
  haptics: boolean;
  rememberRecents: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  readerTextSize: 'default',
  showReadingStats: true,
  haptics: true,
  rememberRecents: true,
};

export const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export const TEXT_SIZE_OPTIONS: { label: string; value: ReaderTextSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
  { label: 'Larger', value: 'xlarge' },
];

export const ReaderScale: Record<ReaderTextSize, number> = {
  small: 0.92,
  default: 1,
  large: 1.12,
  xlarge: 1.24,
};

const STORAGE_KEY = 'mdr:settings:v1';

const themeValues: ThemePreference[] = ['system', 'light', 'dark'];
const textSizeValues: ReaderTextSize[] = ['small', 'default', 'large', 'xlarge'];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

/** Coerces stored data into a valid settings object, ignoring unknown values. */
export function sanitizeSettings(value: unknown): AppSettings {
  const raw = asRecord(value);

  return {
    theme: themeValues.includes(raw.theme as ThemePreference)
      ? (raw.theme as ThemePreference)
      : DEFAULT_SETTINGS.theme,
    readerTextSize: textSizeValues.includes(raw.readerTextSize as ReaderTextSize)
      ? (raw.readerTextSize as ReaderTextSize)
      : DEFAULT_SETTINGS.readerTextSize,
    showReadingStats:
      typeof raw.showReadingStats === 'boolean'
        ? raw.showReadingStats
        : DEFAULT_SETTINGS.showReadingStats,
    haptics: typeof raw.haptics === 'boolean' ? raw.haptics : DEFAULT_SETTINGS.haptics,
    rememberRecents:
      typeof raw.rememberRecents === 'boolean'
        ? raw.rememberRecents
        : DEFAULT_SETTINGS.rememberRecents,
  };
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
