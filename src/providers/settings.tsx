import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';

import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type AppSettings,
} from '@/lib/settings';

export type ColorScheme = 'light' | 'dark';

type SettingsContextValue = {
  settings: AppSettings;
  scheme: ColorScheme;
  isHydrated: boolean;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const systemScheme = useSystemColorScheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    loadSettings().then((loaded) => {
      if (!active) return;
      setSettings(loaded);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist after the first load so we never overwrite stored values with defaults.
  useEffect(() => {
    if (!isHydrated) return;
    saveSettings(settings).catch(() => {
      // Settings are non-critical; the in-memory value stays applied for this session.
    });
  }, [settings, isHydrated]);

  // Force native UI (alerts, keyboards, tab bars) to follow the chosen theme too.
  useEffect(() => {
    if (process.env.EXPO_OS === 'web') return;
    Appearance.setColorScheme(settings.theme === 'system' ? 'auto' : settings.theme);
  }, [settings.theme]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((previous) => ({ ...previous, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const scheme: ColorScheme =
    settings.theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : settings.theme;

  const value = useMemo(
    () => ({ settings, scheme, isHydrated, updateSettings, resetSettings }),
    [settings, scheme, isHydrated, updateSettings, resetSettings],
  );

  if (!isHydrated) return null;

  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings(): SettingsContextValue {
  const context = use(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside a SettingsProvider');
  }
  return context;
}
