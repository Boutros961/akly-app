import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import BottomNavigation from '../../../components/BottomNavigation';
import { screenStyles as s, colors } from '../../../components/screenStyles';
import { auth, db } from '../../../services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { router } from 'expo-router';

type Foyer = {
  id: string;
  nom: string;
  nbPersonnes: number;
  restrictions?: string[];
  preferences?: string;
  createdAt?: Timestamp | null;
};

export default function Liste() {
  const [username, setUsername] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [foyers, setFoyers] = useState<Foyer[]>([]);
  const [loadingFoyers, setLoadingFoyers] = useState(true);

  useEffect(() => {
    let unsubFoyers: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          setUsername('');
          setFoyers([]);
          setLoadingUser(false);
          setLoadingFoyers(false);
          return;
        }

        const snap = await getDoc(doc(db, 'users', u.uid));
        setUsername(snap.exists() ? (snap.data()?.username ?? '') : '');
        setLoadingUser(false);

        const q = query(collection(db, 'users', u.uid, 'foyers'), orderBy('createdAt', 'desc'));
        unsubFoyers = onSnapshot(
          q,
          (ss) => {
            const items = ss.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Foyer[];
            setFoyers(items);
            setLoadingFoyers(false);
          },
          (err) => {
            console.log('Erreur snapshot foyers:', err);
            setLoadingFoyers(false);
          }
        );
      } catch (e) {
        console.log('Erreur Firestore get username/foyers:', e);
        setUsername('');
        setFoyers([]);
        setLoadingUser(false);
        setLoadingFoyers(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubFoyers) unsubFoyers();
    };
  }, []);

  const goToAjouterFoyer = () => {
    router.push('/HOME/LISTE/ajouterfoyer' as const);
  };

  // ✅ MODIFICATION ICI - Passer l'ID du foyer à modifier
  const goToModifierFoyer = (foyerId: string) => {
    router.push(`/HOME/LISTE/ajouterfoyer?id=${foyerId}` as const);
  };

   // ✅ Nouvelle fonction pour aller vers CourseList
   const goToCourseList = (foyerId: string) => {
    router.push(`/HOME/LISTE/courselist?id=${foyerId}` as const);
  };

  const renderFoyer = ({ item }: { item: Foyer }) => (
    <View style={s.foyerCard}>
      {/* Header avec icône, nom et boutons */}
      <View style={s.foyerHeader}>
        <View style={s.foyerIconContainer}>
          <Image
            source={require('../../../assets/images/famille.png')}
            style={s.foyerIcon}
            resizeMode="contain"
          />
        </View>

        <View style={s.foyerInfo}>
          <Text style={s.foyerTitle}>{item.nom}</Text>
        </View>

        {/* Boutons côte à côte */}
        <View style={{ flexDirection: 'column', gap: 8 }}>
          <TouchableOpacity
            style={s.modifyBtn}
            onPress={() => goToModifierFoyer(item.id)}
            activeOpacity={0.7}
          >
            <Text style={s.modifyBtnText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.modifyBtn}
            onPress={() => goToCourseList(item.id)}
            activeOpacity={0.7}
          >
            <Text style={s.modifyBtnText}>Courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Blocs d'informations */}
      <View style={s.foyerBlocs}>
        {/* Bloc personnes */}
        <View style={s.blocPersonnes}>
          <Text style={s.blocNumber}>{item.nbPersonnes}</Text>
          <Text style={s.blocLabel}>
            {item.nbPersonnes > 1 ? 'personnes' : 'personne'}
          </Text>
        </View>

        {/* Bloc restrictions */}
        <View style={s.blocRestrictions}>
          <Text style={s.blocNumber}>{item.restrictions?.length || 0}</Text>
          <Text style={s.blocLabel}>
            {(item.restrictions?.length || 0) > 1 ? 'restrictions' : 'restriction'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.bgGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={s.container}
    >
      {/* Header texte */}
      <View style={s.content}>
        <Text style={s.title}>
          {loadingUser ? 'Chargement…' : `Salut ${username || '👋'}, Sélectionne ton foyer `}
        </Text>
      </View>

      {/* Bloc principal */}
      <View style={s.blocBlanc}>
        {/* Carte "Ajouter un foyer" */}
        <TouchableOpacity style={s.addCard} activeOpacity={0.85} onPress={goToAjouterFoyer}>
          <View style={s.addIcon}>
            <Text style={s.plus}>+</Text>
          </View>
          <Text style={s.addText}>Ajouter un foyer</Text>
        </TouchableOpacity>

        {/* Liste des foyers */}
        {loadingFoyers ? (
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={foyers}
            keyExtractor={(item) => item.id}
            renderItem={renderFoyer}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <Text style={[s.note, { marginTop: 16 }]}>
                Aucun foyer pour linstant. Créez-en un ci-dessus.
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Navbar */}
      <View style={s.bottomNavWrapper}>
        {/* <BottomNavigation /> */}
      </View>
    </LinearGradient>
  );
}