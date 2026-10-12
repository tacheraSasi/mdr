import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Reports `false` during hydration so the first client render matches the
// server-rendered markup, then triggers one update after the store subscribes.
const subscribe = (onStoreChange: () => void) => {
  onStoreChange();
  return () => {};
};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
