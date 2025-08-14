// app/HOME/PROFIL/ProfilePage.tsx — Firebase + avatar persistant
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BottomNavigation from '../../../components/BottomNavigation';
import { StyleProfilePage as styles } from '../../../components/StyleProfilePage';

import { router } from 'expo-router';
import { auth, db, storage } from '../../../services/firebaseConfig'; // ⚠️ assure-toi que storage est exporté
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type FormData = { username: string; email: string; gender: string; };

export default function ProfilePage() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null); // URL distante persistée
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({ username: '', email: '', gender: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [noNotifications, setNoNotifications] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // -------- Permissions ImagePicker
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permissions requises', 'Caméra et galerie sont nécessaires.');
      return false;
    }
    return true;
  };

  // -------- Upload avatar -> Storage + Firestore
  const uploadAvatar = async (localUri: string, uid: string): Promise<string | null> => {
    try {
      const resp = await fetch(localUri);
      const blob = await resp.blob();
      const ext = (localUri.split('.').pop() || 'jpg').split('?')[0];
      const path = `users/${uid}/avatar.${ext}`;
  
      const r = ref(storage, path);
      await uploadBytes(r, blob, { contentType: blob.type || `image/${ext}` });
  
      const url = await getDownloadURL(r);
      await updateDoc(doc(db, 'users', uid), { avatarUrl: url, avatarPath: path, updatedAt: new Date() });
  
      return url;
    } catch (err) {
      console.log('uploadAvatar error:', err);
      return null;
    }
  };
  

  // suppose que uploadAvatar(uri, uid) => Promise<string | null>
const openImagePicker = async (source: 'camera' | 'library'): Promise<void> => {
  const hasPermission = await requestPermissions();
  const uid = currentUser?.uid ?? auth.currentUser?.uid;

  if (!hasPermission) return;
  if (!uid) {
    Alert.alert('Erreur', 'Utilisateur non connecté.');
    return;
  }

  try {
    const pickerFn =
      source === 'camera'
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

    const result = await pickerFn({
      mediaTypes: [ImagePicker.MediaType.image], // ✅ nouveau
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Erreur', "Aucune image n'a été sélectionnée.");
      return;
    }

    // Affiche tout de suite la version locale (feedback rapide)
    setAvatarUri(asset.uri);

    // Upload vers Storage + maj Firestore → renvoie l’URL publique
    const uploadedUrl = await uploadAvatar(asset.uri, uid); // -> Promise<string | null>
    if (uploadedUrl) {
      setAvatarUri(uploadedUrl);
    } else {
      Alert.alert('Erreur', "L'envoi de l'image a échoué.");
    }
  } catch (e) {
    console.log('openImagePicker error:', e);
    Alert.alert('Erreur', "Impossible de mettre à jour la photo de profil.");
  }
};

  const showImagePickerOptions = () => {
    Alert.alert('Choisir une image', "D'où voulez-vous importer votre image ?", [
      { text: 'Appareil photo', onPress: () => openImagePicker('camera') },
      { text: 'Galerie', onPress: () => openImagePicker('library') },
      { text: 'Annuler', style: 'cancel' },
    ]);
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
          const data = snap.data() as Partial<FormData> & { avatarUrl?: string };
          setFormData({
            username: data.username ?? base.username ?? '',
            email: data.email ?? base.email ?? '',
            gender: data.gender ?? base.gender ?? '',
          });
          setAvatarUri(data.avatarUrl ?? null);
        } else {
          await setDoc(
            refUser,
            { ...base, avatarUrl: null, createdAt: new Date() },
            { merge: true }
          );
          setFormData(base);
          setAvatarUri(null);
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

  // -------- Sauvegarde Firestore (texte)
  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        username: formData.username.trim(),
        email: formData.email.trim(),
        gender: formData.gender.trim(),
        updatedAt: new Date(),
      });
      setIsEditing(false);
      Alert.alert('Succès', 'Profil sauvegardé !');
    } catch (e) {
      console.log('Erreur save profil:', e);
      Alert.alert('Erreur', 'La sauvegarde a échoué.');
    } finally {
      setSaving(false);
    }
  };

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

  if (loadingUser) {
    return (
      <LinearGradient colors={['#FFF3E5', '#FFAD4D']} locations={[0.35, 1]} style={styles.screen}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Chargement…</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFF3E5', '#FFAD4D']} locations={[0.35, 1]} style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing((v) => !v)}
            disabled={saving}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Annuler' : 'Modifier'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarRow}>
          <Image
            source={
              avatarUri
                ? { uri: avatarUri }
                : require('../../../assets/images/utilisateur.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changeBtn} onPress={showImagePickerOptions}>
            <Text style={styles.changeBtnText}>Changer</Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d’utilisateur</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.username}
              onChangeText={(text) => setFormData((p) => ({ ...p, username: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.email}
              onChangeText={(text) => setFormData((p) => ({ ...p, email: text }))}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.gender}
              onChangeText={(text) => setFormData((p) => ({ ...p, gender: text }))}
              editable={isEditing}
              placeholder="Femme / Homme / Autre…"
            />
          </View>

          {/* Notifications (placeholder UI local) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notifications</Text>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => handleNotificationChange('enabled')}>
              <View style={[styles.checkbox, notificationsEnabled && styles.checkboxSelected]}>
                {notificationsEnabled && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <Text style={styles.checkboxText}>Notifications activées</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => handleNotificationChange('none')}>
              <View style={[styles.checkbox, noNotifications && styles.checkboxSelected]}>
                {noNotifications && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <Text style={styles.checkboxText}>Aucune notification</Text>
            </TouchableOpacity>
          </View>

          {/* Sauvegarder */}
          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</Text>
            </TouchableOpacity>
          )}

          {/* Déconnexion */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>

          {/* Supprimer mon compte (placeholder) */}
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={() =>
              Alert.alert(
                'Supprimer mon compte',
                'Cette action est irréversible. Continuer ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', style: 'destructive', onPress: () => Alert.alert('Info', 'À implémenter.') },
                ]
              )
            }
          >
            <Text style={styles.deleteAccountButtonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </LinearGradient>
  );
}
