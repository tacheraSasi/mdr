import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Platform } from 'react-native';

import { useSettings } from '@/hooks/use-settings';

const IS_WEB = Platform.OS === 'web';

/**
 * Haptic helpers that respect the user's "Haptic feedback" preference.
 * Every helper is a no-op on web and when haptics are disabled.
 */
export function useHaptics() {
  const { settings } = useSettings();

  return useMemo(() => {
    const enabled = settings.haptics && !IS_WEB;

    return {
      selection() {
        if (enabled) Haptics.selectionAsync();
      },
      impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
        if (enabled) Haptics.impactAsync(style);
      },
      notify(type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) {
        if (enabled) Haptics.notificationAsync(type);
      },
    };
  }, [settings.haptics]);
}
