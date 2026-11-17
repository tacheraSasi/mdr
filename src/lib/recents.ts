import AsyncStorage from '@react-native-async-storage/async-storage';

export type RecentFile = {
  uri: string;
  name: string;
  firstLine: string;
  openedAt: number;
};

const STORAGE_KEY = 'mdr:recents:v1';
const LIMIT = 12;

function isRecentFile(value: unknown): value is RecentFile {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<RecentFile>;
  return (
    typeof item.uri === 'string' &&
    typeof item.name === 'string' &&
    typeof item.firstLine === 'string' &&
    typeof item.openedAt === 'number'
  );
}

export async function loadRecents(): Promise<RecentFile[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentFile).sort((a, b) => b.openedAt - a.openedAt);
  } catch {
    return [];
  }
}

async function save(recents: RecentFile[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
}

export async function rememberFile(file: Omit<RecentFile, 'openedAt'>): Promise<RecentFile[]> {
  const recents = await loadRecents();
  const next = [
    { ...file, openedAt: Date.now() },
    ...recents.filter((entry) => entry.uri !== file.uri),
  ].slice(0, LIMIT);

  await save(next);
  return next;
}

export async function forgetFile(uri: string): Promise<RecentFile[]> {
  const next = (await loadRecents()).filter((entry) => entry.uri !== uri);
  await save(next);
  return next;
}

export async function clearRecents(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
