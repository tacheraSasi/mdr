import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { pickFile } from "@/lib/file";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTheme } from "@/hooks/use-theme";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleOpenFile = async () => {
    const uri = await pickFile();
    if (uri) {
      router.push({
        pathname: "/viewer",
        params: { uri },
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <View style={styles.brand}>
            <ThemedText type="display">MDR</ThemedText>
            <ThemedText type="label" themeColor="tint">
              Markdown Reader
            </ThemedText>
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={styles.tagline}>
            A quiet place to read your markdown and text files.
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleOpenFile}
            style={({ pressed }) => [
              styles.openButton,
              { backgroundColor: theme.tint },
              pressed && styles.openButtonPressed,
            ]}>
            <SymbolView
              name={{ ios: "doc.text.fill", android: "description", web: "description" }}
              size={18}
              tintColor={theme.tintText}
            />
            <ThemedText type="smallBold" themeColor="tintText">
              Open a file
            </ThemedText>
          </Pressable>

          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            Supports .md and .txt documents from this device
          </ThemedText>
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
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  brand: {
    alignItems: "center",
    gap: Spacing.one,
  },
  tagline: {
    textAlign: "center",
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  actions: {
    alignItems: "center",
    gap: Spacing.three,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: 14,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#208AEF",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  openButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  hint: {
    textAlign: "center",
  },
});