import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'İstatistikler' }} />
      
      <Text style={styles.title}>İstatistiklerim</Text>
      <Text style={styles.subtitle}>Toplam Oyun Sayısı, Kazanma Oranı, vb vb</Text>
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
    fontSize: 24,
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
