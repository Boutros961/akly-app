import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from 'firebase/firestore'; // tu peux garder initializeFirestore
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAa9paP4f0EZ5d3J2AQTuTc8GQI0d2EwmE",
  authDomain: "akly-dd7c8.firebaseapp.com",
  projectId: "akly-dd7c8",
  storageBucket: "akly-dd7c8.firebasestorage.app",
  messagingSenderId: "1040301037015",
  appId: "1:1040301037015:web:b84e499d1f912ef08ae792"
};

// ------------
export const app = initializeApp(firebaseConfig);

// ✅ Persistance pour RN (enlève le warning et garde l'user connecté)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Firestore avec long polling auto (bon choix pour Expo/RN)
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export const storage = getStorage(app);