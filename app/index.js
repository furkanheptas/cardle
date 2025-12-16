import { Stack, useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Cardle' }} />

      <Text style={styles.title}>Cardle</Text>
      <Text style={styles.subtitle}>Arabayı tahmin etmeye başla!</Text>

      <View style={{ width: "100%", marginTop: 20 }}>
        <Button title="Oyuna Başla" onPress={() => router.push('/game')} color="#FF6F00" />
        <View style={{ height: 10 }} />
        <Button title="İstatistikler" onPress={() => router.push('/stats')} color="#007AFF" />
        <View style={{ height: 10 }} />
        <Button title="Ayarlar" onPress={() => router.push('/settings')} color="#333333" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});
