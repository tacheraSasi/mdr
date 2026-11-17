import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alert, toast } from 'yooo-native';
import {
  FieldGroup,
  Host,
  ListItem,
  Row,
  Spacer,
  Text as NativeText,
} from '@expo/ui';

import { SettingPicker } from '@/components/settings/setting-picker';
import { SettingSwitch } from '@/components/settings/setting-switch';
import { Colors, MaxContentWidth, Space, Type } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import { useSettings } from '@/hooks/use-settings';
import { clearRecents, loadRecents } from '@/lib/recents';
import {
  TEXT_SIZE_OPTIONS,
  THEME_OPTIONS,
  type AppSettings,
} from '@/lib/settings';

function FooterText({ children }: { children: string }) {
  const c = Colors[useColorScheme()];
  return <NativeText textStyle={{ fontSize: 13, color: c.textSecondary }}>{children}</NativeText>;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const { settings, updateSettings, resetSettings } = useSettings();
  const haptics = useHaptics();
  const [recentCount, setRecentCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadRecents().then((items) => {
        if (active) setRecentCount(items.length);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const update = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      updateSettings({ [key]: value } as Partial<AppSettings>);
    },
    [updateSettings],
  );

  const onClearRecents = useCallback(() => {
    if (recentCount === 0) {
      toast.info('No recent files', { description: 'Open a document and it will show up here.' });
      return;
    }

    alert.dialog(
      'Clear recent files?',
      'This removes every document from Recents. The files themselves stay on your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearRecents();
            setRecentCount(0);
            haptics.notify();
            toast.success('Recent files cleared');
          },
        },
      ],
    );
  }, [recentCount, haptics]);

  const onReset = useCallback(() => {
    alert.dialog('Reset settings?', 'Appearance and reading options return to their defaults.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetSettings();
          haptics.notify();
          toast.success('Settings reset');
        },
      },
    ]);
  }, [resetSettings, haptics]);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const recentSummary =
    recentCount === null
      ? 'Loading…'
      : recentCount === 0
        ? 'No recent files'
        : `${recentCount} file${recentCount === 1 ? '' : 's'} saved`;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Space.md }]}>
        <Text style={[Type.display, { color: c.ink }]}>Settings</Text>
        <Text style={[Type.caption, { color: c.textSecondary }]}>
          Preferences and information about MDR.
        </Text>
      </View>

      <Host style={styles.host} colorScheme={scheme} seedColor={c.link}>
        <FieldGroup>
          <FieldGroup.Section title="Appearance">
            <SettingPicker
              label="Theme"
              value={settings.theme}
              options={THEME_OPTIONS}
              onValueChange={(value) => {
                haptics.selection();
                update('theme', value);
              }}
            />
            <FieldGroup.SectionFooter>
              <FooterText>System follows your device’s light and dark appearance. The whole app updates
              immediately.</FooterText>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Reading">
            <SettingPicker
              label="Text size"
              value={settings.readerTextSize}
              options={TEXT_SIZE_OPTIONS}
              onValueChange={(value) => {
                haptics.selection();
                update('readerTextSize', value);
              }}
            />
            <SettingSwitch
              label="Show reading stats"
              value={settings.showReadingStats}
              onValueChange={(value) => update('showReadingStats', value)}
            />
            <FieldGroup.SectionFooter>
              <FooterText>Text size applies to the document reader. Reading stats show the word count and
              estimated reading time.</FooterText>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Behavior">
            <SettingSwitch
              label="Haptic feedback"
              value={settings.haptics}
              onValueChange={(value) => update('haptics', value)}
            />
            <SettingSwitch
              label="Save recent files"
              value={settings.rememberRecents}
              onValueChange={(value) => update('rememberRecents', value)}
            />
            <FieldGroup.SectionFooter>
              <FooterText>Haptics add a light tap when opening or acting on documents. With recent files off,
              new documents are not added to the home list.</FooterText>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Storage">
            <ListItem onPress={onClearRecents} supportingText={recentSummary}>
              Clear recent files
            </ListItem>
            <ListItem onPress={onReset} supportingText="Restore appearance and reading defaults.">
              Reset settings
            </ListItem>
          </FieldGroup.Section>

          <FieldGroup.Section title="About">
            <Row spacing={12}>
              <NativeText>Version</NativeText>
              <Spacer flexible />
              <NativeText textStyle={{ color: c.textSecondary }}>{version}</NativeText>
            </Row>
            <Row spacing={12}>
              <NativeText>Documents</NativeText>
              <Spacer flexible />
              <NativeText textStyle={{ color: c.textSecondary }}>Markdown and text</NativeText>
            </Row>
            <FieldGroup.SectionFooter>
              <FooterText>MDR reads files locally. Nothing is uploaded or sent anywhere.</FooterText>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Space.lg,
    paddingBottom: Space.md,
    gap: Space.xs,
  },
  host: {
    flex: 1,
  },
});
