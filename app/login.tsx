import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { authStyles as styles } from '../components/authStyles';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '740879805514-9uubvvlfqrq31jtbqo40u2nvinjjhp92.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri(),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Connexion Google réussie ✅');
        })
        .catch((error) => {
          Alert.alert('Erreur Google Sign-In', error.message);
        });
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/HOME/ACCEUIL/acceuil');
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Connexion réussie ✅');
        router.replace('/');
      } catch (error: any) {
        Alert.alert('Erreur de connexion', error.message);
      }
    } else {
      Alert.alert('Erreur', 'Merci de remplir tous les champs');
    }
  };

  return (
    <LinearGradient
      colors={['#FFEAD8', '#FF8C1A']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email id"
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password with eye */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? require('../assets/images/oeil.png')
                : require('../assets/images/oeilBarre.png')
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
        <Text style={styles.authText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or continue with</Text>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image
          source={require('../assets/images/google.png')}
          style={styles.googleImage}
        />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account ? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.footerLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
