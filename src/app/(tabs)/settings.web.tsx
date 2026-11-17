import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { alert, toast } from 'yooo-native';

import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Colors, MaxContentWidth, Radius, Space, Type } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/hooks/use-settings';
import { clearRecents, loadRecents } from '@/lib/recents';
import {
  TEXT_SIZE_OPTIONS,
  THEME_OPTIONS,
  type AppSettings,
  type ReaderTextSize,
  type ThemePreference,
} from '@/lib/settings';

function SettingsRow({ label, children }: { label: string; children: ReactNode }) {
  const c = Colors[useColorScheme()];

  return (
    <View style={styles.row}>
      <Text style={[Type.body, { color: c.text }]}>{label}</Text>
      <View style={styles.rowControl}>{children}</View>
    </View>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const c = Colors[useColorScheme()];

  return (
    <View style={styles.segmented} accessibilityLabel={label} role="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            role="radio"
            aria-checked={selected}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              {
                backgroundColor: selected ? c.ink : 'transparent',
                borderColor: c.border,
              },
              pressed && styles.pressed,
            ]}>
            <Text
              style={[
                Type.small,
                { color: selected ? c.inkText : c.textSecondary, fontWeight: selected ? '700' : '500' },
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const c = Colors[useColorScheme()];

  return (
    <View style={styles.section}>
      <Text style={[Type.label, { color: c.textSecondary }]}>{title}</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.backgroundElement, borderColor: c.border },
        ]}>
        {children}
      </View>
      {description ? (
        <Text style={[Type.caption, { color: c.textMuted }]}>{description}</Text>
      ) : null}
    </View>
  );
}

function Divider() {
  const c = Colors[useColorScheme()];
  return <View style={[styles.divider, { backgroundColor: c.border }]} />;
}

export default function SettingsScreen() {
  const c = Colors[useColorScheme()];
  const { settings, updateSettings, resetSettings } = useSettings();
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
            toast.success('Recent files cleared');
          },
        },
      ],
    );
  }, [recentCount]);

  const onReset = useCallback(() => {
    alert.dialog('Reset settings?', 'Appearance and reading options return to their defaults.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetSettings();
          toast.success('Settings reset');
        },
      },
    ]);
  }, [resetSettings]);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const recentSummary =
    recentCount === null
      ? 'Loading…'
      : recentCount === 0
        ? 'No recent files'
        : `${recentCount} file${recentCount === 1 ? '' : 's'} saved`;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: c.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Space.xxl }]}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={[Type.display, { color: c.ink }]}>Settings</Text>
        <Text style={[Type.caption, { color: c.textSecondary }]}>
          Preferences and information about MDR.
        </Text>
      </View>

      <SectionCard
        title="Appearance"
        description="System follows your device’s light and dark appearance. The whole app updates immediately.">
        <SettingsRow label="Theme">
          <Segmented
            label="Theme"
            options={THEME_OPTIONS}
            value={settings.theme}
            onChange={(value: ThemePreference) => update('theme', value)}
          />
        </SettingsRow>
      </SectionCard>

      <SectionCard
        title="Reading"
        description="Text size applies to the document reader. Reading stats show the word count and estimated reading time.">
        <SettingsRow label="Text size">
          <Segmented
            label="Reader text size"
            options={TEXT_SIZE_OPTIONS}
            value={settings.readerTextSize}
            onChange={(value: ReaderTextSize) => update('readerTextSize', value)}
          />
        </SettingsRow>
        <Divider />
        <SettingsRow label="Show reading stats">
          <Switch
            value={settings.showReadingStats}
            onValueChange={(value) => update('showReadingStats', value)}
            accessibilityLabel="Show reading stats"
          />
        </SettingsRow>
      </SectionCard>

      <SectionCard
        title="Behavior"
        description="With recent files off, new documents are not added to the home list.">
        <SettingsRow label="Save recent files">
          <Switch
            value={settings.rememberRecents}
            onValueChange={(value) => update('rememberRecents', value)}
            accessibilityLabel="Save recent files"
          />
        </SettingsRow>
      </SectionCard>

      <SectionCard title="Storage" description={recentSummary}>
        <Pressable
          onPress={onClearRecents}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={[Type.body, { color: c.text }]}>Clear recent files</Text>
        </Pressable>
        <Divider />
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={[Type.body, { color: c.text }]}>Reset settings</Text>
        </Pressable>
      </SectionCard>

      <SectionCard title="About" description="MDR reads files locally. Nothing is uploaded or sent anywhere.">
        <SettingsRow label="Version">
          <Text style={[Type.caption, { color: c.textSecondary }]}>{version}</Text>
        </SettingsRow>
        <Divider />
        <SettingsRow label="Documents">
          <Text style={[Type.caption, { color: c.textSecondary }]}>Markdown and text</Text>
        </SettingsRow>
      </SectionCard>

      <WebBadge />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingTop: 72,
    paddingHorizontal: Space.lg,
    gap: Space.xl,
  },
  header: {
    gap: Space.xs,
  },
  section: {
    gap: Space.sm,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    minHeight: 52,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  rowControl: {
    flexShrink: 1,
  },
  segmented: {
    flexDirection: 'row',
    gap: Space.xs,
  },
  segment: {
    paddingVertical: Space.xs,
    paddingHorizontal: Space.md,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Space.lg,
  },
  action: {
    minHeight: 52,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
    justifyContent: 'center',
  },
});
