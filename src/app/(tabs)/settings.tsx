import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  const headerPlatformStyle = Platform.select({
    android: { paddingTop: insets.top },
    default: { paddingTop: Spacing.four },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <View style={[styles.titleContainer, headerPlatformStyle]}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          Preferences and information about MDR.
        </ThemedText>
      </View>

      <View style={styles.sectionsWrapper}>
        <View style={styles.section}>
          <ThemedText type="label" themeColor="textSecondary">
            Reading
          </ThemedText>

          <Collapsible title="Appearance">
            <ThemedText type="small">
              MDR follows your device’s light and dark appearance automatically. Use the system
              setting on your device to switch between themes.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Supported file types">
            <ThemedText type="small">
              You can open <ThemedText type="code">.md</ThemedText> and{' '}
              <ThemedText type="code">.txt</ThemedText> files stored on this device. Files are read
              locally — nothing is uploaded.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.section}>
          <ThemedText type="label" themeColor="textSecondary">
            About
          </ThemedText>

          <Collapsible title="Built with Expo">
            <ThemedText type="small">
              MDR is built with Expo and React Native, so it runs on iOS, Android, and the web from
              a single codebase.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev">
              <ThemedText type="linkPrimary">Expo documentation</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="File-based routing">
            <ThemedText type="small">
              This app uses Expo Router. Screens live in{' '}
              <ThemedText type="code">src/app/</ThemedText> — the home screen is{' '}
              <ThemedText type="code">(tabs)/index.tsx</ThemedText> and the reader is{' '}
              <ThemedText type="code">viewer.tsx</ThemedText>.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={styles.section}>
          <ThemedText type="label" themeColor="textSecondary">
            Feedback
          </ThemedText>

          <Collapsible title="Get involved">
            <ThemedText type="small">
              MDR is built on Expo — report issues or browse the source.
            </ThemedText>
            <ExternalLink href="https://github.com/expo/expo">
              <ThemedText type="linkPrimary">Expo on GitHub</ThemedText>
            </ExternalLink>
          </Collapsible>
        </View>
      </View>

      {Platform.OS === 'web' && <WebBadge />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    gap: Spacing.two,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  centerText: {
    textAlign: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  section: {
    gap: Spacing.three,
  },
});