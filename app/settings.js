import { Stack, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SettingsModal() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Ayarlar' }} />

      <Text style={styles.title}>Ayarlar</Text>
      <Text style={styles.subtitle}>Ses, Tema? idk, Dil? belki ve Veri Sıfırlama ayarları burada olacak.</Text>
      
      <View style={{ marginTop: 20 }}>
          <Button title="Kapat" onPress={() => router.back()} color="#FF6F00" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0D0D0',
    textAlign: 'center',
  },
});
