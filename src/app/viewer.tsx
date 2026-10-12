import { useLocalSearchParams, useRouter } from "expo-router";
import { File } from "expo-file-system";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { readFileText } from "@/lib/file";
import { Fonts, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { SymbolView } from "expo-symbols";
import Markdown from 'react-native-markdown-renderer';
import { useMarkdownStyles } from "@/hooks/useMarkdownstyles";

export default function ViewerScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [fileContent, setFileContent] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();

  const mdStyles = useMarkdownStyles()

  const file = new File(uri);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const text = await readFileText(uri);
        if (!cancelled) setFileContent(text);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
  }, [uri]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
              size={16}
              tintColor={theme.text}
            />
          </Pressable>

          <View style={styles.headerText}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {file.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Markdown document
            </ThemedText>
          </View>
        </View>

        {error ? (
          <View style={styles.centerMessage}>
            <ThemedText type="small" style={styles.errorText}>
              Couldn’t read this file.
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            contentInsetAdjustmentBehavior="automatic">
            {fileContent ? (
              <View
                >
                  <Markdown style={mdStyles}>
                    {fileContent}
                </Markdown>
              </View>
            ) : (
              <View style={styles.centerMessage}>
                <ThemedText type="small" themeColor="textSecondary">
                  Loading…
                </ThemedText>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  paper: {
    width: "100%",
    maxWidth: MaxContentWidth,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
  },
  documentText: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    lineHeight: 26,
  },
  centerMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    padding: Spacing.four,
  },
  errorText: {
    color: "#E5484D",
    textAlign: "center",
  },
});
