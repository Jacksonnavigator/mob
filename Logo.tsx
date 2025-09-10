import React from 'react';
import { Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle | ImageStyle;
  showBackground?: boolean;
}

export default function Logo({ size = 40, style, showBackground = false }: LogoProps) {
  return (
    <Image 
      source={require('../../logo.png')} 
      style={[
        styles.logo,
        { width: size, height: size },
        showBackground && styles.background,
        style
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    // Default styles
  },
  background: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 20,
    padding: 8,
  },
});

