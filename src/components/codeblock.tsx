import type { ReactNode } from 'react';
import { Platform, ScrollView, Text, useColorScheme } from 'react-native';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

type Theme = Record<string, string>;

const themes: Record<'dark' | 'light', Theme> = {
  dark: {
    base: '#e6e6e6', bg: '#1e2327',
    'hljs-keyword': '#c678dd', 'hljs-string': '#98c379',
    'hljs-number': '#d19a66', 'hljs-comment': '#7f848e',
    'hljs-title': '#61afef', 'hljs-built_in': '#e5c07b',
    'hljs-literal': '#d19a66', 'hljs-attr': '#d19a66',
  },
  light: {
    base: '#1a1a1a', bg: '#f3f4f6',
    'hljs-keyword': '#a626a4', 'hljs-string': '#50a14f',
    'hljs-number': '#986801', 'hljs-comment': '#a0a1a7',
    'hljs-title': '#4078f2', 'hljs-built_in': '#c18401',
    'hljs-literal': '#986801', 'hljs-attr': '#986801',
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

    const className = Array.isArray(properties?.className)
      ? properties.className
      : [];
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
  const theme = themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
  const source = code.trimEnd();

  const lang = language && lowlight.registered(language) ? language : null;
  const tree = lang ? lowlight.highlight(lang, source) : null;

  return (
    <ScrollView
      horizontal
      style={{ backgroundColor: theme.bg, borderRadius: 8, marginVertical: 8 }}
      contentContainerStyle={{ padding: 12 }}>
      <Text
        style={{
          color: theme.base,
          fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
          fontSize: 13,
        }}>
        {tree ? tree.children.map((c, i) => renderNode(c, theme, i)) : source}
      </Text>
    </ScrollView>
  );
}