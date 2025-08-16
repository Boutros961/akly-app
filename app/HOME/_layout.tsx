// app/HOME/_layout.tsx
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

const Icon = ({ focused, on, off }: { focused: boolean; on: any; off: any }) => (
  <Image source={focused ? on : off} style={{ width: 38, height: 38 }} />
);

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#FFE8CC',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 12,
          borderRadius: 25,
          marginHorizontal: 0,
          marginBottom: 0,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="ACCEUIL/HomePage"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              focused={focused}
              on={require('../../assets/images/home.png')}
              off={require('../../assets/images/home2.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LISTE/liste"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              focused={focused}
              on={require('../../assets/images/liste.png')}
              off={require('../../assets/images/liste2.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="FRIGO/frigo"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              focused={focused}
              on={require('../../assets/images/frigo.png')}
              off={require('../../assets/images/frigo2.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="PROFIL/ProfilePage"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              focused={focused}
              on={require('../../assets/images/utilisateur.png')}
              off={require('../../assets/images/utilisateur2.png')}
            />
          ),
        }}
      />

      {/* 👇 MASQUER les sous-pages pour qu'elles n'apparaissent pas comme onglet */}
      <Tabs.Screen name="LISTE/ajouterfoyer" options={{ href: null }} />
      <Tabs.Screen name="LISTE/courselist" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/HomePage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/AppetizersPage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/ExpressRecipesPage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/FastRecipesPage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/LightDessertsPage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/ProteinRecipesPage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/VegetarianPage" options={{ href: null }} />
      <Tabs.Screen name="ACCEUIL/LowCalRecipesPage" options={{ href: null }} />







    </Tabs>
  );
}
