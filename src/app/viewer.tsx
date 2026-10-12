import { useLocalSearchParams, useRouter } from "expo-router";
import { File } from "expo-file-system";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { Skeleton, Spinner } from "yooo-native";

import { MDRender } from "@/components/MDRender";
import { ThemedView } from "@/components/themed-view";
import { Colors, MaxContentWidth, Radius, Space, Type } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { firstLineOf, readFileText, wordCountOf } from "@/lib/file";
import { rememberFile } from "@/lib/recents";

export default function ViewerScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const c = Colors[scheme === "dark" ? "dark" : "light"];

  const [content, setContent] = useState<string | null>(null);
  const [name, setName] = useState("Document");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const file = new File(uri);
        const text = await readFileText(uri);
        if (cancelled) return;
        setName(file.name);
        setContent(text);
        await rememberFile({ uri, name: file.name, firstLine: firstLineOf(text) });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uri]);

  const words = useMemo(() => (content === null ? 0 : wordCountOf(content)), [content]);
  const meta = error
    ? "Couldn’t open"
    : content === null
      ? "Opening…"
      : `${words} word${words === 1 ? "" : "s"} · ${Math.max(1, Math.round(words / 200))} min read`;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: c.background },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
              size={16}
              tintColor={c.text}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text numberOfLines={1} style={[Type.smallBold, { color: c.text }]}>
              {name}
            </Text>
            <Text style={[Type.caption, { color: c.textMuted }]}>{meta}</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorWrap}>
            <View style={[styles.errorCard, { backgroundColor: c.pastel.red }]}>
              <Text style={[Type.smallBold, { color: c.text }]}>Couldn’t read this file</Text>
              <Text numberOfLines={4} style={[Type.caption, { color: c.textSecondary }]}>
                {error}
              </Text>
            </View>
          </View>
        ) : content !== null ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + Space.xxl },
            ]}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}>
            <View style={styles.paper}>
              <MDRender>{content}</MDRender>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.loading}>
            <View style={styles.skeleton}>
              <Skeleton variant="text" width="58%" height={28} borderRadius={8} />
              <Skeleton variant="text" width="100%" height={13} />
              <Skeleton variant="text" width="92%" height={13} />
              <Skeleton variant="text" width="96%" height={13} />
              <Skeleton variant="text" width="42%" height={13} />
            </View>
            <View style={styles.loadingRow}>
              <Spinner size="small" color={c.textMuted} />
              <Text style={[Type.caption, { color: c.textMuted }]}>Opening document…</Text>
            </View>
          </View>
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
    gap: Space.md,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
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
    paddingHorizontal: Space.lg,
  },
  paper: {
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingTop: Space.md,
  },
  loading: {
    flex: 1,
    alignItems: "center",
  },
  skeleton: {
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    gap: Space.md,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.sm,
    marginTop: Space.xl,
  },
  errorWrap: {
    flex: 1,
    alignItems: "center",
    padding: Space.lg,
  },
  errorCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: Radius.card,
    padding: Space.lg,
    gap: Space.xs,
  },
});
