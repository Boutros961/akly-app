import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100); // attend un tout petit moment

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.replace('/login');
      // router.replace('/HOME/LISTE/liste');

    }
  }, [isReady]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#A94A00" />
    </View>
  );
}
