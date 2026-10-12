import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { Fonts, ThemeColor, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'hero'
    | 'display'
    | 'title'
    | 'label'
    | 'small'
    | 'smallBold'
    | 'caption'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'linkPrimary' && { color: theme.link },
        type === 'default' && styles.default,
        type === 'hero' && styles.hero,
        type === 'display' && styles.display,
        type === 'title' && styles.title,
        type === 'label' && styles.label,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'caption' && styles.caption,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: Type.body as TextStyle,
  hero: Type.hero as TextStyle,
  display: Type.display as TextStyle,
  title: Type.title as TextStyle,
  subtitle: Type.subtitle as TextStyle,
  small: Type.small as TextStyle,
  smallBold: Type.smallBold as TextStyle,
  caption: Type.caption as TextStyle,
  label: {
    ...(Type.label as TextStyle),
    textTransform: 'uppercase',
  },
  link: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  linkPrimary: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: Type.mono.fontSize,
    lineHeight: Type.mono.lineHeight,
  },
});
