import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { common, createLowlight } from 'lowlight';

import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { paragraphGap } from '@/hooks/useMarkdownstyles';

const lowlight = createLowlight(common);

type Theme = Record<string, string>;

const themes: Record<'dark' | 'light', Theme> = {
  dark: {
    base: '#E6EDF7',
    bg: '#1E2327',
    'hljs-keyword': '#C792EA',
    'hljs-string': '#9ECE6A',
    'hljs-number': '#D6A46A',
    'hljs-comment': '#6E757C',
    'hljs-title': '#8AB8F0',
    'hljs-built_in': '#E5C07B',
    'hljs-literal': '#D6A46A',
    'hljs-attr': '#D6A46A',
  },
  light: {
    base: '#1E2733',
    bg: '#F3F4F6',
    'hljs-keyword': '#9A3F8F',
    'hljs-string': '#3E7A52',
    'hljs-number': '#A0621C',
    'hljs-comment': '#8A9199',
    'hljs-title': '#2F6FBF',
    'hljs-built_in': '#9A6A1C',
    'hljs-literal': '#A0621C',
    'hljs-attr': '#A0621C',
  },
};

function renderNode(node: unknown, theme: Theme, key: number): ReactNode | null {
  if (node && typeof node === 'object' && 'type' in node) {
    const { type, value, properties, children } = node as {
      type: string;
      value?: unknown;
      properties?: { className?: unknown };
      children?: unknown[];
    };

    if (type === 'text') return value as string;
    if (type !== 'element') return null;

    const className = Array.isArray(properties?.className) ? properties.className : [];
    const cls = className.find(
      (c): c is string => typeof c === 'string' && theme[c] != null,
    );

    return (
      <Text key={key} style={cls ? { color: theme[cls] } : undefined}>
        {(children ?? []).map((child, i) => renderNode(child, theme, i))}
      </Text>
    );
  }

  return null;
}

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const theme = themes[scheme === 'dark' ? 'dark' : 'light'];
  const source = code.trimEnd();

  const lang = language && lowlight.registered(language) ? language : null;
  const tree = lang ? lowlight.highlight(lang, source) : null;

  return (
    <View style={[styles.container, { backgroundColor: c.codeBg, borderColor: c.border }]}>
      {language ? (
        <View style={[styles.header, { borderBottomColor: c.border }]}>
          <Text style={[styles.language, { color: c.textSecondary }]}>{language}</Text>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Text style={[styles.code, { color: theme.base }]}>
          {tree ? tree.children.map((child, i) => renderNode(child, theme, i)) : source}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderRadius: Radius.code,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: paragraphGap,
  },
  header: {
    paddingHorizontal: Space.lg,
    paddingVertical: Space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  language: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    lineHeight: 20,
  },
});
