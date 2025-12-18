import { Stack } from "expo-router";
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Kavoon: require('../assets/fonts/Kavoon-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#345774' }}>
        <ActivityIndicator size="large" color="#AF6000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, 
        }} 
      />
      <Stack.Screen 
        name="game" 
        options={{ 
          presentation: 'card',
          headerStyle: { backgroundColor: '#345774' },
          headerTintColor: '#fff'
        }} 
      />
      <Stack.Screen 
        name="stats" 
        options={{ 
          presentation: 'card',
          headerStyle: { backgroundColor: '#345774' },
          headerTintColor: '#fff'
        }} 
      />
      
      <Stack.Screen 
        name="settings" 
        options={{ 
          presentation: 'modal', 
          headerStyle: { backgroundColor: '#333333' },
          headerTintColor: '#FFFFFF'
        }} 
      />
    </Stack>
  );
}
