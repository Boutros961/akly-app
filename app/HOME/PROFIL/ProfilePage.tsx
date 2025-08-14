// app/HOME/PROFIL/ProfilePage.tsx — Firebase + champs en lecture seule
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
import { auth, db, storage } from '../../../services/firebaseConfig';
import { onAuthStateChanged, signOut, User, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';


type FormData = { username: string; email: string; gender: string; };

export default function ProfilePage() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ username: '', email: '', gender: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [noNotifications, setNoNotifications] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
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

  const openImagePicker = async (source: 'camera' | 'library'): Promise<void> => {
    const hasPermission = await requestPermissions();
    const uid = currentUser?.uid ?? auth.currentUser?.uid;

    if (!hasPermission) return;
    if (!uid) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      return;
    }

    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        quality: 0.8,
      };

      const result = source === 'camera' 
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
        
      if (result.canceled) return;
      
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert("Erreur", "Aucune image sélectionnée");
        return;
      }

      // Affiche tout de suite la version locale (feedback rapide)
      setAvatarUri(asset.uri);

      // Upload vers Storage + maj Firestore → renvoie l'URL publique
      const uploadedUrl = await uploadAvatar(asset.uri, uid);
      if (uploadedUrl) {
        setAvatarUri(uploadedUrl);
        Alert.alert('Succès', 'Photo de profil mise à jour !');
      } else {
        Alert.alert('Erreur', "L'envoi de l'image a échoué.");
      }
    } catch (e) {
      console.log('openImagePicker error:', e);
      Alert.alert('Erreur', "Impossible de mettre à jour la photo de profil.");
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Changer la photo', "D'où voulez-vous importer votre image ?", [
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
          const loadedData = {
            username: data.username ?? base.username ?? '',
            email: data.email ?? base.email ?? '',
            gender: data.gender ?? base.gender ?? '',
          };
          setFormData(loadedData);
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAD4D" />
          <Text style={styles.loadingText}>Chargement de votre profil...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Supprime tout le dossier Storage de l'utilisateur (avatar, etc.)
const deleteUserStorage = async (uid: string) => {
  try {
    const folderRef = ref(storage, `users/${uid}`);
    const listing = await listAll(folderRef);
    await Promise.all([
      ...listing.items.map((item) => deleteObject(item)),
      ...listing.prefixes.map(async (sub) => {
        const subList = await listAll(sub);
        await Promise.all(subList.items.map((i) => deleteObject(i)));
      }),
    ]);
  } catch (e) {
    // Pas bloquant si rien à supprimer
    console.log("deleteUserStorage:", e);
  }
};

// Supprime le doc Firestore + Storage + compte Auth
const reallyDeleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Erreur", "Aucun utilisateur connecté.");
    return;
  }
  const uid = user.uid;

  try {
    // 1) Récupérer d’éventuels chemins de fichiers (ex: avatarPath) puis supprimer Storage
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as { avatarPath?: string };
      // Si vous gardez avatarPath, on le supprime explicitement
      if (data?.avatarPath) {
        try {
          await deleteObject(ref(storage, data.avatarPath));
        } catch (e) {
          console.log("deleteObject avatarPath:", e);
        }
      }
    }
    // Supprimer tout le dossier /users/{uid}
    await deleteUserStorage(uid);

    // 2) Supprimer le doc Firestore
    await deleteDoc(doc(db, "users", uid));

    // 3) Supprimer le compte Auth (peut exiger une reconnexion récente)
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



  return (
    <LinearGradient colors={['#FFF3E5', '#FFAD4D']} locations={[0.35, 1]} style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={showImagePickerOptions}
          >
            <Ionicons name="camera" size={20} color="#000" style={styles.photoButtonIcon} />
            <Text style={styles.photoButtonText}>Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require('../../../assets/images/utilisateur.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.avatarOverlay} 
              onPress={showImagePickerOptions}
            >
              <Ionicons name="camera" size={24} color="#FFF" />
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

      <BottomNavigation />
    </LinearGradient>
  );
}