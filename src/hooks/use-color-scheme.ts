import { useSettings } from '@/hooks/use-settings';

/**
 * The resolved color scheme for the app, honoring the user's appearance
 * preference in Settings and otherwise following the device.
 */
export function useColorScheme() {
  return useSettings().scheme;
}
