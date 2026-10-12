import * as DocumentPicker from "expo-document-picker";

/**
Picks a file then returns the result
will will include the uri of that file
*/
export async function pickFile() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["text/markdown", "text/plain"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0]; // will be expected to select only one file
      return uri;
    }
  } catch (error) {
    throw error;
  }
}

export async function readFileText(uri: string): Promise<string> {
  const res = await fetch(uri);
  return res.text();
}

export function firstLineOf(text: string): string {
  const line = text.split("\n").find((value) => value.trim().length > 0) ?? "";
  return line.replace(/^#{1,6}\s*/, "").replace(/[*_`>]/g, "").trim();
}

export function wordCountOf(text: string): number {
  const words = text.replace(/[#*_`>|-]/g, " ").match(/\S+/g);
  return words ? words.length : 0;
}
