import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePathname, router } from 'expo-router';

export default function BottomNavigation() {
  const navigation = useNavigation<any>();
  const route = useRoute(); // route active
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>

       {/* Acceuil */}
    <TouchableOpacity onPress={() => router.push('/HOME/ACCEUIL/acceuil')}>
    <Image
        source={
        route.name.startsWith('HOME/ACCEUIL')
            ? require('../assets/images/home.png')
            : require('../assets/images/home2.png')
        }
        style={styles.icon}
    />
    </TouchableOpacity>

        {/* Liste */}
<TouchableOpacity onPress={() => router.push('/HOME/LISTE/liste')}>
  <Image
    source={
      pathname.startsWith('/HOME/LISTE')
        ? require('../assets/images/liste.png')
        : require('../assets/images/liste2.png')
    }
    style={styles.icon}
  />
</TouchableOpacity>

       {/* Frigo */}
    <TouchableOpacity onPress={() => router.push('/HOME/FRIGO/frigo')}>
    <Image
        source={
        route.name.startsWith('HOME/FRIGO')
            ? require('../assets/images/frigo.png')
            : require('../assets/images/frigo2.png')
        }
        style={styles.icon}
    />
    </TouchableOpacity>

        {/* Profil */}
    <TouchableOpacity onPress={() => router.push('/HOME/PROFIL/ProfilePage')}>
    <Image
        source={
        route.name.startsWith('HOME/PROFIL')
            ? require('../assets/images/utilisateur.png')
            : require('../assets/images/utilisateur2.png')
        }
        style={styles.icon}
    />
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#FFE8CC',
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 25, // valeur à ajuster selon l'arrondi souhaité
  },
  icon: {
    height: 38,
    width: 38,
  },
});
