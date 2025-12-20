import { Stack, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetStats } from './utils/stats';
import { t, LANGUAGE_KEY, setStoredLanguage } from './utils/i18n';

export default function SettingsModal() {
  const router = useRouter();
  const confirmReset = () => {
    resetStats()
      .then((res) => {
        if (res) {
          Alert.alert(t(lang, 'ok'), t(lang, 'settings.reset_ok'));
        } else {
          Alert.alert(t(lang, 'error'), t(lang, 'settings.reset_err'));
        }
      })
      .catch(() => {
        Alert.alert(t(lang, 'error'), t(lang, 'settings.reset_err'));
      });
  };
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (v) setLang(v);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const changeLang = async (l) => {
    try {
      await setStoredLanguage(l);
      setLang(l);
    } catch (e) {
      // ignore
    }
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: t(lang, 'settings.header') }} />

      <Text style={styles.title}>{t(lang, 'settings.title')}</Text>
      <Text style={styles.subtitle}>{t(lang, 'settings.subtitle')}</Text>
      
        <View style={{ marginTop: 20 }}>
          <Button title={t(lang, 'settings.close')} onPress={() => router.back()} color="#AF6000" />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button title={t(lang, 'settings.reset')} onPress={confirmReset} color="#AF6000" />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 18, gap: 10 }}>
          <View style={{ marginRight: 8 }}>
            <Button title={t(lang, 'settings.lang_tr')} onPress={() => changeLang('tr')} color={lang === 'tr' ? '#AF6000' : '#888'} />
          </View>
          <View>
            <Button title={t(lang, 'settings.lang_en')} onPress={() => changeLang('en')} color={lang === 'en' ? '#AF6000' : '#888'} />
          </View>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#AF6000',
    fontFamily: 'Kavoon',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 28,
    color: '#AF6000',
    textAlign: 'center',
    marginBottom: 30,
  },
});
