// app/HOME/PROFIL/ProfilePage.tsx — Firebase + avatars prédéfinis
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import BottomNavigation from '../../../components/BottomNavigation';
import { StyleProfilePage as styles } from '../../../components/StyleProfilePage';

import { router } from 'expo-router';
import { auth, db } from '../../../services/firebaseConfig';
import { onAuthStateChanged, signOut, User, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Avatars prédéfinis
const PRESET_AVATARS = {
  ava1: require("../../../assets/avatars/femme.jpg"),
  ava2: require("../../../assets/avatars/homme.jpg"),
  ava3: require("../../../assets/avatars/mamie.jpg"),
  ava4: require("../../../assets/avatars/noir.jpg"),
  ava5: require("../../../assets/avatars/enfantH.jpg"),
  ava6: require("../../../assets/avatars/azul.jpg"),
  ava7: require("../../../assets/avatars/rousse.jpg"),
  ava8: require("../../../assets/avatars/muscleH.jpg"),
  ava9: require("../../../assets/avatars/squid.jpg"),
  ava10: require("../../../assets/avatars/avatar.jpg"),
  ava11: require("../../../assets/avatars/topchef.jpg"),
  ava12: require("../../../assets/avatars/yoda.jpg"),

} as const;

type AvatarKey = keyof typeof PRESET_AVATARS;
type FormData = { username: string; email: string; gender: string; };

export default function ProfilePage() {
  const [avatarKey, setAvatarKey] = useState<AvatarKey | null>(null);
  const [formData, setFormData] = useState<FormData>({ username: '', email: '', gender: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [noNotifications, setNoNotifications] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // -------- Sélection d'avatar prédéfini
  const selectAvatar = async (newAvatarKey: AvatarKey) => {
    if (!currentUser) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        avatarKey: newAvatarKey,
        updatedAt: new Date()
      });
      
      setAvatarKey(newAvatarKey);
      setShowAvatarModal(false);
      Alert.alert('Succès', 'Avatar mis à jour !');
    } catch (e) {
      console.log('selectAvatar error:', e);
      Alert.alert('Erreur', "Impossible de mettre à jour l'avatar.");
    }
  };

  const openAvatarPicker = () => {
    setShowAvatarModal(true);
  };

  // -------- Auth watcher + chargement du profil
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setCurrentUser(null);
        setLoadingUser(false);
        router.replace('/login');
        return;
      }
      setCurrentUser(u);

      try {
        const refUser = doc(db, 'users', u.uid);
        const snap = await getDoc(refUser);

        const base: FormData = {
          username: u.displayName ?? '',
          email: u.email ?? '',
          gender: '',
        };

        if (snap.exists()) {
          const data = snap.data() as Partial<FormData> & { avatarKey?: AvatarKey };
          const loadedData = {
            username: data.username ?? base.username ?? '',
            email: data.email ?? base.email ?? '',
            gender: data.gender ?? base.gender ?? '',
          };
          setFormData(loadedData);
          setAvatarKey(data.avatarKey ?? 'ava1'); // Avatar par défaut
        } else {
          await setDoc(
            refUser,
            { ...base, avatarKey: 'ava1', createdAt: new Date() },
            { merge: true }
          );
          setFormData(base);
          setAvatarKey('ava1');
        }
      } catch (e) {
        console.log('Erreur chargement profil:', e);
        Alert.alert('Erreur', 'Impossible de charger votre profil.');
      } finally {
        setLoadingUser(false);
      }
    });

    return unsub;
  }, []);

  // -------- Déconnexion (avec confirmation)
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, me déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch {
              Alert.alert('Erreur', 'La déconnexion a échoué.');
            }
          },
        },
      ]
    );
  };

  const handleNotificationChange = (type: 'enabled' | 'none') => {
    if (type === 'enabled') {
      setNotificationsEnabled(true);
      setNoNotifications(false);
    } else {
      setNotificationsEnabled(false);
      setNoNotifications(true);
    }
  };

  // Supprime le doc Firestore + compte Auth
  const reallyDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erreur", "Aucun utilisateur connecté.");
      return;
    }
    const uid = user.uid;

    try {
      // 1) Supprimer le doc Firestore
      await deleteDoc(doc(db, "users", uid));

      // 2) Supprimer le compte Auth (peut exiger une reconnexion récente)
      await deleteUser(user);

      Alert.alert("Compte supprimé", "Votre compte a bien été supprimé.");
      router.replace("/login");
    } catch (e: any) {
      console.log("reallyDeleteAccount:", e);
      if (e?.code === "auth/requires-recent-login") {
        Alert.alert(
          "Sécurité Firebase",
          "Pour des raisons de sécurité, veuillez vous reconnecter puis relancer la suppression.",
          [
            {
              text: "OK",
              onPress: async () => {
                await signOut(auth);
                router.replace("/login?reauth=delete");
              },
            },
          ]
        );
      } else {
        Alert.alert("Erreur", "Impossible de supprimer votre compte pour le moment.");
      }
    }
  };

  // Double confirmation (2 alertes)
  const confirmDeleteAccount = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Cette action est irréversible. Voulez‑vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, continuer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Dernière vérification",
              "Êtes‑vous sûr(e) de vouloir supprimer votre compte et toutes vos données ?",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Oui, supprimer définitivement",
                  style: "destructive",
                  onPress: reallyDeleteAccount,
                },
              ]
            );
          },
        },
      ]
    );
  };
    
  if (loadingUser) {
    return (
      <LinearGradient colors={['#FFAD4D', '#FFF3E5']} locations={[0.35, 1]} style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAD4D" />
          <Text style={styles.loadingText}>Chargement de votre profil...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFAD4D', '#FFF3E5']} locations={[0.35, 1]} style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={openAvatarPicker}
          >
            <Ionicons name="person" size={20} color="#000" style={styles.photoButtonIcon} />
            <Text style={styles.photoButtonText}>Avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                avatarKey
                  ? PRESET_AVATARS[avatarKey]
                  : require('../../../assets/images/utilisateur.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.avatarOverlay} 
              onPress={openAvatarPicker}
            >
              <Ionicons name="person" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Touchez pour changer</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.username}
              editable={false}
              placeholder="Votre nom d'utilisateur"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="votre.email@example.com"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.gender}
              editable={false}
              placeholder="Femme / Homme / Autre..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Notifications */}
          <View style={styles.notificationSection}>
            <Text style={styles.sectionTitle}>Préférences de notification</Text>

            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={() => handleNotificationChange('enabled')}
            >
              <View style={[styles.checkbox, notificationsEnabled && styles.checkboxSelected]}>
                {notificationsEnabled && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <Text style={styles.checkboxText}>Recevoir les notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={() => handleNotificationChange('none')}
            >
              <View style={[styles.checkbox, noNotifications && styles.checkboxSelected]}>
                {noNotifications && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <Text style={styles.checkboxText}>Aucune notification</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#000" style={styles.buttonIcon} />
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={confirmDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.deleteAccountButtonText}>Supprimer mon compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de sélection d'avatar */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisissez votre avatar</Text>
            
            <View style={styles.avatarGrid}>
              {(Object.keys(PRESET_AVATARS) as AvatarKey[]).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.avatarOption,
                    avatarKey === key && styles.avatarOptionSelected
                  ]}
                  onPress={() => selectAvatar(key)}
                >
                  <Image 
                    source={PRESET_AVATARS[key]} 
                    style={styles.avatarOptionImage}
                  />
                  {avatarKey === key && (
                    <View style={styles.avatarSelectedIndicator}>
                      <Ionicons name="checkmark" size={24} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <BottomNavigation /> */}
    </LinearGradient>
  );
}