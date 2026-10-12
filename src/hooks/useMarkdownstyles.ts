import { useColorScheme } from 'react-native';

export function useMarkdownStyles() {
  const dark = useColorScheme() === 'dark';

  const text = dark ? '#e6e6e6' : '#1a1a1a';
  const muted = dark ? '#9aa0a6' : '#555';
  const border = dark ? '#3a3f45' : '#d0d7de';
  const codeBg = dark ? '#1e2327' : '#f3f4f6';
  const link = dark ? '#4da3ff' : '#0b62d6';

  return {
    body: { color: text },
    text: { color: text },
    paragraph: { color: text },
    heading1: { color: text },
    heading2: { color: text },
    heading3: { color: text },
    heading4: { color: text },
    heading5: { color: text },
    heading6: { color: text },
    strong: { color: text },
    em: { color: text },
    link: { color: link },
    blockquote: { backgroundColor: codeBg, borderColor: border },
    code_inline: { color: text, backgroundColor: codeBg, borderColor: border },
    code_block: { color: text, backgroundColor: codeBg, borderColor: border },
    fence: { color: text, backgroundColor: codeBg, borderColor: border },
    hr: { backgroundColor: border },
    list_item: { color: text },
    table: { borderColor: border },
    th: { color: text },
    td: { color: text },
  };
}