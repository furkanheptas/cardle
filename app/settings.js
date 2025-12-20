import { Stack, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { resetStats } from './utils/stats';

export default function SettingsModal() {
  const router = useRouter();
  const confirmReset = () => {
    resetStats()
      .then((res) => {
        if (res) {
          Alert.alert('Tamam', 'İstatistikler sıfırlandı.');
        } else {
          Alert.alert('Hata', 'Sıfırlama başarısız oldu.');
        }
      })
      .catch(() => {
        Alert.alert('Hata', 'Sıfırlama başarısız oldu.');
      });
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Ayarlar' }} />

      <Text style={styles.title}>Ayarlar</Text>
      <Text style={styles.subtitle}>Ses, Tema? idk, Dil? belki ve Veri Sıfırlama ayarları burada olacak.</Text>
      
        <View style={{ marginTop: 20 }}>
          <Button title="Kapat" onPress={() => router.back()} color="#af0000ff" />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button title="Verileri Sıfırla" onPress={confirmReset} color="#AF6000" />
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
