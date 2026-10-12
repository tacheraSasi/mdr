import { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { alert, toast } from "yooo-native";

import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Radius, Space, Type, pastelFor } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { pickFile } from "@/lib/file";
import { forgetFile, loadRecents, type RecentFile } from "@/lib/recents";

function RecentCard({
  item,
  onPress,
  onLongPress,
}: {
  item: RecentFile;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const scheme = useColorScheme();
  const c = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: c.pastel[pastelFor(item.name)] },
        pressed && styles.cardPressed,
      ]}>
      <Text numberOfLines={3} style={[Type.title, { color: c.text }]}>
        {item.name}
      </Text>
      <Text numberOfLines={2} style={[Type.caption, { color: c.textMuted }]}>
        {item.firstLine || "Empty document"}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const c = Colors[scheme === "dark" ? "dark" : "light"];
  const [recents, setRecents] = useState<RecentFile[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadRecents().then((items) => {
        if (active) setRecents(items);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const openFile = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      const uri = await pickFile();
      if (uri) {
        router.push({ pathname: "/viewer", params: { uri } });
      }
    } catch {
      toast.error("Couldn’t open that file", {
        description: "Choose a .md or .txt file and try again.",
      });
    }
  }, [router]);

  const openRecent = useCallback(
    (item: RecentFile) => {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
      router.push({ pathname: "/viewer", params: { uri: item.uri } });
    },
    [router],
  );

  const removeRecent = useCallback((item: RecentFile) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }
    alert.dialog("Remove from recents", `“${item.name}” will leave this list.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          forgetFile(item.uri).then(setRecents);
        },
      },
    ]);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <FlatList
          data={recents ?? []}
          keyExtractor={(item) => item.uri}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Space.xxl + BottomTabInset },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[Type.hero, { color: c.ink }]}>MDR</Text>
              <Text style={[Type.label, styles.label, { color: c.textSecondary }]}>
                Markdown Reader
              </Text>
              <Text style={[Type.body, styles.tagline, { color: c.textSecondary }]}>
                A quiet place to read your markdown and text files.
              </Text>

              <View style={styles.sectionHeader}>
                <Text style={[Type.subtitle, { color: c.text }]}>Recent</Text>
                <Text style={[Type.caption, { color: c.textMuted }]}>
                  {recents && recents.length > 0
                    ? `${recents.length} file${recents.length === 1 ? "" : "s"}`
                    : "Nothing yet"}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            recents === null ? null : (
              <View
                style={[
                  styles.empty,
                  { backgroundColor: c.backgroundElement, borderColor: c.border },
                ]}>
                <Text style={[Type.title, { color: c.text }]}>No recent files</Text>
                <Text style={[Type.caption, { color: c.textSecondary }]}>
                  Open a markdown or text file and it will wait for you here.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <RecentCard
              item={item}
              onPress={() => openRecent(item)}
              onLongPress={() => removeRecent(item)}
            />
          )}
        />

        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + BottomTabInset + Space.md },
          ]}>
          <Pressable
            onPress={openFile}
            style={({ pressed }) => [
              styles.openButton,
              { backgroundColor: c.ink },
              pressed && styles.openButtonPressed,
            ]}>
            <SymbolView
              name={{ ios: "doc.text.fill", android: "description", web: "description" }}
              size={18}
              tintColor={c.inkText}
            />
            <Text style={[Type.smallBold, { color: c.inkText }]}>Open a file</Text>
          </Pressable>
          <Text style={[Type.caption, styles.hint, { color: c.textMuted }]}>
            Supports .md and .txt documents from this device
          </Text>
        </View>
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
  listContent: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Space.lg,
    gap: Space.md,
  },
  row: {
    gap: Space.md,
  },
  header: {
    paddingTop: Platform.OS === "web" ? 72 : Space.lg,
    paddingBottom: Space.xs,
  },
  label: {
    marginTop: Space.xs,
    textTransform: "uppercase",
  },
  tagline: {
    marginTop: Space.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: Space.xxl,
  },
  card: {
    flex: 1,
    minHeight: 148,
    padding: Space.lg,
    borderRadius: Radius.card,
    justifyContent: "space-between",
    gap: Space.xl,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  empty: {
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Space.xl,
    gap: Space.sm,
  },
  footer: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    gap: Space.sm,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Space.sm,
    paddingVertical: 15,
    borderRadius: Radius.card,
  },
  openButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  hint: {
    textAlign: "center",
  },
});
