// app/HOME/LISTE/CourseList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import BottomNavigation from '../../../components/BottomNavigation';
import { screenStyles as s, colors } from '../../../components/screenStyles';
import { useLocalSearchParams, router } from 'expo-router';

import { auth, db } from '../../../services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// ---- Types ----
type Foyer = {
  id: string;
  nom: string;
  nbPersonnes: number;
  restrictions?: string[];
  preferences?: string;
  isPublic?: boolean;
};

type CourseItem = {
  id: string;
  name: string;
  category: string;   // "Viandes" | "Produits laitiers" | ...
  bought: boolean;
  createdAt?: Timestamp | null;
  createdBy?: string;
};

// Catégories affichées (ordre et titres)
const CATEGORIES = [
  'Viandes',
  'Produits laitiers',
  'Fruits et légumes',
  'Condiments secs',
  'Droguerie',
];

// ---- Composant principal ----
export default function CourseList() {
  const { id } = useLocalSearchParams<{ id?: string }>(); // id = foyerId
  const [uid, setUid] = useState<string | null>(null);

  const [foyer, setFoyer] = useState<Foyer | null>(null);
  const [loadingFoyer, setLoadingFoyer] = useState(true);

  const [items, setItems] = useState<CourseItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [addingForCategory, setAddingForCategory] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  // --- Auth watcher ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
    });
    return unsub;
  }, []);

  // --- Charger le foyer ---
  useEffect(() => {
    const run = async () => {
      if (!uid || !id) return;
      setLoadingFoyer(true);
      try {
        const d = await getDoc(doc(db, 'users', uid, 'foyers', id));
        if (d.exists()) {
          const data = d.data() as any;
          setFoyer({
            id,
            nom: data.nom ?? 'Foyer',
            nbPersonnes: data.nbPersonnes ?? 1,
            restrictions: data.restrictions ?? [],
            preferences: data.preferences ?? '',
            isPublic: data.isPublic ?? false,
          });
        } else {
          setFoyer(null);
        }
      } catch (e) {
        console.log('Erreur get foyer:', e);
        setFoyer(null);
      } finally {
        setLoadingFoyer(false);
      }
    };
    run();
  }, [uid, id]);

  // --- Stream des items de courses ---
  useEffect(() => {
    if (!uid || !id) return;
    setLoadingItems(true);
    const qRef = query(
      collection(db, 'users', uid, 'foyers', id, 'courses'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      qRef,
      (ss) => {
        const arr = ss.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as CourseItem[];
        setItems(arr);
        setLoadingItems(false);
      },
      (err) => {
        console.log('Erreur snapshot courses:', err);
        setLoadingItems(false);
      }
    );
    return unsub;
  }, [uid, id]);

  const grouped = useMemo(() => {
    const map: Record<string, CourseItem[]> = {};
    CATEGORIES.forEach((c) => (map[c] = []));
    for (const it of items) {
      const cat = CATEGORIES.includes(it.category) ? it.category : 'Autres';
      if (!map[cat]) map[cat] = [];
      map[cat].push(it);
    }
    return map;
  }, [items]);

  // --- Actions ---
  const addItem = async (category: string) => {
    if (!uid || !id) return;
    const name = newName.trim();
    if (!name) return;

    try {
      await addDoc(collection(db, 'users', uid, 'foyers', id, 'courses'), {
        name,
        category,
        bought: false,
        createdAt: serverTimestamp(),
        createdBy: uid,
      });
      setNewName('');
      setAddingForCategory(null);
    } catch (e) {
      console.log('Erreur add item:', e);
      Alert.alert('Erreur', "Impossible d'ajouter cet élément.");
    }
  };

  const toggleBought = async (item: CourseItem) => {
    if (!uid || !id) return;
    try {
      await updateDoc(doc(db, 'users', uid, 'foyers', id, 'courses', item.id), {
        bought: !item.bought,
      });
    } catch (e) {
      console.log('Erreur toggle bought:', e);
    }
  };

  const removeItem = async (item: CourseItem) => {
    if (!uid || !id) return;
    Alert.alert('Supprimer', `Retirer "${item.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', uid, 'foyers', id, 'courses', item.id));
          } catch (e) {
            console.log('Erreur delete item:', e);
          }
        },
      },
    ]);
  };

  // --- UI d’une ligne de course ---
  const Line = ({ it }: { it: CourseItem }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => toggleBought(it)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#333',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.7}
      >
        {it.bought ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#333',
            }}
          />
        ) : null}
      </TouchableOpacity>

      <Text style={{ flex: 1, textDecorationLine: it.bought ? 'line-through' : 'none' }}>
        {it.name}
      </Text>

      <TouchableOpacity onPress={() => removeItem(it)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={{ fontWeight: '600' }}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  // --- Rendu d’un bloc catégorie ---
const CategoryCard = ({ title }: { title: string }) => {
    const list = grouped[title] ?? [];
    return (
      <View
        style={{
          backgroundColor: '#fff8f0',
          borderRadius: 12,
          padding: 10,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, flex: 1 }}>{title}</Text>
  
          {/* bouton + arrondi */}
          <TouchableOpacity
            onPress={() => {
              setAddingForCategory(title);
              setNewName('');
            }}
            activeOpacity={0.8}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#ffd9a8',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, lineHeight: 18 }}>＋</Text>
          </TouchableOpacity>
        </View>
  
        {list.length === 0 ? (
          <Text style={{ fontSize: 12, color: '#777', paddingVertical: 4 }}>
            Rien à acheter
          </Text>
        ) : (
          <View style={{ borderTopWidth: 1, borderColor: '#eee', marginTop: 4 }}>
            {list.map((it) => (
              <Line key={it.id} it={it} />
            ))}
          </View>
        )}
      </View>
    );
  };
  

  return (
    <LinearGradient
      colors={colors.bgGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={s.container}
    >
      {/* Header simple */}
      <View style={[s.content, { paddingBottom: 0 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
            <Text style={{ fontSize: 20 }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={[s.title, { flex: 1 }]}>
            {loadingFoyer ? 'Chargement…' : foyer?.nom ?? 'Foyer'}
          </Text>

          {/* Icône cercle + (ajout rapide global éventuel) */}
          <TouchableOpacity
            onPress={() => {
              setAddingForCategory(CATEGORIES[0]);
              setNewName('');
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#ffcf99',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 22, lineHeight: 22 }}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* sous-titre / badges */}
        {!loadingFoyer && foyer && (
          <View style={{ marginTop: 4, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#ffe8cc', borderRadius: 999 }}>
              <Text style={{ fontSize: 12 }}>{foyer.nbPersonnes} personnes</Text>
            </View>
            {!!foyer.restrictions?.length && (
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#ffe8cc', borderRadius: 999 }}>
                <Text style={{ fontSize: 12 }}>
                  {foyer.restrictions.join(', ')}
                </Text>
              </View>
            )}
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#ffe8cc', borderRadius: 999 }}>
              <Text style={{ fontSize: 12 }}>{foyer.isPublic ? 'Public (partagé)' : 'Privé'}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bandeau titre "Liste de courses" + note */}
      <View style={[s.blocBlanc, { paddingTop: 12 }]}>
        <Text style={[s.sectionTitle, { marginBottom: 4 }]}>Liste de courses</Text>
        <Text style={[s.note, { marginBottom: 10 }]}>
          Une fois le produit coché comme “acheté”, il sera automatiquement ajouté dans la page
          cuisine à la place correspondante (frigo, placard, …).
        </Text>

        {/* Grille 2 colonnes, proche du mock */}
        {loadingItems ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1, gap: 12 }}>
              <CategoryCard title="Viandes" />
              <CategoryCard title="Fruits et légumes" />
              <CategoryCard title="Droguerie" />
            </View>
            <View style={{ flex: 1, gap: 12 }}>
              <CategoryCard title="Produits laitiers" />
              <CategoryCard title="Condiments secs" />
            </View>
          </View>
        )}

        {/* Si aucune catégorie n’a d’items */}
        {!loadingItems && items.length === 0 && (
          <Text style={[s.note, { marginTop: 16 }]}>Rien à acheter</Text>
        )}
      </View>

      {/* Bottom nav */}
      <View style={s.bottomNavWrapper}>
        {/* <BottomNavigation /> */}
      </View>

      {/* Modal ajout élément */}
      <Modal visible={!!addingForCategory} transparent animationType="fade" onRequestClose={() => setAddingForCategory(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '88%', backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
            <Text style={[s.sectionTitle, { marginBottom: 8 }]}>
              Ajouter dans “{addingForCategory}”
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Nom du produit"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
              }}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setAddingForCategory(null)}>
                <Text style={{ fontWeight: '600' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addItem(addingForCategory!)}>
                <Text style={{ fontWeight: '700' }}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
