import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster, YoooProvider } from 'yooo-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function Rootlayout() {
  const dark = useColorScheme() === 'dark';
  const c = Colors[dark ? 'dark' : 'light'];
  const base = dark ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YoooProvider theme="system">
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
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ contentStyle: { backgroundColor: c.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="viewer" options={{ headerShown: false }} />
          </Stack>
          <Toaster position="top-center" />
        </ThemeProvider>
      </YoooProvider>
    </GestureHandlerRootView>
  );
}
