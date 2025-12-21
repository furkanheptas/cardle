import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getStats } from './utils/stats';
import { t, getStoredLanguage } from './utils/i18n';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    (async () => {
      const l = await getStoredLanguage();
      setLang(l || 'tr');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const s = await getStats();
      setStats(s);
    })();
  }, []);

  const winRate = stats && stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: t(lang, 'stats.header') }} />
      
      <Text style={styles.title}>{t(lang, 'stats.my_stats')}</Text>
      {stats ? (
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardNumber}>{stats.totalGames}</Text>
            <Text style={styles.cardLabel}>{t(lang, 'stats.total_games')}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardNumber}>{stats.totalWins}</Text>
            <Text style={styles.cardLabel}>{t(lang, 'stats.total_wins')}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardNumber}>{winRate}%</Text>
            <Text style={styles.cardLabel}>{t(lang, 'stats.win_rate')}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.subtitle}>{t(lang, 'stats.loading')}</Text>
      )}

      <View style={{ marginTop: 24 }}>
        <Text style={styles.subtitle}>{`${t(lang, 'stats.current_streak')}: ${stats ? stats.currentStreak : 0} | ${t(lang, 'stats.max_streak')}: ${stats ? stats.maxStreak : 0}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#345774',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#AF6000',
    marginBottom: 18,
    fontFamily: 'Kavoon',
  },
  subtitle: {
    fontSize: 16,
    color: '#F0E6DA',
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  card: {
    flex: 1,
    backgroundColor: '#243a46',
    marginHorizontal: 6,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#BFD1D8',
  }
});
