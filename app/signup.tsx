import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { auth } from '../services/firebaseConfig';
import { authStyles as styles } from '../components/authStyles';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'TON_CLIENT_ID',
    redirectUri: AuthSession.makeRedirectUri(),
  });

  const isPasswordStrong = (pwd: string) =>
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (!isPasswordStrong(password)) {
      Alert.alert('Mot de passe trop faible', 'Minimum 8 caractères, 1 majuscule, 1 chiffre');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Succès', 'Compte créé avec succès ✅');
      router.replace('/presentation');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erreur', 'Cet e-mail est déjà utilisé');
      } else {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        Alert.alert('Succès', 'Connecté avec Google ✅');
        router.replace('/');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#FFEAD8', '#FF8C1A']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Let’s get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Email id"
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

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

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm password"
          placeholderTextColor="#000"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={
              showConfirmPassword
                ? require('../assets/images/oeil.png')
                : require('../assets/images/oeilBarre.png')
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.authButton} onPress={handleSignup}>
        <Text style={styles.authText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or continue with</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup}>
        <Image
          source={require('../assets/images/google.png')}
          style={styles.googleImage}
        />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account ? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
