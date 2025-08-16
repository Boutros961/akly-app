// app/HOME/LISTE/ajouterfoyer.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { screenStyles as s, colors } from '../../../components/screenStyles';
// import BottomNavigation from '../../../components/BottomNavigation';
import { auth, db } from '../../../services/firebaseConfig';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  setDoc, 
  doc as fsDoc, 
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';


export default function AjouterFoyer() {
  const navigation = useNavigation<any>();
  const { id } = useLocalSearchParams<{ id?: string }>(); // ✅ Récupérer l'ID du foyer

  const [nom, setNom] = useState('');
  const [nbPersonnes, setNbPersonnes] = useState(1);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [preferences, setPreferences] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Pour charger les données

  // ✅ Déterminer si on est en mode modification
  const isEditing = !!id;

  const options = useMemo(
    () => [
      'Végétarien',
      'Vegan',
      'Sésame',
      'Noix de coco',
      'Légumineuses',
      'Fruits à coques',
      'Gluten',
      'Crustacés',
      'Lactose',
      'Sulfites',
      'Triglycérides',
      'Sans porc',
    ],
    []
  );

  // ✅ Charger les données du foyer si on est en mode modification
  useEffect(() => {
    if (!isEditing || !id) return;

    const loadFoyerData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Erreur', 'Utilisateur non connecté.');
          navigation.goBack();
          return;
        }

        const foyerDoc = await getDoc(fsDoc(db, 'users', user.uid, 'foyers', id));
        
        if (!foyerDoc.exists()) {
          Alert.alert('Erreur', 'Foyer introuvable.');
          navigation.goBack();
          return;
        }

        const data = foyerDoc.data();
        setNom(data.nom || '');
        setNbPersonnes(data.nbPersonnes || 1);
        setRestrictions(data.restrictions || []);
        setPreferences(data.preferences || '');
        
      } catch (error: any) {
        console.log('Erreur chargement foyer:', error);
        Alert.alert('Erreur', 'Impossible de charger les données du foyer.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadFoyerData();
  }, [id, isEditing]);

  const toggleRestriction = (opt: string) => {
    setRestrictions((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const decrement = () => setNbPersonnes((n) => Math.max(1, n - 1));
  const increment = () => setNbPersonnes((n) => Math.min(20, n + 1));

  const onSubmit = async () => {
    if (!nom.trim()) {
      Alert.alert('Nom du foyer', 'Merci de renseigner un nom.');
      return;
    }
    if (saving) return;

    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Erreur', 'Utilisateur non connecté.');
        return;
      }

      if (isEditing && id) {
        // ✅ MODE MODIFICATION - Mettre à jour le foyer existant
        await updateDoc(fsDoc(db, 'users', user.uid, 'foyers', id), {
          nom,
          nbPersonnes,
          restrictions,
          preferences,
          updatedAt: serverTimestamp(),
        });
        
        console.log('Foyer modifié id =', id);
        Alert.alert('Succès', 'Votre foyer a été modifié avec succès !');
        
      } else {
        // ✅ MODE CRÉATION - Créer un nouveau foyer
        await setDoc(
          fsDoc(db, 'users', user.uid),
          { hasHouseholds: true, updatedAt: serverTimestamp() },
          { merge: true }
        );

        const ref = await addDoc(collection(db, 'users', user.uid, 'foyers'), {
          nom,
          nbPersonnes,
          restrictions,
          preferences,
          createdAt: serverTimestamp(),
        });

        console.log('Foyer créé id =', ref.id);
        Alert.alert('Succès', 'Votre foyer a été créé avec succès !');
      }
      
      navigation.goBack();
      
    } catch (error: any) {
      console.log('Erreur foyer:', error?.message || error);
      Alert.alert('Erreur', error?.message || 'Impossible de sauvegarder le foyer.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Afficher un loader pendant le chargement des données
  if (loading) {
    return (
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={s.container}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.orange} />
          <Text style={{ marginTop: 16, color: colors.text }}>Chargement...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.bgGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={s.container}
    >
      {/* Header avec titre + icône */}
      <View style={s.header}>
        <Text style={s.headerTitle}>
          {isEditing ? 'Modifier le foyer' : 'Créer un foyer'}
        </Text>
        <View style={s.headerIcon}>
          <Image
            source={require('../../../assets/images/famille.png')}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Bloc clair arrondi avec évitement clavier */}
      <KeyboardAvoidingView
        style={s.blocBlanc}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nom du foyer */}
          <Text style={s.label}>Nom du foyer</Text>
          <TextInput
            value={nom}
            onChangeText={setNom}
            placeholder="Ex. Famille Dupont"
            placeholderTextColor="#9CA3AF"
            style={s.input}
          />

          {/* Nombre de personnes */}
          <Text style={[s.label, { marginTop: 18 }]}>Nombre de personnes</Text>
          <View style={s.peopleRow}>
            <TextInput
              value={String(nbPersonnes)}
              editable={false}
              style={[s.input, { flex: 1, marginRight: 12 }]}
            />
            <View style={s.stepper}>
              <TouchableOpacity onPress={decrement} style={s.stepBtn} activeOpacity={0.8}>
                <Text style={s.stepTxt}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increment} style={s.stepBtn} activeOpacity={0.8}>
                <Text style={s.stepTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Restrictions */}
          <Text style={[s.sectionTitle, { marginTop: 22 }]}>
            Restrictions alimentaires
          </Text>

          <View style={s.chipsWrap}>
            {options.map((opt) => {
              const selected = restrictions.includes(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  style={[s.chip, selected && s.chipSelected]}
                  onPress={() => toggleRestriction(opt)}
                  activeOpacity={0.8}
                >
                  <View style={[s.dot, selected && s.dotSelected]} />
                  <Text style={[s.chipText, selected && s.chipTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Préférences */}
          <Text style={[s.sectionTitle, { marginTop: 22 }]}>
            Préférences alimentaires
          </Text>
          <Text style={s.helper}>Y a-t-il un/des aliments que vous détestez ?</Text>
          <TextInput
            value={preferences}
            onChangeText={setPreferences}
            placeholder="Ex. Je n'aime pas les champignons…"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            style={[s.input, { height: 50, textAlignVertical: 'top' }]}
          />

          {/* Bouton principal */}
          <TouchableOpacity
            style={[s.submitBtn, saving && { opacity: 0.6 }]}
            onPress={onSubmit}
            activeOpacity={0.9}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.submitTxt}>
                {isEditing ? 'Modifier le foyer' : 'Créer le foyer'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom bar */}
      <View style={s.bottomNavWrapper}>
        {/* <BottomNavigation /> */}
      </View>
    </LinearGradient>
  );
}