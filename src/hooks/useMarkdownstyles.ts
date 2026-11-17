import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/hooks/use-settings';
import { ReaderScale } from '@/lib/settings';

export const paragraphGap = 16;
export const codeRadius = 10;

export function useMarkdownStyles() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = Colors[dark ? 'dark' : 'light'];
  const mono = Fonts.mono;
  const hairline = StyleSheet.hairlineWidth;
  const { settings } = useSettings();
  const scale = ReaderScale[settings.readerTextSize];

  return useMemo(() => {
    const s = (size: number) => Math.round(size * scale);

    return ({
    root: { width: '100%', alignSelf: 'stretch' },
    view: {},

    text: {
      color: c.text,
      fontSize: s(16),
      lineHeight: s(27),
    },
    paragraph: {
      marginTop: 0,
      marginBottom: paragraphGap,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    strong: {
      color: c.text,
      fontWeight: '700',
    },
    em: { fontStyle: 'italic' },
    del: { textDecorationLine: 'line-through' },
    strikethrough: { textDecorationLine: 'line-through' },
    u: { textDecorationLine: 'underline' },

    link: {
      color: c.link,
      textDecorationLine: 'underline',
      textDecorationColor: c.link,
    },
    blocklink: {
      flex: 1,
      color: c.link,
      textDecorationLine: 'underline',
      textDecorationColor: c.link,
      borderBottomWidth: 0,
    },

    headingContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      marginTop: 30,
      marginBottom: 10,
    },
    heading: {
      color: c.text,
      fontWeight: '700',
    },
    heading1: { fontSize: s(28), lineHeight: s(36), letterSpacing: -0.4 },
    heading1Container: {
      paddingBottom: 10,
      borderBottomWidth: hairline,
      borderBottomColor: c.border,
      marginBottom: 16,
    },
    heading2: { fontSize: s(22), lineHeight: s(30), letterSpacing: -0.3 },
    heading2Container: { paddingBottom: 2, borderBottomWidth: 0 },
    heading3: { fontSize: s(18), lineHeight: s(26), letterSpacing: -0.2 },
    heading4: { fontSize: s(16), lineHeight: s(24) },
    heading5: { fontSize: s(15), lineHeight: s(22), color: c.textSecondary },
    heading6: { fontSize: s(13), lineHeight: s(20), color: c.textSecondary, letterSpacing: 0.4 },

    hr: {
      backgroundColor: c.border,
      height: hairline,
      borderRadius: 999,
      marginTop: 28,
      marginBottom: 28,
    },

    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: c.border,
      paddingHorizontal: 0,
      paddingLeft: 14,
      paddingVertical: 2,
      marginBottom: paragraphGap,
    },
    blockquoteText: { color: c.textSecondary },

    callout: {
      borderRadius: 16,
      padding: 14,
      gap: 6,
      marginBottom: paragraphGap,
    },
    calloutLabel: {
      fontSize: s(12),
      lineHeight: s(16),
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    calloutBody: { marginBottom: -paragraphGap },

    codeInline: {
      color: c.ink,
      backgroundColor: c.codeBg,
      borderWidth: hairline,
      borderColor: c.border,
      borderRadius: 6,
      paddingHorizontal: 5,
      paddingVertical: 2,
      fontFamily: mono,
      fontSize: s(14),
      lineHeight: s(22),
      overflow: 'hidden',
    },
    inlineCode: {
      color: c.ink,
      backgroundColor: c.codeBg,
      borderRadius: 6,
      paddingHorizontal: 5,
      paddingVertical: 2,
      fontFamily: mono,
      fontSize: s(14),
      lineHeight: s(22),
    },
    codeBlock: {
      color: c.text,
      backgroundColor: c.codeBg,
      borderRadius: codeRadius,
      padding: 14,
      fontFamily: mono,
      fontSize: s(13),
      lineHeight: s(20),
      marginBottom: paragraphGap,
    },
    pre: { marginBottom: 0 },

    list: { marginBottom: paragraphGap },
    listItem: { flex: 1, flexWrap: 'wrap' },
    listUnordered: {},
    listUnorderedItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 6,
    },
    listUnorderedItemIcon: {
      color: c.textMuted,
      fontSize: s(16),
      lineHeight: s(27),
      marginLeft: 4,
      marginRight: 10,
    },
    listUnorderedItemText: { fontSize: s(16), lineHeight: s(27), color: c.text },
    listOrdered: {},
    listOrderedItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 6,
    },
    listOrderedItemIcon: {
      color: c.textSecondary,
      fontSize: s(15),
      lineHeight: s(27),
      fontWeight: '600',
      fontVariant: ['tabular-nums'],
      minWidth: 22,
      marginLeft: 4,
      marginRight: 10,
    },
    listOrderedItemText: { fontSize: s(16), lineHeight: s(27), color: c.text },

    hardbreak: { width: '100%', height: 1 },

    tableScroll: { marginBottom: paragraphGap, alignSelf: 'stretch' },
    table: {
      borderWidth: hairline,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: c.backgroundElement,
      marginBottom: 0,
    },
    tableHeader: { backgroundColor: c.codeBg },
    tableHeaderText: {
      color: c.textSecondary,
      fontSize: s(12),
      lineHeight: s(16),
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    tableHeaderCell: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 0,
      justifyContent: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      borderBottomWidth: 0,
    },
    tableRowCell: {
      flex: 1,
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderWidth: 0,
      justifyContent: 'flex-start',
    },

    image: { flex: 1 },
    });
  }, [c, mono, hairline, scale]);
}
