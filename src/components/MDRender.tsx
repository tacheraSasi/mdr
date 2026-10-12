import { useMarkdownStyles } from "@/hooks/useMarkdownstyles";
import Markdown, { MarkdownProps } from "react-native-markdown-renderer";
import { CodeBlock } from "./codeblock";

const codeRules = {
  fence: (node: any) => (
    <CodeBlock key={node.key} code={node.content} language={node.sourceInfo} />
  ),
  code_block: (node: any) => <CodeBlock key={node.key} code={node.content} />,
};

export const MDRender = ({ style, rules, ...rest }: MarkdownProps) => {
  const themeStyles = useMarkdownStyles();

  return (
    <Markdown
      {...rest}
      style={{ ...themeStyles, ...style }}
      rules={{ ...codeRules, ...rules }}
    />
  );
};