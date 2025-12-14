import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  const handleExit = () => {
  if (Platform.OS === 'android') {
    BackHandler.exitApp(); 
  }
};

  const menuItems = [
    { title: 'Oyna', onPress: () => router.push('/game') },
    { title: 'İstatistikler', onPress: () => router.push('/stats') },
    { title: 'Çıkış', onPress: () => handleExit() },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>CARDLE</Text>
        <Text style={styles.logoSubtitle}>ARABA TAHMİN OYUNU</Text>
      </View>

      <View style={styles.buttonGroup}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.button} 
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.settingsButton} 
        onPress={() => router.push('/settings')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="cog" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  logoContainer: {
    marginTop: Platform.OS === 'android' ? 30 : 0,
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FF6F00',
    letterSpacing: 4,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 5,
    letterSpacing: 2,
  },

  buttonGroup: {
    width: '80%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#333333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  settingsButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: 'transparent',
    padding: 10,
  },
});