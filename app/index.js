import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t, LANGUAGE_KEY } from './utils/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Cardle' }} />

      <Text style={styles.title}>{t(lang, 'app.title').toUpperCase()}</Text>
      <Text style={styles.subtitle}>{t(lang, 'index.welcome')}</Text>

      <View style={{ width: "100%", marginTop: 20, alignItems: 'center' }}>
        <TouchableOpacity style={styles.startButton} onPress={() => router.push('/game')} activeOpacity={0.85}>
          <Text style={styles.startButtonText}>{t(lang, 'index.start')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/stats')}>
          <Text style={styles.linkButtonText}>{t(lang, 'index.statistics')}</Text>
        </TouchableOpacity>

      </View>

      <Pressable style={styles.settingsFab} onPress={() => router.push('/settings')}>
        <MaterialCommunityIcons name="cog" size={24} color="#fff" />
      </Pressable>
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
  startButton: {
    width: '80%',
    height: 84,
    backgroundColor: '#AF6000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    marginVertical: 18,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Kavoon',
    letterSpacing: 2,
  },
  linkButton: {
    width: '60%',
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  linkButtonText: {
    color: '#AF6000',
    fontSize: 18,
    fontWeight: '600',
  },
  settingsFab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#AF6000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
