// app/UserInfos.tsx (ou ton chemin)
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '../components/GradientText';

import { auth, db } from '../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function UserInfos() {
  const router = useRouter();
  const [gender, setGender] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [searchOptions, setSearchOptions] = useState<string[]>([]);
  const [discoverySource, setDiscoverySource] = useState<string | null>(null);
  const [customSearch, setCustomSearch] = useState('');

  const toggleSearchOption = (option: string) => {
    setSearchOptions(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Non connecté', "Connecte-toi d'abord.");
        return;
      }
  
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email ?? null,
        gender,
        username,
        searchOptions,
        customSearch,
        discoverySource,
        updatedAt: Date.now(),
      }, { merge: true });
  
      Alert.alert('OK', 'Profil enregistré ✅');
      router.replace('/HOME/ACCEUIL/acceuil');
    } catch (e: any) {
      console.log('Firestore write error:', e?.name, e?.message, e);
      Alert.alert('Erreur Firestore', e?.message ?? 'Échec de sauvegarde.');
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollInner}>
        <GradientText
          text="Super maintenant que nous nous sommes présentés à toi, dis nous en plus sur toi !"
          colors={['#FC9D44', '#D96C00']}
          style={styles.title}
        />

        <LinearGradient
          colors={['#FFD4A3', '#FF9D43']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.questionBox}
        >
          {/* Genre */}
          <Text style={styles.label}>Genre</Text>
          <View style={styles.radioRow}>
            {['F', 'M'].map(opt => {
              const icon = gender === opt
                ? require('../assets/images/point.png')
                : require('../assets/images/point_rempli.png');
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setGender(opt)}
                  style={styles.checkboxRow}
                >
                  <Image source={icon} style={styles.radioIcon} />
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Nom d'utilisateur */}
          <Text style={styles.label}>Nom d’utilisateur</Text>
          <TextInput
            style={styles.input}
            placeholder="Entre ton pseudo"
            value={username}
            onChangeText={setUsername}
          />

          {/* Objectifs */}
          <Text style={styles.label}>Que recherches-tu dans Akly ?</Text>
          {[
            'Éviter le gaspillage alimentaire',
            'Listes de courses coopératives',
            'Trouver de l’inspiration pour cuisiner avec des recettes sur mesure',
            'Faire un rééquilibrage alimentaire',
          ].map(option => {
            const icon = searchOptions.includes(option)
              ? require('../assets/images/point.png')
              : require('../assets/images/point_rempli.png');
            return (
              <TouchableOpacity
                key={option}
                onPress={() => toggleSearchOption(option)}
                style={styles.checkboxRow}
              >
                <Image source={icon} style={styles.radioIcon} />
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Autres objectifs */}
          <Text style={styles.optionText}>Autres :</Text>
          <TextInput
            style={styles.input}
            placeholder="Tes autres objectifs"
            value={customSearch}
            onChangeText={setCustomSearch}
          />

          {/* Découverte */}
          <Text style={styles.label}>Comment as-tu découvert Akly ?</Text>
          {['Bouche à oreilles', 'Réseaux sociaux', 'Autres'].map(opt => {
            const icon = discoverySource === opt
              ? require('../assets/images/point.png')
              : require('../assets/images/point_rempli.png')
            return (
              <TouchableOpacity
                key={opt}
                onPress={() => setDiscoverySource(opt)}
                style={styles.checkboxRow}
              >
                <Image source={icon} style={styles.radioIcon} />
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Bouton */}
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEAD8',
  },
  scrollInner: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  questionBox: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF9D43',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    fontFamily: 'Montserrat',
    backgroundColor: '#fff',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioIcon: {
    width: 20,
    height: 20,
    marginRight: 10,

    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 60,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#D96C00',
    borderRadius: 20,
    paddingVertical: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
});
