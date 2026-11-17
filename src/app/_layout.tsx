import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster, YoooProvider } from 'yooo-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/hooks/use-settings';
import { SettingsProvider } from '@/providers/settings';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const dark = useColorScheme() === 'dark';
  const c = Colors[dark ? 'dark' : 'light'];
  const base = dark ? DarkTheme : DefaultTheme;
  const { settings } = useSettings();

  return (
    <YoooProvider theme={settings.theme}>
      <ThemeProvider
        value={{
          ...base,
          colors: {
            ...base.colors,
            background: c.background,
            card: c.backgroundElement,
            text: c.text,
            border: c.border,
            primary: c.ink,
          },
        }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ contentStyle: { backgroundColor: c.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="viewer" options={{ headerShown: false }} />
        </Stack>
        <Toaster position="top-center" />
      </ThemeProvider>
    </YoooProvider>
  );
}

export default function Rootlayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <RootNavigator />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
