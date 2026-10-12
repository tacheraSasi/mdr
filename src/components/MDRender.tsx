import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Markdown, {
  AstRenderer,
  MarkdownIt,
  renderRules as defaultRenderRules,
  type ASTNode,
  type MarkdownProps,
  type MarkdownStyles,
  type RenderRules,
} from 'react-native-markdown-renderer';

import { CodeBlock } from './codeblock';
import { Colors, type PastelRole } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMarkdownStyles } from '@/hooks/useMarkdownstyles';

const markdownit = MarkdownIt({ typographer: true, linkify: true });

type CalloutKind = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const CALLOUTS: Record<CalloutKind, { label: string; role: PastelRole }> = {
  note: { label: 'Note', role: 'blue' },
  tip: { label: 'Tip', role: 'green' },
  important: { label: 'Important', role: 'purple' },
  warning: { label: 'Warning', role: 'yellow' },
  caution: { label: 'Caution', role: 'red' },
};

const ALERT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

function stripLeadingInline(children: ASTNode[]) {
  while (children.length > 0) {
    const first = children[0];
    if (first.type === 'softbreak' || first.type === 'hardbreak') {
      children.shift();
      continue;
    }
    if (first.type === 'text' && !first.content) {
      children.shift();
      continue;
    }
    break;
  }
}

function annotateCallouts(nodes: ASTNode[]) {
  for (const node of nodes) {
    if (node.type === 'blockquote') {
      const paragraph = node.children[0];
      const group = paragraph?.children[0];
      const text =
        group?.type === 'textgroup'
          ? group.children.find((child) => child.type === 'text')
          : undefined;
      const match = group && text ? ALERT_RE.exec(text.content) : null;

      if (paragraph && group && text && match) {
        node.attributes = { ...node.attributes, 'mdr-callout': match[1].toLowerCase() };
        text.content = text.content.slice(match[0].length);
        stripLeadingInline(group.children);
        if (group.children.length === 0) paragraph.children.shift();
        stripLeadingInline(paragraph.children);
        if (paragraph.children.length === 0) node.children.shift();
      }
    }

    if (node.children?.length) annotateCallouts(node.children);
  }
}

function alignmentOf(node: ASTNode): {
  alignItems?: ViewStyle['alignItems'];
  textAlign?: TextStyle['textAlign'];
} {
  const style = node.attributes?.style ?? '';
  if (style.includes('text-align:center')) return { alignItems: 'center', textAlign: 'center' };
  if (style.includes('text-align:right')) return { alignItems: 'flex-end', textAlign: 'right' };
  if (style.includes('text-align:left')) return { alignItems: 'flex-start', textAlign: 'left' };
  return {};
}

function MDTable({
  node,
  styles,
  children,
}: {
  node: ASTNode;
  styles: MarkdownStyles;
  children: ReactNode;
}) {
  const [available, setAvailable] = useState(0);
  const columns = node.children[0]?.children[0]?.children.length ?? 1;
  const contentWidth = Math.max(available, Math.min(columns, 8) * 150);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => setAvailable(event.nativeEvent.layout.width)}
      style={styles.tableScroll as ViewStyle}>
      <View style={[styles.table as ViewStyle, available > 0 && { width: contentWidth }]}>
        {children}
      </View>
    </ScrollView>
  );
}

export const MDRender = ({ style, rules, children, ...rest }: MarkdownProps) => {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const themeStyles = useMarkdownStyles();

  const renderer = useMemo(() => {
    const border = c.border;
    const styles: MarkdownStyles = style ? { ...themeStyles, ...style } : themeStyles;

    const customRules: RenderRules = {
      fence: (node) => (
        <CodeBlock key={node.key} code={node.content} language={node.sourceInfo} />
      ),
      code_block: (node) => <CodeBlock key={node.key} code={node.content} />,

      table: (node, children, _parent, ruleStyles) => (
        <MDTable key={node.key} node={node} styles={ruleStyles}>
          {children}
        </MDTable>
      ),

      th: (node, children, _parent, ruleStyles) => (
        <View
          key={node.key}
          style={[
            ruleStyles.tableHeaderCell as ViewStyle,
            { alignItems: alignmentOf(node).alignItems },
          ]}>
          {children}
        </View>
      ),

      td: (node, children, _parent, ruleStyles) => (
        <View
          key={node.key}
          style={[
            ruleStyles.tableRowCell as ViewStyle,
            { alignItems: alignmentOf(node).alignItems },
          ]}>
          {children}
        </View>
      ),

      tr: (node, children, parent, ruleStyles) => {
        const section = parent[0];
        const showBorder =
          section?.type === 'thead' ||
          !section ||
          node.index !== section.children.length - 1;

        return (
          <View
            key={node.key}
            style={[
              ruleStyles.tableRow as ViewStyle,
              showBorder && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: border,
              },
            ]}>
            {children}
          </View>
        );
      },

      blockquote: (node, children, _parent, ruleStyles) => {
        const kind = node.attributes['mdr-callout'] as CalloutKind | undefined;
        const callout = kind ? CALLOUTS[kind] : undefined;

        if (callout) {
          return (
            <View
              key={node.key}
              style={[
                ruleStyles.callout as ViewStyle,
                { backgroundColor: c.pastel[callout.role] },
              ]}>
              <Text style={[ruleStyles.calloutLabel as TextStyle, { color: c.text }]}>
                {callout.label}
              </Text>
              <View style={ruleStyles.calloutBody as ViewStyle}>{children}</View>
            </View>
          );
        }

        return (
          <View key={node.key} style={ruleStyles.blockquote as ViewStyle}>
            {children}
          </View>
        );
      },

      paragraph: (node, children, parent, ruleStyles) => {
        const ancestor = parent[0];
        const extra: ViewStyle = {};

        if (ancestor?.type === 'list_item') {
          extra.marginBottom = 6;
        }

        return (
          <View key={node.key} style={[ruleStyles.paragraph as ViewStyle, extra]}>
            {children}
          </View>
        );
      },

      textgroup: (node, children, parent, ruleStyles) => {
        const owner = parent[0];
        const grandparent = parent[1];
        let extra: TextStyle | undefined;

        if (owner?.type === 'th') {
          extra = { ...(ruleStyles.tableHeaderText as TextStyle), ...alignmentOf(owner) };
        } else if (owner?.type === 'td') {
          const { textAlign } = alignmentOf(owner);
          if (textAlign) extra = { textAlign };
        } else if (
          grandparent?.type === 'blockquote' &&
          !grandparent.attributes['mdr-callout']
        ) {
          extra = ruleStyles.blockquoteText as TextStyle;
        }

        return (
          <Text key={node.key} style={[ruleStyles.text as TextStyle, extra]}>
            {children}
          </Text>
        );
      },
    };

    return new AstRenderer(
      { ...defaultRenderRules, ...customRules, ...rules },
      styles,
      { onLinkPress: rest.onLinkPress },
    );
  }, [c, themeStyles, style, rules, rest.onLinkPress]);

  const render = useCallback(
    (nodes: ASTNode[]) => {
      annotateCallouts(nodes);
      return renderer.render(nodes);
    },
    [renderer],
  );

  return (
    <Markdown {...rest} markdownit={markdownit} renderer={render}>
      {children}
    </Markdown>
  );
};
