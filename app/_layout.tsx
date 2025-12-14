import { Stack } from "expo-router";

export default function RootLayout() {
  return (<Stack>
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
        }} 
      />
      <Stack.Screen 
        name="stats" 
        options={{ 
          presentation: 'card',
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
    </Stack>);
}
