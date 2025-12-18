import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@cardle_stats_v1';

const defaultStats = {
  totalGames: 0,
  totalWins: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayed: null,
};

export async function getStats() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return { ...defaultStats };
    return JSON.parse(json);
  } catch (e) {
    console.warn('getStats error', e);
    return { ...defaultStats };
  }
}

export async function recordGameResult(won) {
  try {
    const stats = await getStats();
    const now = new Date().toISOString();
    const next = { ...stats };
    next.totalGames += 1;
    if (won) {
      next.totalWins += 1;
      next.currentStreak = (next.currentStreak || 0) + 1;
      next.maxStreak = Math.max(next.maxStreak || 0, next.currentStreak);
    } else {
      next.currentStreak = 0;
    }
    next.lastPlayed = now;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch (e) {
    console.warn('recordGameResult error', e);
    return null;
  }
}
