import AsyncStorage from '@react-native-async-storage/async-storage';

export const LANGUAGE_KEY = '@cardle_language_v1';

const translations = {
  tr: {
    'app.title': 'Cardle',
    'index.welcome': 'Hoşgeldiniz',
    'index.start': 'BAŞLA',
    'index.statistics': 'İstatistikler',

    'settings.header': 'Ayarlar',
    'settings.title': 'Ayarlar',
    'settings.subtitle': 'Ses, Tema? idk, Dil? belki ve Veri Sıfırlama ayarları burada olacak.',
    'settings.close': 'Kapat',
    'settings.reset': 'Verileri Sıfırla',
    'settings.reset_ok': 'İstatistikler sıfırlandı.',
    'settings.reset_err': 'Sıfırlama başarısız oldu.',
    'settings.lang_tr': 'Türkçe',
    'settings.lang_en': 'English',
    'ok': 'Tamam',
    'error': 'Hata',

    'game.header': 'Tahmin Et',
    'game.placeholder': 'Bir araba yazın...',
    'game.guess': 'Tahmin Et',
    'game.already_guessed': 'Bu aracı zaten tahmin ettiniz!',
    'game.congrats': 'Tebrikler! Bildiniz 🏎️',
    'game.over': 'Oyun Bitti',
    'game.new': 'Yeni Oyun',
    'stats.header': 'İstatistikler',
    'stats.my_stats': 'İstatistiklerim',
    'stats.loading': 'İstatistikler yükleniyor…',
    'stats.total_games': 'Toplam Oyun',
    'stats.total_wins': 'Kazanç',
    'stats.win_rate': 'Kazanma Oranı',
    'stats.current_streak': 'Seri',
    'stats.max_streak': 'En Uzun Seri',
  },
  en: {
    'app.title': 'Cardle',
    'index.welcome': 'Welcome',
    'index.start': 'START',
    'index.statistics': 'Statistics',

    'settings.header': 'Settings',
    'settings.title': 'Settings',
    'settings.subtitle': 'Sound, Theme, Language toggle and data reset options will be here.',
    'settings.close': 'Close',
    'settings.reset': 'Reset Data',
    'settings.reset_ok': 'Statistics reset.',
    'settings.reset_err': 'Reset failed.',
    'settings.lang_tr': 'Turkish',
    'settings.lang_en': 'English',
    'ok': 'OK',
    'error': 'Error',

    'game.header': 'Guess',
    'game.placeholder': 'Type a car...',
    'game.guess': 'Guess',
    'game.already_guessed': 'You already guessed this car!',
    'game.congrats': 'Congratulations! You guessed it 🏎️',
    'game.over': 'Game Over',
    'game.new': 'New Game',
    'stats.header': 'Statistics',
    'stats.my_stats': 'My Statistics',
    'stats.loading': 'Loading statistics…',
    'stats.total_games': 'Total Games',
    'stats.total_wins': 'Wins',
    'stats.win_rate': 'Win Rate',
    'stats.current_streak': 'Streak',
    'stats.max_streak': 'Max Streak',
  },
};

export function t(lang, key) {
  if (!lang) lang = 'tr';
  return (translations[lang] && translations[lang][key]) || translations['tr'][key] || key;
}

export async function getStoredLanguage() {
  try {
    const v = await AsyncStorage.getItem(LANGUAGE_KEY);
    return v || 'tr';
  } catch (e) {
    return 'tr';
  }
}

export async function setStoredLanguage(l) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, l);
  } catch (e) {
    // ignore
  }
}

export default { t, getStoredLanguage, setStoredLanguage };
