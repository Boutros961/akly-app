import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import { View } from 'react-native';

// Empêche l'écran splash de se fermer automatiquement
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="presentation" options={{ headerShown: false }} />
        <Stack.Screen name="UserInfos" options={{ headerShown: false }} />
        <Stack.Screen name="HOME/ACCEUIL/acceuil" options={{ headerShown: false }} />
        <Stack.Screen name="HOME/FRIGO/frigo" options={{ headerShown: false }} />
        <Stack.Screen name="HOME/LISTE/liste" options={{ headerShown: false }} />
        <Stack.Screen name="HOME/LISTE/ajouterfoyer" options={{ headerShown: false }} />
        <Stack.Screen name="HOME/LISTE/courselist" options={{ headerShown: false }} />
        <Stack.Screen name="HOME/PROFIL/ProfilePage" options={{ headerShown: false }} />






        {/* Ajoute d'autres pages ici au besoin */}
      </Stack>
    </View>
  );
}




