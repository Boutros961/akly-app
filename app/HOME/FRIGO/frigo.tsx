import React from 'react';
import { View, Text } from 'react-native';
import BottomNavigation from '../../../components/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { screenStyles as s, colors } from '../../../components/screenStyles';

export default function Frigo() {
  return (
    <LinearGradient
      colors={colors.bgGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={s.container}
    >
      <View style={s.content}>
        <Text style={s.title}>Bienvenue dans la page frigo</Text>
      </View>
      <BottomNavigation />
    </LinearGradient>
  );
}
