import { useLocalSearchParams } from "expo-router";
import { File } from "expo-file-system";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useEffect, useState } from "react";
import { readFileText } from "@/lib/file";

export default function ViewerScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [fileContent, setFileContent] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);

  const file = new File(uri);
  console.log("URI ", uri);

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
    <ThemedView>
      <ThemedText>{fileContent}</ThemedText>
    </ThemedView>
  );
}
