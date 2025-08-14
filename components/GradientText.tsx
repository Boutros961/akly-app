import React from 'react';
import { Text, TextProps, ColorValue } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps extends TextProps {
  text: string;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]]; // tuple constant requis
}

export default function GradientText({ text, colors, style, ...rest }: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text {...rest} style={[style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Ce texte invisible permet à la gradient d'être visible via le masque */}
        <Text {...rest} style={[style, { opacity: 0 }]}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
